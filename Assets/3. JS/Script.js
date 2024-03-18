document.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.getElementById('city-search-form');
    var cityInput = document.getElementById('city-input');
    var searchHistoryList = document.getElementById('search-history');
    var clearHistoryButton = document.getElementById('clear-history-button');
    var currentWeather = document.getElementById('weather-card');
    var forecastCards = document.getElementById('forecast-cards');

    var apiKey = 'a9dabeff0f819ad6fd3a5db138545d52'; // Your OpenWeatherMap API key

    // Load search history from localStorage
    loadSearchHistory();

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = ''; // Clear the input field
        }
    });

    // Clear History Button
clearHistoryButton.addEventListener('click', function() {
    localStorage.clear(); // Clears all local storage
    loadSearchHistory(); // Reloads the search history
});

    function getWeather(city) {
        var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    
        // Fetch current weather
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                document.getElementById('weather-display').style.display = 'block'; // Show the weather display section
                addToSearchHistory(city);
            });
    
        // Fetch 5-day forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
                document.getElementById('forecast').style.display = 'block'; // Show the weather display section

            });
    }

    function displayCurrentWeather(data) {
        currentWeather.innerHTML = `
            <div class="weather-card">
                <h4>Today in ${data.name} </h4>
                <h4>(${new Date().toLocaleDateString()})</h4>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
                <p><strong>Temp:</strong> ${data.main.temp.toFixed(2)}°F</p>
                <p><strong>Wind:</strong> ${data.wind.speed} MPH</p>
                <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
            </div>
        `;
    }

    function displayForecast(data) {
        forecastCards.innerHTML = '';
        for (let i = 0; i < data.list.length; i += 8) { 
            const dayData = data.list[i];
            const cardHtml = `
                <div class="forecast-card">
                    <h4>${new Date(dayData.dt_txt).toLocaleDateString()}</h4>
                    <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="Weather Icon">
                    <p><strong>Temp:</strong> ${dayData.main.temp.toFixed(2)} °F</p>
                    <p><strong>Wind:</strong> ${dayData.wind.speed} MPH</p>
                    <p><strong>Humidity:</strong> ${dayData.main.humidity} %</p>
                </div>
            `;
            forecastCards.innerHTML += cardHtml;
        }
    }

    function addToSearchHistory(city) {
        if (!localStorage.getItem('weatherSearchHistory')) {
            localStorage.setItem('weatherSearchHistory', JSON.stringify([]));
        }
        let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory'));
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city); 
        localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
        loadSearchHistory();
    }
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '';
    searchHistory.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', () => getWeather(city));
        searchHistoryDiv.appendChild(cityButton);
    });
}
});
