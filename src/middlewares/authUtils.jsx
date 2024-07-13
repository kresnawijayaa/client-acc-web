// authUtils.js
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const response = await fetch(`${baseURL}/api/auth/check`, {
        headers: {
          authorization: token,
        },
      });

      console.log(response.json().message, "ini check <<<")
      if (response.ok) {
        return true;
      } else {
        localStorage.clear();
        const data = await response.json();
        console.error(data.message);
        return false;
      }
    } catch (error) {
      localStorage.clear();
      console.error('Error checking token:', error);
      return false;
    }
  };
  