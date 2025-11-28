import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Mail, Calendar, Target } from "lucide-react";
import { calculateLevel, getLevelTitle } from "@/utils/levelSystem";

const PRESET_AVATARS = [
  "🧠", "🎯", "⚡", "🌟", "🚀", "💡", "🎮", "🏆", "🔥", "✨",
  "🎨", "🌈", "🦋", "🐘", "🦉", "🐬", "🦁", "🐼", "🦊", "🐨"
];

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧠");
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(data);
          setDisplayName(data.name || "");
          setSelectedAvatar(data.avatar || "🧠");
          setGoals(data.goals || []);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({
            name: displayName,
            avatar: selectedAvatar,
            goals: goals,
          })
          .eq("id", user.id);

        toast.success("Profile updated successfully!");
        loadProfile();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const level = calculateLevel(profile?.xp_points || 0);
  const levelTitle = getLevelTitle(level);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{selectedAvatar}</div>
                <p className="text-sm text-muted-foreground">Choose your avatar</p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        selectedAvatar === avatar
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input value={profile?.email || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </Label>
                <Input
                  value={new Date(profile?.created_at).toLocaleDateString()}
                  disabled
                />
              </div>

              <Button onClick={saveProfile} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personal Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Select what you'd like to improve:
              </p>
              {[
                "Memory & Recall",
                "Focus & Attention",
                "Processing Speed",
                "Mental Flexibility",
                "Stress & Calmness",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    goals.includes(goal)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {goals.includes(goal) ? "✓ " : ""}
                  {goal}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {level}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Level ({levelTitle})
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-focus">
                    {profile?.focus_score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Focus</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-memory">
                    {profile?.memory_score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Memory</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-speed">
                    {profile?.speed_score || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Speed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
