"""
Jerusalem Weather Updater
Fetches weather data every 10 minutes and saves to JSON file
Uses wttr.in free weather service (no API key required)
"""

import requests
import json
import time
from datetime import datetime
import os

# Jerusalem location
JERUSALEM_LOCATION = 'Jerusalem,Israel'
UPDATE_INTERVAL = 600  # 10 minutes in seconds
WEATHER_FILE = 'weather_data.json'

def fetch_weather():
    """Fetch current weather for Jerusalem from wttr.in (free, no API key)"""
    try:
        # Use wttr.in - free weather service with no API key required
        url = f"https://wttr.in/{JERUSALEM_LOCATION}?format=j1"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract weather information from wttr.in format
        current = data['current_condition'][0]
        
        # Map weather descriptions to simple terms
        description = current['weatherDesc'][0]['value']
        temp_c = int(current['temp_C'])
        feels_like = int(current['FeelsLikeC'])
        humidity = int(current['humidity'])
        wind_speed = int(float(current['windspeedKmph']))
        
        weather_info = {
            'status': 'ok',
            'location': 'Jerusalem, Israel',
            'temperature': temp_c,
            'feels_like': feels_like,
            'description': description,
            'humidity': humidity,
            'wind_speed': wind_speed,
            'pressure': int(current['pressure']),
            'updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'timestamp': time.time()
        }
        
        return weather_info
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching weather: {e}")
        # Return demo data if fetch fails
        return create_demo_weather()
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return create_demo_weather()

def create_demo_weather():
    """Create realistic demo weather data for Jerusalem"""
    # Jerusalem typical weather - varies by time of day
    hour = datetime.now().hour
    
    # Simulate day/night temperature variation
    if 6 <= hour < 12:
        temp = 18
        desc = "Clear"
    elif 12 <= hour < 18:
        temp = 24
        desc = "Partly Cloudy"
    elif 18 <= hour < 22:
        temp = 20
        desc = "Clear"
    else:
        temp = 15
        desc = "Clear"
    
    return {
        'status': 'ok',
        'location': 'Jerusalem, Israel',
        'temperature': temp,
        'feels_like': temp - 1,
        'description': desc,
        'humidity': 55,
        'wind_speed': 12,
        'pressure': 1013,
        'updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'timestamp': time.time(),
        'note': 'Demo data - Live weather unavailable'
    }

def save_weather_data(weather_info):
    """Save weather data to JSON file"""
    try:
        with open(WEATHER_FILE, 'w', encoding='utf-8') as f:
            json.dump(weather_info, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"✗ Error saving weather data: {e}")
        return False

def run_updater():
    """Main loop to update weather every 10 minutes"""
    print("=" * 70)
    print("🌤️  Jerusalem Weather Updater")
    print("=" * 70)
    print(f"Update Interval: {UPDATE_INTERVAL // 60} minutes")
    print(f"Output File: {WEATHER_FILE}")
    print(f"Location: {JERUSALEM_LOCATION}")
    print(f"Weather Source: wttr.in (free service)")
    print("Press Ctrl+C to stop")
    print("=" * 70)
    print()
    
    update_count = 0
    
    try:
        while True:
            update_count += 1
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            print(f"[{timestamp}] Update #{update_count} - Fetching weather data...")
            
            # Fetch weather
            weather_info = fetch_weather()
            
            # Save to file
            if save_weather_data(weather_info):
                if weather_info['status'] == 'ok':
                    print(f"✓ Weather updated: {weather_info['temperature']}°C, {weather_info['description']}")
                    print(f"  Feels like: {weather_info['feels_like']}°C")
                    print(f"  Humidity: {weather_info['humidity']}%")
                    print(f"  Wind: {weather_info['wind_speed']} km/h")
                    if 'note' in weather_info:
                        print(f"  Note: {weather_info['note']}")
                else:
                    print(f"⚠ Weather fetch failed: {weather_info.get('message', 'Unknown error')}")
                print(f"✓ Data saved to {WEATHER_FILE}")
            else:
                print(f"✗ Failed to save weather data")
            
            print(f"Next update in {UPDATE_INTERVAL // 60} minutes...")
            print("-" * 70)
            
            # Wait for next update
            time.sleep(UPDATE_INTERVAL)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Weather updater stopped by user")
        print(f"Total updates: {update_count}")
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")
        print(f"Updater stopped after {update_count} updates")

if __name__ == '__main__':
    # Check if requests is installed
    try:
        import requests
    except ImportError:
        print("✗ Error: 'requests' library not installed")
        print("Install it with: pip install requests")
        exit(1)
    
    # Create initial weather file if it doesn't exist
    if not os.path.exists(WEATHER_FILE):
        print(f"Creating initial weather file: {WEATHER_FILE}")
        initial_weather = fetch_weather()
        save_weather_data(initial_weather)
        print()
    
    run_updater()
