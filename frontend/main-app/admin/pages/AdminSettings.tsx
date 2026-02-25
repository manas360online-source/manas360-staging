import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/apiClient-unified';

interface MFASetupState {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  mfaCode: string;
  step: 'idle' | 'generating' | 'verifying' | 'complete';
}

interface MFAStatus {
  mfaEnabled: boolean;
  email: string;
}

export const AdminSettings: React.FC = () => {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [mfaSetup, setMfaSetup] = useState<MFASetupState>({
    secret: '',
    qrCode: '',
    backupCodes: [],
    mfaCode: '',
    step: 'idle'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [disableMfaMode, setDisableMfaMode] = useState(false);

  useEffect(() => {
    fetchMfaStatus();
  }, []);

  const fetchMfaStatus = async () => {
    try {
      const response = await api.admin.getMfaStatus();
      setMfaStatus(response?.data?.data || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch MFA status');
    }
  };

  const handleGenerateMfaSecret = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    setMfaSetup(prev => ({ ...prev, step: 'generating' }));

    try {
      const response = await api.admin.generateMfaSecret();
      const { secret, qrCode, backupCodes } = response?.data?.data || {};

      setMfaSetup({
        secret: secret || '',
        qrCode: qrCode || '',
        backupCodes: backupCodes || [],
        mfaCode: '',
        step: 'verifying'
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to generate MFA secret');
      setMfaSetup(prev => ({ ...prev, step: 'idle' }));
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    if (!mfaSetup.mfaCode.trim()) {
      setError('Please enter the 6-digit code from your authenticator app');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.admin.enableMfa({
        secret: mfaSetup.secret,
        mfaCode: mfaSetup.mfaCode
      });

      setSuccessMessage('✓ MFA enabled successfully!');
      setMfaSetup(prev => ({ ...prev, step: 'complete' }));
      setShowBackupCodes(true);
      
      // Refresh MFA status
      setTimeout(fetchMfaStatus, 500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to enable MFA. Check code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!window.confirm('Are you sure you want to disable MFA? You can re-enable it anytime from settings.')) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.admin.disableMfa({});
      setSuccessMessage('✓ MFA disabled successfully');
      setDisableMfaMode(false);
      setTimeout(fetchMfaStatus, 500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMfaSetup({
      secret: '',
      qrCode: '',
      backupCodes: [],
      mfaCode: '',
      step: 'idle'
    });
    setError('');
    setSuccessMessage('');
    setShowBackupCodes(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account security and preferences</p>
        </div>

        {/* MFA Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6 border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🔐 Two-Factor Authentication (MFA)
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Add an extra layer of security to your admin account
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold text-white ${
              mfaStatus?.mfaEnabled ? 'bg-green-500' : 'bg-amber-500'
            }`}>
              {mfaStatus?.mfaEnabled ? '✓ Enabled' : '⚠ Not Set'}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
            </div>
          )}

          {/* MFA Not Enabled */}
          {!mfaStatus?.mfaEnabled && !disableMfaMode && (
            <div className="space-y-6">
              {mfaSetup.step === 'idle' && (
                <div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Protect your admin account with time-based one-time passwords (TOTP).
                  </p>
                  <button
                    onClick={handleGenerateMfaSecret}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    {loading ? 'Setting up...' : 'Enable MFA'}
                  </button>
                </div>
              )}

              {(mfaSetup.step === 'verifying' || mfaSetup.step === 'complete') && (
                <div className="space-y-6">
                  {/* QR Code Step */}
                  {mfaSetup.step === 'verifying' && (
                    <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Step 1: Scan QR Code
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-4">
                        Use an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.) to scan this QR code:
                      </p>
                      {mfaSetup.qrCode && (
                        <div className="flex justify-center mb-6">
                          <img
                            src={mfaSetup.qrCode}
                            alt="MFA QR Code"
                            className="w-48 h-48 border-4 border-white dark:border-slate-700 rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                      <div className="bg-white dark:bg-slate-700 p-4 rounded border border-slate-300 dark:border-slate-600 mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Or enter this code manually:</p>
                        <p className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all whitespace-normal">
                          {mfaSetup.secret}
                        </p>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                        Step 2: Verify Code
                      </h3>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        value={mfaSetup.mfaCode}
                        onChange={(e) => setMfaSetup(prev => ({
                          ...prev,
                          mfaCode: e.target.value.replace(/[^0-9]/g, '')
                        }))}
                        placeholder="000000"
                        className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white mb-4"
                        disabled={loading}
                        autoFocus
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Enter the 6-digit code from your authenticator app to verify setup
                      </p>

                      <div className="flex gap-3">
                        <button
                          onClick={handleEnableMfa}
                          disabled={loading || mfaSetup.mfaCode.length !== 6}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                          {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                        <button
                          onClick={handleReset}
                          disabled={loading}
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success & Backup Codes */}
                  {mfaSetup.step === 'complete' && showBackupCodes && (
                    <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                      <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4">
                        ✓ MFA Enabled Successfully!
                      </h3>
                      
                      <div className="bg-white dark:bg-slate-700 p-4 rounded border border-slate-300 dark:border-slate-600 mb-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Backup Codes</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          Save these codes in a safe place. Use them if you lose access to your authenticator app:
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded font-mono text-sm text-slate-900 dark:text-white space-y-1">
                          {mfaSetup.backupCodes.map((code, idx) => (
                            <div key={idx}>{code}</div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleReset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MFA Enabled - Disable Option */}
          {mfaStatus?.mfaEnabled && !disableMfaMode && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Your admin account is protected with MFA. A code will be required each time you log in.
                </p>
              </div>
              <button
                onClick={() => setDisableMfaMode(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Disable MFA
              </button>
            </div>
          )}

          {/* Disable MFA Confirmation */}
          {disableMfaMode && (
            <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/20">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-4">⚠ Disable MFA?</h3>
              <p className="text-red-600 dark:text-red-400 mb-6">
                Disabling MFA will reduce your account security. You can re-enable it anytime.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDisableMfa}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {loading ? 'Disabling...' : 'Disable MFA'}
                </button>
                <button
                  onClick={() => setDisableMfaMode(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">ℹ️ Recommended Authenticator Apps</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2">
            <li>• <strong>Google Authenticator</strong> (iOS/Android)</li>
            <li>• <strong>Microsoft Authenticator</strong> (iOS/Android)</li>
            <li>• <strong>Authy</strong> (iOS/Android/Web)</li>
            <li>• <strong>1Password</strong> (iOS/Android/Mac/Windows)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
