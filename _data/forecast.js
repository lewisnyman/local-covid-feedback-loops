const fetch = require('node-fetch');
const targetDate = '2020-12-01';
const areaName = 'Brighton and Hove';

module.exports = async function() {
    const source = await fetchCovidData();
    const targetCases = getTargetRate(source.data);
    const firstRow = source.data[0];
    const dailyRateOfChange = firstRow.newCasesBySpecimenDateChangePercentage / 7;
    let currentRate = firstRow.newCasesBySpecimenDateRollingRate;
    let currentDate = new Date(firstRow.date);
    console.log(currentDate);

    while (currentRate > targetCases) {
        currentDate.setDate(currentDate.getDate() + 1)
        const tomorrowsRateOfChange = (currentRate / 100) * dailyRateOfChange;
        currentRate = currentRate + tomorrowsRateOfChange; 
        // console.log('Rateofchange:' + tomorrowsRateOfChange);
        // console.log('Date:' + currentDate.getDate());
        // console.log('currentRate:' + currentRate);
    }

    return {
        targetDate: getPrettyDate(new Date(targetDate)),
        date: getPrettyDate(currentDate),
        latestRollingRate: firstRow.newCasesBySpecimenDateChangePercentage,
        areaName: firstRow.areaName
    };
  };

  async function fetchCovidData() {
    const endpoint = 'https://coronavirus.data.gov.uk/api/v1/data?' + 
    'filters=areaType=utla;areaName=' + areaName  + ';date>=' + targetDate + '&' + 
    'structure=' +
    '{"areaType":"areaType",' +
    '"areaName":"areaName",' +
    '"areaCode":"areaCode",' +
    '"date":"date",' +
    '"newCasesBySpecimenDateRollingSum":"newCasesBySpecimenDateRollingSum",' +
    '"newCasesBySpecimenDateRollingRate":"newCasesBySpecimenDateRollingRate",' +
    '"newCasesBySpecimenDateChange":"newCasesBySpecimenDateChange",' +
    '"newCasesBySpecimenDateChangePercentage":"newCasesBySpecimenDateChangePercentage"}&format=json';
    const response = await fetch(encodeURI(endpoint));
    const data = await response.json();
    return data;
  }

  function getTargetRate(data) {
    let targetRate;
    data.forEach(function(row) {
        console.log(row);
        if(row.date == targetDate) {
            targetRate = row.newCasesBySpecimenDateRollingRate;
        }
    });
    return targetRate;
  }

  function getPrettyDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }