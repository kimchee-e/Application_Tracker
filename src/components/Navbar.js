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
            console.error('Failed to log out');
        }
    };

    return (
        <nav className="nav">
            <div className="nav-container">
                <Link to="/" className="site-name">Jobly</Link>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {/* {user && ( */}
                        <li>
                            <Link to="/tableView">Applications</Link>
                        </li>
                    {/* )} */}
                    <li>
                        <Link to="/extension">Extension</Link>
                    </li>
                    {!user ? (
                        <button
                            className="login-button" 
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    ) : (
                        <li>
                            <button 
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
