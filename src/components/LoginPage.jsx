import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please provide username and password");
      return;
    }

    // Validazione minima lato client
    const validUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username);
    if (!validUsername) {
      setError("Invalid username format");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // necessario per cookie HttpOnly
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === "OK") {
        onLoginSuccess();
      } else {
        setError("Invalid credentials");
        sendLog(`Login failed for ${username}`);
      }
    } catch (err) {
      setError("Server error, please try again later");
      sendLog(`Login exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendLog = async (message) => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ log: message }),
      });
    } catch {
      // in caso di errore nel logging, non bloccare l'app
    }
  };

  return (
    <div className="login-card">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
