import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    House, 
    ChartLineUp, 
    ListChecks, 
    Calendar, 
    GoogleChromeLogo,
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
            console.error('Failed to log out');
        }
    };

    return (
        <div className="sidebar">
            <Link to="/" className="logo">Jobly</Link>
            <nav>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                    <House size={20} weight="regular" /> Home
                </Link>
                <Link to="/tableView" className={location.pathname === '/tableView' ? 'active' : ''}>
                    <ListChecks size={20} weight="regular" /> Applications
                </Link>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    <ChartLineUp size={20} weight="regular" /> Dashboard
                </Link>
                <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
                    <Calendar size={20} weight="regular" /> Calendar
                </Link>
                <Link to="/extension" className={location.pathname === '/extension' ? 'active' : ''}>
                    <GoogleChromeLogo size={20} weight="regular" /> Extension
                </Link>
            </nav>
            <div className="bottom-nav">
                <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                    <Gear size={20} weight="regular" /> Settings
                </Link>
                <button className="nav-button" onClick={handleLogout}>
                    <SignOut size={20} weight="regular" /> Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 