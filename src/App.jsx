import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import UploadPage from "./components/UploadPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <UploadPage />
      ) : (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}
