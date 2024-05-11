import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import authorisation from "../../services/Authorisation";

export default function AdminRoutes() {
  const [ admin, setAdmin ] = useState(authorisation.hasRole("admin"));
  
  useEffect(() => {
    setAdmin(authorisation.hasRole("admin"));
  }, [admin]);

  if (admin) {
    return <Outlet />;
  }
  return <Navigate to="/forbidden" />;
};