const GMAIL_API_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

export const getLinkedInEmails = async (accessToken) => {

    try {
        const URL = `${GMAIL_API_URL}/messages?q=from:jobs-noreply@linkedin.com subject"your application was sent to`;

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