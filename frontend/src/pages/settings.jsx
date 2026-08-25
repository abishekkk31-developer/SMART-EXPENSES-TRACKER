import { useEffect, useState } from "react";

import {
  Settings as SettingsIcon,
  Bell,
  Wallet,
  Moon,
  Sun,
  Save,
} from "lucide-react";

import "../styles/settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    currency: "INR",
    theme: "light",
    notifications: true,
    budgetAlerts: true,
  });

  const [saved, setSaved] = useState(false);

  // ==========================================
  // LOAD SAVED SETTINGS
  // ==========================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(
        "expenseTrackerSettings"
      );

    if (savedSettings) {
      try {
        const parsedSettings =
          JSON.parse(savedSettings);

        const loadedSettings = {
          currency:
            parsedSettings.currency || "INR",

          theme:
            parsedSettings.theme || "light",

          notifications:
            parsedSettings.notifications ??
            true,

          budgetAlerts:
            parsedSettings.budgetAlerts ??
            true,
        };

        setSettings(loadedSettings);

        document.documentElement.setAttribute(
          "data-theme",
          loadedSettings.theme
        );

      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );
      }
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        "light"
      );
    }
  }, []);

  // ==========================================
  // UPDATE SETTING
  // ==========================================

  const handleChange = (key, value) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: value,
    }));

    // Apply theme immediately
    if (key === "theme") {
      document.documentElement.setAttribute(
        "data-theme",
        value
      );
    }

    setSaved(false);
  };

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = () => {
    localStorage.setItem(
      "expenseTrackerSettings",
      JSON.stringify(settings)
    );

    document.documentElement.setAttribute(
      "data-theme",
      settings.theme
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your application preferences.
          </p>
        </div>

      </div>

      {/* SETTINGS CONTENT */}

      <div className="settings-grid">

        {/* GENERAL SETTINGS */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <SettingsIcon size={20} />
            </div>

            <div>

              <h2>
                General Settings
              </h2>

              <p>
                Customize your application preferences.
              </p>

            </div>

          </div>

          {/* CURRENCY */}

          <div className="settings-row">

            <div className="settings-row-info">

              <Wallet size={19} />

              <div>

                <h3>
                  Currency
                </h3>

                <p>
                  Choose your preferred currency.
                </p>

              </div>

            </div>

            <select
              value={settings.currency}
              onChange={(event) =>
                handleChange(
                  "currency",
                  event.target.value
                )
              }
            >

              <option value="INR">
                INR (₹)
              </option>

              <option value="USD">
                USD ($)
              </option>

              <option value="EUR">
                EUR (€)
              </option>

              <option value="GBP">
                GBP (£)
              </option>

            </select>

          </div>

          {/* THEME */}

          <div className="settings-row">

            <div className="settings-row-info">

              {settings.theme === "dark" ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}

              <div>

                <h3>
                  Theme
                </h3>

                <p>
                  Choose your preferred appearance.
                </p>

              </div>

            </div>

            <select
              value={settings.theme}
              onChange={(event) =>
                handleChange(
                  "theme",
                  event.target.value
                )
              }
            >

              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>

            </select>

          </div>

        </div>

        {/* NOTIFICATIONS */}

        <div className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <Bell size={20} />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Manage your notification preferences.
              </p>

            </div>

          </div>

          {/* EXPENSE NOTIFICATIONS */}

          <div className="settings-row">

            <div className="settings-row-info">

              <div>

                <h3>
                  Expense Notifications
                </h3>

                <p>
                  Receive updates about your expenses.
                </p>

              </div>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(event) =>
                  handleChange(
                    "notifications",
                    event.target.checked
                  )
                }
              />

              <span className="settings-slider" />

            </label>

          </div>

          {/* BUDGET ALERTS */}

          <div className="settings-row">

            <div className="settings-row-info">

              <div>

                <h3>
                  Budget Alerts
                </h3>

                <p>
                  Get notified when your budget is running low.
                </p>

              </div>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={settings.budgetAlerts}
                onChange={(event) =>
                  handleChange(
                    "budgetAlerts",
                    event.target.checked
                  )
                }
              />

              <span className="settings-slider" />

            </label>

          </div>

        </div>

      </div>

      {/* SAVE */}

      <div className="settings-save-section">

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >

          <Save size={18} />

          Save Settings

        </button>

        {saved && (

          <span className="settings-saved-message">
            Settings saved successfully!
          </span>

        )}

      </div>

    </div>
  );
}

export default Settings;