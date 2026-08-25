import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // LOAD STORED SESSION
  // ==========================================

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch (error) {
        console.error(
          "Failed to load stored user:",
          error
        );

        localStorage.removeItem(
          "user"
        );
      }
    }

    setLoading(false);
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (
    userData,
    accessToken
  ) => {
    localStorage.setItem(
      "token",
      accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(accessToken);
    setUser(userData);
  };

  // ==========================================
  // UPDATE USER ONLY
  // ==========================================

  const updateUser = (
    updatedUser
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  // ==========================================
  // UPDATE USER + TOKEN
  // ==========================================

  const updateSession = (
    updatedUser,
    accessToken
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    localStorage.setItem(
      "token",
      accessToken
    );

    setUser(updatedUser);
    setToken(accessToken);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ==========================================
  // AUTH STATUS
  // ==========================================

  const isAuthenticated =
    Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        updateUser,
        updateSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}