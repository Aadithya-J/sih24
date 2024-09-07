import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      <ul>
        <li>
          {/* Make 'Yatharth' a link to the homepage */}
          <Link to="/" className="title">Yatharth</Link>
        </li>
        <div className="list">
          {!user && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <button className="btn" onClick={logout}>
                  Log Out
                </button>
              </li>
              <li>
                <Link className="btn" to="/roadmap">Roadmap</Link>
              </li>
              <li>
                <Link className="btn" to="/resume-analyser">Resume</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
