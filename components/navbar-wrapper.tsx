// components/NavbarWrapper.tsx
"use client"; // This component MUST be a Client Component to use usePathname

import { usePathname } from 'next/navigation'; // Hook to get the current route
import { Navbar } from '@/components/navbar'; // Import your existing Navbar component
import { UserSessionData } from '@/lib/session-utils'; // For typing the userSession prop

interface NavbarWrapperProps {
    userSession: UserSessionData | null;
}

export default function NavbarWrapper({ userSession }: NavbarWrapperProps) {
    const pathname = usePathname();

    // Define the paths where the Navbar should NOT be displayed
    // Add any other routes (e.g., '/register', '/forgot-password') where you don't want the Navbar.
    const noNavbarPaths = ['/login'];

    // Check if the current pathname is in the list of paths where Navbar should be hidden
    const shouldDisplayNavbar = !noNavbarPaths.includes(pathname);

    if (!shouldDisplayNavbar) {
        return null; // If Navbar should not be displayed, return null
    }

    // Otherwise, render your actual Navbar component, passing the user session data
    return <Navbar userSession={userSession} />;
}