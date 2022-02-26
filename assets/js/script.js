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
                console.log(data);
                
                todayweatherEl.classList.remove("d-none");

                // display the current weather and forecast
                displayForecast(data);
            });
        }
        else {
            alert('Error: City Not Found');
        }
    });
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
    currentWindEl.innerHTML = "Wind: " + weatherData.current.wind_speed + "MPH";
    if (weatherData.current.uvi <= 2) {
        currentUVEl.innerHTML = "UV Index: " + "<span class='favorable'>" + weatherData.current.uvi + "</span>";
    }
    else if (weatherData.current.uvi > 2 && weatherData.current.uvi <= 7) {
        currentUVEl.addClass("moderate");
        currentUVEl.innerHTML = "UV Index: " + "<span class='moderate'>" + weatherData.current.uvi + "</span>";
    }
    else {
        currentUVEl.addClass("severe");
        currentUVEl.innerHTML = "UV Index: " + "<span class='severe'>" + weatherData.current.uvi + "</span>";
    }
    

};

// search button function to pass to get coordinates
var searchButton = function(event) {
    event.preventDefault();

    var searchCity = cityEl.value;
    if (searchCity) {
        getCoordinates(searchCity);
        cityEl.value = "";
    }
}

// event handlers
searchEl.addEventListener("click", searchButton);
