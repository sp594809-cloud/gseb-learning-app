import { getSolutionsByChapter } from './content';

const CHAPTERS_CACHE_NAME = 'gseb-chapters-cache-v1';
const OFFLINE_INDEX_KEY = 'gseb_offline_downloaded_chapters';

export interface StorageEstimateResult {
  usedMb: number;
  quotaMb: number;
  percentUsed: number;
}

// Register service worker safely
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // SW registered
      })
      .catch((err) => {
        // registration failed
      });
  });
}

// Check if online
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// Listen to connectivity changes
export function addConnectivityListener(callback: (online: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Download a chapter for offline viewing
export async function downloadChapterForOffline(chapterNumber: string): Promise<boolean> {
  const norm = chapterNumber.padStart(2, '0');
  const items = getSolutionsByChapter(norm);

  if (!items || items.length === 0) return false;

  try {
    if ('caches' in window) {
      const cache = await caches.open(CHAPTERS_CACHE_NAME);
      const url = `/api/offline/chapter-${norm}`;
      const response = new Response(JSON.stringify(items), {
        headers: {
          'Content-Type': 'application/json',
          'X-GSEB-Offline-Date': new Date().toISOString(),
        },
      });
      await cache.put(url, response);

      // Track in localStorage index
      const downloaded = getDownloadedChaptersList();
      if (!downloaded.includes(norm)) {
        downloaded.push(norm);
        localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(downloaded));
      }
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

// Remove downloaded chapter from cache
export async function removeChapterFromOffline(chapterNumber: string): Promise<boolean> {
  const norm = chapterNumber.padStart(2, '0');
  try {
    if ('caches' in window) {
      const cache = await caches.open(CHAPTERS_CACHE_NAME);
      const url = `/api/offline/chapter-${norm}`;
      await cache.delete(url);

      const downloaded = getDownloadedChaptersList().filter((c) => c !== norm);
      localStorage.setItem(OFFLINE_INDEX_KEY, JSON.stringify(downloaded));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// List of all offline downloaded chapter numbers
export function getDownloadedChaptersList(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_INDEX_KEY) || '[]');
  } catch {
    return [];
  }
}

// Verify if a specific chapter is truly cached
export async function isChapterAvailableOffline(chapterNumber: string): Promise<boolean> {
  const norm = chapterNumber.padStart(2, '0');
  if (typeof window === 'undefined' || !('caches' in window)) return false;

  try {
    const cache = await caches.open(CHAPTERS_CACHE_NAME);
    const match = await cache.match(`/api/offline/chapter-${norm}`);
    return !!match;
  } catch {
    return false;
  }
}

// Get storage quota estimate
export async function getStorageEstimate(): Promise<StorageEstimateResult> {
  if (typeof navigator === 'undefined' || !navigator.storage || !navigator.storage.estimate) {
    return { usedMb: 0, quotaMb: 0, percentUsed: 0 };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const used = (estimate.usage || 0) / (1024 * 1024);
    const quota = (estimate.quota || 1) / (1024 * 1024);
    return {
      usedMb: Math.round(used * 10) / 10,
      quotaMb: Math.round(quota),
      percentUsed: Math.min(100, Math.round((used / quota) * 100)),
    };
  } catch {
    return { usedMb: 0, quotaMb: 0, percentUsed: 0 };
  }
}
