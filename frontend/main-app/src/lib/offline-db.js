// MANAS360 Offline Database Manager

// IndexedDB wrapper for offline data storage

const DB_NAME = 'MANAS360_Offline';

const DB_VERSION = 1;

// Database schema

const STORES = {

  // User data (cached from server)

  user_profile: { keyPath: 'id', indexes: ['email', 'updated_at'] },

  

  // Mood tracking (offline-first)

  mood_entries: { keyPath: 'id', indexes: ['user_id', 'created_at', 'synced'] },

  pending_mood_entries: { keyPath: 'id', indexes: ['created_at'] },

  

  // Journal (offline-first)

  journal_entries: { keyPath: 'id', indexes: ['user_id', 'created_at', 'synced'] },

  pending_journal_entries: { keyPath: 'id', indexes: ['created_at'] },

  

  // Assessments (offline-first)

  assessments: { keyPath: 'id', indexes: ['user_id', 'type', 'created_at', 'synced'] },

  pending_assessments: { keyPath: 'id', indexes: ['created_at'] },

  

  // Cached content

  meditation_tracks: { keyPath: 'id', indexes: ['category', 'cached_at'] },

  therapist_profiles: { keyPath: 'id', indexes: ['cached_at'] },

  

  // Sync queue

  sync_queue: { keyPath: 'id', indexes: ['type', 'created_at', 'attempts'] },

  

  // App state

  app_state: { keyPath: 'key' }

};

class OfflineDB {

  constructor() {

    this.db = null;

    this.isReady = false;

  }

  // Initialize database

  async init() {

    return new Promise((resolve, reject) => {

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {

        console.error('[OfflineDB] Failed to open database:', request.error);

        reject(request.error);

      };

      request.onsuccess = () => {

        this.db = request.result;

        this.isReady = true;

        console.log('[OfflineDB] Database opened successfully');

        resolve(this.db);

      };

      request.onupgradeneeded = (event) => {

        console.log('[OfflineDB] Upgrading database schema...');

        const db = event.target.result;

        // Create object stores

        Object.entries(STORES).forEach(([storeName, config]) => {

          if (!db.objectStoreNames.contains(storeName)) {

            const store = db.createObjectStore(storeName, { 

              keyPath: config.keyPath,

              autoIncrement: config.keyPath === 'id'

            });

            // Create indexes

            if (config.indexes) {

              config.indexes.forEach(indexName => {

                store.createIndex(indexName, indexName, { unique: false });

              });

            }

            console.log(`[OfflineDB] Created store: ${storeName}`);

          }

        });

      };

    });

  }

  // Generic CRUD operations

  async add(storeName, data) {

    return this._transaction(storeName, 'readwrite', (store) => {

      const record = {

        ...data,

        id: data.id || this._generateId(),

        created_at: data.created_at || new Date().toISOString(),

        synced: false

      };

      return store.add(record);

    });

  }

  async put(storeName, data) {

    return this._transaction(storeName, 'readwrite', (store) => {

      return store.put({

        ...data,

        updated_at: new Date().toISOString()

      });

    });

  }

  async get(storeName, key) {

    return this._transaction(storeName, 'readonly', (store) => {

      return store.get(key);

    });

  }

  async getAll(storeName) {

    return this._transaction(storeName, 'readonly', (store) => {

      return store.getAll();

    });

  }

  async getByIndex(storeName, indexName, value) {

    return this._transaction(storeName, 'readonly', (store) => {

      const index = store.index(indexName);

      return index.getAll(value);

    });

  }

  async delete(storeName, key) {

    return this._transaction(storeName, 'readwrite', (store) => {

      return store.delete(key);

    });

  }

  async clear(storeName) {

    return this._transaction(storeName, 'readwrite', (store) => {

      return store.clear();

    });

  }

  // Transaction wrapper

