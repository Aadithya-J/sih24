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
        <li className="title">Yatharth</li>
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
            <li>
              <button className="btn" onClick={logout}>
                Log Out
              </button>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
}
export default Navbar;