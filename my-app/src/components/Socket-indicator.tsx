"use client";

import { Badge } from "./ui/badge";
import { useRealtime } from "./providers/realtime-provider";
const SupabaseIndicator = () => {
  const { isConnected } = useRealtime();
  if (!isConnected)
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        Fallback: Polling every 1s
      </Badge>
    );

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      Live: Real-time updates
    </Badge>
  );
};

export default SupabaseIndicator;
