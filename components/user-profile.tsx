"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";

interface UserProfileProps {
  account: AccountInfo;
}

export function UserProfile({ account }: UserProfileProps) {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {account.name ? account.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{account.name || "User"}</h2>
            <p className="profile-email">{account.username}</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Account ID:</span>
              <span className="detail-value">{account.localAccountId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Environment:</span>
              <span className="detail-value">{account.environment}</span>
            </div>
          </div>

          <div className="welcome-message">
            <h3 className="welcome-title">Welcome to the application!</h3>
            <p className="welcome-text">
              You have successfully signed in with your Microsoft account.
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
