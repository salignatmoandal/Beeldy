// frontend/components/SoonerStatusBanner.tsx
import React, { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hook/useOnlineStatus";

export function SoonerStatusBanner() {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true); // Show immediately if offline
    } else {
      // Disappear after 3 seconds if online
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`
          flex items-center gap-2 px-6 py-2 rounded-full shadow-lg
          text-white font-medium text-sm
          transition-all duration-500
          ${isOnline
            ? "bg-gradient-to-r from-green-400 to-green-600 shadow-green-200"
            : "bg-gradient-to-r from-red-400 to-red-600 shadow-red-200"
          }
          ${isOnline ? "opacity-90" : "opacity-95"}
          ring-1 ring-black/10
        `}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span
          className={`
            block w-3 h-3 rounded-full
            transition-colors duration-500
            ${isOnline ? "bg-green-300" : "bg-red-300"}
            ring-2 ring-white
          `}
        />
        {isOnline ? "Connected to Internet" : "Offline"}
      </div>
    </div>
  );
}