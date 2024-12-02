import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApplications } from '../utils/firestore';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';
import startOfWeek from 'date-fns/startOfWeek';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Calendar.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const loadEvents = async () => {
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
        };

        loadEvents();
    }, [user.uid]);

    return (
        <div className="calendar-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Interview Calendar</h1>
                    <p className="subheader">
                        Track your upcoming interviews
                    </p>
                </div>
            </div>
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
