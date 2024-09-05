from bs4 import BeautifulSoup
import requests
import re

keywords = "Machine Learning"
location = "Bangalore"

link_url = f"https://www.linkedin.com/jobs/search?keywords={keywords}&location={location}&geoId=&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0"

response = requests.get(link_url)

list_page = response.text
soup = BeautifulSoup(list_page, "html.parser")
page_jobs = soup.find_all("a", {"class": "base-card__full-link absolute top-0 right-0 bottom-0 left-0 p-0 z-[2]"})
id_list = []
link_list = []
pattern = re.compile(r'\d{10}')

for job in page_jobs:
    if job != None:
        link = job.get("href")
        id = pattern.findall(link)[0]
        link_list.append(link)
        id_list.append(id)

i = 0
job_list = []

for id in id_list:
    job_url = link_list[i]

    job_response = requests.get(job_url)
    job_soup = BeautifulSoup(job_response.content, "html.parser")

    job_post = {}
    try:
        job_post["job_title"] = job_soup.find("h1", {"class": "top-card-layout__title font-sans text-lg papabear:text-xl font-bold leading-open text-color-text mb-0 topcard__title"}).text.strip()
    except:
        job_post["job_title"] = None
    
    try:
        job_post["company_name"] = job_soup.find("a", {"class": "topcard__org-name-link topcard__flavor--black-link"}).text.strip()
    except:
        job_post["company_name"] = None
    
    try:
        job_post["time_posted"] = job_soup.find("span", {"class": "posted-time-ago__text posted-time-ago__text--new topcard__flavor--metadata"}).text.strip()
    except:
        job_post["time_posted"] = None

    try:
        job_post["job_url"] = link_list[i]
    except:
        job_post["job_url"] = None

    i += 1
    job_list.append(job_post)

print(job_list)