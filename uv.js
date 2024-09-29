// uv.js

export async function fetchUVData(lat, lon) {
    const API_URL = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}&alt=100&dt=`;
    const API_KEY = 'openuv-gfvrm1hse1tb-io'; // Replace this with your valid OpenUV API key

    const myHeaders = new Headers();
    myHeaders.append("x-access-token", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(API_URL, requestOptions);

        // Check if the response status is 403 or any other issue
        if (!response.ok) {
            if (response.status === 403) {
                console.error('Invalid API key or access forbidden.');
            } else {
                console.error('Error fetching UV data:', response.statusText);
            }
            return;
        }

        const data = await response.json();

        if (data && data.result) {
            const uvIndex = data.result.uv.toFixed(1);
            const uvMax = data.result.uv_max.toFixed(1);
            const uvMaxTime = new Date(data.result.uv_max_time).toLocaleTimeString();

            // Update the UI with UV data
            const uvElement = document.getElementById('uv-index');
            if (uvElement) {
                uvElement.innerText = `UV Index: ${uvIndex}`;
            }
        } else {
            console.error('No UV data found');
        }

    } catch (error) {
        console.error('Error fetching UV data:', error);
    }
}
