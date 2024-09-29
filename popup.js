//popup.js

import { getLocation, getCityCoordinatesFromNeonatim } from './location.js';
import { updateAQI } from './aqi.js';
import { fetchForecastData } from './forecast.js';
import { fetchUVData } from './uv.js';
import { fetchWeatherData } from './weather.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoading(); // Show the loader initially
        const { lat, lon } = await getLocation();
        updateAQI(lat, lon);
        fetchWeatherData(lat, lon);
        fetchUVData(lat, lon);
        fetchForecastData(lat, lon); // Single call for min-max temp and forecast
        hideLoading(); // Hide the loader when done
    } catch (error) {
        hideLoading(); // Ensure the loader is hidden in case of error
        console.error('Error initializing weather extension:', error);
    }
});

// City toggle logic
const weatherLocation = document.getElementById('location');
const cityInput = document.getElementById('city-input');
const toggleCityText = document.querySelector('.underline');
const locationIcon = document.querySelector('#city-name i.fa-map-marker-alt');
const inputField = document.querySelector('#city-input input');
const enterSymbolText = document.getElementById('enter-symbol-text');

// Loader functions
function showLoading() {
    document.getElementById('loading-spinner').style.display = 'block'; // Show loading spinner
}

function hideLoading() {
    document.getElementById('loading-spinner').style.display = 'none'; // Hide loading spinner
}

function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.color = 'red'; // Set text color to red
    errorDiv.style.display = 'block'; // Ensure error message is displayed
}

// Toggle city input visibility
function toggleCityInput() {
    if (cityInput.style.display === 'none' || cityInput.style.display === '') {
        cityInput.style.display = 'block';  // Show city input
        toggleCityText.style.display = 'none'; // Hide "Select another city" text
    }
}

toggleCityText.addEventListener('click', toggleCityInput);
inputField.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const cityName = inputField.value.trim();
        if (cityName) {
            try {
                showLoading(); // Show loading spinner when fetching new city data
                const { lat, lon, country } = await getCityCoordinatesFromNeonatim(cityName);
                updateAQI(lat, lon);
                fetchUVData(lat, lon);
                fetchWeatherData(lat, lon);
                fetchForecastData(lat, lon); // Single call for min-max temp and forecast
                // Update city and country names
                document.getElementById('city-name').innerText = cityName;
                document.getElementById('country-name').innerText = country;
                hideLoading(); // Hide loading spinner when done
                enterSymbolText.style.display = 'none'; // Hide enter symbol text after valid entry
                document.getElementById('error-message').style.display = 'none'; // Hide error message
            } catch (error) {
                hideLoading(); // Ensure the loader is hidden in case of error
                displayError('City not found'); // Update error message
                console.error('Error fetching city coordinates or country:', error);
            }
        }
    } else {
        enterSymbolText.style.display = 'block'; // Show enter symbol text on typing
        document.getElementById('error-message').style.display = 'none'; // Hide error message while typing
    }
});

// Add hover tooltip for location icon
locationIcon.addEventListener('mouseenter', () => {
    const tooltip = document.createElement('span');
    tooltip.innerText = 'Click here for current location';
    tooltip.classList.add('tooltip');
    locationIcon.appendChild(tooltip);
});

locationIcon.addEventListener('mouseleave', () => {
    const tooltip = locationIcon.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
});

// Location icon click event listener
document.addEventListener('click', async (event) => {
    const target = event.target;

    // Make sure the click is coming from the location icon
    if (target && target.classList.contains('fa-map-marker-alt')) {
        console.log("Location icon clicked!");  // Log the click
        try {
            showLoading(); // Show loading spinner when fetching geolocation-based data
            cityInput.style.display = 'none';
            toggleCityText.style.display = 'block';
            const { lat, lon } = await getLocation();
            console.log("New location:", lat, lon);  // Log the new lat/lon
            updateAQI(lat, lon);
            fetchUVData(lat, lon);
            fetchWeatherData(lat, lon);
            fetchForecastData(lat, lon); // Single call for min-max temp and forecast
            hideLoading(); // Hide loading spinner when done
        } catch (error) {
            hideLoading(); // Ensure the loader is hidden in case of error
            displayError('Error fetching location. Try again.');
            console.error('Error fetching geolocation on icon click:', error);
        }
    }
});
