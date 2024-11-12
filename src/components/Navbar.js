import { Link, useLocation } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get the current route

  return (
    <nav className="nav">
      <Link to="/" className="site-name">Jobly</Link>
      <ul>
        <li>
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/tableView" className={`nav-link ${location.pathname === "/tableView" ? "active" : ""}`}>
            Applications
          </Link>
        </li>
        <li>
          <Link to="/extension" className={`nav-link ${location.pathname === "/extension" ? "active" : ""}`}>
            Extension
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
