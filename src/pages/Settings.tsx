import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useSound } from "@/hooks/useSound";
import { Volume2, Moon, Bell } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toggleSound, isSoundEnabled } = useSound();
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());
  const [volume, setVolume] = useState([30]);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle dark/light theme
                </p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Enable audio feedback
                </p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={handleSoundToggle} />
            </div>

            <div className="space-y-2">
              <Label>Master Volume</Label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">{volume}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to complete your daily quests
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Streak Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Don't break your streak!
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievement Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you earn badges
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
