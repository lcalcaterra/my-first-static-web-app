import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import UploadPage from "./components/UploadPage";
import { getToken, clearToken } from "./auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = getToken();
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/users/session", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setIsLoggedIn(data.authenticated === true);
        if (!data.authenticated) clearToken();
      } catch {
        clearToken();
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {isLoggedIn ? (
        <UploadPage onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}