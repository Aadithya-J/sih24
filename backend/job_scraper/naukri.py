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
from flask import Flask, jsonify
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)


def scrape_jobs(role, location):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("start-maximized")
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    service = Service('chromedriver.exe')

    driver = webdriver.Chrome(service=service, options=chrome_options)

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
                driver.execute_script("arguments[0].click();", next_button)
                page_number += 1
            
            except Exception as e:
                print(f"Error with the 'Next' button on page {page_number}: {e}")
                break

        except Exception as e:
            print(f"Error on page {page_number}: {e}")
            break

    driver.quit()

    return total_jobs


def get_job_details(job_info, model):
    try:
        if job_info[1] is None:
            return None
        
        job_str = job_info[1][36:] 
        prompt = (f"I am using your API in my code. I have a string '{job_str}', and I want you to give me a list "
                  "that can be later converted into JSON data. The input format is like "
                  "'gen-ai-developer-happiest-minds-technologies-noida-pune-bengaluru-5-to-8-years-030924013278', "
                  "and it should be converted to the list ['gen ai developer', 'happiest minds technologies', 'noida pune bengaluru', '5 to 8']. "
                  "Please provide ONLY the list in the response, no extra text, explanations, or code.")
        
        response = model.generate_content(prompt)
        output = response.text
        
        actual_list = ast.literal_eval(output)
        
        if len(actual_list) == 4:
            actual_list.append(job_info[1]) 
            return actual_list
        return None
    
    except Exception as e:
        print(f"Error processing job {job_info}: {e}")
        return None


def process_jobs_concurrently(total_jobs, model, max_workers=10):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(get_job_details, job, model) for job in total_jobs]
        
        results = []
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                results.append(result)
    
    return results


@app.route('/api/jobs/<jobInput>/<location>', methods=['GET'])
def get_jobs(jobInput, location):
    total_jobs = scrape_jobs(jobInput, location)
    
    load_dotenv()
    API_KEY = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    job_data = process_jobs_concurrently(total_jobs, model)
    
    if not job_data:
        print("No jobs found!")
    
    return jsonify(job_data)

if __name__ == "__main__":
    app.run(debug=True)