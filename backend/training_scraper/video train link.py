from flask import Flask, jsonify, request
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

def youtube_search(query, max_results=10):
    youtube = build('youtube', 'v3', developerKey=API_KEY)
    
    request = youtube.search().list(
        q=query,
        part='snippet',
        type='video',
        maxResults=max_results
    )
    response = request.execute()

    videos = []
    for item in response.get('items', []):
        title = item['snippet']['title']
        video_id = item['id']['videoId']
        link = f"https://www.youtube.com/watch?v={video_id}"
        videos.append({'title': title, 'link': link})

    return videos
@app.route('/api/resources/<skill>', methods=['GET'])
def search(skill):
    links = scrape_links(skill)
    final = []
    print('api running')
    if not links:
        print("No links found!")
    for i in range(len(links)):
        if links[0] == "":
            continue
        else:
            final.append(links)
    return jsonify(final)

@app.route('/api/videos/<skill>', methods=['GET'])
def get_videos(skill):
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    try:
        videos = youtube_search(query)
        return jsonify(videos)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

if __name__ == "__main__":
    app.run(debug=True)
