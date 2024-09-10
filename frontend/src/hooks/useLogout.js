import { useEffect, useState } from "react";

function useLogout() {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    console.log('Logging out...');
    setError(null);
    setIsPending(true);
    try {
      // Clear token and UID from localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      window.location.replace("/");
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
