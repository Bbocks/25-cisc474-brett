import { createFileRoute } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { Navbar01 } from '../_components/ui/shadcn-io/navbar-01';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const signInHref = "/login";
  const ctaHref = "/signup";
    
  return (
      <div>
          <Navbar01 
              signInHref={signInHref}
              ctaHref={ctaHref}
              onSignInClick={() => router.push(signInHref)}   
              onCtaClick={() => router.push(ctaHref)}
              navigationLinks={[
                  { href: '#', label: 'Home', active: false },
                  { href: '#pages', label: 'Pages', active: false },
                  { href: '#about', label: 'About', active: false},
              ]}
                
          />
          <div className="container mx-auto px-4 py-8">
              <div id="home" className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold mb-4">Welcome to Our Web Application</h1>
                  <p className="text-lg mb-6">This is the home page of our awesome web application built with Next.js and Tailwind CSS.</p>
                  <a href="#about" className="text-blue-500 hover:underline">Learn more about us</a>
              </div>
              <div id="features" className="container mx-auto px-4 py-8">
                  <h2 className="text-3xl font-semibold mb-4">Pages for Assignment: Learning NextJS</h2>
                  <ul className="list-disc list-inside space-y-2">
                      <li>Page One: <Link to="/dashboard" className="text-blue-500 hover:underline ml-4">Dashboard (Backend Data)</Link></li>   
                      <li>Page Two: <Link to="/courses" className="text-blue-500 hover:underline ml-4">Courses (Backend Data)</Link></li>
                      <li>Page Three: <Link to="/calendar" className="text-blue-500 hover:underline ml-4">Calendar (Backend Data)</Link></li>
                      <li>Page Four: <Link to="/courses/grades" className="text-blue-500 hover:underline ml-4">Grades</Link></li>
                      <li>Page Five: <Link to="/login" className="text-blue-500 hover:underline ml-4">Login</Link></li>
                      <li>Page Six: <Link to="/signup" className="text-blue-500 hover:underline ml-4">Signup</Link></li>
                  </ul>
              </div>
              <div id="about" className="container mx-auto px-4 py-8">
                  <h2 className="text-3xl font-semibold mb-4">About Us</h2>
              </div>
          </div>
          {/* <Footer /> */}
      </div>
  );
}
