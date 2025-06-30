"use client";
import { useEffect } from "react";
import { getOfflineQueue, clearOfflineQueue } from "@/lib/offlineStorage";
import { EquipmentAPI } from "@/lib/services/equiment-api"; // adapte le chemin si besoin

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
          // Ajoute ici d'autres types d'actions si besoin (update, delete, etc.)
        } catch (e) {
          // Gestion d'erreur : tu peux garder l'action dans la queue ou afficher un message
          console.error("Erreur lors de la synchronisation offline :", e);
        }
      }
      await clearOfflineQueue();
      // Optionnel : affiche un toast ou un message de succès
    }

    function handleOnline() {
      console.log("Je suis de retour en ligne !");
      syncQueue();
    }

    window.addEventListener("online", handleOnline);
    // Synchronise aussi au montage si déjà online
    if (navigator.onLine) {
      syncQueue();
    }
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}