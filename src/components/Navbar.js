import { useAuth } from '../context/AuthContext';
import "./../styles/Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Failed to log out');
        }
    };

    return (
        <nav className="nav">
            <a href="/" className="site-name">Website Name</a>
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                {user && (
                    <li>
                        <a href="/tableView">Applications</a>
                    </li>
                )}
                {user && (
                    <li>
                        <a href="/extension">Extension</a>
                    </li>
                )}
                {!user ? (
                    <li>
                        <a href="/login">Login</a>
                    </li>
                ) : (
                    <li>
                        <a href="#" onClick={handleLogout}>Logout</a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
  