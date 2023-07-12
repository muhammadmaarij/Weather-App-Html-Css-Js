const apiKey = "18f2ba39d8b76ccbd01e5a800a9d5d07";

const locationInput = document.getElementById("location-input");
const locationDropdown = document.getElementById("location-dropdown");
const searchBtn = document.getElementById("search-btn");
const weatherContainer = document.getElementById("weather-container");
const fiveDays = document.getElementById("five-days");
const currentDay = document.getElementById("current-day");
const centi = document.createElement("span");
const faren = document.createElement("span");
var metric = "metric";
var weatherData = [];
var degree = "°C";
centi.innerText = "°C";
faren.innerText = "°F";
centi.style.textDecoration = "underline overline";

searchBtn.addEventListener("click", fetchWeatherData);
// faren.addEventListener("click", toggleMetric);
// centi.addEventListener("click", toggleMetric);

function fetchWeatherData() {
  const locationValue = locationInput.value.trim();
  const locationType = locationDropdown.value;

  if (locationValue === "") {
    alert("Please enter a location");
    return;
  }

  let apiUrl = "";

  switch (locationType) {
    case "city":
      apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${locationValue}&units=${metric}&appid=${apiKey}`;
      break;
    case "zipcode":
      apiUrl = `http://api.openweathermap.org/data/2.5/forecast?zip=${locationValue}&units=${metric}&appid=${apiKey}`;
      break;
    case "coordinates":
      const [latitudes, longitudes] = locationValue.split(" ");
      apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitudes}&lon=${longitudes}&units=${metric}&appid=${apiKey}`;
      break;
    default:
      alert("Invalid location type");
      return;
  }

  weatherContainer.innerHTML = ""; //remove prev div of weather container
  fiveDays.innerHTML = ""; //remove prev div of weather container
  currentDay.innerHTML = ""; //remove prev div of weather container

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      weatherData = parseWeatherData(data);
      displayWeatherData(weatherData);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert(
        "An error occurred while fetching weather data. Please try again later."
      );
    });
}

function toggleMetric() {
  if (metric == "metric") {
    metric = "imperial";
    degree = "°F";
    faren.style.textDecoration = "underline";
    centi.style.textDecoration = "none";
    fetchWeatherData();
  } else if (metric == "imperial") {
    metric = "metric";
    degree = "°C";
    centi.style.textDecoration = "underline";
    faren.style.textDecoration = "none";
    fetchWeatherData();
  }
}

function parseWeatherData(data) {
  const city = data.city;
  const weatherList = data.list;
  const weatherData = [];

  for (let i = 0; i < weatherList.length; i += 8) {
    //3h data so for diff of 24h +8 -> 3h*8=24h
    const weather = weatherList[i];
    const date = new Date(weather.dt_txt);
    const temperature = Math.round(weather.main.temp);
    const minTemperature = Math.round(weather.main.temp_min);
    const maxTemperature = Math.round(weather.main.temp_max);
    const weatherIcon = weather.weather[0].icon;
    const weather2 = weather.weather[0].main;
    const pressure = weather.main.pressure;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    weatherData.push({
      date: date.toLocaleDateString("en-US", { weekday: "long" }),
      temperature,
      minTemperature,
      maxTemperature,
      weatherIcon,
      weather2,
      pressure,
      humidity,
      windSpeed,
    });
  }

  return { city, weatherData };
}

function displayWeatherData(weatherData) {
  const cityElement = document.createElement("h2");
  cityElement.textContent = `${weatherData.city.name}, ${weatherData.city.country}`;
  weatherContainer.appendChild(cityElement);

  const cityElementToday = document.createElement("h4");
  cityElementToday.innerHTML = `${weatherData.weatherData[0].date}<br>${weatherData.weatherData[0].weather2}`;
  weatherContainer.appendChild(cityElementToday);

  currentDay.style.display = "flex";
  currentDay.style.marginLeft = "350px";

  const pressureDiv = document.createElement("h3");
  pressureDiv.innerHTML = `Pressure: ${weatherData.weatherData[0].pressure} hPa<br>
                           Humidity: ${weatherData.weatherData[0].humidity}%<br>
                           Wind Speed: ${weatherData.weatherData[0].windSpeed} m/s`;
  pressureDiv.style.marginLeft = "100px";

  const todayTemp = document.createElement("div");

  const weatherIcon1 = document.createElement("img");
  weatherIcon1.src = `http://openweathermap.org/img/w/${weatherData.weatherData[0].weatherIcon}.png`;
  weatherIcon1.alt = weatherData.weatherData[0].date;
  todayTemp.appendChild(weatherIcon1);

  const temperatureElement1 = document.createElement("button");
  temperatureElement1.style.backgroundColor = "white";
  temperatureElement1.style.borderWidth = "0";
  temperatureElement1.addEventListener("click", toggleMetric);
  temperatureElement1.innerHTML = `${weatherData.weatherData[0].temperature} ${centi.innerHTML} |${faren.innerHTML}`;
  temperatureElement1.style.fontSize = "44px";
  todayTemp.appendChild(temperatureElement1);
  todayTemp.style.marginLeft = "100px";

  todayTemp.style.display = "flex";

  currentDay.appendChild(todayTemp);
  currentDay.appendChild(pressureDiv);

  weatherData.weatherData.forEach((weather) => {
    const card = document.createElement("div");
    card.classList.add("weather-card");

    const dateElement = document.createElement("p");
    dateElement.textContent = weather.date;
    card.appendChild(dateElement);

    const weatherIcon = document.createElement("img");
    weatherIcon.src = `http://openweathermap.org/img/w/${weather.weatherIcon}.png`;
    weatherIcon.alt = weather.date;
    card.appendChild(weatherIcon);

    const minMaxElement = document.createElement("p");
    minMaxElement.textContent = `${weather.minTemperature}${degree} ${weather.maxTemperature}${degree}`;
    card.appendChild(minMaxElement);

    fiveDays.appendChild(card);
  });
  weatherContainer.appendChild(currentDay);
  weatherContainer.appendChild(fiveDays);
}
