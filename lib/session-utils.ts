// lib/session-utils.ts
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers';
import {NextResponse} from "next/server";
import {jwtVerify, SignJWT} from "jose";

const SESSION_SECRET = process.env.SESSION_SECRET;

const encodedSecret = new TextEncoder().encode(SESSION_SECRET);

const SESSION_COOKIE_NAME = 'app_session';
const SESSION_MAX_AGE = 60 * 60 * 2; // 2 hours

export interface UserSessionData {
    sessionId: string; // A unique ID for this specific session
    userId: string; // The user's unique ID from MSAL claims (oid or sub)
    email: string;
    name?: string;
    expiresAt: number; // Unix timestamp
}


/**
 * Creates and signs a new session cookie payload.
 * Generates a unique sessionId and calculates expiry.
 */
export async function createSignedSessionCookie(userData: Omit<UserSessionData, 'sessionId' | 'expiresAt'>): Promise<string> {
    const sessionId = nanoid(); // Generate a unique ID for this session
    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE; // Convert ms to seconds

    const sessionData: UserSessionData = {
        exp: expiresAt,
        ...userData,
    };

    // Sign the session data using JWS (JSON Web Signature) for integrity
    const jws = await new SignJWT(sessionData)
        .setProtectedHeader({ alg: 'HS256' }) // HMAC-SHA256 algorithm
        .setIssuedAt()
        .setJti(sessionId) // JWT ID
        .sign(encodedSecret);

    return jws; // This is the signed string that goes into the cookie
}

/**
 * Verifies and decodes a signed session cookie.
 * Returns the session data if valid, otherwise null.
 */
export async function verifySignedSessionCookie(signedSession: string): Promise<UserSessionData | null> {
    try {
        const { payload } = await jwtVerify(signedSession, encodedSecret, {
            algorithms: ['HS256'],
            maxAge: `${SESSION_MAX_AGE}s`, // Verify JWT expiration matches cookie max age
        });

        // Basic type assertion and expiry check
        const sessionData = payload as unknown as UserSessionData;

        // Additional check for expiration (though jwtVerify handles this for 'exp')
        if (sessionData.expiresAt < Math.floor(Date.now() / 1000)) {
            console.warn('Session expired based on custom expiresAt.');
            return null;
        }

        return sessionData;

    } catch (error) {
        console.error('Session cookie verification failed:', error);
        return null; // Invalid or expired session
    }
}

/**
 * Helper to set the session cookie in a NextResponse.
 */
export function setSessionCookie(response: NextResponse, signedSessionValue: string) {
    response.cookies.set(SESSION_COOKIE_NAME, signedSessionValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // 'strict' is more secure but can break cross-site navigation, 'lax' is generally a good balance.
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });
}

/**
 * Helper to delete the session cookie from a NextResponse.
 */
export function deleteSessionCookie(response: NextResponse) {
    response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Helper to get the session from the incoming request (e.g., in Route Handlers or Server Components).
 */
export async function getSession(): Promise<UserSessionData | null> {
    const cookieStore = await cookies();
    const signedSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!signedSession) {
        return null;
    }

    return verifySignedSessionCookie(signedSession);
}