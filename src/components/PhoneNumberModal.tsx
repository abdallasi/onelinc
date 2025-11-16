import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number");

const countries = [
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
];

interface PhoneNumberModalProps {
  open: boolean;
  onComplete: () => void;
  profileId: string;
}

export const PhoneNumberModal = ({ open, onComplete, profileId }: PhoneNumberModalProps) => {
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const adjustForKeyboard = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        const offsetTop = viewport.height < window.innerHeight ? viewport.height * 0.1 : 0;
        document.documentElement.style.setProperty('--keyboard-offset', `${offsetTop}px`);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustForKeyboard);
      window.visualViewport.addEventListener('scroll', adjustForKeyboard);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', adjustForKeyboard);
        window.visualViewport.removeEventListener('scroll', adjustForKeyboard);
      }
    };
  }, [open]);

  const handleSubmit = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    
    try {
      phoneSchema.parse(fullPhoneNumber);
    } catch (error: any) {
      toast({
        title: "Invalid phone number",
        description: error.errors?.[0]?.message || "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone_number: fullPhoneNumber })
        .eq("id", profileId);

      if (error) throw error;

      toast({
        title: "Phone number saved!",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Failed to save phone number",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[256px] max-w-[256px] rounded-3xl border-none shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out" style={{ transform: 'translate(-50%, calc(-50% - var(--keyboard-offset, 0px)))' }}>
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <DialogTitle className="text-lg font-semibold">Add your phone number</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Help customers reach you easily
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-3">
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="rounded-xl bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <div className="flex items-center justify-center px-3 rounded-xl bg-muted/50 text-sm font-medium">
              {countryCode}
            </div>
            <Input
              type="tel"
              placeholder="800 000 0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="flex-1 py-5 text-center rounded-xl"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !phoneNumber}
            className="w-full py-5 rounded-xl font-semibold"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
