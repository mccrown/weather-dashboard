var cityEl = document.getElementById("city");
var searchEl = document.getElementById("search-button");
var clearEl = document.getElementById("clear-history");
var nameEl = document.getElementById("city-name");
var currentPicEl = document.getElementById("current-pic");
var currentTempEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindEl = document.getElementById("wind-speed");
var currentUVEl = document.getElementById("UV-index");
var historyEl = document.getElementById("history");
var fivedayEl = document.getElementById("fiveday-header");
var todayweatherEl = document.getElementById("today-weather");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// Api Key
var APIKey = "86ef247d424c25935fd6c766a8b744f8";

// get forecast function
var getForecast = function(cityName) {
    // weather request from api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                displayForecast(data.items, cityName)
            });
        }
        else {
            alert('Error: City Not Found');
        }
    });
};