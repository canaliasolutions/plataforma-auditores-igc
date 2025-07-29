// app/api/check-session/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session-utils';


export async function GET(): Promise<NextResponse> {
    try {
        const session = await getSession();
        if (session) {
            return NextResponse.json({ isAuthenticated: true, user: { name: session.name, email: session.email } });
        } else {
            return NextResponse.json({ isAuthenticated: false });
        }
    } catch (error) {
        console.error("Error checking session in /api/check-session:", error);
        return NextResponse.json({ isAuthenticated: false, error: 'Failed to check session' }, { status: 500 });
    }
}