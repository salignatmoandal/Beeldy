import localforage from "localforage";

// Save an equipments page
export async function saveEquipmentsPage(pageKey: string, data: any) {
  await localforage.setItem(pageKey, data);
}

// Load an equipments page from the cache
export async function loadEquipmentsPage(pageKey: string) {
  return await localforage.getItem(pageKey);
}

// Add an action to the offline queue
export async function queueOfflineAction(action: any) {
  const queue = ((await localforage.getItem("offline_queue")) || []) as any[];
  queue.push(action);
  await localforage.setItem("offline_queue", queue);
}

// Get the queue
export async function getOfflineQueue() {
  return ((await localforage.getItem("offline_queue")) || []) as any[];
}

// Clear the queue
export async function clearOfflineQueue() {
  await localforage.setItem("offline_queue", []);
}