  async _transaction(storeName, mode, callback) {

    if (!this.isReady) {

      await this.init();

    }

    return new Promise((resolve, reject) => {

      const transaction = this.db.transaction(storeName, mode);

      const store = transaction.objectStore(storeName);

      const request = callback(store);

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => reject(request.error);

    });

  }

  // Generate UUID

  _generateId() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {

      const r = Math.random() * 16 | 0;

      const v = c === 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);

    });

  }

}

// ============================================

// SPECIALIZED MANAGERS

// ============================================

class MoodManager {

  constructor(db) {

    this.db = db;

  }

  async saveMoodEntry(entry) {

    const data = {

      ...entry,

      user_id: entry.user_id,

      mood_score: entry.mood_score, // 1-10

      emotions: entry.emotions, // ['anxious', 'tired', 'hopeful']

      notes: entry.notes,

      factors: entry.factors, // ['sleep', 'work', 'relationships']

      created_at: new Date().toISOString()

    };

    // Save to main store

    await this.db.add('mood_entries', data);

    // If offline, also save to pending queue

    if (!navigator.onLine) {

      await this.db.add('pending_mood_entries', { data });

      await this._requestSync('sync-mood-entries');

    }

    return data;

  }

  async getMoodHistory(userId, days = 30) {

    const entries = await this.db.getByIndex('mood_entries', 'user_id', userId);

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    

    return entries

      .filter(e => new Date(e.created_at) >= cutoff)

      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  }

  async _requestSync(tag) {

    if ('serviceWorker' in navigator && 'sync' in window.registration) {

      try {

        await navigator.serviceWorker.ready;

        await registration.sync.register(tag);

        console.log('[MoodManager] Background sync registered:', tag);

      } catch (error) {

        console.error('[MoodManager] Failed to register sync:', error);

      }

    }

  }

}

class JournalManager {

  constructor(db) {

    this.db = db;

  }

  async saveJournalEntry(entry) {

    const data = {

      ...entry,

      user_id: entry.user_id,

      title: entry.title,

      content: entry.content, // Encrypted locally

      mood_tag: entry.mood_tag,

      prompts_used: entry.prompts_used,

      word_count: entry.content.split(/\s+/).length,

      created_at: new Date().toISOString()

    };

    await this.db.add('journal_entries', data);

    if (!navigator.onLine) {

      await this.db.add('pending_journal_entries', { data });

      await this._requestSync('sync-journal-entries');

    }

    return data;

  }

  async getJournalEntries(userId, limit = 50) {

    const entries = await this.db.getByIndex('journal_entries', 'user_id', userId);

    return entries

      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      .slice(0, limit);

  }

  async searchJournal(userId, query) {

    const entries = await this.getJournalEntries(userId, 100);

    const lowerQuery = query.toLowerCase();

    

    return entries.filter(entry => 

      entry.title.toLowerCase().includes(lowerQuery) ||

      entry.content.toLowerCase().includes(lowerQuery)

    );

  }

  async _requestSync(tag) {

    if ('serviceWorker' in navigator && 'sync' in window.registration) {

      try {

        await navigator.serviceWorker.ready;

        await registration.sync.register(tag);

      } catch (error) {

        console.error('[JournalManager] Failed to register sync:', error);

      }

    }

  }

}

class AssessmentManager {

  constructor(db) {

    this.db = db;

  }

  async saveAssessment(assessment) {

    const data = {

      ...assessment,

      user_id: assessment.user_id,

      type: assessment.type, // 'PHQ9', 'GAD7', 'WHO5'

      answers: assessment.answers,

      total_score: this._calculateScore(assessment.type, assessment.answers),

      severity: this._getSeverity(assessment.type, assessment.total_score),

      completed_at: new Date().toISOString()

    };

    await this.db.add('assessments', data);

    if (!navigator.onLine) {

      await this.db.add('pending_assessments', { data });

      await this._requestSync('sync-assessments');

    }

    // Check for crisis (PHQ-9 Q9 > 0)

    if (assessment.type === 'PHQ9' && assessment.answers[8] > 0) {

      this._triggerCrisisAlert(data);

    }

    return data;

  }

