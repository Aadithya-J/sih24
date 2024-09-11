import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { logout } = useLogout();
  const [user, setUser] = useState(null); // State to store user information
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false); // Added state for theme
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode);
    document.body.classList.toggle('light-mode', !isLightMode);
    document.body.classList.toggle('dark-mode', isLightMode);
  };

  useEffect(() => {
    // Simulating user authentication with tokens
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user information using the token (example)
      // Replace this with your actual token verification logic
      setUser({ displayName: "John Doe", email: "johndoe@example.com" });
    }
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the profile dropdown
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear user information and token on logout
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to the home page after logout
  };

  return (
    <nav className={`navbar ${isLightMode ? 'light-mode' : 'dark-mode'}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          Yatharth
        </Link>

        {user ? (
          <>
            {/* Navbar Links */}
            <div
              className={`navbar__menu ${showMenu ? "show-menu" : ""}`}
              aria-expanded={showMenu}
            >
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
                <li>
                  <Link to="/roadmap" className="navbar__link">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link to="/training" className="navbar__link">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLightMode ? 'Dark' : 'Light'} Mode`}
            >
              {isLightMode ? (
                <FaMoon title="Switch to Dark Mode" />
              ) : (
                <FaSun title="Switch to Light Mode" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="navbar__profile" ref={profileRef}>
              <FaUserCircle
                className="navbar__profile-icon"
                onClick={toggleProfileDropdown}
              />
              {showProfileDropdown && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-content">
                    <Link to="/profile" className="navbar__link">
                      <p>
                        <strong>
                          <FaUserCircle />
                        </strong>{" "}
                        {user?.displayName || "Unknown"}
                      </p>
                    </Link>
                    <p>{user?.email || "Unknown"}</p>
                    <Link to="/personalized-form">
                      Complete Profile
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="navbar__logout-button">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Content when user is not logged in */}
            <div
              className={`navbar__menu ${showMenu ? "show-menu" : ""}`}
              aria-expanded={showMenu}
            >
              <ul className="navbar__menu">
                <li>
                  <Link to="/login" className="navbar__link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="navbar__link">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Mobile Toggle Button */}
        <div
          className="navbar__toggle"
          role="button"
          aria-label="Open menu"
          onClick={toggleMenu}
        >
          <IoMenu />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
