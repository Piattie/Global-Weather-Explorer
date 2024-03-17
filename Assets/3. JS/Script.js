document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('city-search-form');
    const cityInput = document.getElementById('city-input');
    const searchHistoryList = document.getElementById('search-history');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastCardsDiv = document.getElementById('forecast-cards');

    const apiKey = 'a9dabeff0f819ad6fd3a5db138545d52'; // Your OpenWeatherMap API key

    // Load search history from localStorage
    loadSearchHistory();

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = ''; // Clear the input field
        }
    });

    function getWeather(city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

        // Fetch current weather
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                addToSearchHistory(city);
            });

        // Fetch 5-day forecast
        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
            });
    }

    function displayCurrentWeather(data) {
        currentWeatherDiv.innerHTML = `
            <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
            <p><strong>Temp:</strong> ${data.main.temp.toFixed(2)}°F</p>
            <p><strong>Wind:</strong> ${data.wind.speed} MPH</p>
            <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
        `;
    }

    function displayForecast(data) {
        forecastCardsDiv.innerHTML = '';
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
            forecastCardsDiv.innerHTML += cardHtml;
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
        searchHistoryList.innerHTML = '';
        searchHistory.forEach(city => {
            const cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.classList.add('city-icon');
            cityButton.onclick = () => getWeather(city);
            searchHistoryList.appendChild(cityButton);
        });
    }
});
