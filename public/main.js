// New: Homepage chooser function
function showWeatherOptions() {
  const weatherContainer = document.getElementById("weathering-info");
  weatherContainer.innerHTML = `
    <div class="option-selector">
      <p>How would you like to check the weather?</p>
      <button onclick="WeatheringToday('location')">Use My Location</button>
      <input type="text" id="cityInput" placeholder="Or type a city name..." />
      <button onclick="WeatheringToday('manual')">Check City</button>
    </div>
  `;

  // Remove back button if it exists
  const existingBackBtn = document.querySelector(".back-home-button");
  if (existingBackBtn) existingBackBtn.remove();
}

// Updated WeatheringToday function: handles location or manual city entry
async function WeatheringToday(method = 'location') {
  let city = "";

  if (method === 'manual') {
    city = document.getElementById("cityInput").value;
    if (!city) {
      alert("Please enter a city.");
      return;
    }
  } else {
    try {
      const location = await getUserLocation();
      city = `${location.lat},${location.lon}`;
    } catch (error) {
      city = "Toronto";
    }
  }

  const apiKey = "59320ff7bbb247e0b88222430252905";
  const apiUrl = `https://api.weatherapi.com/v1/marine.json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const apiRes = await fetch(apiUrl);
    const result = await apiRes.json();

    const cityName = result.location.name; // City name
    const regionName = result.location.region; // Region name
    const dateToday = result.forecast.forecastday[0].date; // Current date

    const iconWeather = result.forecast.forecastday[0].day.condition.icon; // Main weather icon URL
    const textWeather = result.forecast.forecastday[0].day.condition.text; // Weather condition as text (e.g., "Rain Showers")

    const iconTime = result.forecast.forecastday[0].hour[0].condition.icon; // Weather icon for the first hour of the day

    const sunrise = result.forecast.forecastday[0].astro.sunrise; // Sunrise time
    const sunset = result.forecast.forecastday[0].astro.sunset;   // Sunset time
    const moonPhase = result.forecast.forecastday[0].astro.moon_phase; // Moon phase name (e.g., "Full Moon")

    const moonIcons = {
      "New Moon": "new.svg",
      "First Quarter": "first-quarter.svg",
      "Full Moon": "full.svg",
      "Last Quarter": "last-quarter.svg"
    };

    // Dynamically change background gradient based on weather condition
    const body = document.body;
    if (textWeather.includes("Sunny") || textWeather.includes("Clear")) {
      body.style.background = "linear-gradient(135deg, #ffe57f, #ffd180)"; // sunny - yellow
    } else if (textWeather.includes("Rain") || textWeather.includes("Drizzle")) {
      body.style.background = "linear-gradient(135deg, #a1c4fd, #c2e9fb)"; // rainy - blue
    } else if (textWeather.includes("Snow")) {
      body.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)"; // snowy - icy
    } else if (textWeather.includes("Cloud")) {
      body.style.background = "linear-gradient(135deg, #d7dde8, #f2f6fa)"; // cloudy - gray
    } else {
      body.style.background = "linear-gradient(135deg, #cbe7f3, #f6e7fb)"; // default - soft pastel
    }

    const placeHolder = document.querySelector("#weathering-info");
    placeHolder.innerHTML = `
      <div class="top-section">
        <h2>${cityName}</h2>
        <p>${dateToday}</p>
        <div class="temp-card">
          <p class="condition">${textWeather}</p>
          <h1>${result.forecast.forecastday[0].day.maxtemp_c}°</h1>
          <img src="${iconWeather}" alt="${textWeather}" />
        </div>
      </div>

      <div class="astro-info">
        <p>Sunrise: <span>${sunrise}</span></p>
        <p>Sunset: <span>${sunset}</span></p>
        <p>Moon Phase: <span>${moonPhase}</span> <img class="moon-icon" src="./assets/moons/${moonIcons[moonPhase] || 'default.svg'}" /></p>
      </div>
    `;

    // Add back to homepage button
    const backButton = document.createElement("div");
    backButton.className = "back-home-button";
    backButton.innerHTML = `
      <button onclick="showWeatherOptions()">
        <span style="font-size: 18px">🏠</span> Home
      </button>
    `;
    document.body.appendChild(backButton);

  } catch (error) {
    document.querySelector("#weathering-info").innerHTML = `<p>Weather data not available.</p>`;
    console.error("API error:", error);
  }
}

// Geolocation helper
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        lat: position.coords.latitude, // Latitude of user
        lon: position.coords.longitude // Longitude of user
      }),
      error => reject(error)
    );
  });
}

// On load, show the home options first
window.onload = showWeatherOptions;
