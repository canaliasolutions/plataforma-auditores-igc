import { createRemoteJWKSet, jwtVerify } from "jose";

export interface MsalIdTokenClaims {
    iss: string; // Issuer
    aud: string; // Audience (your client ID)
    exp: number; // Expiration time (Unix timestamp)
    nbf: number; // Not Before time (Unix timestamp)
    iat: number; // Issued At time (Unix timestamp)
    oid?: string; // Object ID (unique identifier for the user in Azure AD)
    sub: string; // Subject (unique identifier for the user)
    preferred_username?: string; // User's preferred username (often email)
    name?: string; // User's full name
    tid?: string;
    ver?: string; // Version of the token
}

export interface MsalValidationResult {
    isValid: boolean;
    error?: string;
    claims?: MsalIdTokenClaims; // The verified claims
}

interface OidcMetadata {
    issuer: string;
    jwks_uri: string;
    // You might include other fields if needed, e.g., authorization_endpoint, token_endpoint
}

const AZURE_AD_CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
const AZURE_AD_TENANT_ID = process.env.NEXT_PUBLIC_AZURE_TENANT_ID;

if (!AZURE_AD_CLIENT_ID || !AZURE_AD_TENANT_ID) {
    throw new Error("Missing Azure AD environment variables. Please set NEXT_PUBLIC_AZURE_CLIENT_ID and AZURE_TENANT_ID.");
}

let cachedOidcMetadata: OidcMetadata | undefined;
let lastMetadataFetchTime: number = 0;
const METADATA_CACHE_DURATION = 60 * 60 * 1000; // Cache for 1 hour

// The JWKSet from jose's createRemoteJWKSet is a function, not a simple object.
// We cache the function directly.
let cachedJWKSetFn: ReturnType<typeof createRemoteJWKSet> | undefined;
let lastJwksFetchTime: number = 0;
const JWKS_CACHE_DURATION = 60 * 60 * 1000; // Cache for 1 hour

/**
 * Fetches and caches the OpenID Connect metadata from Azure AD.
 */
async function getAzureADOidcMetadata(): Promise<OidcMetadata> {
    const now = Date.now();
    if (cachedOidcMetadata && (now - lastMetadataFetchTime < METADATA_CACHE_DURATION)) {
        return cachedOidcMetadata;
    }

    const tenantForMetadataUrl = AZURE_AD_TENANT_ID === 'common' ? 'common' : AZURE_AD_TENANT_ID;
    const AAD_OIDC_METADATA_URL = `https://login.microsoftonline.com/${tenantForMetadataUrl}/v2.0/.well-known/openid-configuration`;

    try {
        const oidcResponse = await fetch(AAD_OIDC_METADATA_URL);
        if (!oidcResponse.ok) {
            throw new Error(`Failed to fetch OIDC metadata from ${AAD_OIDC_METADATA_URL}: ${oidcResponse.statusText}`);
        }
        const oidcConfig: OidcMetadata = await oidcResponse.json();

        if (!oidcConfig.jwks_uri || !oidcConfig.issuer) {
            throw new Error('Missing jwks_uri or issuer in OpenID Connect metadata.');
        }

        cachedOidcMetadata = oidcConfig;
        lastMetadataFetchTime = now;
        return oidcConfig;

    } catch (error) {
        console.error("Error fetching Azure AD OIDC metadata:", error);
        throw new Error(`Could not retrieve Azure AD OpenID Connect metadata from ${AAD_OIDC_METADATA_URL}: ${error}`);
    }
}

/**
 * Fetches and caches the JWKS from Azure AD using the provided jwksUri,
 * or retrieves it from OIDC metadata if jwksUri is not provided.
 */
