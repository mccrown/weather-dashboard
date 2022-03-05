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
var forecastElement = document.querySelector("#forecast");


var displayName;
var searchTerms = [];

// Api Key
var APIKey = "86ef247d424c25935fd6c766a8b744f8";

var getCoordinates = function(cityName) {
    var apiUrll = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;

    fetch(apiUrll).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                
                
                todayweatherEl.classList.remove("d-none");

                var lat = data.coord.lat;
                var lon = data.coord.lon;
                displayName = data.name;

                // call getForecast function
                getForecast(lat,lon);
            });
        }
        else {
            alert('Error: City Not Found');
        }
    });

};


// get forecast function
var getForecast = function(lat,lon) {
    // weather request from api
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + APIKey;

    fetch(apiUrl).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                
                
                todayweatherEl.classList.remove("d-none");

                // display the current weather and forecast
                displayForecast(data);
                fiveDayForecast(data);
            });
        }
        else {
            alert('Error: City Not Found');
        }
    });
};

var loadSearchHistory = function() {
    var searchHis = [];
    searchHis = searchHistory;
    console.log(searchHis);
    createHistoryEl(searchHis);
};


var displayForecast = function(weatherData) {

    // set city name and date
    var city = displayName;
    var unixDate = weatherData.current.dt;
    var formattedDate = moment.unix(unixDate).format("dddd, MMMM Do");

    // insert city name and date to page
    nameEl.textContent = city + " (" + formattedDate + ") :";

    // display current forecast icon
    var weatherPic = weatherData.current.weather[0].icon;
    currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    currentPicEl.setAttribute("alt", weatherData.current.weather[0].description);

    // display temp, humidity, wind speed, uv index
    currentTempEl.innerHTML = "Temperature: " + weatherData.current.temp + "<span>&#176</span>" + "F";
    currentHumidityEl.innerHTML = "Humidity: " + weatherData.current.humidity + " %";
    currentWindEl.innerHTML = "Wind: " + weatherData.current.wind_speed + " MPH";

    //check uvi value and assign class based on value
    if (weatherData.current.uvi <= 2) {
        currentUVEl.innerHTML = "UV Index: " + "<span class='favorable'>" + weatherData.current.uvi + "</span>";
    }
    else if (weatherData.current.uvi > 2 && weatherData.current.uvi <= 7) {
        currentUVEl.innerHTML = "UV Index: " + "<span class='moderate'>" + weatherData.current.uvi + "</span>";
    }
    else {
        currentUVEl.innerHTML = "UV Index: " + "<span class='severe'>" + weatherData.current.uvi + "</span>";
    }
};

var fiveDayForecast = function(forecastData) {
    console.log(forecastData);
    fivedayEl.classList.remove("d-none");
    forecastElement.classList.remove("d-none");
    // iterate through the 5 days
    for (var i = 1; i < 6; i++) {

        // display the date
        var dateElement = forecastElement.querySelector("#forecast-date-" + i);
        var unixDate = forecastData.daily[i].dt;
        dateElement.textContent = moment.unix(unixDate).format("MMMM Do");

        // display the icon representation
        var weatherPic = forecastData.daily[i].weather[0].icon;
        var iconElement = forecastElement.querySelector("#forecast-icon-" + i);
        iconElement.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        iconElement.setAttribute("alt", forecastData.daily[i].weather[0].description);

        // display max temperature
        var maxTempElement = forecastElement.querySelector("#forecast-temp-" + i);
        var maxTemp = Math.floor(forecastData.daily[i].temp.max);  // fahrenheit
        maxTempElement.textContent = "High Temp: " + maxTemp + "°F";

        // display wind
        var windElement = forecastElement.querySelector("#forecast-wind-" + i);
        var windSpeed = forecastData.daily[i].wind_speed; 
        windElement.textContent = "Wind: " + windSpeed + " MPH";

        // display humidity
        var humidityElement = forecastElement.querySelector("#forecast-humidity-" + i);
        var humidity = forecastData.daily[i].humidity;  // percentage
        humidityElement.textContent = "Humidity: " + humidity + "%";
    }

};


var createHistoryEl = function(searchData) {
    for (var i = 0; i < searchData.length; i++){
    const city = searchData[i];
    var historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", city.toUpperCase());
    //historyEl.append(historyItem);
    historyItem.addEventListener("click", function (event){
        getCoordinates(event.target.value);
    })
    historyEl.append(historyItem);
    }
}

// event handlers
//searchEl.addEventListener("click", searchButton);
searchEl.addEventListener("click", function () {
    var searchTerm = cityEl.value;
    getCoordinates(searchTerm);
    searchHistory.push(searchTerm);
    searchTerms.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    createHistoryEl(searchTerms);
    cityEl.value = "";

});

loadSearchHistory();
