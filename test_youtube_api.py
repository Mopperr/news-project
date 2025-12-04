import requests

try:
    r = requests.get('http://127.0.0.1:8081/api/youtube/videos')
    print(f'Status: {r.status_code}')
    data = r.json()
    print(f'Total videos: {data.get("total", 0)}')
    print('\nFirst 3 videos:')
    for i, video in enumerate(data.get('items', [])[:3], 1):
        print(f'{i}. {video["snippet"]["title"]}')
        print(f'   Video ID: {video["id"]["videoId"]}')
except Exception as e:
    print(f'Error: {e}')
