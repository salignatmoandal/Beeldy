import React from "react";
import { useOnlineStatus } from "@/hook/useOnlineStatus"; // ou selon ton chemin

export function OnlineStatusBanner() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      {!isOnline && <div className="bg-yellow-200 p-2">Mode Offline</div>}
    </div>
  );
}
