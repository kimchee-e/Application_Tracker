import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./../styles/Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    return (
        <nav className="nav">
            <Link to="/" className="site-name">Jobly</Link>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {user && (
                    <li>
                        <Link to="/tableView">Applications</Link>
                    </li>
                )}
                <li>
                    <Link to="/extension">Extension</Link>
                </li>
                {!user ? (
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                ) : (
                    <li>
                        <button onClick={handleLogout} className="nav-button">
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
