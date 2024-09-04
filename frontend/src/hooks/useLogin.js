import { useEffect, useState } from "react";
import firebase from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

function useLogin() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  async function login(email, password) {
    setError(null);
    setIsPending(true);
    try {
      const resp = await firebase.myAuth.signInWithEmailAndPassword(
        email,
        password
      );

      dispatch({ type: "LOGIN", payload: resp.user });

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
  }

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
}

export default useLogin;