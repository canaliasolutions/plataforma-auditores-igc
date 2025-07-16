"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import { MainApp } from "@/components/main-app";

export default function DashboardPage() {
  const { accounts } = useMsal();
  const placeholderAccount = {
    homeAccountId: "a1b2c3d4-e5f6-7890-1234-567890abcdef-tenantId",
    environment: "login.microsoftonline.com",
    tenantId: "your-tenant-id-12345",
    username: "john.doe@example.com",
    localAccountId: "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
    name: "John Doe", // Optional property included
    idToken: "eyJraWQiOiJ...", // A shortened example of a JWT (JSON Web Token)
    idTokenClaims: {
      // Optional property included, showing some common claims
      aud: "your-client-id",
      iss: "https://login.microsoftonline.com/your-tenant-id-12345/v2.0",
      iat: 1678886400, // Unix timestamp for 'issued at'
      exp: 1678890000, // Unix timestamp for 'expiration'
      name: "John Doe",
      preferred_username: "john.doe@example.com",
      oid: "f1e2d3c4-b5a6-9876-5432-10fedcba9876", // Object ID
      tid: "your-tenant-id-12345", // Tenant ID
      // Example of a custom claim or other common claims
      roles: ["user", "admin"],
      custom_data: { setting: "value" },
    },
    nativeAccountId: "some-native-account-identifier", // Optional property
    authorityType: "MSSTS", // Optional property
    tenantProfiles: new Map([
      // Optional property: Example of a Map with tenant profiles
      [
        "tenant-id-1",
        {
          tenantId: "tenant-id-1",
          // ... other TenantProfile properties if available
          isMfaEnabled: true,
        },
      ],
      [
        "tenant-id-2",
        {
          tenantId: "tenant-id-2",
          // ...
          isMfaEnabled: false,
        },
      ],
    ]),
  };

  const router = useRouter();

  // useEffect(() => {
  //   // If user is not authenticated, redirect to login
  //   if (accounts.length === 0) {
  //     router.push("/login");
  //   }
  // }, [accounts, router]);

  // Don't render dashboard if not authenticated
  // if (accounts.length === 0) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner">Redirecting to login...</div>
  //     </div>
  //   );
  // }

  return <MainApp account={placeholderAccount} />;
}
