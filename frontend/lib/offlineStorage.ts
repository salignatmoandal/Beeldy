import localforage from "localforage";

// Sauvegarder une page d'équipements
export async function saveEquipmentsPage(pageKey: string, data: any) {
  await localforage.setItem(pageKey, data);
}

// Charger une page depuis le cache
export async function loadEquipmentsPage(pageKey: string) {
  return await localforage.getItem(pageKey);
}

// Ajouter une action à la queue offline
export async function queueOfflineAction(action: any) {
  const queue = ((await localforage.getItem("offline_queue")) || []) as any[];
  queue.push(action);
  await localforage.setItem("offline_queue", queue);
}

// Récupérer la queue
export async function getOfflineQueue() {
  return ((await localforage.getItem("offline_queue")) || []) as any[];
}

// Vider la queue
export async function clearOfflineQueue() {
  await localforage.setItem("offline_queue", []);
}