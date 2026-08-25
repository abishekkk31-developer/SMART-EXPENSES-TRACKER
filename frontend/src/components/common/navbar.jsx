import { useEffect, useState } from "react";

import {
  Bell,
  UserCircle,
  Check,
  X,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [showMobileAccountMenu, setShowMobileAccountMenu] =
    useState(false);

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = () => {
    const savedNotifications =
      localStorage.getItem(
        "expenseTrackerNotifications"
      );

    if (!savedNotifications) {
      setNotifications([]);
      return;
    }

    try {
      const parsedNotifications =
        JSON.parse(savedNotifications);

      setNotifications(
        Array.isArray(parsedNotifications)
          ? parsedNotifications
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );

      setNotifications([]);
    }
  };

  // ==========================================
  // NOTIFICATION UPDATE EVENT
  // ==========================================

  const notifyNotificationsUpdated = () => {
    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  };

  // ==========================================
  // LOAD + LISTEN
  // ==========================================

  useEffect(() => {
    loadNotifications();

    const handleFocus = () => {
      loadNotifications();
    };

    const handleNotificationsUpdated = () => {
      loadNotifications();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdated
      );
    };
  }, []);

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  // ==========================================
  // MARK ONE READ
  // ==========================================

  const markAsRead = (id) => {
    const updatedNotifications =
      notifications.map(
        (notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
      );

    setNotifications(
      updatedNotifications
    );

    localStorage.setItem(
      "expenseTrackerNotifications",
      JSON.stringify(
        updatedNotifications
      )
    );

    notifyNotificationsUpdated();
  };

  // ==========================================
  // MARK ALL READ
  // ==========================================

  const markAllAsRead = () => {
    const updatedNotifications =
      notifications.map(
        (notification) => ({
          ...notification,
          read: true,
        })
      );

    setNotifications(
      updatedNotifications
    );

    localStorage.setItem(
      "expenseTrackerNotifications",
      JSON.stringify(
        updatedNotifications
      )
    );

    notifyNotificationsUpdated();
  };

  // ==========================================
  // REMOVE NOTIFICATION
  // ==========================================

  const removeNotification = (id) => {
    const updatedNotifications =
      notifications.filter(
        (notification) =>
          notification.id !== id
      );

    setNotifications(
      updatedNotifications
    );

    localStorage.setItem(
      "expenseTrackerNotifications",
      JSON.stringify(
        updatedNotifications
      )
    );

    notifyNotificationsUpdated();
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // MOBILE ACCOUNT MENU
  // ==========================================

  const handleMobileSettings = () => {
    setShowMobileAccountMenu(false);

    navigate("/settings");
  };

  const handleMobileLogout = () => {
    setShowMobileAccountMenu(false);

    logout();

    navigate("/");
  };

  return (
    <header className="navbar">

      {/* =====================================
          LEFT
      ====================================== */}

      <div className="navbar-left">

        <h1 className="navbar-title">
          Smart Expense Tracker
        </h1>

      </div>

      {/* =====================================
          RIGHT
      ====================================== */}

      <div className="navbar-right">

        {/* ===================================
            NOTIFICATIONS
        =================================== */}

        <div className="notification-wrapper">

          <button
            type="button"
            className="icon-button notification-button"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(
                (previous) =>
                  !previous
              );

              setShowMobileAccountMenu(
                false
              );
            }}
          >

            <Bell size={21} />

            {unreadCount > 0 && (

              <span className="notification-badge">

                {unreadCount > 9
                  ? "9+"
                  : unreadCount}

              </span>

            )}

          </button>

          {/* =================================
              NOTIFICATION DROPDOWN
          ================================= */}

          {showNotifications && (

            <div className="notification-dropdown">

              {/* HEADER */}

              <div className="notification-header">

                <div>

                  <h2>
                    Notifications
                  </h2>

                  <span>
                    {unreadCount} unread
                  </span>

                </div>

                <div className="notification-header-actions">

                  {unreadCount > 0 && (

                    <button
                      type="button"
                      className="notification-mark-read"
                      onClick={
                        markAllAsRead
                      }
                    >

                      <Check size={14} />

                      Mark all read

                    </button>

                  )}

                  <button
                    type="button"
                    className="notification-close"
                    onClick={() =>
                      setShowNotifications(
                        false
                      )
                    }
                    aria-label="Close notifications"
                  >

                    <X size={18} />

                  </button>

                </div>

              </div>

              {/* LIST */}

              <div className="notification-list">

                {notifications.length === 0 && (

                  <div className="notification-empty">

                    <Bell size={26} />

                    <h3>
                      No notifications
                    </h3>

                    <p>
                      You're all caught up.
                    </p>

                  </div>

                )}

                {notifications.map(
                  (notification) => (

                    <div
                      key={
                        notification.id
                      }
                      className={`notification-item ${
                        notification.read
                          ? "read"
                          : "unread"
                      }`}
                    >

                      <div className="notification-item-content">

                        <div className="notification-dot" />

                        <div>

                          <h3>
                            {notification.title ||
                              "Notification"}
                          </h3>

                          <p>
                            {notification.message ||
                              ""}
                          </p>

                          <span className="notification-time">

                            {formatTime(
                              notification.createdAt
                            )}

                          </span>

                        </div>

                      </div>

                      <div className="notification-item-actions">

                        {!notification.read && (

                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            title="Mark as read"
                          >

                            <Check size={15} />

                          </button>

                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeNotification(
                              notification.id
                            )
                          }
                          title="Remove notification"
                        >

                          <X size={15} />

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* ===================================
            ACCOUNT BUTTON
        =================================== */}

        <div className="mobile-account-wrapper">

          <button
            type="button"
            className="profile-button"
            onClick={() => {

              setShowMobileAccountMenu(
                (previous) =>
                  !previous
              );

              setShowNotifications(
                false
              );

            }}
            aria-label="Account menu"
          >

            <UserCircle size={26} />

            <span>
              {user?.name || "User"}
            </span>

          </button>

          {/* =================================
              MOBILE ACCOUNT MENU
          ================================= */}

          {showMobileAccountMenu && (

            <div className="mobile-account-menu">

              <button
                type="button"
                className="mobile-account-menu-item"
                onClick={
                  handleMobileSettings
                }
              >

                <Settings size={17} />

                <span>
                  Settings
                </span>

              </button>

              <button
                type="button"
                className="mobile-account-menu-item logout"
                onClick={
                  handleMobileLogout
                }
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;