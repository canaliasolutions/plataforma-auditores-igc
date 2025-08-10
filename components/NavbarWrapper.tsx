"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { UserSessionData } from '@/lib/session-utils';

interface NavbarWrapperProps {
    userSession: UserSessionData | null;
}

export default function NavbarWrapper({ userSession }: NavbarWrapperProps) {
    const pathname = usePathname();
    const noNavbarPaths = ['/login'];
    const shouldDisplayNavbar = !noNavbarPaths.includes(pathname);

    if (!shouldDisplayNavbar) {
        return null;
    }

    return <Navbar userSession={userSession} />;
}