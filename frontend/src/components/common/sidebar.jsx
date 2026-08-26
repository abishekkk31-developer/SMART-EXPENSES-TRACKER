import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  // ==========================================
  // NAV LINK
  // ==========================================

  const getNavClass = ({ isActive }) =>
    `sidebar-link ${
      isActive ? "active" : ""
    }`;

  return (
    <aside className="sidebar">

      {/* ======================================
          BRAND
      ====================================== */}

      <div className="sidebar-brand">

        <div className="brand-icon">
          ₹
        </div>

        <div>
          <h2>
            Smart Expense
          </h2>

          <span>
            Tracker
          </span>
        </div>

      </div>

      {/* ======================================
          MAIN NAVIGATION
      ====================================== */}

      <nav className="sidebar-nav">

        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          className={getNavClass}
        >
          <LayoutDashboard size={20} />

          <span>
            Dashboard
          </span>
        </NavLink>

        {/* EXPENSES */}

        <NavLink
          to="/expenses"
          className={getNavClass}
        >
          <Receipt size={20} />

          <span>
            Expenses
          </span>
        </NavLink>

        {/* BUDGET */}

        <NavLink
          to="/budget"
          className={getNavClass}
        >
          <Wallet size={20} />

          <span>
            Budget
          </span>
        </NavLink>

        {/* REPORTS */}

        <NavLink
          to="/reports"
          className={getNavClass}
        >
          <BarChart3 size={20} />

          <span>
            Reports
          </span>
        </NavLink>

        {/* PROFILE */}

        <NavLink
          to="/profile"
          className={getNavClass}
        >
          <User size={20} />

          <span>
            Profile
          </span>
        </NavLink>

      </nav>

      {/* ======================================
          SETTINGS + LOGOUT
      ====================================== */}

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={getNavClass}
        >
          <Settings size={20} />

          <span>
            Settings
          </span>
        </NavLink>

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <LogOut size={20} />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;