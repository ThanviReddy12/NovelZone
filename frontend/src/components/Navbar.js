import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/App.css';

const Navbar = () => {
  const userId = localStorage.getItem("userId");
  const [searchInput, setSearchInput] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = searchInput.trim();
    if (trimmedInput !== "") {
      navigate(`/browse?search=${encodeURIComponent(trimmedInput)}`);
      setSearchInput(""); // Clear input after navigating
    }
  };

  return (
    <nav className="navbar">
      {/* Left side links */}
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/quotes">Quotes</Link>
      </div>

      {/* Right side controls */}
      <div className="nav-right">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search books..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>

          {/* Info icon with tooltip */}
          <span
            className="shortcut-info"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            tabIndex={0}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label="Keyboard shortcuts info"
            role="tooltip"
            style={{ cursor: 'pointer', marginLeft: '8px' }}
          >
            {/* Inline SVG info icon with white color */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#FFFFFF"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <line x1="12" y1="8" x2="12" y2="12" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="12" cy="16" r="1" fill="#FFFFFF" />
            </svg>

            {showTooltip && (
              <div className="tooltip">
                <strong>Keyboard Shortcuts:</strong><br />
                / : Focus search bar<br />
                f : Go to Favorites<br />
                b : Go to Browse<br />
                h : Go to Home
              </div>
            )}
          </span>
        </form>

        {!userId && <Link to="/login" className="login-link">Login</Link>}
        {userId && <button onClick={handleLogout} className="logout-button">Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
