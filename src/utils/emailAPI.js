import { checkEmailProcessed, markEmailProcessed } from './firestore';

const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

export const getLinkedInEmails = async (accessToken, userId) => {
    try {
        const URL = `${GMAIL_API_URL}/messages?q=from:jobs-noreply@linkedin.com subject:"your application was sent to"`;

        const response = await fetch(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const emailSearchResponse = await response.json();
        
        if (!emailSearchResponse.messages || emailSearchResponse.messages.length === 0) {
            console.log('No new LinkedIn emails found');
            return [];
        }

        const emails = await Promise.all(
            emailSearchResponse.messages.map(async (message) => {
                const isProcessed = await checkEmailProcessed(userId, message.id);
                if (isProcessed) {
                    console.log('Skipping already processed email:', message.id);
                    return null;
                }

                const emailResponse = await fetch(`${GMAIL_API_URL}/messages/${message.id}?format=full`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const emailData = await emailResponse.json();
                const parsedEmail = linkedInParser(emailData);
                
                if (parsedEmail) {
                    await markEmailProcessed(userId, message.id);
                    return parsedEmail
                }
            })
        );

        return emails.filter(email => email !== null);
    } catch (error) {
        console.error('Error getting emails:', error);
        throw error;
    }
};


export const linkedInParser = (emails) => {
    try { 
        console.log('Starting the linked in funcion here:')
        const headers = emails.payload.headers;
        const subject = headers.find(header => header.name === 'Subject').value;
        console.log('Subject of the email is: ', subject);

        let body = ''
        if (emails.payload.parts) {
            body = emails.payload.parts[0].body.data; // email body can be in parts (if therse HTML) or just plain text so we got to check
        }
        else {
            body = emails.payload.body.data // if just plain text than can just directly access. 
        }

        const stringBody = atob(body.replace(/-/g, '+').replace(/_/g, '/')); // got to convert from base 64 to string
        console.log('Body of the email is: ', stringBody);

        const companyName = subject.match(/sent to (.*?)(?:,|\.|$)/i);
        if (!companyName) return null;

        const lines = stringBody.split('\n');
        let location = '';
        let jobTitle = '';

        // there is probably a better way to do this but for this is all I got.
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.includes('application was sent')) continue; 
            
            if(!jobTitle) { // my understanding is job title is first line after header
                jobTitle = line;
                continue;
            }

            const locationParsed = line.match(/([^,]+),\s*([A-Z]{2})/); // location is Austin, TX or something like that
            if (locationParsed) {
                location = locationParsed[1] + ', ' + locationParsed[2];
                break;
            }
        }
        console.log('Location is:', location);

        const dateHeader = headers.find(header => header.name === 'Date');
        const dateApplied = dateHeader ? new Date(dateHeader.value) : new Date()

        const result = {
            jobTitle: jobTitle,
            companyName: companyName[1].trim(),
            location: location,
            dateApplied: dateApplied,
            jobType: 'Full Time',
            status: 'Applied'
        };

        console.log('Linked in parser found: ', result);
        return result;
    } catch (error) {
        console.error('Error parsing emails:', error);
        throw error;
    }
}; 
