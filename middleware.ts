// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@/lib/session-utils';

const publicPaths = ['/login', '/api/login', '/api/logout', '/api/check-session', '/auth.html'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await getSession();

    if (!session) {
        console.log(`Unauthenticated access to ${pathname}. Redirecting to /login`);
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    console.info(`Authenticated access to ${pathname} for user ${session.email}`);
    console.info('Atendiendo peticion: ', request.url, request.body);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!login|forbidden|api/login|api/logout|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|css|js)$).*)',
    ],
};