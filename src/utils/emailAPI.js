const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

export const getLinkedInEmails = async (accessToken) => {

    try {
        const URL = `${GMAIL_API_URL}/messages?q=from:jobs-noreply@linkedin.com subject:"your application was sent to"`;

        const response = await fetch(URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const emailSearchResponse = await response.json();

        const emails = [];

        for (const message of emailSearchResponse.messages) {
            const emailResponse = await fetch(`${GMAIL_API_URL}/messages/${message.id}?format=full`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const emailData = await emailResponse.json();
            emails.push(emailData);
        }

        return emails;
    } catch (error) {
        console.error('Error getting emails:', error);
        throw error;
    }
};


const linkedInParser = (emails) => {
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

        const stringBody = atob(body); // got to convert from base 64 to string
        console.log('Body of the email is: ', stringBody);

        return {
            subject: subject,
            body: stringBody
        }
    } catch (error) {
        console.error('Error parsing emails:', error);
        throw error;
    }

}; 
