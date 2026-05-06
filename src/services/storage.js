// ── IndexedDB storage (replaces localStorage)
// iOS does NOT purge IndexedDB like it does localStorage in PWAs.

const DB_NAME    = "calorieTrackerDB";
const DB_VERSION = 1;
const STORE      = "appData";
const DATA_KEY   = "main";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function loadData() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(DATA_KEY);
      req.onsuccess = (e) => resolve(e.target.result ? e.target.result.data : null);
      req.onerror   = (e) => reject(e.target.error);
    });
  } catch {
    return null;
  }
}

export async function saveData(data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).put({ id: DATA_KEY, data });
      req.onsuccess = () => resolve();
      req.onerror   = (e) => reject(e.target.error);
    });
  } catch {
    // silent fail — data will reload on next open
  }
}

export function todayKey() {
  return new Date().toISOString().split("T")[0];
}