async function getAzureADJwkSet(jwksUri?: string): Promise<ReturnType<typeof createRemoteJWKSet>> {
    const now = Date.now();
    if (cachedJWKSetFn && (now - lastJwksFetchTime < JWKS_CACHE_DURATION)) {
        return cachedJWKSetFn;
    }

    let resolvedJwksUri = jwksUri;

    // If jwksUri not provided, fetch from OIDC metadata
    if (!resolvedJwksUri) {
        try {
            const oidcMetadata = await getAzureADOidcMetadata();
            resolvedJwksUri = oidcMetadata.jwks_uri;
        } catch (error) {
            console.error("Error getting JWKS URI from OIDC metadata:", error);
            throw new Error("Could not determine JWKS URI for token validation.");
        }
    }

    if (!resolvedJwksUri) {
        throw new Error("JWKS URI is undefined, cannot create JWK Set.");
    }

    try {
        const JWKS = createRemoteJWKSet(new URL(resolvedJwksUri));
        cachedJWKSetFn = JWKS;
        lastJwksFetchTime = now;
        return JWKS;
    } catch (error) {
        console.error("Error creating remote JWK Set:", error);
        throw new Error(`Could not create JWK Set from ${resolvedJwksUri}: ${error}`);
    }
}


/**
 * Validates an MSAL ID Token.
 * @param idToken The JWT string to validate.
 * @returns A MsalValidationResult indicating validity and containing claims if valid.
 */
export async function validateMsalToken(idToken: string): Promise<MsalValidationResult> {
    try {
        // First, get the OIDC metadata to obtain the official issuer and JWKS URI
        const oidcMetadata = await getAzureADOidcMetadata();
        const expectedIssuer = oidcMetadata.issuer; // This is the dynamically obtained issuer

        // Then, get the JWK Set function using the JWKS URI from the metadata
        // We pass the jwks_uri explicitly to ensure it's from the fetched metadata.
        const JWKS = await getAzureADJwkSet(oidcMetadata.jwks_uri);

        // Verify the ID token
        const { payload } = await jwtVerify(idToken, JWKS, {
            issuer: expectedIssuer, // Use the dynamically fetched issuer here
            audience: AZURE_AD_CLIENT_ID,
            algorithms: ['RS256'], // Azure AD typically uses RS256
        });

        // Ensure the payload conforms to our expected claims interface
        const claims = payload as MsalIdTokenClaims;

        // Optional: Add any additional custom validation checks for claims here
        // For example, if you need to ensure 'oid' is present or matches a certain format.
        if (!claims.oid) {
            console.warn("ID Token is missing 'oid' claim.");
            // return { isValid: false, error: "ID Token is missing required 'oid' claim." };
        }

        return { isValid: true, claims };

    } catch (error: any) { // Use 'any' for the error type for more flexibility in catching
        console.error("MSAL ID Token validation failed:", error);
        // Provide more specific error messages based on jose's errors
        if (error.code === 'ERR_JWT_EXPIRED') {
            return { isValid: false, error: 'ID Token expired.' };
        }
        if (error.code === 'ERR_JWS_INVALID') {
            return { isValid: false, error: 'ID Token signature is invalid.' };
        }
        if (error.code === 'ERR_JWT_AUDIENCE_MISMATCH') {
            return { isValid: false, error: `ID Token audience mismatch. Expected: ${AZURE_AD_CLIENT_ID}, Actual: ${error.aud}` };
        }
        if (error.code === 'ERR_JWT_ISSUER_MISMATCH') {
            // Log expected and actual for easier debugging
            const expected = (error as any).expectedIssuer || 'N/A';
            const actual = (error as any).actualIssuer || 'N/A';
            console.error(`Issuer Mismatch: Expected "${expected}", Actual "${actual}"`);
            return { isValid: false, error: `ID Token issuer mismatch. Expected: ${expected}, Actual: ${actual}` };
        }
        if (error.code === 'ERR_JWS_NO_MATCHING_KEY') {
            return { isValid: false, error: 'No matching public key found for token signature.' };
        }
        return { isValid: false, error: `Token validation error: ${error.message}` };
    }
}