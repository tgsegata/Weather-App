// ==========================
// Main Weather App Logic JS
// ==========================

// This function builds the homepage with date, time, and input/search buttons
function showWeatherOptions() {
  const weatherContainer = document.getElementById("weathering-info");

  // Get current date and time formatted to user's locale
  const now = new Date();
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit'
  });

  // Inject homepage content: date, time, input and buttons
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

  // Remove the 'Back to Home' button if it exists already
  const existingBackBtn = document.querySelector(".back-home-button");
  if (existingBackBtn) existingBackBtn.remove();
}

// Main function to fetch weather data
// It accepts either a city typed by the user or the device's geolocation
async function WeatheringToday(method = 'location') {
  let city = "";

  // If user chose manual input, get the city value from input field
  if (method === 'manual') {
    city = document.getElementById("cityInput").value;
    if (!city) {
      alert("Please enter a city.");
      return;
    }
  } else {
    // Otherwise, try to get the user's coordinates via Geolocation API
    try {
      const location = await getUserLocation();
      city = `${location.lat},${location.lon}`;
    } catch (error) {
      city = "Toronto"; // fallback if geolocation fails
    }
  }

  // Set API key and build the full request URL
  const apiKey = "59320ff7bbb247e0b88222430252905";
  const apiUrl = `https://api.weatherapi.com/v1/marine.json?q=${encodeURIComponent(city)}&key=${apiKey}`;

  try {
    // Request data from WeatherAPI
    const apiRes = await fetch(apiUrl);
    const result = await apiRes.json();

    // Extract necessary data
    const cityName = result.location.name;
    const regionName = result.location.region;
    const dateToday = result.forecast.forecastday[0].date;
    const iconWeather = result.forecast.forecastday[0].day.condition.icon;
    const textWeather = result.forecast.forecastday[0].day.condition.text;
    const iconTime = result.forecast.forecastday[0].hour[0].condition.icon;
    const sunrise = result.forecast.forecastday[0].astro.sunrise;
    const sunset = result.forecast.forecastday[0].astro.sunset;
    const moonPhase = result.forecast.forecastday[0].astro.moon_phase;

    // Map moon phase names to corresponding SVG filenames
    const moonIcons = {
      "New Moon": "new.svg",
      "Waxing Crescent": "waxing-crescent.svg",
      "First Quarter": "first-quarter.svg",
      "Waxing Gibbous": "waxing-gibbous.svg",
      "Full Moon": "full.svg",
      "Waning Gibbous": "waning-gibbous.svg",
      "Last Quarter": "last-quarter.svg",
      "Waning Crescent": "waning-crescent.svg"
    };

    // Set dynamic background based on weather condition text
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

    // Build weather info cards inside a grid layout
    const placeHolder = document.querySelector("#weathering-info");
    placeHolder.innerHTML = `
      <div class="weather-grid">
        <!-- Temperature Card -->
        <div class="card city-temp">
          <p>${cityName}</p>
          <h1>${result.forecast.forecastday[0].day.maxtemp_c}°</h1>
          <img src="${iconWeather}" alt="${textWeather}" />
        </div>

        <!-- Weather Condition -->
        <div class="card condition-text">
          <p>${textWeather}</p>
        </div>

        <!-- Date Card -->
        <div class="card date-block">
          <p>${dateToday}</p>
        </div>

        <!-- Sunrise Card -->
        <div class="card sunrise-card">
          <img src="assets/images/sunrise.svg" alt="Sunrise icon" class="sun-icon" />
          <p>Sunrise</p>
          <p>${sunrise}</p>
        </div>

        <!-- Sunset Card -->
        <div class="card sunset-card">
          <img src="assets/images/sunset.svg" alt="Sunset icon" class="sun-icon" />
          <p>Sunset</p>
          <p>${sunset}</p>
        </div>

        <!-- Moon Phase Card -->
        <div class="card moon-info">
          <p>Moon: ${moonPhase}</p>
          <img class="moon-icon" src="assets/images/${moonIcons[moonPhase] || 'default.svg'}" alt="Moon phase icon" />
        </div>
      </div>
    `;

    // Add a floating back-to-home button
    const backButton = document.createElement("div");
    backButton.className = "back-home-button";
    backButton.innerHTML = `
      <button onclick="showWeatherOptions()">
        <span style="font-size: 18px">🏠</span> Home
      </button>
    `;
    document.body.appendChild(backButton);

  } catch (error) {
    // If API fails or something goes wrong
    document.querySelector("#weathering-info").innerHTML = `<p>Weather data not available.</p>`;
    console.error("API error:", error);
  }
}

// Geolocation helper: returns a promise that resolves with {lat, lon}
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

// Show homepage on first load
window.onload = showWeatherOptions;