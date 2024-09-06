import { useState } from "react";
import useLogin from "../../hooks/useLogin";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
    console.log(email, password);
  }

  return (
    <div className="login-container">
      {/* Left section for rocket image */}
      <div className="image-container"> 
        <img src="/rocket.png" alt="Rocket" onError={() => {}} /> {/* Image path relative to the public folder */}
        <div className="typing-text">
          <span>Bridging dreams with reality</span>
        </div>
      </div>

      {/* Right section for login form */}
      <form onSubmit={handleSubmit} className="login-form">
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
        {!isPending && <button className="btn">Login</button>}
        {isPending && (
          <button className="btn" disabled>
            loading
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
