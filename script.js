
async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "b6f258a38e0e11b3dc693a6c5adf119e"; // Replace this with your actual OpenWeather API key

  // Check if input is empty
  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  // Function to get longitude and latitude
  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(
      " ",
      "%20"
    )}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      weatherDataSection.innerHTML = `
        <div>
          <h2>Error!</h2>
          <p>Failed to fetch location data. Please try again.</p>
        </div>
      `;
      return null;
    }

    const data = await response.json();
    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }
    return data[0]; // Return the first result with lat/lon
  }

  // Get latitude and longitude
  const geocodeData = await getLonAndLat();
  if (!geocodeData) return; // Exit if geocode data is invalid

  const { lon, lat } = geocodeData;

  // Fetch weather data
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const weatherResponse = await fetch(weatherURL);

  if (!weatherResponse.ok) {
    console.log("Bad response! ", weatherResponse.status);
    weatherDataSection.innerHTML = `
      <div>
        <h2>Error!</h2>
        <p>Failed to fetch weather data. Please try again.</p>
      </div>
    `;
    return;
  }

  const weatherData = await weatherResponse.json();

  // Display weather data
  weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" 
         alt="${weatherData.weather[0].description}" width="100" />
    <div>
      <h2>${weatherData.name}</h2>
      <p><strong>Temperature:</strong> ${Math.round(
        weatherData.main.temp - 273.15
      )}°C</p>
      <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
    </div>
  `;

  // Clear the input field
  document.getElementById("search").value = "";
}