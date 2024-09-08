import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa"; // Import user icon
import "./Navbar.css";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Profile dropdown state

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          Yatharth
        </Link>

        {user && (
          <>
            {/* Navbar Links */}
            <div className={`navbar__menu ${showMenu ? "show-menu" : ""}`} aria-expanded={showMenu}>
              <ul className="navbar__list">
                <li>
                  <Link to="/resume-analyser" className="navbar__link">
                    Resume Analyser
                  </Link>
                </li>
                <li>
                  <Link to="/community-support" className="navbar__link">
                    Community Support
                  </Link>
                </li>
                <li>
                  <Link to="/jobsfinder" className="navbar__link">
                    Jobs Finder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Profile Dropdown */}
            <div className="navbar__profile">
              <FaUserCircle
                className="navbar__profile-icon"
                onClick={toggleProfileDropdown} // Toggle dropdown on click
              />
              {showProfileDropdown && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-content">
                    <p><strong>Name:</strong> {user.displayName || "Unknown"}</p>
                    <p><strong>Email:</strong> {user.email || "Unknown"}</p>
                    {!user.displayName && (
                      <Link to="/profile">Complete Profile</Link>
                    )}
                    <hr />
                    <button onClick={logout} className="navbar__logout-button">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Toggle Button */}
        <div className="navbar__toggle" role="button" aria-label="Open menu" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
