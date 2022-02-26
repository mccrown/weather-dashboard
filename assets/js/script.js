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
var dateDisplay;
var searchTerms = [];

// Api Key
var APIKey = "86ef247d424c25935fd6c766a8b744f8";

var getCoordinates = function(searchTerm) {
    /* use the mapquest API to geocode the location based on the search terms */

    searchTerm = searchTerm.split(" ").join("+");
    var geocodingApiUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=ZJUiXdZZzhsEe05eUGvmmAsIoTPvQOHn&location=" + searchTerm;
    fetch(geocodingApiUrl).then(function(res) {
        if (res.ok) {
            res.json().then(function(data) {

                // find one location to use to generate the weather
                var locations = data.results[0].locations;
                if (locations.length == 1) {
                    saveLocation(locations[0]);
                    getWeather(locations[0].latLng);
                } else {
                    confirmLocation(locations);  // prompt the user to confirm the location
                }
            })
        } else {
            console.log("Couldn't get the coordinates from the mapquest API: ", res.text);
        }
    });
}

// get forecast function
var getForecast = function(cityName) {
    // weather request from api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;
    var betterUrl = 

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
    var city = weatherData.name;
    var unixDate = weatherData.dt;
    var formattedDate = moment.unix(unixDate).format("dddd, MMMM Do");

    // insert city name and date to page
    nameEl.textContent = city + " (" + formattedDate + ") :";

    // display current forecast icon
    var weatherPic = weatherData.weather[0].icon;
    currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
    currentPicEl.setAttribute("alt", weatherData.weather[0].description);

    // display temp, humidity, wind speed, uv index
    currentTempEl.innerHTML = "Temperature: " + weatherData.main.temp + "<span>&#176</span>" + "F";
    currentHumidityEl.innerHTML = "Humidity: " + weatherData.main.humidity + " %";
    currentWindEl.innerHTML = "Wind: " + weatherData.wind.speed + "MPH";
    currentUVEl.innerHTML = "UV Index: " + weatherData.uvi;

}

var getDate = function(date) {

}