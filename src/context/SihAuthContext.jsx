import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SihAuthContext = createContext(null);

export function SihAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/api/auth/me",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUser(null);
        return null;
      }

      setUser(data.data);

      return data.data;
    } catch (error) {
      console.error(
        "Failed to fetch current SIH user:",
        error
      );

      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL AUTH CHECK
  // ==========================================

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Logout failed"
        );
      }

      setUser(null);

      return {
        success: true,
        message:
          data.message || "Logout successful",
      };
    } catch (error) {
      console.error("Logout error:", error);

      return {
        success: false,
        message:
          error.message || "Logout failed",
      };
    }
  };

  return (
    <SihAuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchCurrentUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </SihAuthContext.Provider>
  );
}

export function useSihAuth() {
  const context = useContext(SihAuthContext);

  if (!context) {
    throw new Error(
      "useSihAuth must be used inside SihAuthProvider"
    );
  }

  return context;
}