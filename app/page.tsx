"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";

export default function Home() {
  const { accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    // Redirect based on authentication state
    if (accounts.length > 0) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [accounts, router]);

  return (
    <div className="loading-container">
      <div className="loading-spinner">Loading...</div>
    </div>
  );
}
