"use client";

import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { Login } from "@/components/login";
import { UserProfile } from "@/components/user-profile";

export default function Home() {
  const { accounts } = useMsal();
  const [isAuthenticated, setIsAuthenticated] = useState(accounts.length > 0);
  const [currentAccount, setCurrentAccount] = useState<AccountInfo | null>(
    accounts.length > 0 ? accounts[0] : null,
  );

  const handleLoginSuccess = (account: AccountInfo) => {
    setIsAuthenticated(true);
    setCurrentAccount(account);
  };

  if (isAuthenticated && currentAccount) {
    return <UserProfile account={currentAccount} />;
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
