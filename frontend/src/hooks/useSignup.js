import { useState, useEffect } from "react";
import axios from "axios"; // Assuming axios is used for making requests;

function useSignup() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const signup = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const response = await axios.post('http://localhost:4000/signup', { email, password });

      if (!response.data) {
        throw new Error("Could not complete process");
      }

      const token = response.data.token;
      localStorage.setItem('token', token);
      // Redirect to home page
      window.location.replace("/");
      
      // Store the UID in localStorage after signup
      localStorage.setItem('uid', response.data.uid);

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
}

export default useSignup;