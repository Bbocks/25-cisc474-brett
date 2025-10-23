import { useAuth0 } from '@auth0/auth0-react';
import { Button } from "@/_components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/_components/ui/card";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute('/login')({
  component: SignIn,
})

function SignIn() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="mx-auto flex items-center justify-center h-screen">
      {/* <div className="mb-4 px-1">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div> */}
      <Card className="justify-center w-full max-w-md">
        <CardContent>
          <div className="grid gap-4">
            <div className={cn(
              "w-full gap-2 flex items-center",
              "justify-between flex-col"
            )}>

              <Button
                variant="outline"
                className={cn(
                  "w-full gap-2 "
                )}
                disabled={isLoading}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      scope: 'read:all',
                      prompt: 'consent',
                    },
                  })
                }
              >
                Sign In
              </Button>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              
            </p>
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}