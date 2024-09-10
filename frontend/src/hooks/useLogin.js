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
      const resp = await firebase.myAuth.signInWithEmailAndPassword(
        email,
        password
      );

      if (!isCancelled) {
        setIsPending(false);
        setError(null);

        // Store the token and UID in localStorage
        localStorage.setItem('token', resp.token);
        localStorage.setItem('uid', resp.user.uid);
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