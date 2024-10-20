import "./../styles/Navbar.css"

const Navbar = () => {
    return (
      <nav className="nav">
          <a href="/" className="site-name">Website Name</a>
          <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/tableView">Applications</a>
            </li>
            <li>
                <a href="/extension">Extension</a>
            </li>
          </ul>
      </nav>
    );
  };
  
  export default Navbar;
  