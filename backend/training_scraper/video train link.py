from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# Setup WebDriver service
service = Service('chromedriver.exe')

# Initialize WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

# YouTube search URL
skill = 'data structures and algorithms'
url = f'https://www.youtube.com/results?search_query={skill}&sp=EgIQAw%253D%253D'

# Load the YouTube search results page
driver.get(url)

# Wait for playlists to load
playlists = WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.XPATH, "//ytd-playlist-renderer"))
)

# Loop through the playlists and extract information
for playlist in playlists:
    try:
        # Extract playlist link
        playlist_link = playlist.find_element(By.XPATH, ".//a[contains(@href, '/playlist')]").get_attribute('href')
        
        # Extract playlist name
        playlist_name = playlist.find_element(By.XPATH, ".//span[@id='video-title']").get_attribute('title')
        
        # Extract channel name
        channel_name = playlist.find_element(By.XPATH, ".//ytd-channel-name//a").text

        print(f"Playlist Name: {playlist_name}")
        print(f"Playlist Link: {playlist_link}")
        print(f"Channel Name: {channel_name}\n")

    except Exception as e:
        print(f"Error: {e}")

# Close the WebDriver
driver.quit()