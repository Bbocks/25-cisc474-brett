'use client';

import { Navbar05 } from "./ui/shadcn-io/navbar-05";
import { Navbar01 } from "./ui/shadcn-io/navbar-01";
import { useRouter } from "next/navigation";
import { PrismaClient } from "@prisma/client";

export default function Header() {
    const router = useRouter();

    // Navbar Logic for if a user is logged in or not can go here
    // If logged in, show Navbar05, else show Navbar01
    /*
    if (user.isLoggedIn) {
        return <div className="relative w-full" ><Navbar05 /></div>;
    } else {
        return <div className="relative w-full" ><Navbar01 /></div>;
    }
    */
   return( 
        <div className="relative w-full" >
            <Navbar05 
                logoHref="/"
                onNavItemClick={(href) => router.push(href)}
                navigationLinks={[
                    { href: '/', label: 'Directory Page (TMP)' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/courses', label: 'Courses' },
                    { href: '/calendar', label: 'Calendar' },
                ]}
                
            />
        </div>
    );
}