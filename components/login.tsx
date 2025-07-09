"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth-config";
import { AccountInfo } from "@azure/msal-browser";

interface LoginProps {
  onLoginSuccess?: (account: AccountInfo) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const { instance, accounts } = useMsal();

  const handleLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      if (loginResponse && onLoginSuccess) {
        onLoginSuccess(loginResponse.account);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <svg
            className="microsoft-logo"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="23" height="23" fill="#F25022" />
            <rect x="25" width="23" height="23" fill="#7FBA00" />
            <rect y="25" width="23" height="23" fill="#00A4EF" />
            <rect x="25" y="25" width="23" height="23" fill="#FFB900" />
          </svg>
          <h1 className="login-title">Sign in to your account</h1>
          <p className="login-subtitle">
            Use your Microsoft account to access the application
          </p>
        </div>

        <div className="login-content">
          <button onClick={handleLogin} className="microsoft-login-button">
            <svg
              className="microsoft-icon"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="10" height="10" fill="#F25022" />
              <rect x="11" width="10" height="10" fill="#7FBA00" />
              <rect y="11" width="10" height="10" fill="#00A4EF" />
              <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        <div className="login-footer">
          <p className="privacy-text">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
