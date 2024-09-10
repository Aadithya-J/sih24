import { useEffect, useState } from "react";
import firebase from "../firebase/config";

function useLogin() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  async function login(email, password) {
    setError(null);
    setIsPending(true);

    try {
      const userCredential = await firebase.myAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Get the ID token
      const idToken = await user.getIdToken();

      if (!isCancelled) {
        setIsPending(false);
        setError(null);

        // Store the ID token and UID in localStorage
        localStorage.setItem('token', idToken);
        localStorage.setItem('uid', user.uid);

        window.location.replace("/");
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
}

export default useLogin;