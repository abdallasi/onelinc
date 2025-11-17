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
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
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
      setEditedProfile(profileData);
    } catch (error) {
      toast({
        title: "Failed to load details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfileChanges = async () => {
    if (!editedProfile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: editedProfile.name,
        slug: editedProfile.slug,
        bio: editedProfile.bio,
        phone_number: editedProfile.phone_number,
      })
      .eq("id", profileId);

    if (error) {
      toast({
        title: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile updated",
      });
    }
  };

  const deleteAccount = async () => {
    // Delete cards first
    await supabase.from("cards").delete().eq("profile_id", profileId);
    
    // Delete subscription
    if (subscription) {
      await supabase.from("subscriptions").delete().eq("id", subscription.id);
    }

    // Delete profile
    const { error } = await supabase.from("profiles").delete().eq("id", profileId);

    if (error) {
      toast({
        title: "Failed to delete account",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account deleted",
      });
      onOpenChange(false);
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    saveProfileChanges();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={editedProfile?.name || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Slug</label>
                  <input
                    type="text"
                    value={editedProfile?.slug || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <input
                    type="text"
                    value={editedProfile?.phone_number || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone_number: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Bio</label>
                  <textarea
                    value={editedProfile?.bio || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
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
              </>
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
          <div className="pt-2 space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (subscription) {
                  supabase
                    .from("subscriptions")
                    .update({ status: "inactive" })
                    .eq("id", subscription.id)
                    .then(({ error }) => {
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
                    });
                }
              }}
            >
              Disable Account
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={deleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
