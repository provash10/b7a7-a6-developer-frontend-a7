import Link from "next/link";
import Logo from "@/assets/svg/logo";
import { Button } from "@/components/ui/button";

export default function Header() {
  // console.log("public header navigation rendered");
  const routes = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Services",
      url: "/services",
    },
    {
      name: "About Us",
      url: "/about-us",
    },
    {
      name: "Contact",
      url: "/contact",
    },
  ];

  return (
    <header className="w-full h-16 border-b border-border/80 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-bold text-lg text-foreground hover:opacity-90 transition-opacity"
        >
          <Logo className="text-primary size-8" />
          <span className="tracking-tight">DevAssess</span>
        </Link>
        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div>
          <Button
            variant="outline"
            render={<Link href="/login">Login</Link>}
            nativeButton={false}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
