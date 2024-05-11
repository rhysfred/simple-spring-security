import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import authorisation from "../../services/Authorisation";

export default function SecAdminRoutes() {
  const [ secAdmin, setSecAdmin ] = useState(authorisation.hasRole("secadmin"));
  
  useEffect(() => {
    setSecAdmin(authorisation.hasRole("secadmin"));
  }, [secAdmin]);

  if (secAdmin) {
    return <Outlet />;
  }
  return <Navigate to="/forbidden" />;
};