import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import UploadPage from "./components/UploadPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/session", { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setIsLoggedIn(data.authenticated))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
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
