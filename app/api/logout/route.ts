import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/session-utils';

/**
 * Handles POST requests to log out a user by destroying their server-side session.
 */
export async function POST(): Promise<NextResponse> {
    try {

        // Return a success response.
        // The client-side will then typically redirect to the login page.
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

        deleteSessionCookie(response);

        // Important: The destroySession function already modifies the cookies on the response,
        // but explicitly calling it ensures the cookie is deleted.
        // If destroySession modified the 'cookies()' object directly, it's immediately effective.
        // If it relies on `response.cookies.delete`, ensure you return that response.
        // Our `destroySession` currently uses `cookies().delete()`, which is good for server actions/route handlers.

        return response;

    } catch (error) {
        console.error('Error during logout:', error);
        return NextResponse.json({ success: false, error: 'Failed to log out' }, { status: 500 });
    }
}