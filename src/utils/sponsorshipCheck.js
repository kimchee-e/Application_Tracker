import visaSponsors from './visaSponsors.json';

const cleanedSponsors = {};
Object.keys(visaSponsors).forEach(company => {
    const cleanedName = company
        .toLowerCase()
        .trim()
        .replace(/^[\s\t"]+|[\s\t"]+$/g, '')
        .replace(/,?\s*(inc|llc|corp|corporation)\.?$/gi, '');
    
    cleanedSponsors[cleanedName] = visaSponsors[company];
});

export const checkSponsorship = (companyName) => {
    if (!companyName) return false;

    const searchName = companyName
        .toLowerCase()
        .trim()
        .replace(/^[\s\t"]+|[\s\t"]+$/g, '')
        .replace(/,?\s*(inc|llc|corp|corporation)\.?$/gi, '');

    return cleanedSponsors[searchName] > 0;
}; 