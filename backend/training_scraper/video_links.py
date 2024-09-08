from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import flask
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

def scrape_links(skill):
    chrome_driver_path = 'chromedriver.exe' 

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    service = Service(chrome_driver_path)
    
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.get(f"https://www.youtube.com/results?search_query=learn+{skill}")
    
    time.sleep(2)  
    
    results = driver.find_elements(By.XPATH, '//*[@id="video-title"]')
    links = []

    for result in results:
        try:
            title = result.get_attribute('title')
            link = result.get_attribute('href')
            if title and link:
                links.append([title, link])
        except Exception as e:
            print(f"An error occurred: {e}")

    driver.quit()

    return links

@app.route('/api/video/<skill>', methods=['GET'])
def search(skill):
    links = scrape_links(skill)
    final = []
    
    if not links:
        print("No links found!")
        
    for link in links:
        if link[0]:  
            final.append(link)
    
    return jsonify(final)

if __name__ == "__main__":
    app.run(debug=True)
