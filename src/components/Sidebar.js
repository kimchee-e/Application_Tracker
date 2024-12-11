import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    ChartLineUp, 
    ListChecks, 
    Calendar, 
    Gear, 
    SignOut 
} from '@phosphor-icons/react';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <aside className="sidebar">
            <Link to="/" className="logo">Jobly</Link>
            <nav>
                <Link to="/tableView" className={location.pathname === '/tableView' ? 'active' : ''}>
                    <ListChecks size={20} /> Applications
                </Link>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    <ChartLineUp size={20} /> Dashboard
                </Link>
                <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
                    <Calendar size={20} /> Calendar
                </Link>
            </nav>
            <div className="bottom-nav">
                <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                    <Gear size={20} /> Settings
                </Link>
                <button className="nav-button" onClick={handleLogout}>
                    <SignOut size={20} /> Log out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 