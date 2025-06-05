// WeatheringToday function: gets weather data based on city or user location
async function WeatheringToday() {
    let city = document.getElementById("cityInput").value;
  
    // If the user didn't enter a city, try using geolocation
    if (!city) {
      try {
        const location = await getUserLocation(); // Get user coordinates
        city = `${location.lat},${location.lon}`; // Format as "lat,lon"
      } catch (error) {
        city = "Toronto"; // If geolocation fails, use default city
      }
    }
  
    const apiKey = "59320ff7bbb247e0b88222430252905";
    const apiUrl = `https://api.weatherapi.com/v1/marine.json?q=${encodeURIComponent(city)}&key=${apiKey}`;
  
    try {
      // Fetch weather data from API
      const apiRes = await fetch(apiUrl);
      const result = await apiRes.json();
  
      // ========== Extract relevant info from the API result ==========
  
      const cityName = result.location.name; // City name
      const regionName = result.location.region; // Region name
      const dateToday = result.forecast.forecastday[0].date; // Current date
  
      const iconWeather = result.forecast.forecastday[0].day.condition.icon; // Main weather icon URL
      const textWeather = result.forecast.forecastday[0].day.condition.text; // Weather condition as text (e.g., "Rain Showers")
  
      const iconTime = result.forecast.forecastday[0].hour[0].condition.icon; // Weather icon for the first hour of the day
  
      const sunrise = result.forecast.forecastday[0].astro.sunrise; // Sunrise time
      const sunset = result.forecast.forecastday[0].astro.sunset;   // Sunset time
      const moonPhase = result.forecast.forecastday[0].astro.moon_phase; // Moon phase name (e.g., "Full Moon")
  
      // Map moon phases to SVG icon file names
      const moonIcons = {
        "New Moon": "new.svg",
        "First Quarter": "first-quarter.svg",
        "Full Moon": "full.svg",
        "Last Quarter": "last-quarter.svg"
      };
  
      // ========== Write content into the weather display container ==========
  
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
  
        <div class="info-buttons">
          <button>Air Quality</button>
          <button>Pressure</button>
          <button>UV</button>
          <button>Precipitation</button>
          <button>Wind</button>
          <button>Visibility</button>
        </div>
  
        <div class="astro-info">
          <p>Sunrise: <span>${sunrise}</span></p>
          <p>Sunset: <span>${sunset}</span></p>
          <p>Moon Phase: <span>${moonPhase}</span> <img class="moon-icon" src="./assets/moons/${moonIcons[moonPhase] || 'default.svg'}" /></p>
        </div>
      `;
    } catch (error) {
      // Show error message if something goes wrong
      document.querySelector("#weathering-info").innerHTML = `<p>Weather data not available.</p>`;
      console.error("API error:", error);
    }
  }
  
  // Helper function: gets user's latitude and longitude from browser
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
  
  // Automatically show weather for user's location on page load
  window.onload = WeatheringToday;
  