import React, { useState } from "react";
import "./LoginPage.css";
import { saveToken } from "../auth";

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

    const validUsername = /^[a-zA-Z0-9_]{3,16}$/.test(username);
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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "OK" && data.access_token) {
        saveToken(data.access_token);
        onLoginSuccess();
      } else {
        setError("Invalid credentials");
        sendLog(`Login failed for ${username}`, "error");
      }
    } catch (err) {
      setError("Server error, please try again later");
      sendLog(`Login exception: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const sendLog = async (message, level = "info") => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, level }),
      });
    } catch {
      // ignore
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