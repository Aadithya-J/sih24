import { useState, useEffect } from "react";
import axios from "axios"; // Assuming axios is used for making requests;
import firebase from "../firebase/config";
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
      console.log("Created user");
      const userCredential = await firebase.myAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Get the ID token
      const idToken = await user.getIdToken();

      console.log("ID token:",idToken);


      if (!isCancelled) {
        setIsPending(false);
        setError(null);
        localStorage.setItem('uid', user.uid);
        localStorage.setItem('token', idToken);
        console.log("User created");
      }
      // Redirect to home page
      window.location.replace("/");
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