const city = document.getElementById("city");
const search = document.getElementById("search");
const loc = document.getElementById("loc");
const description = document.getElementById("description");
const max_temp = document.getElementById("max_temp");
const min_temp = document.getElementById("min_temp");

let place;
let weatherData = {};

document.addEventListener("keydown", keyPress);
search.addEventListener("click", getWeather);

city.focus();

const getWeatherData = place => {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      place +
      "&units=metric&APPID=b9a098030deae92fa48e1b91be240011",
    { mode: "cors" }
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log(response);
      weatherData.location = response.name + ", " + response.sys.country;
      weatherData.description = jsUcfirst(response.weather[0].description);
      weatherData.maxTemp = response.main.temp_max;
      weatherData.minTemp = response.main.temp_min;
      updateDisplay();
    })
    .catch(function() {
      console.error("Data not found");
      description.textContent = "Not found";
      loc.textContent = "";
      max_temp.textContent = "";
      min_temp.textContent = "";
    });
};

function getWeather() {
  place = city.value;
  getWeatherData(place);
}

function updateDisplay() {
  loc.textContent = weatherData.location;
  description.textContent = weatherData.description;
  max_temp.textContent = "Max temp: " + weatherData.maxTemp + "°C";
  min_temp.textContent = "Min temp: " + weatherData.minTemp + "°C";
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function keyPress(event) {
  if (event.key == "Enter") {
    getWeather();
  }
}
