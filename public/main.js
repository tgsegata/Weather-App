console.log("hellooooooooo world");

// API
const apiUrl = 'https://api.weatherapi.com/v1/current.json?q="New York"&key=59320ff7bbb247e0b88222430252905';

// Function
async function getCurrentWeather () {
    const apiRes = await fetch (apiUrl)
    const result = await apiRes.json();

    // Whole API data
    // console.log ('API response: ', JSON.stringify(result));

    // Weather API
    const currentTempCelsius = result.current.temp_c;
    console.log ('Current Weather: ', currentTempCelsius);

    // City Name
    const cityName = result.location.name;
    console.log ('City Name: ', cityName);

    // Icon Image
    const iconImage = result.current.condition.icon;
    const textImage = result.current.condition.text;

    // Writing on html page - connecting the APIs
    const placeHolder = document.querySelector("#weather-info")
    placeHolder.innerHTML = `
        <p>Right now it is ... </p>
        <p>${cityName}</p>
        <p>${currentTempCelsius} C
            <img src="${iconImage}" alt="${textImage}" />
        ${textImage}</p>
    `


}

// Calling function
getCurrentWeather();


