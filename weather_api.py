"""
Jerusalem Weather API
Fetches current weather data for Jerusalem, Israel
"""

import requests
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
from datetime import datetime

# OpenWeatherMap API Configuration
WEATHER_API_KEY = 'ba2a50681ffed31ce97da2d5cf03e17f'
JERUSALEM_COORDS = {'lat': 31.7683, 'lon': 35.2137}

class WeatherAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Add CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if parsed_path.path == '/api/weather/jerusalem':
            weather_data = get_jerusalem_weather()
            self.wfile.write(json.dumps(weather_data).encode())
        else:
            error_response = {'error': 'Invalid endpoint', 'path': self.path}
            self.wfile.write(json.dumps(error_response).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Customize log messages"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def get_jerusalem_weather():
    """Fetch current weather for Jerusalem from OpenWeatherMap API"""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': JERUSALEM_COORDS['lat'],
            'lon': JERUSALEM_COORDS['lon'],
            'appid': WEATHER_API_KEY,
            'units': 'metric'  # Celsius
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract relevant weather information
        weather_info = {
            'status': 'ok',
            'location': 'Jerusalem, Israel',
            'temperature': round(data['main']['temp']),
            'feels_like': round(data['main']['feels_like']),
            'description': data['weather'][0]['description'].title(),
            'icon': data['weather'][0]['icon'],
            'humidity': data['main']['humidity'],
            'wind_speed': round(data['wind']['speed'] * 3.6, 1),  # Convert m/s to km/h
            'pressure': data['main']['pressure'],
            'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
            'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
            'updated': datetime.now().isoformat()
        }
        
        print(f"✓ Weather data fetched: {weather_info['temperature']}°C, {weather_info['description']}")
        return weather_info
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching weather: {e}")
        return {
            'status': 'error',
            'message': str(e),
            'location': 'Jerusalem, Israel',
            'temperature': '--',
            'description': 'Unable to fetch weather'
        }
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return {
            'status': 'error',
            'message': str(e),
            'location': 'Jerusalem, Israel',
            'temperature': '--',
            'description': 'Weather unavailable'
        }

def run_server(port=8082):
    """Start the weather API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, WeatherAPIHandler)
    
    print("=" * 60)
    print("🌤️  Jerusalem Weather API Server")
    print("=" * 60)
    print(f"Server running on http://127.0.0.1:{port}")
    print(f"Endpoint: http://127.0.0.1:{port}/api/weather/jerusalem")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
