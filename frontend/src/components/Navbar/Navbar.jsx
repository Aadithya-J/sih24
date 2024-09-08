import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoMenu } from "react-icons/io5";
import "./Navbar.css";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1150) {
        setShowMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          YATHARTH
        </Link>
        <div
          className={`navbar__menu ${showMenu ? "show-menu" : ""}`}
          aria-expanded={showMenu}
        >
          <ul className="navbar__list">
            {!user && (
              <>
                <li>
                  <Link to="/login" className="navbar__link" onClick={closeMenuOnMobile}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="navbar__link" onClick={closeMenuOnMobile}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <button className="navbar__button" onClick={logout}>
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
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
