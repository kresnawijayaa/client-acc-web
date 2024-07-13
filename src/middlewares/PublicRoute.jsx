// PublicRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthToken } from './authUtils';
import Loading from "../components/Loading";

const PublicRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const isValid = await checkAuthToken();
      setIsAuthenticated(isValid);
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <Loading />; // Or some kind of loading spinner
  }

  return isAuthenticated ? <Navigate to="/" /> : element;
};

export default PublicRoute;
