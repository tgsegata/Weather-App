// ==========================
// Main Weather App Logic JS
// ==========================

// Homepage chooser: shows input & buttons for manual or location search
function showWeatherOptions() {
  const weatherContainer = document.getElementById("weathering-info");

  const now = new Date();
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  });

  weatherContainer.innerHTML = `
    <div class="time-info">
      <p>${formattedDate}</p>
      <p>${formattedTime}</p>
    </div>
    <div class="option-selector modern-ui">
      <p class="prompt">What's your location or city?</p>
      <input type="text" id="cityInput" placeholder="Start typing a city..." />
      <div class="button-column">
        <button class="fill" onclick="WeatheringToday('manual')">Search City</button>
        <p class="or-label">— or —</p>
        <button class="outline" onclick="WeatheringToday('location')">Use My Location</button>
      </div>
    </div>
  `;

  // Remove back button if it exists
  const existingBackBtn = document.querySelector(".back-home-button");
  if (existingBackBtn) existingBackBtn.remove();
}

// Main function to get weather: handles 'manual' or 'location' search
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
      city = "Toronto"; // fallback
    }
  }

  const apiKey = "59320ff7bbb247e0b88222430252905";
  const apiUrl = `https://api.weatherapi.com/v1/marine.json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    const apiRes = await fetch(apiUrl);
    const result = await apiRes.json();

    // Extract data from API
    const cityName = result.location.name;
    const regionName = result.location.region;
    const dateToday = result.forecast.forecastday[0].date;
    const iconWeather = result.forecast.forecastday[0].day.condition.icon;
    const textWeather = result.forecast.forecastday[0].day.condition.text;
    const iconTime = result.forecast.forecastday[0].hour[0].condition.icon;
    const sunrise = result.forecast.forecastday[0].astro.sunrise;
    const sunset = result.forecast.forecastday[0].astro.sunset;
    const moonPhase = result.forecast.forecastday[0].astro.moon_phase;

    // Local moon icon filenames
    const moonIcons = {
      "New Moon": "new.svg",
      "First Quarter": "first-quarter.svg",
      "Full Moon": "full.svg",
      "Last Quarter": "last-quarter.svg"
    };

    // Dynamic background by condition
    const body = document.body;
    if (textWeather.includes("Sunny") || textWeather.includes("Clear")) {
      body.style.background = "linear-gradient(135deg, #ffe57f, #ffb347)";
    } else if (textWeather.includes("Rain") || textWeather.includes("Drizzle")) {
      body.style.background = "linear-gradient(135deg, #89f7fe, #66a6ff)";
    } else if (textWeather.includes("Snow")) {
      body.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)";
    } else if (textWeather.includes("Cloud")) {
      body.style.background = "linear-gradient(135deg, #d7dde8, #f2f6fa)";
    } else {
      body.style.background = "linear-gradient(135deg, #fad0c4, #ffd1ff)";
    }

    // Grid-style layout like dashboard cards
    const placeHolder = document.querySelector("#weathering-info");
    placeHolder.innerHTML = `
      <div class="weather-grid">
        <div class="card city-temp">
          <p>${cityName}</p>
          <h1>${result.forecast.forecastday[0].day.maxtemp_c}°</h1>
          <img src="${iconWeather}" alt="${textWeather}" />
        </div>
        <div class="card condition-text">
          <p>${textWeather}</p>
        </div>
        <div class="card date-block">
          <p>${dateToday}</p>
        </div>
        <div class="card sun-info">
          <p>Sunrise: ${sunrise}</p>
          <p>Sunset: ${sunset}</p>
        </div>
        <div class="card moon-info">
          <p>Moon: ${moonPhase}</p>
          <img class="moon-icon" src="./assets/moons/${moonIcons[moonPhase] || 'default.svg'}" />
        </div>
      </div>
    `;

    // Add back button
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

// Geolocation wrapper
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }),
      error => reject(error)
    );
  });
}

// On load
window.onload = showWeatherOptions;
