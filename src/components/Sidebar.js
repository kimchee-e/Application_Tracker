import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();

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
                <Link to="/tableView">Applications</Link>
                <Link to="/extension">Extension</Link>
            </nav>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Sidebar; 