const apiKey = 'aeRAhWnWoaLSe68S0_x8le30TJfUHmPj'; 
const tickers = ['AAPL', 'MSFT'];

document.addEventListener('DOMContentLoaded', function () {
    // Setup the form submission handler to add new tickers
    const form = document.getElementById('addTickerForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTicker = document.getElementById('tickerInput').value.toUpperCase();
        if (!tickers.includes(newTicker)) {
            tickers.push(newTicker); // Add to tickers array if new
            fetchHistoricalData(newTicker).then(result => {
                if (result) {
                    updateTickerList([result], true); // Append to the list
                    updateChartWithData([result], true); // Append to the chart
                }
            });
        }
        document.getElementById('tickerInput').value = ''; // Clear input field
    });

    // Initial data fetch and display
    Promise.all(tickers.map(ticker => fetchHistoricalData(ticker)))
        .then(results => {
            const validResults = results.filter(result => result);
            updateChartWithData(validResults); // Initialize chart
            updateTickerList(validResults); // Initialize list
        });
});

function fetchHistoricalData(symbol) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startOfYear}/${today}?adjusted=true&sort=asc&apiKey=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length) {
                return {
                    symbol: symbol,
                    startPrice: data.results[0].c,
                    latestPrice: data.results[data.results.length - 1].c
                };
            }
            throw new Error(`No data found for ${symbol}`);
        })
        .catch(error => {
            console.error(`Error fetching historical data for ${symbol}:`, error);
            return null; // Handle missing data gracefully
        });
}



function updateTickerList(tickerData, addToExisting) {
    const tickerList = document.getElementById('tickerList');
    if (!addToExisting) tickerList.innerHTML = ''; // Clear existing list items only if not adding
    tickerData.forEach(data => {
        const percentChange = calculatePercentageChange(data.startPrice, data.latestPrice);
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="https://example.com/logos/${data.symbol}.png" alt="${data.symbol} Logo" style="height: 24px; width: 24px; vertical-align: middle; margin-right: 10px;">
            <strong>${data.symbol}</strong>
            <span style="float: right;">${percentChange}%</span>
        `;
        tickerList.appendChild(listItem);
    });
}

function updateChartWithData(tickerData, addToExisting) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (!window.stockChart || !addToExisting) {
        window.stockChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tickerData.map(data => data.symbol),
                datasets: [{
                    label: 'Percentage Change from Start of Year',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: tickerData.map(data => calculatePercentageChange(data.startPrice, data.latestPrice))
                }]
            },
            options: chartOptions
        });
    } else if (addToExisting) {
        tickerData.forEach(data => {
            const index = window.stockChart.data.labels.indexOf(data.symbol);
            if (index === -1) { // Only add if it's a new ticker
                window.stockChart.data.labels.push(data.symbol);
                window.stockChart.data.datasets[0].data.push(calculatePercentageChange(data.startPrice, data.latestPrice));
            }
        });
        window.stockChart.update();
    }
}


function calculatePercentageChange(startPrice, latestPrice) {
    return ((latestPrice - startPrice) / startPrice * 100).toFixed(2);
}

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true, // Ensure the y-axis starts at 0
            title: {
                display: true,
                text: 'Percentage Change (%)'
            },
            ticks: {
                // Ensure that 0 always appears in the chart
                callback: function(value, index, values) {
                    return value + '%';
                }
            }
        },
        x: {
            title: {
                display: true,
                text: 'Ticker Symbol'
            }
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    },
    animation: {
        duration: 500 // general animation time
    },
    hover: {
        animationDuration: 300 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 500 // animation duration after a resize
};
