// forecast.js

export async function fetchForecastData(lat, lon) {
    try {
        const apiKey = '2956524c98dd4f3a1e73e890dee6a754'; // Add your OpenWeatherMap API key here
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            updateMinMaxTemp(data);
            updateForecast(data);
            updateSunriseSunset(data);
        } else {
            console.error('Error fetching forecast data:', data.message);
            // Optional: Display error to the user
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        // Optional: Display error to the user
    }
}

// Update min/max temperature for the day
function updateMinMaxTemp(data) {
    let minTemp = Infinity;
    let maxTemp = -Infinity;

    const today = new Date().toISOString().split('T')[0];
    for (const forecast of data.list) {
        const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
        if (date === today) {
            const temp = forecast.main.temp; // Assuming this is the current temp
            minTemp = Math.min(minTemp, temp);
            maxTemp = Math.max(maxTemp, temp);
        }
    }

    // Update DOM elements for min/max temperature
    document.getElementById('min-temp').innerText = `Min: ${Math.round(minTemp)}°C`;
    document.getElementById('max-temp').innerText = `Max: ${Math.round(maxTemp)}°C`;
}

// Update forecast for 3 days starting from tomorrow
function updateForecast(data) {
    const forecastList = data.list;
    const dailyForecasts = {};

    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Get tomorrow's date
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2); // Get the day after tomorrow's date

    forecastList.forEach(forecast => {
        const dateTime = new Date(forecast.dt * 1000);
        const day = dateTime.toISOString().split('T')[0];

        // Only process forecasts for tomorrow and the next two days
        if (day === tomorrow.toISOString().split('T')[0] ||
            day === dayAfterTomorrow.toISOString().split('T')[0] ||
            day === new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {

            const hour = dateTime.getHours();

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = {
                    morningTemps: [],
                    afternoonTemps: [],
                    eveningTemps: []
                };
            }

            if (hour >= 6 && hour < 12) {
                dailyForecasts[day].morningTemps.push(forecast.main.temp);
            } else if (hour >= 12 && hour < 18) {
                dailyForecasts[day].afternoonTemps.push(forecast.main.temp);
            } else if (hour >= 18 && hour < 24) {
                dailyForecasts[day].eveningTemps.push(forecast.main.temp);
            }
        }
    });

    let dayCount = 1;
    for (const day in dailyForecasts) {
        if (dayCount > 3) break; // Only show 3 days of forecast

        const { morningTemps, afternoonTemps, eveningTemps } = dailyForecasts[day];

        const avgMorningTemp = calculateAverage(morningTemps);
        const avgAfternoonTemp = calculateAverage(afternoonTemps);
        const avgEveningTemp = calculateAverage(eveningTemps);

        const iconCode = data.list.find(forecast => new Date(forecast.dt * 1000).toISOString().split('T')[0] === day).weather[0].icon;

        document.getElementById(`dt${dayCount}`).innerHTML = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
        document.getElementById(`weather-icon${dayCount}`).src = `https://openweathermap.org/img/wn/${iconCode}.png`;
        document.getElementById(`morning${dayCount}`).innerHTML = `Morning: ${Math.round(avgMorningTemp)}°C`;
        document.getElementById(`afternoon${dayCount}`).innerHTML = `Afternoon: ${Math.round(avgAfternoonTemp)}°C`;
        document.getElementById(`evening${dayCount}`).innerHTML = `Evening: ${Math.round(avgEveningTemp)}°C`;

        dayCount++;
    }
}

// Helper function to calculate the average temperature
function calculateAverage(temps) {
    if (temps.length === 0) return 0;
    const total = temps.reduce((sum, temp) => sum + temp, 0);
    return total / temps.length;
}

// Update sunrise and sunset times
function updateSunriseSunset(data) {
    const sunriseTimestamp = data.city.sunrise; // Sunrise in Unix timestamp
    const sunsetTimestamp = data.city.sunset;   // Sunset in Unix timestamp

    // Convert Unix timestamp to readable time format
    const sunrise = new Date(sunriseTimestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(sunsetTimestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Update DOM elements for sunrise and sunset
    document.getElementById('sunrise').innerHTML = `Sunrise: ${sunrise} <i class="fas fa-sun"></i>`;
    document.getElementById('sunset').innerHTML = `Sunset: ${sunset} <i class="fas fa-moon"></i>`;
}