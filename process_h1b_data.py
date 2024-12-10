import pandas as pd
import json

df = pd.read_excel('h1b_data.xlsx')

certified_cases = df[df['CASE_STATUS'].isin(['Certified', 'Certified-Withdrawn'])]

visaSponsors = {}
for employer, group in certified_cases.groupby('EMPLOYER_NAME'):
    visaSponsors[employer.lower()] = len(group)

with open('src/utils/visaSponsors.json', 'w') as f:
    json.dump(visaSponsors, f, indent=2) 