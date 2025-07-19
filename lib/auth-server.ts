import jwt from "jsonwebtoken";
import jwksClient from 'jwks-rsa';

export interface UserInfo {
    email: string;
    name?: string;
    oid: string; // Object ID from Azure AD
}

export interface AuthValidationResult {
    isValid: boolean;
    user?: UserInfo;
    error?: string;
}

export const placeholderAccount = {
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
                localAccountId: "123",
            },
        ],
        [
            "tenant-id-2",
            {
                tenantId: "tenant-id-2",
                // ...
                isMfaEnabled: false,
                localAccountId: "123",
            },
        ],
    ]),
};


const jwksUri = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`;

const client = jwksClient({
    jwksUri: jwksUri,
    cache: true,             // Cache the signing keys to prevent too many requests to Azure AD
    rateLimit: true,         // Prevent abuse
    jwksRequestsPerMinute: 5, // Allow 5 JWKS requests per minute
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    if (!header.kid) {
        return callback(new Error('JWT header missing "kid" (Key ID)'));
    }
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}


/**
 * Production-ready token validation (commented out for development)
 * This would validate the token signature against Azure AD public keys
 */
export async function validateMsalToken(token: string): Promise<AuthValidationResult> {
    // Ensure required environment variables are set
    if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID) {
        return { isValid: false, error: 'Missing AZURE_TENANT_ID or AZURE_CLIENT_ID environment variables.' };
    }

    return new Promise((resolve) => {
        jwt.verify(
            token,
            getKey,
            {
                algorithms: ['RS256'], // Azure AD uses RS256 for signing
                issuer: `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`, // Check token's issuer
                audience: process.env.AZURE_CLIENT_ID, // Check token's audience (your API's client ID)
            },
            (err, decodedToken) => {
                if (err) {
                    console.error('JWT verification error:', err.message);
                    return resolve({ isValid: false, error: `Token verification failed: ${err.message}` });
                }

                const payload = decodedToken as jwt.JwtPayload; // Cast to JwtPayload

                const userEmail = payload.preferred_username || payload.email;
                if (!userEmail) {
                    console.warn('Token missing "preferred_username" or "email" claim.');
                    return resolve({ isValid: false, error: 'Token missing required user email claim.' });
                }

                if (payload.tid !== process.env.AZURE_TENANT_ID) {
                    console.warn('Token "tid" mismatch:', payload.tid, process.env.AZURE_TENANT_ID);
                    return resolve({ isValid: false, error: 'Token issued by wrong tenant.' });
                }


                resolve({
                    isValid: true,
                    user: {
                        email: userEmail,
                        oid: payload.oid
                    },
                });
            }
        );
    });
}

