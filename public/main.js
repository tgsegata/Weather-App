// function for search city - weather
async function WeatheringToday () {

    // cityInput is the input search-space-html
    // Default city is Toronto
    const city = document.getElementById("cityInput").value || "Toronto";

    // This is my key on API weather
    const apiKey = "59320ff7bbb247e0b88222430252905";

    // base website
    const apiUrl = `https://api.weatherapi.com/v1/marine.json?q=${encodeURIComponent(city)}&key=${apiKey}`;

    // try and catch is for errors (by chatpgt)
    try {
        
        // defining functions
        const apiRes = await fetch(apiUrl);
        const result = await apiRes.json();

        // City & Region
        const cityName = result.location.name;
        const regionName = result.location.region;

        // Date
        const dateToday = result.forecast.forecastday[0].date;

        // Weather icons & text
        const iconWeather = result.forecast.forecastday[0].day.condition.icon;
        const textWeather = result.forecast.forecastday[0].day.condition.text;
        const iconTime = result.forecast.forecastday[0].hour[0].condition.icon;

        // Astrology data
        const sunrise = result.forecast.forecastday[0].astro.sunrise;
        const sunset = result.forecast.forecastday[0].astro.sunset;
        const moonPhase = result.forecast.forecastday[0].astro.moon_phase;



        // Writing the html
        const placeHolder = document.querySelector("#weathering-info");

        // html function
        placeHolder.innerHTML = `
            <p>${cityName}, ${regionName}</p>
            <p>Date today: ${dateToday}</p>
            <img src="${iconWeather}" alt="${textWeather}" />
            <img src="${iconTime}" />
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
            <p>Moon Phase: ${moonPhase}</p>
        `;


    } catch (error) {
        document.querySelector("#weathering-info").innerHTML = `<p>Could not fetch weather. Please try another city.</p>`;
        console.error("Error:", error);
    }
}
// finish function





// Calling function
WeatheringToday();