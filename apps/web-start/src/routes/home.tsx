import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { Spinner } from '@/_components/ui/spinner';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div><Spinner className="size-24" /></div>;
  }

  return (
    isAuthenticated && (
      <div>
        User Information: {JSON.stringify(user, null, 2)}.
        <Link to="/courses">View Courses</Link>
      </div>
    )
  );
}