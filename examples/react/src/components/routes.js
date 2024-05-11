import { createBrowserRouter } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Rules from "./pages/Rules";
import Reports from "./pages/Reports";
import Import from "./pages/Import";
import Configuration from "./pages/Configuration";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/nav/ProtectedRoutes";
import ChangePassword from "./pages/ChangePassword";
import Users from "./pages/Users";
import Forbidden from "./pages/Forbidden";
import AdminRoutes from "./components/nav/AdminRoutes";
import SecAdminRoutes from "./components/nav/SecAdminRoues";

export const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        element: <AdminRoutes />,
        children: [
        ],
      },
      {
        element: <SecAdminRoutes />,
        children: [
          {
            path: "users",
            element: <Users />,
          },
        ],
      },
    ],
  },
]);
