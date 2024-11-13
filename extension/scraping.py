from bs4 import BeautifulSoup
# Using BeautifulSoup with lxml parses to ease data extraction
# TODO: Only works locally for now on Handshake, will integrate with extension to automate later

# Path to the local HTML file (A Handshake listing)
file_path = 'extension/input_folder/input1.html'

# Read the HTML file
with open(file_path, 'r', encoding='utf-8') as file:
    html = file.read()

# Parse the HTML content
soup = BeautifulSoup(html, 'lxml')

# Extract relevant information based on the provided HTML structure
job_title = soup.find('h1', class_='sc-dLGSFA eAbXpd').get_text(strip=True)
company_name = soup.find('div', class_='sc-fewgDk bxBKkv').get_text(strip=True)
salary = soup.find('div', class_='sc-jOPAHi hDSPNG').get_text(strip=True)
location = soup.find_all('div', class_='sc-jOPAHi hDSPNG')[1].get_text(strip=True)
deadline = soup.find('div', class_='sc-gxgGZj gCQLzi').get_text(strip=True)

# Isolate the deadline portion
if "Apply by" in deadline:
    deadline = deadline.split("Apply by")[-1].strip()
else:
    deadline = "Deadline information not found."

# Print the extracted data
print("Job Title:", job_title)
print("Company Name:", company_name)
print("Salary Range:", salary)
print("Location:", location)
print("Deadline Info:", deadline)
