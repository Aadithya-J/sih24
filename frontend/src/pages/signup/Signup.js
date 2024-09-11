import React, { useState } from "react";
import "./Signup.css";
import useSignup from "../../hooks/useSignup";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signup, isPending, error } = useSignup();
  const [match, setMatch] = useState(true);
  const [signedUp, setSignedUp] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password === confirm) {
      setMatch(true);
      signup(email, password);
      setSignedUp(true);
    } else {
      setMatch(false);
    }
  }

  return (
    <div className="signup-container">
      {signedUp ? (
        <p>Signup successful. Redirecting...</p>
      ) : (
        <>
          {/* Left section for the rocket image */}
          <div className="image-container">
            <img src="/rocket.png" alt="Rocket" />
            <div className="typing-text">
              <span>Bridging dreams with reality </span>
            </div>
          </div>

          {/* Right section for signup form */}
          <div className="form-container">
            <form onSubmit={handleSubmit} className="signup-form">
              <h2>Sign Up</h2>
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
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  onChange={(e) => setConfirm(e.target.value)}
                  value={confirm}
                />
              </label>

              {!isPending && <button className="btn">Submit</button>}
              {isPending && (
                <button className="btn" disabled>
                  Loading
                </button>
              )}
              {error && <p>{error}</p>}
              {!match && <p>Passwords do not match</p>}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Signup;