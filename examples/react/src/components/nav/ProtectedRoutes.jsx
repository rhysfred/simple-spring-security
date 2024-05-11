import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import authentication from "../../services/Authentication";

export default function ProtectedRoutes() {
  const [ user, setUser ] = useState(authentication.subscribeUserChanges(handleUserChange));

  function handleUserChange(user) {
    setUser(user);
  }

  if (user && user.accessToken) {
    return <Outlet />;
  }
  return <Navigate to="/login" />;
};