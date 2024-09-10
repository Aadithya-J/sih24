from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask import Flask, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

def scrape_yt(skill):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("start-maximized")
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # Initialize WebDriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    skill = skill.replace(' ', '+')
    url = f'https://www.youtube.com/results?search_query={skill}&sp=EgIQAw%253D%253D'

    driver.get(url)
    
    total_playlists = []

    playlists = WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.XPATH, "//ytd-playlist-renderer"))
    )

    for playlist in playlists:
        try:
            playlist_link = playlist.find_element(By.XPATH, ".//a[contains(@href, '/playlist')]").get_attribute('href')
            playlist_name = playlist.find_element(By.XPATH, ".//span[@id='video-title']").get_attribute('title')
            channel_name = playlist.find_element(By.XPATH, ".//ytd-channel-name//a").text
            
            total_playlists.append([playlist_link,playlist_name,channel_name])

        except Exception as e:
            print(f"An error has occured: {e}")

    driver.quit()
    
    return total_playlists

@app.route('/api/videos/<skill>', methods = ["GET"])
def playlist_search(skill):
    final = scrape_yt(skill)
    
    if not final:
        print('no playlists found')
    
    return jsonify(final)

if __name__ == "__main__":
    app.rum(port = 'port daal de tash')
