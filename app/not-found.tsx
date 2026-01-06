import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Search className="h-12 w-12 text-primary" aria-hidden="true" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="default">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Home
            </Button>
          </Link>
          <Link href="/catalog">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" aria-hidden="true" />
              Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
