import React, { useState, useEffect } from 'react';

import { offlineDB, SyncManager } from '../lib/offline-db';

const OfflineStatus = () => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [pendingCount, setPendingCount] = useState(0);

  const [isSyncing, setIsSyncing] = useState(false);

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {

    const handleOnline = () => {

      setIsOnline(true);

      setShowBanner(true);

      setTimeout(() => setShowBanner(false), 3000);

    };

    const handleOffline = () => {

      setIsOnline(false);

      setShowBanner(true);

    };

    window.addEventListener('online', handleOnline);

    window.addEventListener('offline', handleOffline);

    // Check pending count periodically

    const checkPending = async () => {

      const syncManager = new SyncManager(offlineDB);

      const count = await syncManager.getPendingCount();

      setPendingCount(count.total);

    };

    checkPending();

    const interval = setInterval(checkPending, 10000);

    return () => {

      window.removeEventListener('online', handleOnline);

      window.removeEventListener('offline', handleOffline);

      clearInterval(interval);

    };

  }, []);

  const handleManualSync = async () => {

    if (!isOnline || isSyncing) return;

    

    setIsSyncing(true);

    try {

      const syncManager = new SyncManager(offlineDB);

      await syncManager.syncAll();

      const count = await syncManager.getPendingCount();

      setPendingCount(count.total);

    } finally {

      setIsSyncing(false);

    }

  };

  if (!showBanner && isOnline && pendingCount === 0) {

    return null;

  }

  return (

    <>

      {/* Offline Banner */}

      {!isOnline && (

        <div 

          className="offline-banner"

          role="alert"

          aria-live="polite"

        >

          <span className="offline-icon" aria-hidden="true">📴</span>

          <span>You're offline. Changes will sync when connected.</span>

        </div>

      )}

      {/* Back Online Banner */}

      {isOnline && showBanner && (

        <div 

          className="online-banner"

          role="status"

          aria-live="polite"

        >

          <span className="online-icon" aria-hidden="true">✅</span>

          <span>You're back online!</span>

        </div>

      )}

      {/* Pending Sync Indicator */}

      {isOnline && pendingCount > 0 && (

        <button

          className="sync-button"

          onClick={handleManualSync}

          disabled={isSyncing}

          aria-label={`Sync ${pendingCount} pending items`}

        >

          <span className="sync-icon" aria-hidden="true">

            {isSyncing ? '⏳' : '🔄'}

          </span>

          <span>{isSyncing ? 'Syncing...' : `${pendingCount} to sync`}</span>

        </button>

      )}

      <style jsx>{`

        .offline-banner {

          position: fixed;

          top: 0;

          left: 0;

          right: 0;

          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);

          color: white;

          padding: 12px 20px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          font-size: 14px;

          font-weight: 500;

          z-index: 9999;

          animation: slideDown 0.3s ease;

        }

        .online-banner {

          position: fixed;

          top: 0;

          left: 0;

          right: 0;

          background: linear-gradient(135deg, #10b981 0%, #059669 100%);

          color: white;

          padding: 12px 20px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          font-size: 14px;

          font-weight: 500;

          z-index: 9999;

          animation: slideDown 0.3s ease;

        }

        .sync-button {

          position: fixed;

          bottom: 80px;

          right: 20px;

          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

          color: white;

          border: none;

          border-radius: 30px;

          padding: 12px 20px;

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 14px;

          font-weight: 500;

          cursor: pointer;

          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

          z-index: 1000;

          transition: all 0.2s ease;

        }

        .sync-button:hover:not(:disabled) {

          transform: translateY(-2px);

          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);

        }

        .sync-button:disabled {

          opacity: 0.7;

          cursor: not-allowed;

        }

        @keyframes slideDown {

          from {

            transform: translateY(-100%);

          }

          to {

            transform: translateY(0);

          }

        }

      `}</style>

    </>

  );

};

export default OfflineStatus;
