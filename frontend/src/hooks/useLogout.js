import { useEffect, useState } from "react";
import firebase from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate(); // Add this line

  async function logout() {
    setError(null);
    setIsPending(true);
    try {
      await firebase.myAuth.signOut();

      dispatch({ type: "LOGOUT" });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);

        // Redirect to the homepage
        navigate('/');
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

  return { logout, error, isPending };
}

export default useLogout;
