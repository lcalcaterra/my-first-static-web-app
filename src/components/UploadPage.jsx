import React, { useState } from "react";
import "./UploadPage.css";

export default function UploadPage({ onLogout }) {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 20 * 1024 * 1024) {
      setUploadMessage("File too large (max 20 MB)");
      return;
    }
    if (
      selected &&
      !selected.type.startsWith("text/") &&
      !selected.type.startsWith("application/")
    ) {
      setUploadMessage("Invalid file type");
      return;
    }
    setFile(selected);
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.status === "Upload succeeded") {
        setUploadMessage(`File '${data.filename}' uploaded successfully!`);
        sendLog(`Upload succeeded: ${data.filename}`, "info");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      setUploadMessage("Upload failed");
      sendLog(`Upload error: ${err.message}`, "error");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMessage("Nothing to search");
      return;
    }

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setSearchMessage(data.reply);
        sendLog(`Search success for query: ${searchQuery}`, "info");
      } else {
        throw new Error("Search failed");
      }
    } catch (err) {
      setSearchMessage("Can't search. Retry later");
      sendLog(`Search error: ${err.message}`, "error");
    }
  };

  const sendLog = async (message, level = "info") => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          level,
        }),
      });
    } catch {
      // do not block app on log errors
    }
  };

  const handleLogout = async () => {
    await fetch("/api/users/logout", { method: "POST", credentials: "include" });
    onLogout();
  };

  const getColor = (message) => {
    if (!message) return {};
    return message.toLowerCase().includes("failed") ||
      message.toLowerCase().includes("can't")
      ? { color: "red" }
      : { color: "green" };
  };

  return (
    <div className="upload-card">
      <h1>Upload Your File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div style={getColor(uploadMessage)}>{uploadMessage}</div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchMessage("");
          }}
        />
        <button onClick={handleSearch}>Search</button>
        <div style={getColor(searchMessage)}>{searchMessage}</div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}