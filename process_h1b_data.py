import pandas as pd
import json

df = pd.read_excel('h1b_data.xlsx')

visaSponsors = {}
for employer, group in df.groupby('EMPLOYER_NAME'):
    visaSponsors[employer.lower()] = {
        'applications': len(group),
        'name': employer
    }

with open('src/utils/visaSponsors.json', 'w') as f:
    json.dump(visaSponsors, f, indent=2) 