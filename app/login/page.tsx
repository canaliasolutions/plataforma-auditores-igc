"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth-config";
import { useRouter } from "next/navigation";
import styles from "@/components/Login.module.css";

export default function LoginPage() {
    const { instance } = useMsal();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const loginResponse = await instance.loginPopup(loginRequest);

            // Check if login was successful and we got an ID Token
            if (loginResponse && loginResponse.idToken) {
                console.log("MSAL Login successful. Sending ID Token to backend.");

                const apiResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // You can also include the Authorization header if your API expects it
                        // 'Authorization': `Bearer ${loginResponse.idToken}`
                    },
                    body: JSON.stringify({
                        idToken: loginResponse.idToken,
                        // You might also send accessToken if your backend needs it to call Graph API on behalf of the user
                        // accessToken: loginResponse.accessToken,
                        // Add any other relevant info like account details if needed
                        // account: loginResponse.account
                    }),
                });

                if (apiResponse.ok) {
                    console.log("Backend session established successfully!");
                    // Optional: Parse response if your backend sends back user data or session status
                    // const data = await apiResponse.json();

                    // After successful API call, navigate to the protected page
                    router.push("/auditorias");

                    // If you still need the original onLoginSuccess callback for other client-side logic:
                    // if (onLoginSuccess) {
                    //   onLoginSuccess(loginResponse.account);
                    // }

                } else {
                    // Handle API error
                    const errorData = await apiResponse.json();
                    console.error("Failed to establish backend session:", apiResponse.status, errorData);
                    alert("Login failed: Could not establish secure session. Please try again.");
                }
            } else {
                console.warn("MSAL login did not return an ID Token.");
                alert("Login failed: Missing authentication token.");
            }
        } catch (error) {
            console.error("Login process failed:", error);
            alert("Login failed during MSAL process. Please check console for details.");
        }
    };


    return (
        <div className={styles["login-container"]}>
            <div className={styles["login-card"]}>
                <div className={styles["login-header"]}>
                    <svg
                        className={styles["microsoft-logo"]}
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
                    <h1 className={styles["login-title"]}>Sign in to your account</h1>
                    <p className={styles["login-subtitle"]}>
                        Use your Microsoft account to access the application
                    </p>
                </div>

                <div className={styles["login-content"]}>
                    <button
                        onClick={handleLogin}
                        className={styles["microsoft-login-button"]}
                    >
                        <svg
                            className={styles["microsoft-icon"]}
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

                <div className={styles["login-footer"]}>
                    <p className={styles["privacy-text"]}>
                        By signing in, you agree to our terms of service and privacy policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
