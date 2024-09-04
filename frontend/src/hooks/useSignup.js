import { useState, useEffect } from "react";
import firebase from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

function useSignup() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const resp = await firebase.myAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!resp) {
        throw new Error("Could not complete process");
      }

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
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
}

export default useSignup;