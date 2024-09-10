import React, { useState } from "react";
import "./Signup.css";
import useSignup from "../../hooks/useSignup";
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [resume, setResume] = useState(null);
  const { signup, isPending, error } = useSignup();
  const [match, setMatch] = useState(true);
  const [signedUp, setSignedUp] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [step, setStep] = useState(1); // Added step state
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      if (password === confirm) {
        setMatch(true);
        setStep(2);
      } else {
        setMatch(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleFormData();
    }
  }

  async function handleFormData() {
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('city', city);
    formDataToSend.append('college', college);
    if (resume) {
      formDataToSend.append('resume', resume);
    }

    // Get UID from localStorage
    const uid = localStorage.getItem('uid');
    if (uid) {
      formDataToSend.append('uid', uid);
    }

    try {
      const response = await fetch('http://localhost:4000/upload-resume', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionStatus('success');
        setSignedUp(true);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        throw new Error('Failed to upload resume');
      }
    } catch (error) {
      setSubmissionStatus('error');
      console.error('Error uploading resume:', error);
    }
  }

  return (
    <div className="signup-container">
      {signedUp ? (
        <>
          {submissionStatus === 'success' && (
            <>
              <Confetti width={window.innerWidth} height={window.innerHeight} />
              <p>Signup successful and form submitted. Redirecting...</p>
            </>
          )}
          {submissionStatus === 'error' && (
            <p>There was an error with your submission. Please try again.</p>
          )}
        </>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="signup-form">
            <h2>Sign Up</h2>
            {step === 1 && (
              <>
                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </label>
                <label>
                  <span>Confirm Password</span>
                  <input
                    type="password"
                    onChange={(e) => setConfirm(e.target.value)}
                    value={confirm}
                    required
                  />
                </label>
                {!match && <p>Passwords do not match</p>}
                <button type="submit" className="btn">Next</button>
              </>
            )}
            {step === 2 && (
              <>
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </label>
                <label>
                  <span>Phone</span>
                  <input
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    required
                  />
                </label>
                <label>
                  <span>City</span>
                  <input
                    type="text"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    required
                  />
                </label>
                <label>
                  <span>College</span>
                  <input
                    type="text"
                    onChange={(e) => setCollege(e.target.value)}
                    value={college}
                  />
                </label>
                <button type="submit" className="btn">Next</button>
              </>
            )}
            {step === 3 && (
              <>
                <label>
                  <span>Upload Resume (PDF only):</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                </label>
                <button type="submit" className="btn">Submit</button>
              </>
            )}
            {isPending && (
              <button className="btn" disabled>
                Loading
              </button>
            )}
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}

export default Signup;
