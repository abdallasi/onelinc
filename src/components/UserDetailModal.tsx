import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
}

export default function UserDetailModal({ open, onOpenChange, profileId }: UserDetailModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && profileId) {
      fetchUserDetails();
    }
  }, [open, profileId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      // Fetch cards
      const { data: cardsData } = await supabase
        .from("cards")
        .select("*")
        .eq("profile_id", profileId)
        .order("order_index");

      // Fetch subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("profile_id", profileId)
        .maybeSingle();

      setProfile(profileData);
      setCards(cardsData || []);
      setSubscription(subData);
    } catch (error) {
      toast({
        title: "Failed to load details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePaidStatus = async () => {
    if (!subscription) {
      toast({
        title: "No subscription found",
        variant: "destructive",
      });
      return;
    }

    const newStatus = subscription.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: newStatus })
      .eq("id", subscription.id);

    if (error) {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    } else {
      setSubscription({ ...subscription, status: newStatus });
      toast({
        title: "Status updated",
      });
    }
  };

  const disableAccount = async () => {
    // For now, we'll mark subscription as inactive
    // You could add a disabled field to profiles table if needed
    if (subscription) {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "inactive" })
        .eq("id", subscription.id);

      if (error) {
        toast({
          title: "Failed to disable account",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account disabled",
        });
        onOpenChange(false);
      }
    }
  };

  if (loading || !profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{profile.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Info */}
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Profile</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Slug:</span>
                <span className="font-medium">{profile.slug}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{profile.phone_number || "—"}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</span>
              </p>
            </div>
            {profile.bio && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Bio:</p>
                <p className="text-sm">{profile.bio}</p>
              </div>
            )}
          </Card>

          {/* Products */}
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Products ({cards.length})</h3>
            {cards.length > 0 ? (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-medium">{card.title}</p>
                    {card.price && <p className="text-sm text-muted-foreground">{card.price}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No products yet</p>
            )}
          </Card>

          {/* Subscription Status */}
          <Card className="p-6 border-none shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Subscription</h3>
            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid Status</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {subscription.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={subscription.status === "active"}
                      onCheckedChange={togglePaidStatus}
                    />
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{subscription.plan_code}</span>
                  </p>
                  {subscription.next_payment_date && (
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Next Payment:</span>
                      <span className="font-medium">
                        {new Date(subscription.next_payment_date).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active subscription</p>
            )}
          </Card>

          {/* Actions */}
          <div className="pt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={disableAccount}
            >
              Disable Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
