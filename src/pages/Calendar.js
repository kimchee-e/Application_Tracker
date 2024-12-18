import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../utils/firestore';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';
import startOfWeek from 'date-fns/startOfWeek';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Calendar.css';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { enUS }
});

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const loadInterviews = useCallback(async () => {
        if (!user) return;
        
        try {
            const applications = await getApplications(user.uid);
            const interviewEvents = applications
                .filter(app => app.interviewDate)
                .map(app => ({
                    id: app.id,
                    title: `Interview: ${app.company} - ${app.jobTitle}`,
                    start: app.interviewDate,
                    end: app.interviewDate,
                    status: app.status
                }));
            setEvents(interviewEvents);
        } catch (error) {
            console.error('Error loading interviews:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadInterviews();
    }, [loadInterviews]);

    if (loading) {
        return <div className="calendar-page">Loading...</div>;
    }

    return (
        <div className="calendar-page">
            <header>
                <h1>Calendar</h1>
                <p>Track your upcoming interviews</p>
            </header>
            <div className="calendar-container">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 600 }}
                />
            </div>
        </div>
    );
};

export default Calendar;
