import countryList from "./countryList.js";

const city = document.getElementById("city");
const countrySelect = document.getElementById("countrySelect");
const search = document.getElementById("search");
const loc = document.getElementById("loc");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const output = document.getElementById("output");
const forecast = document.getElementById("forecast");
const day1Discription = document.getElementById("day1Description");
const day2Discription = document.getElementById("day2Description");
const day3Discription = document.getElementById("day3Description");
const day1Temp = document.getElementById("day1Temp");
const day2Temp = document.getElementById("day2Temp");
const day3Temp = document.getElementById("day3Temp");
const day2Name = document.getElementById("day2Name");
const day3Name = document.getElementById("day3Name");

let place;
let countryCode = "";
let weatherData = {};
let forecastData = {};
let days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

for (let country of countryList) {
  let newItem = document.createElement("option");
  newItem.innerHTML = country.Name;
  countrySelect.appendChild(newItem);
}

document.addEventListener("keydown", keyPress);
search.addEventListener("click", getWeather);
countrySelect.addEventListener("change", selectCountry);
city.addEventListener("change", capitalizeCity);

function selectCountry() {
  for (let n = 0; n < countryList.length; n++) {
    if (countryList[n].Name == countrySelect.value) {
      countryCode = countryList[n].Code;
    }
  }
}

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
      for (let n = 0; n < countryList.length; n++) {
        if (countryList[n].Code == response.sys.country) {
          var countryName = countryList[n].Name;
        }
      }
      weatherData.location = response.name + ", " + countryName;
      weatherData.description = response.weather[0].description;
      weatherData.temp = response.main.temp;
    })
    .catch(function(error) {
      console.error(error);
      temp.textContent = "Not found";
      loc.textContent = "";
      description.textContent = "";
      output.style.visibility = "visible";
      forecast.style.visibility = "hidden";
    });
};

const getWeatherForecast = place => {
  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
      place +
      "&units=metric&APPID=b9a098030deae92fa48e1b91be240011",
    { mode: "cors" }
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log(response);
      let today = String(new Date().getDate());
      if (today.length == 1) {
        today = "0" + today;
      }
      let middays = [];
      for (let i = 0; i < 39; i++) {
        if (
          response.list[i].dt_txt.substr(11, 2) === "12" &&
          response.list[i].dt_txt.substr(8, 2) !== today
        ) {
          middays.push(i);
        }
      }
      let timezone = response.city.timezone;
      let timeAdjust = Math.floor(timezone / 10800);
      let adjusted = middays.map(n => n - timeAdjust);
      forecastData.day1 = response.list[adjusted[0]].weather[0].description;
      forecastData.temp1 = response.list[adjusted[0]].main.temp;
      forecastData.day2 = response.list[adjusted[1]].weather[0].description;
      forecastData.temp2 = response.list[adjusted[1]].main.temp;
      forecastData.day3 = response.list[adjusted[2]].weather[0].description;
      forecastData.temp3 = response.list[adjusted[2]].main.temp;

      updateDisplay();
    })
    .catch(function(error) {
      console.error(error);
      temp.textContent = "Not found";
      loc.textContent = "";
      description.textContent = "";
      output.style.visibility = "visible";
      forecast.style.visibility = "hidden";
    });
};

function getWeather() {
  countryCode == ""
    ? (place = city.value)
    : (place = city.value + ", " + countryCode);
  getWeatherData(place);
  getWeatherForecast(place);
}

function updateDisplay() {
  output.style.visibility = "visible";
  forecast.style.visibility = "visible";

  loc.textContent = weatherData.location;
  description.textContent = capitalize(weatherData.description);
  temp.textContent = weatherData.temp.toFixed(1) + "°C";
  day1Discription.textContent = capitalize(forecastData.day1);
  day1Temp.textContent = forecastData.temp1.toFixed(1) + "°C";
  day2Discription.textContent = capitalize(forecastData.day2);
  day2Temp.textContent = forecastData.temp2.toFixed(1) + "°C";
  day3Discription.textContent = capitalize(forecastData.day3);
  day3Temp.textContent = forecastData.temp3.toFixed(1) + "°C";
  let today = new Date().getDay();
  let day2day = today + 1;
  let day3day = today + 2;
  if (day2day > 6) day2day = day2day - 7;
  if (day3day > 6) day3day = day3day - 7;
  day2Name.textContent = days[day2day];
  day3Name.textContent = days[day3day];
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function capitalizeCity() {
  city.value = capitalize(city.value);
}

function keyPress(event) {
  if (event.key == "Enter") {
    getWeather();
  }
}
