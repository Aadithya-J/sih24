from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

service = Service('chromedriver.exe')

driver = webdriver.Chrome(service=service, options=chrome_options)

query = 'machine learning'
query = query.replace(' ', '+')
url = f'https://www.udemy.com/courses/search/?src=ukw&q={query}'

driver.get(url)

courses = WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.XPATH, "//h3[@data-purpose='course-title-url']"))
)

for course in courses:
    try:
        course_link = course.find_element(By.XPATH, ".//a").get_attribute('href')
        course_name = course.find_element(By.XPATH, ".//a").text
        try:
            provider_name = course.find_element(By.XPATH, ".//ancestor::div[contains(@class, 'course-card')]//div[@class='course-card-instructors-module--instructor-list--cJTfw']").text
        except:
            provider_name = "Provider not found"

        print(f"Course Name: {course_name}")
        print(f"Course Link: {course_link}")
        print(f"Provider: {provider_name}\n")

    except Exception as e:
        print(f"Error extracting course details: {e}")

driver.quit()