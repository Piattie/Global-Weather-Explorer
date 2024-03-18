document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    var searchForm = document.getElementById('city-search-form');
    var cityInput = document.getElementById('city-input');
    var searchHistoryList = document.getElementById('search-history');
    var clearHistoryButton = document.getElementById('clear-history-button');
    var currentWeather = document.getElementById('weather-card');
    var forecastCards = document.getElementById('forecast-cards');

    // API key
    var apiKey = 'a9dabeff0f819ad6fd3a5db138545d52'; // Your OpenWeatherMap API key

    // Load search history from localStorage
    loadSearchHistory();

    // Event listeners
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = ''; // Clear the input field
        }
    });

    clearHistoryButton.addEventListener('click', function() {
        localStorage.clear(); // Clears all local storage
        loadSearchHistory(); // Reloads the search history
    });

    // Function to fetch weather data
    function getWeather(city) {
        var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
        var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=imperial';

        // Fetch current weather
        fetch(weatherUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                displayCurrentWeather(data);
                document.getElementById('weather-display').style.display = 'block'; // Show the weather display section
                addToSearchHistory(city);
            });

        // Fetch 5-day forecast
        fetch(forecastUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                displayForecast(data);
                document.getElementById('forecast').style.display = 'block'; // Show the weather display section
            });
    }

    // Function to display current weather
    function displayCurrentWeather(data) {
        currentWeather.innerHTML = '<div class="weather-card"><h3>Today in ' + data.name + ' </h3><h4>(' + new Date().toLocaleDateString() + ')</h4><img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png" alt="Weather Icon"><p><strong>Temp:</strong> ' + data.main.temp.toFixed(2) + '°F</p><p><strong>Wind:</strong> ' + data.wind.speed + ' MPH</p><p><strong>Humidity:</strong> ' + data.main.humidity + ' %</p></div>';
    }

    // Function to display 5-day forecast
    function displayForecast(data) {
        forecastCards.innerHTML = '';
        for (var i = 0; i < data.list.length; i += 8) {
            var dayData = data.list[i];
            var cardHtml = '<div class="forecast-card"><h5>' + new Date(dayData.dt_txt).toLocaleDateString() + '</h5><img src="http://openweathermap.org/img/wn/' + dayData.weather[0].icon + '.png" alt="Weather Icon"><p><strong>Temp:</strong> ' + dayData.main.temp.toFixed(2) + ' °F</p><p><strong>Wind:</strong> ' + dayData.wind.speed + ' MPH</p><p><strong>Humidity:</strong> ' + dayData.main.humidity + ' %</p></div>';
            forecastCards.innerHTML += cardHtml;
        }
    }

    // Function to add city to search history
    function addToSearchHistory(city) {
        if (!localStorage.getItem('weatherSearchHistory')) {
            localStorage.setItem('weatherSearchHistory', JSON.stringify([]));
        }
        var searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory'));
        if (!searchHistory.includes(city)) {
            searchHistory.unshift(city);
            localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
            loadSearchHistory();
        }
    }

    // Function to load search history from localStorage
    function loadSearchHistory() {
        var searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
        var searchHistoryDiv = document.getElementById('search-history');
        searchHistoryDiv.innerHTML = '';
        searchHistory.forEach(function(city) {
            var cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.addEventListener('click', function() {
                return getWeather(city);
            });
            searchHistoryDiv.appendChild(cityButton);
        });
    }
});
