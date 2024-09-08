from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import flask
import jsonify
import requests

def scrape_links(string):
    chrome_driver_path = 'chromedriver.exe'

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    service = Service(chrome_driver_path)
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://www.google.com")
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(string)
    search_box.send_keys(Keys.RETURN)

    time.sleep(1) 
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

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query')
    
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400
    search_param = f"learn {query}"
    try:
        results = scrape_links(search_param)
        return jsonify(results)
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)