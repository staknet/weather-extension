// Get current location using geolocation or IP as a fallback
export async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const geolocationTimeout = setTimeout(() => {
                fallbackToIP(); // Fallback if geolocation takes too long
            }, 2000); // Timeout after 2 seconds

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(geolocationTimeout);
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    resolve({ lat, lon });
                },
                () => {
                    clearTimeout(geolocationTimeout);
                    fallbackToIP(); // If geolocation fails, fallback to IP
                }
            );
        } else {
            fallbackToIP(); // If geolocation is unavailable, fallback to IP
        }

        function fallbackToIP() {
            const token = '36123c8ca02e02'; // Your ipinfo API token
            fetch(`https://ipinfo.io?token=${token}`)
                .then(response => response.json())
                .then(data => {
                    const countryName = data.country;
                    document.getElementById('country-name').innerHTML = ` ${countryName}`;
                    const [lat, lon] = data.loc.split(','); // Split the location string
                    resolve({ lat: parseFloat(lat), lon: parseFloat(lon) });
                })
                .catch(err => {
                    console.error('Error fetching location:', err);
                    reject('Unable to fetch location');
                });
        }
    });
}

// Get coordinates of a city using the Nominatim API (OpenStreetMap)
export async function getCityCoordinatesFromNeonatim(cityName) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`);
    const data = await response.json();

    if (data.length === 0) {
        throw new Error('City not found');
    }

    const { lat, lon, display_name } = data[0]; // Extract latitude, longitude, and full location name

    // Parse the country from the display_name (city, region, country is usually returned)
    const locationParts = display_name.split(',').map(part => part.trim());
    const country = locationParts[locationParts.length - 1]; // Last part is usually the country

    return { lat, lon, country }; // Return lat, lon, and country
}
