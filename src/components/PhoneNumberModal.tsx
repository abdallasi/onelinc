import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number");

interface PhoneNumberModalProps {
  open: boolean;
  onComplete: () => void;
  profileId: string;
}

export const PhoneNumberModal = ({ open, onComplete, profileId }: PhoneNumberModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      phoneSchema.parse(phoneNumber);
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
        .update({ phone_number: phoneNumber })
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
      <DialogContent className="sm:max-w-[320px] rounded-3xl border-border/50">
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
          <DialogTitle className="text-xl font-semibold">Add your phone number</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Help customers reach you easily
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-3">
          <Input
            type="tel"
            placeholder="+234 800 000 0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="py-5 text-center rounded-xl"
            disabled={isLoading}
          />
          
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
