//weather.js
const apiKey = '3c732d884d1f4eb49d674300242909'; // Replace with your WeatherAPI key

// Function to fetch weather data
export async function fetchWeatherData(lat, lon) {
    console.log('Fetching data');
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
    try {
        console.log('in try block');
        const response = await fetch(url);
        if (!response.ok) {
            console.log('response not ok');
            throw new Error(`Weather data fetch failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('response ok');
        updateWeatherUI(data);
        updateBackground(data.current.condition.text.toLowerCase());
    } catch (error) {
        console.error(error);
        alert('Failed to retrieve weather data. Please try again later.');
    }
}

// Function to update the HTML with fetched weather data
function updateWeatherUI(data) {
    const weatherMain = data.current.condition.text; // Weather condition text (e.g. Sunny, Rainy)
    const iconCode = 'https://' + data.current.condition.icon; // Weather icon URL
    console.log(iconCode);
    const temp = Math.floor(data.current.temp_c); // Current temperature in Celsius
    const feelsLike = Math.floor(data.current.feelslike_c); // Feels like temperature
    const humidity = data.current.humidity; // Humidity percentage
    const windSpeed = data.current.wind_kph; // Wind speed in kph
    const uvIndex = data.current.uv; // UV index
    const visibility = data.current.vis_km; // Visibility in km
    const cityName = data.location.name; // City name
    const country = data.location.country; // Country
    const precipitation = data.current.precip_mm; // Precipitation in millimeters

    document.getElementById('city-name').innerHTML = `${cityName}<i class="fas fa-map-marker-alt"></i>`;
    document.getElementById('weather-main').innerHTML = weatherMain;
    document.getElementById('temp').innerHTML = `${temp}°`;
    document.getElementById('current-temp').innerHTML = `Feels like: ${feelsLike}°C`;
    document.getElementById('humidity').innerHTML = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').innerHTML = `Wind Speed: ${windSpeed}kph <i class="fas fa-wind"></i>`;
    document.getElementById('uv-index').innerHTML = `UV Index: ${uvIndex}`;
    document.getElementById('visibility').innerHTML = `Visibility: ${visibility} km <i class="fas fa-eye"></i>`;
    document.getElementById('precipitation').innerText = `Precipitation: ${precipitation} mm`;
    document.getElementById('weather-icon').src = iconCode; // Weather icon
    document.getElementById('country-name').innerHTML = `Country: ${country}`;

}
// Function to update the background based on weather condition
const updateBackground = (weatherCondition) => {
    const body = document.body;
    body.className = '';  // Reset existing weather condition class

    // Normalize the weather condition to lowercase for easier comparison
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
        case 'sunny':
        case 'clear':
            body.classList.add('clear');
            break;
        case 'cloudy':
        case 'partly cloudy':
            body.classList.add('clouds');
            break;
        case 'rain':
        case 'light rain':
        case 'moderate rain':
        case 'heavy rain':
        case 'showers':
            body.classList.add('rain');
            break;
        case 'snow':
        case 'light snow':
        case 'heavy snow':
            body.classList.add('snow');
            break;
        default:
            body.classList.add('default-weather');
            break;
    }
};
