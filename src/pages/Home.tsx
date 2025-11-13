import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Onlink</h2>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/auth")}
        >
          Sign in
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Your shop.
              <br />
              One link.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Create a clean product page your customers actually trust.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full shadow-apple-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/create")}
            >
              Create your store
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-lg px-8 py-6 rounded-full"
              onClick={() => navigate("/create")}
            >
              View sample store
            </Button>
          </div>

          {/* Sample Store Preview */}
          <div className="pt-12 animate-slide-up">
            <div className="bg-card rounded-3xl shadow-apple-lg p-8 max-w-md mx-auto border border-border">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-3xl">🛍️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Cake Cafe</h3>
                  <p className="text-sm text-muted-foreground">Fresh products daily</p>
                </div>
                <div className="w-full aspect-square bg-secondary rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    📦
                  </div>
                </div>
                <div className="w-full text-left">
                  <p className="font-semibold">Sample Product</p>
                  <p className="text-muted-foreground">₦5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>Built with love • Simple stores, happy customers</p>
      </footer>
    </div>
  );
};

export default Home;