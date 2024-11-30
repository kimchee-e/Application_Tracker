import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
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
    return (
        <div className="calendar-container">
            <BigCalendar
                localizer={localizer}
                events={[]}
                startAccessor="start"
                endAccessor="end"
                style={{height: 500 }}
            />
        </div>
    );
};

export default Calendar;
