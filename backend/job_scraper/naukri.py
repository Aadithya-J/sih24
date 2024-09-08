from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
from dotenv import load_dotenv
import google.generativeai as genai
import ast

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("start-maximized")
chrome_options.add_argument("window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

service = Service('chromedriver.exe')

driver = webdriver.Chrome(service=service, options=chrome_options)

role = 'ai developer'
location = 'bengaluru'

role = role.replace(' ', '-')
location = location.replace(' ','-')

url = f'https://www.naukri.com/{role}-jobs-in-{location}'

driver.get(url)

page_number = 1
max_pages = 1

total_jobs = []

while page_number <= max_pages:
    try:
        jobs = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//a[contains(@class, 'title')]"))
        )
        
        for job in jobs:
            title = job.text 
            link = job.get_attribute('href') 
            total_jobs.append([title,link])
        
        try:
            overlay = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, "styles_privacyPolicy__yEgp3"))
            )
            if overlay:
                close_button = overlay.find_element(By.XPATH, "//button[contains(text(), 'Accept')]")
                close_button.click()
                time.sleep(2) 
        except:
            pass

        try:
            next_button = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.XPATH, "//a[@class='styles_btn-secondary__2AsIP']/span[text()='Next']"))
            )
            driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
            time.sleep(1) 
            driver.execute_script("arguments[0].click();", next_button)
            page_number += 1
            time.sleep(3)
        
        except Exception as e:
            print(f"Error with the 'Next' button on page {page_number}: {e}")
            break

    except Exception as e:
        print(f"Error on page {page_number}: {e}")
        break

driver.quit()

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
last = []
genai.configure(api_key = API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
for m in total_jobs:
    if m[1] == None:
        continue
    else:
        job = m[1][36:]
        string = f"i am using your api in my code, i have a string {job} i want you to give me a list so that i can append it to the code, i dont need any other type of text because i need to append the list it should be like 'gen-ai-developer-happiest-minds-technologies-noida-pune-bengaluru-5-to-8-years-030924013278' this should be converted to [gen ai developer,happiest minds technologies, noida pune bengaluru, 5 to 8], this is just an example, please follow the given format, i dont need any form of code, i just need what i asked for (i dont need any type of explanation please just give me what i ask for)"
        time.sleep(3)
        response = model.generate_content(string)
        responses_list = [ast.literal_eval(line) for line in response.text.strip().split('\n') if line.strip()]

print(responses_list)