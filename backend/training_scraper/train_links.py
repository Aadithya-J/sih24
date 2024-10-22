from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import flask
from flask import Flask, jsonify,request
from flask_cors import CORS
import platform

app = Flask(__name__)
CORS(app) 

def scrape_links(skill):
    chrome_driver_path = ''
    if(platform.system() == 'Windows'):
        chrome_driver_path = Service('chromedriver.exe')
    else:
        chrome_driver_path = Service('chromedriver')

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    service = Service(chrome_driver_path)
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://www.google.com")
    
    search_box = driver.find_element(By.NAME, "q")
    actual_string = f"learn {skill}"
    search_box.send_keys(actual_string)
    search_box.send_keys(Keys.RETURN)

    time.sleep(2) 

    results = driver.find_elements(By.CSS_SELECTOR, 'div.g')
    links = []

    for result in results:
        try:
            title_element = result.find_element(By.TAG_NAME, 'h3')
            link_element = result.find_element(By.CSS_SELECTOR, 'a')
            links.append([title_element.text, link_element.get_attribute('href')])
        except Exception as e:
            print(f"An error occurred: {e}")

    driver.quit()

    return links

@app.route('/api/resources/<skill>', methods=['GET','OPTIONS'])
def search(skill):
    if request.method == 'OPTIONS':
        return '',200
    links = scrape_links(skill)
    final = []
    
    
    if not links:
        print("No links found!")
        
    for link in links:
        if link[0]:  
            final.append(link)
    
    return jsonify(final)

if __name__ == "__main__":
    app.run(port=5004)
