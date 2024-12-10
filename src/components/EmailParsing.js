import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { getLinkedInEmails } from '../utils/emailAPI';
import { addApplication } from '../utils/firestore';
import { useAuth } from '../context/AuthContext';
import '../styles/EmailParsing.css';

const EmailParsing = ({ reload, showNotification }) => {
    const { user } = useAuth();
    const [token, setToken] = useState(null);

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        onSuccess: (response) => {
            setToken(response.access_token);
            showNotification('Setup complete!');
        },

        onError: (error) => {
            console.error('Login failed:', error);
            showNotification('Failed to connect Gmail');
        }
    });

    useEffect(() => {
        if (!token || !user) return;

        const checkEmails = async () => {
            
            try {
                const applications = await getLinkedInEmails(token, user.uid);
                if (applications.length > 0) {
                    for (const app of applications) {
                        await addApplication(user.uid, app);
                    }
                    reload();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        checkEmails();
        const interval = setInterval(checkEmails, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, [token, user, reload, showNotification]);

    return (
        <button 
            className="add-button"
            onClick={() => login()}
        >
            {token ? 'Connectd' : 'Connect Gmail'}
        </button>
    );
};

export default EmailParsing;
