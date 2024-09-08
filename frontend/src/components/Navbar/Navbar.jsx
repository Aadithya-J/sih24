import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef(null); // Reference to the profile dropdown

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          Yatharth
        </Link>

        {user ? (
  <>
    {/* Content when user is logged in */}
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
    <div className="navbar__profile" ref={profileRef}>
      <FaUserCircle
        className="navbar__profile-icon"
        onClick={toggleProfileDropdown}
      />
      {showProfileDropdown && (
        <div className="navbar__dropdown">
          <div className="navbar__dropdown-content">
            <p className="pi">
              <strong>
                <FaUserCircle />
              </strong>{" "}
              {user.displayName || "Unknown"}
            </p>
            <p> {user.email || "Unknown"}</p>
            {!user.displayName && (
              <Link to="/personalized-form">Complete Profile</Link>
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
) : (
  <>
    {/* Content when user is not logged in */}
    <div className={`navbar__menu ${showMenu ? "show-menu" : ""}`} aria-expanded={showMenu}>
      <ul className="navbar__list">
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
        <div className="navbar__toggle" role="button" aria-label="Open menu" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
