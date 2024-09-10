import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    setError(null);
    setIsPending(true);
    try {
      // Clear token and UID from localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      navigate('/');
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsPending(false);
    }
  }

  return { logout, error, isPending };
}

export default useLogout;
