import React, { useState } from "react";
import "./LoginPage.css";

const API_BASE = `https://${import.meta.env.VITE_FUNCTION_HOST}`;
const API_KEY = import.meta.env.VITE_FUNCTION_KEY;

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      console.log("Please provide username and password");
      setError("Please provide username and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/login?code=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "username": username, "password": password }),
      });

      // Assuming your API responds with JSON like { status: "OK" } or { status: "KO" }
      const data = await response.json();

      if (data.status === "OK") {
        console.log("Login Succeded");
        onLoginSuccess();
      } else {
        console.log("User not registered or wrong credentials");
        setError("User not registered or wrong credentials");
      }
    } catch (err) {
      console.error(err);
      console.log("Server error, please try again later");
      setError("Server error, please try again later");
    } finally {
      setLoading(false);
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
