from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# from flask import Flask, jsonify
import concurrent.futures
from flask_cors import CORS

# app = Flask(_name_)
# CORS(app)

def scrape_playlist(skill):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("start-maximized")
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    service = Service('chromedriver.exe')
    driver = webdriver.Chrome(service=service, options=chrome_options)

    url = f'https://www.youtube.com/results?search_query={skill}&sp=EgIQAw%253D%253D'
    driver.get(url)

    # Wait for playlist results to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-playlist-renderer")))

    playlists = driver.find_elements(By.CSS_SELECTOR, "ytd-playlist-renderer")

    playlist_data = []

    for playlist in playlists:
        # Extract the playlist link
        playlist_link_element = playlist.find_element(By.CSS_SELECTOR, "a.yt-simple-endpoint")
        playlist_link = playlist_link_element.get_attribute('href')

        # Extract the playlist title
        playlist_title_element = playlist.find_element(By.CSS_SELECTOR, "span#video-title")
        playlist_title = playlist_title_element.get_attribute("title")

        # Extract the YouTube channel name
        channel_element = playlist.find_element(By.CSS_SELECTOR, "yt-formatted-string#text")
        channel_name = channel_element.get_attribute("title")

        playlist_data.append({
            'playlist_title': playlist_title,
            'playlist_link': playlist_link,
            'channel_name': channel_name
        })

    driver.quit()

    print(playlist_data)
    
skill = 'data+structures+and+algorithms'
scrape_playlist(skill)

# @app.route('/scrape/<skill>', methods=['GET'])
# def scrape(skill):
#     with concurrent.futures.ThreadPoolExecutor() as executor:
#         future = executor.submit(scrape_playlist, skill)
#         result = future.result()

#     return jsonify(result)

# if _name_ == "_main_":
#     app.run(debug=True)