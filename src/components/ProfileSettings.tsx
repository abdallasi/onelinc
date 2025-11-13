import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  profile: any;
  onClose: () => void;
  onSave: (updatedProfile: any) => void;
}

const ProfileSettings = ({ profile, onClose, onSave }: ProfileSettingsProps) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Please enter a shop name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          name,
          bio,
          phone_number: phoneNumber,
          avatar_url: avatarUrl,
        })
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile updated!",
      });

      onSave(data);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Profile Settings</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Shop Name *</label>
            <Input
              placeholder="My Amazing Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-5 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline</label>
            <Textarea
              placeholder="Fresh products daily"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Number</label>
            <Input
              placeholder="+234 xxx xxx xxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="py-5 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Customers will use this to contact you
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Image URL</label>
            <Input
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="py-5 rounded-xl"
            />
            {avatarUrl && (
              <div className="mt-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-border mx-auto">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 py-6 rounded-full shadow-apple"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;