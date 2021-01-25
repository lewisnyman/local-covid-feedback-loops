const fetch = require('node-fetch');

module.exports = async function() {
    const source = await fetchCovidData();
    const targetCases = 60;
    const firstRow = source.data[0];
    const dailyRateOfChange = firstRow.newCasesBySpecimenDateChangePercentage / 7;
    let currentRate = firstRow.newCasesBySpecimenDateRollingRate;
    let currentDate = new Date(firstRow.date);
    console.log(currentDate);

    while (currentRate > targetCases) {
        currentDate.setDate(currentDate.getDate() + 1)
        const tomorrowsRateOfChange = (currentRate / 100) * dailyRateOfChange;
        currentRate = currentRate + tomorrowsRateOfChange; 
        console.log('Rateofchange:' + tomorrowsRateOfChange);
        console.log('Date:' + currentDate.getDate());
        console.log('currentRate:' + currentRate);
    }

    return {
        date: currentDate.toDateString(),
        latestRollingRate: firstRow.newCasesBySpecimenDateChangePercentage
    };
  };

  async function fetchCovidData() {
    const endpoint = 'https://coronavirus.data.gov.uk/api/v1/data?' + 
    'filters=areaType=utla;areaName=Brighton%2520and%2520Hove;date%253E2020-12-01&' + 
    'structure=' +
    '%7B%22areaType%22:%22areaType%22,' +
    '%22areaName%22:%22areaName%22,' +
    '%22areaCode%22:%22areaCode%22,' +
    '%22date%22:%22date%22,' +
    '%22newCasesBySpecimenDateRollingSum%22:%22newCasesBySpecimenDateRollingSum%22,' +
    '%22newCasesBySpecimenDateRollingRate%22:%22newCasesBySpecimenDateRollingRate%22,' +
    '%22newCasesBySpecimenDateChange%22:%22newCasesBySpecimenDateChange%22,' +
    '%22newCasesBySpecimenDateChangePercentage%22:%22newCasesBySpecimenDateChangePercentage%22%7D&format=json';
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data);
    return data;
  }
