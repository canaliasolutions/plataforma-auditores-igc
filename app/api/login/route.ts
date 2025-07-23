// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateMsalToken } from '@/lib/auth-server'; // Your MSAL token validation utility
import { createSignedSessionCookie, setSessionCookie, UserSessionData } from '@/lib/session-utils'; // Your session management utilities

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      console.warn("Login API: No ID Token provided in request body.");
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    const validation = await validateMsalToken(idToken);

    if (!validation.isValid || !validation.claims) {
      console.error("Login API: ID Token validation failed:", validation.error);
      return NextResponse.json({ error: validation.error || 'Invalid ID token' }, { status: 401 });
    }

    // 3. Extract necessary user data from the validated ID Token claims
    // These claims are from Azure AD and are now trustworthy
    const userForSession: Omit<UserSessionData, 'sessionId' | 'expiresAt'> = {
      userId: validation.claims.oid || validation.claims.sub,
      email: validation.claims.preferred_username || '',
      name: validation.claims.name
    };

    const signedSessionValue = await createSignedSessionCookie(userForSession);

    // 5. Create the response object and set the secure HTTP-only session cookie
    const response = NextResponse.redirect(new URL('/auditorias', req.url));

    setSessionCookie(response, signedSessionValue);

    console.log(`User ${userForSession.email} successfully logged in and server session established.`);
    return response;

  } catch (error) {
    console.error('Error in /api/login endpoint:', error);
    return NextResponse.json({ error: 'Internal server error during authentication process.' }, { status: 500 });
  }
}