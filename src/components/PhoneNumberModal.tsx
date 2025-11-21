import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { X } from "lucide-react";

const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number");

const countries = [
  { code: "+234", name: "Nigeria", flag: "🇳🇬", format: "### ### ####" },
  { code: "+1", name: "USA", flag: "🇺🇸", format: "(###) ###-####" },
  { code: "+44", name: "UK", flag: "🇬🇧", format: "#### ### ####" },
  { code: "+91", name: "India", flag: "🇮🇳", format: "##### #####" },
  { code: "+86", name: "China", flag: "🇨🇳", format: "### #### ####" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", format: "## ### ####" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", format: "### ######" },
  { code: "+233", name: "Ghana", flag: "🇬🇭", format: "## ### ####" },
];

// Auto-detect country from timezone/locale
const detectCountry = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const locale = navigator.language;
    
    // Map common timezones to country codes
    if (timezone.includes("Lagos") || timezone.includes("Africa") && locale.includes("en-NG")) return "+234";
    if (timezone.includes("America") || locale.includes("en-US")) return "+1";
    if (timezone.includes("Europe/London") || locale.includes("en-GB")) return "+44";
    if (timezone.includes("Asia/Kolkata") || locale.includes("en-IN")) return "+91";
    if (timezone.includes("Asia/Shanghai") || locale.includes("zh")) return "+86";
    if (timezone.includes("Africa/Johannesburg")) return "+27";
    if (timezone.includes("Africa/Nairobi")) return "+254";
    if (timezone.includes("Africa/Accra")) return "+233";
    
    // Default to Nigeria
    return "+234";
  } catch {
    return "+234";
  }
};

interface PhoneNumberModalProps {
  open: boolean;
  onComplete: () => void;
  profileId: string;
}

export const PhoneNumberModal = ({ open, onComplete, profileId }: PhoneNumberModalProps) => {
  const [countryCode, setCountryCode] = useState(detectCountry());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Format phone number as user types
  const formatPhoneNumber = (value: string, format: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    let numIndex = 0;
    
    for (let i = 0; i < format.length && numIndex < numbers.length; i++) {
      if (format[i] === '#') {
        formatted += numbers[numIndex];
        numIndex++;
      } else {
        formatted += format[i];
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      const formatted = formatPhoneNumber(value, country.format);
      setPhoneNumber(formatted);
    } else {
      setPhoneNumber(value.replace(/\D/g, ''));
    }
  };

  const handleSubmit = async () => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `${countryCode}${cleanNumber}`;
    
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
        description: "Customers can now reach you on WhatsApp",
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
      <DialogContent className="sm:max-w-[360px] max-w-[360px] rounded-[24px] border border-border/50 shadow-2xl backdrop-blur-xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
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
          <div>
            <DialogTitle className="text-[22px] font-semibold tracking-tight">Your WhatsApp Number</DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground mt-1.5">
              For users to contact your WhatsApp.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        {/* Form */}
        <div className="px-6 pb-6 space-y-4">
          {/* Country Selector */}
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger className="h-[52px] rounded-[14px] bg-muted/30 border-border/50 text-[15px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-[14px]">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="text-[15px]">
                  <span className="flex items-center gap-2.5">
                    <span className="text-[18px]">{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                    <span className="text-muted-foreground">{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Phone Input */}
          <div className="flex gap-2.5">
            <div className="flex items-center justify-center px-4 rounded-[14px] bg-muted/30 border border-border/50 text-[15px] font-medium min-w-[70px]">
              {countryCode}
            </div>
            <div className="relative flex-1">
              <Input
                type="tel"
                placeholder={countries.find(c => c.code === countryCode)?.format || "800 000 0000"}
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="h-[52px] rounded-[14px] bg-muted/30 border-border/50 text-[15px] pr-10"
                disabled={isLoading}
              />
              {phoneNumber && (
                <button
                  onClick={() => setPhoneNumber("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !phoneNumber}
            className="w-full h-[52px] rounded-[14px] font-semibold text-[15px] shadow-sm hover:shadow transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
