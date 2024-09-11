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

def scrape_coursera(query):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("start-maximized")
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    service = Service('chromedriver.exe')

    driver = webdriver.Chrome(service=service, options=chrome_options)

    query = query.replace(' ', '%20')
    url = f'https://www.coursera.org/search?query={query}'

    driver.get(url)
    
    total_courses = []

    courses = WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.XPATH, "//a[contains(@class, 'cds-CommonCard-titleLink')]"))
    )

    for course in courses:
        try:
            course_link = course.get_attribute('href')
            course_name = course.find_element(By.XPATH, ".//h3").text
            
            total_courses.append([course_name, course_link])

        except Exception as e:
            print(f"Error extracting course details: {e}")

    driver.quit()

    
    return total_courses

@app.route('/api/courses/<course>', methods = ["GET"])
def course_search(course):
    final = scrape_coursera(course)
    
    if not final:
        print('no courses found')
        
    return jsonify(final)

if __name__ == "__main__":
    app.run(port=5006)
