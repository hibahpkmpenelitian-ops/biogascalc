import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <span className="navbar-title gradient-text">BiogasCalc</span>
        </Link>

        <ul className="navbar-links" id="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                id={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
