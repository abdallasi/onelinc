import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-xl font-semibold hover:opacity-70 transition-opacity"
      >
        onelinc
      </button>

      <div className="text-center space-y-6 animate-scale-in max-w-md">
        {/* Large 404 */}
        <div className="space-y-2">
          <h1 className="text-[120px] font-bold leading-none tracking-tighter text-foreground/10">
            404
          </h1>
          <h2 className="text-2xl font-semibold -mt-4">Page not found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <Button 
          size="lg" 
          onClick={() => navigate("/")}
          className="rounded-full shadow-apple-lg hover:scale-[1.02] active:scale-[0.98] transition-transform px-8"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;