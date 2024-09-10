import { useState } from "react";
import "./Login.css";
import useLogin from "../../hooks/useLogin.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { login } = useLogin(); // Initialize the useLogin hook

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    login(email, password) // Call the login function from useLogin hook
      .then(() => {
        setIsPending(false);
        setError(null);
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
        setIsPending(false);
      });
  }

  return (
    <div className="signup-container">
      {/* Left section for the rocket image */}
      <div className="image-container">
        <img src="/rocket.png" alt="Rocket" />
        <div className="typing-text">
          <span>Bridging dreams with reality </span>
        </div>
      </div>

      {/* Right section for login form */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Login</h2>
          <label>
            <span>Email</span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>

          {!isPending && <button className="btn">Submit</button>}
          {isPending && (
            <button className="btn" disabled>
              Loading
            </button>
          )}
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
