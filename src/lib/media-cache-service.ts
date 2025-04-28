interface MediaCacheItem {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  timestamp: number;
}

class MediaCacheService {
  private dbName = 'multiAI-media-cache';
  private storeName = 'media-files';
  private db: IDBDatabase | null = null;
  private initializationPromise: Promise<boolean> | null = null;
  // Fallback storage when IndexedDB is not available
  private memoryCache: Map<string, MediaCacheItem> = new Map();
  private useMemoryFallback: boolean = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<boolean> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise<boolean>(async (resolve) => {
      try {
        // Check if IndexedDB is available in this browser
        if (!window.indexedDB) {
          console.warn('IndexedDB not supported by this browser, using memory fallback');
          this.useMemoryFallback = true;
          resolve(false);
          return;
        }

        console.log('Initializing media cache service...');
        
        // Open the database with a timeout
        const dbRequest = indexedDB.open(this.dbName, 1);
        
        // Set a timeout for the initialization
        const timeoutId = setTimeout(() => {
          console.warn('IndexedDB initialization timed out, using memory fallback');
          this.useMemoryFallback = true;
          resolve(false);
        }, 3000); // 3 seconds timeout
        
        dbRequest.onupgradeneeded = (event) => {
          console.log('Upgrading media cache database...');
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create object store if it doesn't exist
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            console.log('Created media cache object store');
          }
        };

        dbRequest.onsuccess = (event) => {
          clearTimeout(timeoutId);
          this.db = (event.target as IDBOpenDBRequest).result;
          console.log('Media cache database initialized successfully');
          
          // Add connection monitoring
          this.db.onversionchange = () => {
            this.db?.close();
            this.db = null;
            this.initializationPromise = null;
            console.warn('Database version changed, connection closed');
          };
          
          resolve(true);
        };

        dbRequest.onerror = (event) => {
          clearTimeout(timeoutId);
          const error = (event.target as IDBOpenDBRequest).error;
          console.error('IndexedDB initialization error:', error);
          this.useMemoryFallback = true;
          resolve(false);
        };

        dbRequest.onblocked = () => {
          clearTimeout(timeoutId);
          console.warn('IndexedDB initialization blocked');
          this.useMemoryFallback = true;
          resolve(false);
        };
        
      } catch (error) {
        console.error('Fatal error during media cache initialization:', error);
        this.useMemoryFallback = true;
        resolve(false);
      }
    });

    return this.initializationPromise;
  }

  async saveMedia(media: { id: string; name: string; type: string; dataUrl: string }): Promise<string> {
    try {
      // Wait for initialization
      await this.initialize();
      
      const item: MediaCacheItem = {
        id: media.id,
        name: media.name,
        type: media.type,
        dataUrl: media.dataUrl,
        timestamp: Date.now()
      };

      // Use memory fallback if needed
      if (this.useMemoryFallback) {
        this.memoryCache.set(media.id, item);
        console.log(`Media saved to memory cache: ${media.id}`);
        return media.id;
      }

      // Only proceed with IndexedDB if database is available
      if (!this.db) {
        console.warn('IndexedDB not available, saved to memory only');
        this.memoryCache.set(media.id, item);
        return media.id;
      }

      return new Promise((resolve, reject) => {
        try {
          const transaction = this.db!.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          
          // Also save to memory cache as backup
          this.memoryCache.set(media.id, item);
          
          const request = store.put(item);
          
          transaction.oncomplete = () => {
            console.log(`Media saved to IndexedDB: ${media.id}`);
            resolve(media.id);
          };
          
          transaction.onerror = (event) => {
            console.error('Error in IndexedDB transaction:', event);
            // Already saved to memory, so we can still return success
            resolve(media.id);
          };
        } catch (error) {
          console.error('Error during IndexedDB save operation:', error);
          // Already saved to memory, so we can still return success
          resolve(media.id);
        }
      });
    } catch (error) {
      console.error('Media save operation failed completely:', error);
      // Last resort: try to save to memory
      try {
        const item: MediaCacheItem = {
          id: media.id,
          name: media.name,
          type: media.type,
          dataUrl: media.dataUrl,
          timestamp: Date.now()
        };
        this.memoryCache.set(media.id, item);
        return media.id;
      } catch (e) {
        console.error('Even memory cache failed:', e);
        throw new Error('Could not save media anywhere');
      }
    }
  }

  async getMedia(id: string): Promise<MediaCacheItem | null> {
    await this.initialize();
    
    // First check memory cache
    if (this.memoryCache.has(id)) {
      const item = this.memoryCache.get(id)!;
      item.timestamp = Date.now(); // Update timestamp on access
      console.log(`Media retrieved from memory cache: ${id}`);
      return item;
    }
    
    // If using memory fallback or no DB, return null as it's not in memory
    if (this.useMemoryFallback || !this.db) {
      console.warn(`Media not found in memory cache: ${id}`);
      return null;
    }
    
    // Try to get from IndexedDB
    try {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.get(id);
          
          request.onsuccess = () => {
            if (request.result) {
              // Cache the result in memory for faster access next time
              this.memoryCache.set(id, request.result);
              console.log(`Media retrieved from IndexedDB: ${id}`);
              
              // Update timestamp (don't wait for completion)
              this.updateTimestamp(id).catch(err => 
                console.warn('Failed to update media timestamp:', err)
              );
              
              resolve(request.result);
            } else {
              console.warn(`Media not found in IndexedDB: ${id}`);
              resolve(null);
            }
          };
          
          request.onerror = (event) => {
            console.error('Error fetching media from IndexedDB:', event);
            resolve(null);
          };
        } catch (error) {
          console.error('Error during IndexedDB get operation:', error);
          resolve(null);
        }
      });
    } catch (error) {
      console.error('Media retrieval operation failed completely:', error);
      return null;
    }
  }

  private async updateTimestamp(id: string): Promise<void> {
    if (!this.db || this.useMemoryFallback) return;
    
    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
        
        request.onsuccess = () => {
          if (request.result) {
            const item = request.result;
            item.timestamp = Date.now();
            store.put(item);
          }
          resolve();
        };
        
        request.onerror = () => {
          console.warn('Failed to update media timestamp');
          resolve();
        };
      } catch (error) {
        console.warn('Error during timestamp update:', error);
        resolve();
      }
    });
  }

  async clearOldMedia(maxAgeInDays = 7): Promise<number> {
    // Clear memory cache
    const now = Date.now();
    const cutoffTime = now - (maxAgeInDays * 24 * 60 * 60 * 1000);
    let memoryDeleted = 0;
    
    // Clean memory cache
    for (const [id, item] of this.memoryCache.entries()) {
      if (item.timestamp < cutoffTime) {
        this.memoryCache.delete(id);
        memoryDeleted++;
      }
    }
    
    // If no DB or using fallback, return the memory cleanup count
    if (this.useMemoryFallback || !this.db) {
      console.log(`Cleared ${memoryDeleted} old items from memory cache`);
      return memoryDeleted;
    }
    
    // Also clean IndexedDB
    try {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const index = store.index('timestamp');
          const range = IDBKeyRange.upperBound(cutoffTime);
          const request = index.openCursor(range);
          
          let indexedDBDeleted = 0;
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              const id = cursor.value.id;
              cursor.delete();
              this.memoryCache.delete(id); // Also remove from memory cache
              indexedDBDeleted++;
              cursor.continue();
            } else {
              console.log(`Cleared ${indexedDBDeleted} old items from IndexedDB`);
              resolve(memoryDeleted + indexedDBDeleted);
            }
          };
          
          request.onerror = () => {
            console.warn('Error during IndexedDB cleanup');
            resolve(memoryDeleted);
          };
        } catch (error) {
          console.error('Error during IndexedDB cleanup:', error);
          resolve(memoryDeleted);
        }
      });
    } catch (error) {
      console.error('Media cleanup operation failed:', error);
      return memoryDeleted;
    }
  }

  // Check if the service is available
  async isAvailable(): Promise<boolean> {
    await this.initialize();
    return true; // We're always available due to memory fallback
  }
}

export const mediaCacheService = new MediaCacheService();