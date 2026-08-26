import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Save,
  LogOut,
  Wallet,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../api/userapi";

import { useAuth } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  // ==========================================
  // PROFILE STATE
  // ==========================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // ==========================================
  // PASSWORD STATE
  // ==========================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  // ==========================================
  // UI STATE
  // ==========================================

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setError("");

        const profile =
          await getProfile();

        setName(
          profile?.name || ""
        );

        setEmail(
          profile?.email || ""
        );

        // Update AuthContext + localStorage
        if (profile) {
          updateUser(profile);
        }

      } catch (err) {
        console.error(
          "Failed to load profile:",
          err
        );

        const backendError =
          err.response?.data;

        setError(
          typeof backendError === "string"
            ? backendError
            : err.message ||
              "Failed to load profile."
        );

        // Fallback to stored user
        setName(
          user?.name || ""
        );

        setEmail(
          user?.email || ""
        );

      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleProfileSave = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError(
        "Name cannot be empty."
      );
      return;
    }

    try {
      setSavingProfile(true);

      // Your backend currently updates name
      // and returns UserResponse directly
      const updatedUser =
        await updateProfile({
          name: name.trim(),
        });

      if (!updatedUser) {
        throw new Error(
          "Invalid profile response from server."
        );
      }

      // Update form state
      setName(
        updatedUser.name || name.trim()
      );

      setEmail(
        updatedUser.email || email
      );

      // Update AuthContext + localStorage
      updateUser(updatedUser);

      setMessage(
        "Profile updated successfully!"
      );

    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      const backendError =
        err.response?.data;

      setError(
        typeof backendError === "string"
          ? backendError
          : err.message ||
            "Failed to update profile."
      );

    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handlePasswordChange = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !currentPassword ||
      !newPassword
    ) {
      setError(
        "Please enter both current and new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setMessage(
        "Password changed successfully!"
      );

    } catch (err) {
      console.error(
        "Failed to change password:",
        err
      );

      const backendError =
        err.response?.data;

      setError(
        typeof backendError === "string"
          ? backendError
          : err.message ||
            "Failed to change password."
      );

    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  // ==========================================
  // DISPLAY USER
  // ==========================================

  const displayName =
    name ||
    user?.name ||
    "User";

  const displayEmail =
    email ||
    user?.email ||
    "No email available";

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <div>

          <h1>
            Profile & Settings
          </h1>

          <p>
            Manage your account and preferences.
          </p>

        </div>

      </div>

      {/* PROFILE OVERVIEW */}

      <div className="profile-overview">

        <div className="profile-avatar">

          {displayName
            ?.charAt(0)
            ?.toUpperCase() || "U"}

        </div>

        <div>

          <h2>
            {displayName}
          </h2>

          <p>
            {displayEmail}
          </p>

        </div>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (

        <div className="profile-message">
          {message}
        </div>

      )}

      {/* ERROR MESSAGE */}

      {error && (

        <div className="profile-message profile-error">

          {typeof error === "string"
            ? error
            : "Something went wrong."}

        </div>

      )}

      <div className="profile-grid">

        {/* PERSONAL INFORMATION */}

        <div className="profile-card">

          <div className="profile-card-header">

            <User size={20} />

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Update your account details.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleProfileSave}
          >

            {/* NAME */}

            <div className="profile-input-group">

              <label>
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <User size={18} />

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                  disabled={
                    loadingProfile ||
                    savingProfile
                  }
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-input-group">

              <label>
                Email Address
              </label>

              <div className="profile-input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  placeholder="Email cannot currently be changed"
                  disabled
                />

              </div>

            </div>

            <button
              type="submit"
              className="profile-save-button"
              disabled={
                loadingProfile ||
                savingProfile
              }
            >

              <Save size={17} />

              {savingProfile
                ? "Saving..."
                : "Save Changes"}

            </button>

          </form>

        </div>

        {/* CHANGE PASSWORD */}

        <div className="profile-card">

          <div className="profile-card-header">

            <Lock size={20} />

            <div>

              <h2>
                Change Password
              </h2>

              <p>
                Keep your account secure.
              </p>

            </div>

          </div>

          <form
            onSubmit={handlePasswordChange}
          >

            {/* CURRENT PASSWORD */}

            <div className="profile-input-group">

              <label>
                Current Password
              </label>

              <div className="profile-input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                  disabled={
                    changingPassword
                  }
                  required
                />

              </div>

            </div>

            {/* NEW PASSWORD */}

            <div className="profile-input-group">

              <label>
                New Password
              </label>

              <div className="profile-input-wrapper">

                <Lock size={18} />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                  disabled={
                    changingPassword
                  }
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="profile-save-button"
              disabled={
                changingPassword
              }
            >

              <Lock size={17} />

              {changingPassword
                ? "Updating..."
                : "Update Password"}

            </button>

          </form>

        </div>

      </div>

      {/* ACCOUNT ACTIONS */}

      <div className="profile-actions-card">

        <div className="profile-actions-info">

          <div className="profile-action-icon">
            <Wallet size={20} />
          </div>

          <div>

            <h2>
              Account
            </h2>

            <p>
              Manage your account session.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="profile-logout-button"
          onClick={handleLogout}
        >

          <LogOut size={17} />

          Logout

        </button>

      </div>

    </div>
  );
}

export default Profile;