"use client";
import { useEffect } from "react";
import { getOfflineQueue, clearOfflineQueue } from "@/lib/offlineStorage";
import { EquipmentAPI } from "@/lib/services/equiment-api"; 

export function useOfflineSync() {
  useEffect(() => {
    async function syncQueue() {
      const queue = await getOfflineQueue();
      console.log("Queue offline à la reconnexion :", queue);
      if (!queue || queue.length === 0) return;

      for (const action of queue) {
        console.log("Traitement action offline :", action);
        try {
          if (action.type === "create") {
            console.log("Synchronisation offline : création", action.data);
            const res = await EquipmentAPI.createEquipment(action.data);
            console.log("Réponse API création :", res);
          }
          if (action.type === "update") {
            console.log("Synchronisation offline : mise à jour", action.data);
            const res = await EquipmentAPI.updateEquipment(action.data.id, action.data);
            console.log("Réponse API mise à jour :", res);
          }
          if (action.type === "delete") {
            console.log("Synchronisation offline : suppression", action.data);
            const res = await EquipmentAPI.deleteEquipment(action.data.id);
            console.log("Réponse API suppression :", res);
          }
        } catch (e) {
          // Error handling
          console.error("Erreur lors de la synchronisation offline :", e);
        }
      }
      await clearOfflineQueue();
      
    }

    function handleOnline() {
      console.log("I'm back online !");
      syncQueue();
    }

    window.addEventListener("online", handleOnline);
    // Synchronize also at mount if already online
    if (navigator.onLine) {
      syncQueue();
    }
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}