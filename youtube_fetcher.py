from flask import Flask, jsonify
from flask_cors import CORS
import feedparser
from datetime import datetime

app = Flask(__name__)
CORS(app)

# VFI YouTube Channel ID
VFI_CHANNEL_ID = 'UCgbcHAR6wp5mtxZltb3xVZQ'

@app.route('/api/youtube/videos', methods=['GET'])
def get_youtube_videos():
    """Fetch videos from VFI YouTube channel using RSS feed (no quota)"""
    try:
        # YouTube RSS feed doesn't require API key
        rss_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={VFI_CHANNEL_ID}'
        feed = feedparser.parse(rss_url)
        
        videos = []
        for entry in feed.entries:
            video = {
                'id': {
                    'videoId': entry.yt_videoid
                },
                'snippet': {
                    'title': entry.title,
                    'description': entry.get('summary', ''),
                    'publishedAt': entry.published,
                    'thumbnails': {
                        'high': {
                            'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/hqdefault.jpg'
                        },
                        'maxres': {
                            'url': f'https://img.youtube.com/vi/{entry.yt_videoid}/maxresdefault.jpg'
                        }
                    },
                    'channelTitle': entry.author
                }
            }
            videos.append(video)
        
        return jsonify({
            'status': 'ok',
            'total': len(videos),
            'items': videos
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/youtube/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'YouTube fetcher is running'})

if __name__ == '__main__':
    print("Starting YouTube Video Fetcher API...")
    print("Available endpoints:")
    print("  - GET /api/youtube/videos - Get VFI YouTube videos")
    print("  - GET /api/youtube/health - Health check")
    print("\nNote: This uses YouTube RSS feed (no API quota required)")
    app.run(debug=True, host='127.0.0.1', port=8081)
