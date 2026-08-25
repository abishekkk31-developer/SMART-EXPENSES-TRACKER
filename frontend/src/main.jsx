import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";

const savedSettings = localStorage.getItem(
  "expenseTrackerSettings"
);

if (savedSettings) {
  try {
    const settings =
      JSON.parse(savedSettings);

    document.documentElement.setAttribute(
      "data-theme",
      settings.theme || "light"
    );
  } catch (error) {
    console.error(
      "Failed to load theme:",
      error
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);