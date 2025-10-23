import { Navbar05 } from "./ui/shadcn-io/navbar-05";
import { Navbar01 } from "./ui/shadcn-io/navbar-01";
import { useRouter } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
// import { PrismaClient } from "@prisma/client";

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth0();
    const signInHref = "/login";


    // Navbar Logic for if a user is logged in or not can go here
    // If logged in, show Navbar05, else show Navbar01
    if (isAuthenticated) {
        return <div className="relative w-full" >
            <Navbar05
                logoHref="/"
                onNavItemClick={(href) => router.navigate({ to: href })}
                navigationLinks={[
                    { href: '/', label: 'Directory Page (TMP)' },
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/courses', label: 'Courses' },
                    { href: '/calendar', label: 'Calendar' },
                ]}
                userName={user?.name}
                userEmail={user?.email}
                userAvatar={user?.picture}
            />
        </div>
    } else {
        return <div className="relative w-full" >
            <Navbar01
                signInText=""
                ctaText="Sign In"
                onSignInClick={() => router.navigate({ to: signInHref })}
                navigationLinks={[]}
            />
        </div>;
    }
}