import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onShareAgain: () => void;
  storeUrl: string;
}

export const ShareSuccessModal = ({ open, onClose, onShareAgain, storeUrl }: ShareSuccessModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] rounded-[24px] border border-border/50 shadow-2xl p-0 overflow-hidden">
        <div className="p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-[22px] font-semibold tracking-tight mb-2">Done!</h3>
            <p className="text-[15px] text-muted-foreground">
              Want more people to see your store?
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={onShareAgain}
              className="w-full h-[52px] rounded-[14px] font-semibold text-[15px] shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              Share again
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="w-full h-[52px] rounded-[14px] font-semibold text-[15px] hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy link
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full h-[44px] text-[15px]"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
