// API website "marine.json"
const apiUrl = 'https://api.weatherapi.com/v1/marine.json?q="New York"&key=59320ff7bbb247e0b88222430252905';


// Function
async function WeatheringToday () {
    const apiRes = await fetch (apiUrl)
    const result = await apiRes.json();

    // LETS CREATE A SPACE SO USER WRITE THE CITY / $ INSIDE THE WEBSITE URL

    // City
    const cityName = result.location.name;
    console.log ('City: ', cityName);

    // Region
    const regionName = result.location.name;
    console.log ('Region: ', regionName);

    // Date
    const dateToday = result.forecast.forecastday[0].date;
    console.log('Date:', dateToday);

    // Icon weather
    const iconWeather = result.forecast.forecastday[0].day.condition.icon;
    console.log('Weather Icon:', iconWeather);

    // Text weather
    const textWeather = result.forecast.forecastday[0].day.condition.text;
    console.log('Weather:', textWeather);

    // Sunrise
    const sunrise = result.forecast.forecastday[0].astro.sunrise;
    console.log('Sunrise:', sunrise);

    // Sunset
    const sunset = result.forecast.forecastday[0].astro.sunset;
    console.log('Sunset:', sunset);

    // Moon Phase
    const moonPhase = result.forecast.forecastday[0].astro.moon_phase;
    console.log('Moon Phase:', moonPhase);

    // Icon Image
    // const iconImage = result.current.condition.icon;
    // const textImage = result.current.condition.text;

    // Writing on html page - connecting the APIs
    // const placeHolder = document.querySelector("#weather-info")
    // placeHolder.innerHTML = `
    //     <p>Right now it is ... </p>
    //     <p>${cityName}</p>
    //     <p>${currentTempCelsius} C
    //         <img src="${iconImage}" alt="${textImage}" />
    //     ${textImage}</p>
    // `






}

// Calling function
WeatheringToday();


