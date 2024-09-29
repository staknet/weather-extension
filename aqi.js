// aqi.js

export async function updateAQI(lat, lon) {
    const apiKey = '2956524c98dd4f3a1e73e890dee6a754';
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(aqiUrl);
        const data = await response.json();

        if (data && data.list && data.list.length > 0) {
            const pm25 = data.list[0].components.pm2_5;
            const aqi = calculateAQI('PM2.5', pm25);
            const severity = getAQIText(aqi);
            updateAQIDisplay(aqi, severity);
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error);
    }
}

function calculateAQI(pollutant, concentration) {
    const breakpoints = [
        { AQI_low: 0, AQI_high: 50, C_low: 0, C_high: 12 },
        { AQI_low: 51, AQI_high: 100, C_low: 12.1, C_high: 35.4 },
        { AQI_low: 101, AQI_high: 150, C_low: 35.5, C_high: 55.4 },
        { AQI_low: 151, AQI_high: 200, C_low: 55.5, C_high: 150.4 },
        { AQI_low: 201, AQI_high: 300, C_low: 150.5, C_high: 250.4 },
        { AQI_low: 301, AQI_high: 400, C_low: 250.5, C_high: 350.4 },
        { AQI_low: 401, AQI_high: 500, C_low: 350.5, C_high: 500.4 }
    ];

    for (const bp of breakpoints) {
        if (concentration >= bp.C_low && concentration <= bp.C_high) {
            return Math.round(
                ((bp.AQI_high - bp.AQI_low) / (bp.C_high - bp.C_low)) * (concentration - bp.C_low) + bp.AQI_low
            );
        }
    }
    return null;
}

function getAQIText(aqi) {
    if (aqi <= 50) {
        return { severity: 'Good', color: 'green' };
    } else if (aqi <= 100) {
        return { severity: 'Moderate', color: 'yellow' };
    } else if (aqi <= 150) {
        return { severity: 'Unhealthy for Sensitive Groups', color: 'orange' };
    } else if (aqi <= 200) {
        return { severity: 'Unhealthy', color: 'red' };
    } else if (aqi <= 300) {
        return { severity: 'Very Unhealthy', color: 'purple' };
    } else {
        return { severity: 'Hazardous', color: 'maroon' };
    }
}

function updateAQIDisplay(aqi, severity) {
    const aqiElement = document.getElementById('aqi');
    if (aqiElement) {
        aqiElement.innerHTML = `AQI: ${aqi} <i class="fas fa-smog"></i>`;
        // aqiElement.style.color = severity.color;
    }
}
