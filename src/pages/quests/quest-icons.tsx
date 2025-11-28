import { Brain, Zap, Wind, RefreshCw } from "lucide-react";

export const MemoryIcon = () => (
  <div className="w-12 h-12 rounded-full bg-memory flex items-center justify-center">
    <Brain className="w-6 h-6 text-memory-foreground" />
  </div>
);

export const SpeedIcon = () => (
  <div className="w-12 h-12 rounded-full bg-speed flex items-center justify-center">
    <Zap className="w-6 h-6 text-speed-foreground" />
  </div>
);

export const SwitchIcon = () => (
  <div className="w-12 h-12 rounded-full bg-switch flex items-center justify-center">
    <RefreshCw className="w-6 h-6 text-switch-foreground" />
  </div>
);
