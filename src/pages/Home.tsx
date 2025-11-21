import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <button 
          onClick={() => navigate("/")}
          className="text-xl font-semibold hover:opacity-70 transition-opacity"
        >
          onelinc
        </button>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/auth")}
        >
          Sign in
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in mt-16 md:mt-0">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-[3.2rem] md:text-[3.7rem] font-bold tracking-tight leading-tight">
              Your shop.
              <br />
              One link.
            </h1>
            <p className="text-[1.1rem] md:text-[1.3rem] text-muted-foreground max-w-2xl mx-auto">
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

          {/* Sample Store Preview - Interactive */}
          <div className="pt-12 animate-slide-up">
            <div className="bg-card rounded-3xl shadow-apple-lg p-8 max-w-md mx-auto border border-border transition-all hover:shadow-xl">
              <div className="flex flex-col items-center space-y-6">
                {/* Store Profile */}
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center animate-scale-in">
                  <span className="text-3xl">🛍️</span>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Cake Cafe</h3>
                  <p className="text-sm text-muted-foreground">Fresh products daily</p>
                </div>
                
                {/* Sample Product Card */}
                <div className="w-full relative bg-secondary rounded-3xl overflow-hidden shadow-apple cursor-pointer hover:shadow-apple-lg transition-all group">
                  <div className="w-full aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">🎂</span>
                  </div>
                  
                  {/* Floating Bottom Bar */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-background/95 backdrop-blur-xl rounded-full px-4 py-2.5 shadow-lg border border-border/50 flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-semibold text-sm truncate">Chocolate Cake</p>
                        <p className="text-xs font-medium text-muted-foreground">₦5,000</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-whatsapp flex items-center justify-center flex-shrink-0 shadow-md">
                        <MessageCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Click "Create your store" to get started
                </p>
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