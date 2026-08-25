import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardOverview from "../components/dashboard/dashboardOverview";
import AppLayout from "../components/common/appLayout";

import Expenses from "../pages/Expenses";
import Budget from "../pages/Budget";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Settings from "../pages/settings";

import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<PrivateRoute />}>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardOverview />
            </AppLayout>
          }
        />

        <Route
          path="/expenses"
          element={
            <AppLayout>
              <Expenses />
            </AppLayout>
          }
        />

        <Route
          path="/budget"
          element={
            <AppLayout>
              <Budget />
            </AppLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <AppLayout>
              <Reports />
            </AppLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;