import { useState, useEffect } from "react";
import { X, Share, Plus } from "lucide-react";

// PWA Install Prompt Component
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Show iOS prompt after delay
    if (isIOSDevice && !standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // Handle Android/Chrome install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />
      
      {/* Prompt Card */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500 ease-out">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {/* App Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center">
                <img 
                  src="/favicon.png" 
                  alt="Onelinc" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center text-foreground">
              Add Onelinc to Home Screen
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Get quick access to your store anytime
            </p>
          </div>

          {/* Instructions for iOS */}
          {isIOS ? (
            <div className="px-6 pb-6">
              <div className="bg-muted/50 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Share className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tap the Share button
                    </p>
                    <p className="text-xs text-muted-foreground">
                      At the bottom of Safari
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Tap "Add to Home Screen"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Then tap "Add" to confirm
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="w-full mt-4 py-3.5 rounded-2xl bg-muted text-foreground font-medium text-base hover:bg-muted/80 transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
            /* Install button for Android/Chrome */
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={handleInstall}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3.5 rounded-2xl bg-transparent text-muted-foreground font-medium text-base hover:bg-muted/50 transition-colors"
              >
                Not now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PWAInstallPrompt;
