from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# Setup WebDriver service
service = Service('chromedriver.exe')  # Adjust to the path where chromedriver is located

# Initialize WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

# Define the Coursera search URL (change query parameter as needed)
query = 'data structures and algorithms'
url = f'https://www.coursera.org/search?query={query.replace(" ", "%20")}'

# Load the Coursera search results page
driver.get(url)

# Wait for the course cards to load
courses = WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.XPATH, "//a[contains(@class, 'cds-CommonCard-titleLink')]"))
)

# Loop through the courses and extract information
for course in courses:
    try:
        # Extract course link (relative URL)
        course_link = course.get_attribute('href')
        
        # Extract course name
        course_name = course.find_element(By.XPATH, ".//h3").text
        
        # Extract university/organization name (if available)
        try:
            university_name = course.find_element(By.XPATH, ".//span[contains(@class, 'partner-name')]").text
        except:
            university_name = "University not found"

        print(f"Course Name: {course_name}")
        print(f"Course Link: {course_link}")
        print(f"University/Organization: {university_name}\n")

    except Exception as e:
        print(f"Error extracting course details: {e}")

# Close the WebDriver
driver.quit()