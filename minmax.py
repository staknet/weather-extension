import requests
from datetime import datetime

API_KEY = '2956524c98dd4f3a1e73e890dee6a754'
lat = '23.0'
lon = '75.7105'

response = requests.get(f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric')
data = response.json()

# Today's date
today = datetime.now().date()

min_temp = float('inf')
max_temp = float('-inf')

# Iterate through the forecast list
for forecast in data['list']:
    forecast_time = datetime.fromtimestamp(forecast['dt']).date()
    if forecast_time == today:
        temp = forecast['main']['temp']
        min_temp = min(min_temp, forecast['main']['temp_min'])
        max_temp = max(max_temp, forecast['main']['temp_max'])

print(f"Today's Min Temp: {min_temp}°C")
print(f"Today's Max Temp: {max_temp}°C")
