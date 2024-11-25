import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
                    Home
                </Link>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                    Dashboard
                </Link>
                <Link to="/tableView" className={location.pathname === '/tableView' ? 'active' : ''}>
                    Applications
                </Link>
                <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
                    Calendar
                </Link>
                <Link to="/extension" className={location.pathname === '/extension' ? 'active' : ''}>
                    Extension
                </Link>
            </nav>
            <div className="bottom-nav">
                <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
                    Settings
                </Link>
                <button className="nav-button" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 