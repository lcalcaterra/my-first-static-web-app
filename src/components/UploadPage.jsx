import React, { useState } from "react";
import "./UploadPage.css";

const API_BASE = `https://${import.meta.env.VITE_FUNCTION_HOST}`;
const API_KEY = import.meta.env.VITE_FUNCTION_KEY;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage(""); // clear previous messages
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("no file uploaded");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/storage/upload?code=${API_KEY}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload Failed");
      }

      const data = await res.json();

      if (data.status === "Upload succeeded") {
        setUploadMessage(`File '${data.filename}' uploaded successfully!`);
      } else {
        setUploadMessage("Upload Failed");
      }
    } catch (err) {
      setUploadMessage("Upload Failed");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMessage("notting to search");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/ai/search?code=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error("Can't search. Retry later");
      }

      const data = await res.json();
      setSearchMessage(data.reply || "Can't search. Retry later");
    } catch (err) {
      setSearchMessage("Can't search. Retry later");
    }
  };

  const getColor = (message, type) => {
    if (!message) return {};
    if (
      message.toLowerCase().includes("failed") ||
      message.toLowerCase().includes("can't") ||
      message.toLowerCase().includes("no file") ||
      message.toLowerCase().includes("notting")
    ) {
      return { color: "red" };
    }
    return { color: "green" };
  };

  return (
    <div className="upload-card">
      <h1>Upload Your File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div style={getColor(uploadMessage, "upload")}>{uploadMessage}</div>

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
        <div style={getColor(searchMessage, "search")}>{searchMessage}</div>
      </div>
    </div>
  );
}
