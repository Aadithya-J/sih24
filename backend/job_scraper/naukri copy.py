import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up Chrome options
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# Path to your chromedriver
service = Service('sih24\backend\job_scraper\chromedriver.exe')

# Initialize the Chrome WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

# Open the URL
driver.get('https://www.naukri.com/ai-developer-jobs-in-bangalore-bengaluru-karnataka?expJD=true')

# Initialize a counter for pages
page_number = 1
max_pages = 10 

# URL of your MERN stack backend API
api_url = 'http://localhost:4000/api/jobs'

while page_number <= max_pages:
    try:
        # Extract job elements and their links
        job_elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//a[contains(@class, 'title')]"))
        )
        
        # Extract company names only with class 'comp-name mw-25'
        company_elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//a[contains(@class, 'comp-name mw-25')]"))
        )
        
        # Combine job titles and company names, and send the data to the backend
        for job, company in zip(job_elements, company_elements):
            title = job.text  # Extract the job title
            link = job.get_attribute('href')  # Extract the href link
            company_name = company.text  # Extract the company name
            
            # Data to be sent to the backend
            job_data = {
                'title': title,
                'company': company_name,
                'link': link
            }
            
            # Send the data to your backend using a POST request
            response = requests.post(api_url, json=job_data)
            
            if response.status_code == 200:
                print(f"Successfully saved job: {title}")
            else:
                print(f"Failed to save job: {title}, Status Code: {response.status_code}")
        
        # Click the "Next" button to go to the next page
        next_button = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.XPATH, "//a[@class='styles_btn-secondary__2AsIP']/span[text()='Next']"))
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
        time.sleep(1)  # Give it a moment to adjust
        driver.execute_script("arguments[0].click();", next_button)
        page_number += 1
        time.sleep(3)  # Increase delay to ensure page loads fully

    except Exception as e:
        print(f"Error on page {page_number}: {e}")
        break

# Close the browser
driver.quit()