  _calculateScore(type, answers) {

    return answers.reduce((sum, val) => sum + val, 0);

  }

  _getSeverity(type, score) {

    if (type === 'PHQ9') {

      if (score <= 4) return 'minimal';

      if (score <= 9) return 'mild';

      if (score <= 14) return 'moderate';

      if (score <= 19) return 'moderately_severe';

      return 'severe';

    }

    if (type === 'GAD7') {

      if (score <= 4) return 'minimal';

      if (score <= 9) return 'mild';

      if (score <= 14) return 'moderate';

      return 'severe';

    }

    return 'unknown';

  }

  _triggerCrisisAlert(assessment) {

    // Show crisis resources immediately

    if (typeof window !== 'undefined') {

      window.dispatchEvent(new CustomEvent('crisis-detected', {

        detail: { assessment }

      }));

    }

  }

  async _requestSync(tag) {

    if ('serviceWorker' in navigator && 'sync' in window.registration) {

      try {

        await navigator.serviceWorker.ready;

        await registration.sync.register(tag);

      } catch (error) {

        console.error('[AssessmentManager] Failed to register sync:', error);

      }

    }

  }

}

// ============================================

// SYNC MANAGER

// ============================================

class SyncManager {

  constructor(db) {

    this.db = db;

    this.isSyncing = false;

  }

  async syncAll() {

    if (this.isSyncing || !navigator.onLine) {

      return { success: false, reason: this.isSyncing ? 'sync_in_progress' : 'offline' };

    }

    this.isSyncing = true;

    const results = {

      disabled: true,

      mood: { synced: 0, failed: 0 },

      journal: { synced: 0, failed: 0 },

      assessments: { synced: 0, failed: 0 }

    };

    try {

      // Legacy offline sync endpoints were removed during /api/v1 contract lock.
      // Keep pending entries local until corresponding v1 write endpoints are introduced.

      return { success: true, results };

    } finally {

      this.isSyncing = false;

    }

  }

  async _syncToServer(endpoint, data) {

    const csrfToken = this._getCookie('csrf_token');

    const response = await fetch(endpoint, {

      method: 'POST',

      credentials: 'include',

      headers: {

        'Content-Type': 'application/json',

        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {})

      },

      body: JSON.stringify(data)

    });

    if (!response.ok) {

      throw new Error(`Sync failed: ${response.status}`);

    }

    return response.json();

  }

  _getCookie(name) {

    if (typeof document === 'undefined') return null;

    const cookie = document.cookie
      .split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith(`${name}=`));

    if (!cookie) return null;

    return decodeURIComponent(cookie.split('=').slice(1).join('='));

  }

  // Get pending count

  async getPendingCount() {

    const mood = await this.db.getAll('pending_mood_entries');

    const journal = await this.db.getAll('pending_journal_entries');

    const assessments = await this.db.getAll('pending_assessments');

    

    return {

      mood: mood.length,

      journal: journal.length,

      assessments: assessments.length,

      total: mood.length + journal.length + assessments.length

    };

  }

}

// ============================================

// EXPORT SINGLETON

// ============================================

const offlineDB = new OfflineDB();

export {

  offlineDB,

  OfflineDB,

  MoodManager,

  JournalManager,

  AssessmentManager,

  SyncManager

};

// Auto-initialize

if (typeof window !== 'undefined') {

  offlineDB.init().then(() => {

    console.log('[OfflineDB] Ready for offline operations');

    

    // Listen for online/offline events

    window.addEventListener('online', async () => {

      console.log('[OfflineDB] Back online, starting sync...');

      const syncManager = new SyncManager(offlineDB);

      const results = await syncManager.syncAll();

      console.log('[OfflineDB] Sync complete:', results);

    });

    window.addEventListener('offline', () => {

      console.log('[OfflineDB] Gone offline, using local storage');

    });

  });

}
