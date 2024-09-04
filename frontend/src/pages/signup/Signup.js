import "./Signup.css";

import useSignup from "../../hooks/useSignup";
import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signup, isPending, error } = useSignup();
  const [match, setMatch] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password, confirm);
    if (password === confirm) {
      setMatch(true);
      signup(email, password);
    } else setMatch(false);
  }
  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Sign Up</h2>
      <label>
        <span>Email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>Confirm Password:</span>
        <input
          type="password"
          onChange={(e) => setConfirm(e.target.value)}
          value={confirm}
        />
      </label>

      {!isPending && <button className="btn">Submit</button>}
      {isPending && (
        <button className="btn" disabled>
          loading
        </button>
      )}
      {error && <p>{error}</p>}
      {!match && <p>Passwords do not match</p>}
    </form>
  );
}
export default Signup;