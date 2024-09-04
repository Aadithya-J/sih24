import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./pages/home/Home.js";
import Login from "./pages/login/Login.js";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar/Navbar.jsx";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <>
          <Navbar />
          <Routes>
            <Route
              exact
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;