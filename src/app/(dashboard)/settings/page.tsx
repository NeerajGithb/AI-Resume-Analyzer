'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'data'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: '',
  });

  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyTips: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Create a mock JSON export
    const data = {
      profile: { name: profile.name, email: profile.email },
      analyses: [],
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ResuPulse-data-export.json';
    a.click();
    setMessage({ type: 'success', text: 'Data exported successfully!' });
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    if (!confirm('Final confirmation: Delete all your data and close your account?')) {
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert('Account deleted. Redirecting to home...');
    router.push('/');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: '👤' },
    { id: 'security' as const, label: 'Security', icon: '🔒' },
    { id: 'preferences' as const, label: 'Preferences', icon: '⚙️' },
    { id: 'data' as const, label: 'Data & Privacy', icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and data</p>
        </div>

        {/* Message banner */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-sm border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{message.type === 'success' ? '✓' : '✗'}</span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm border border-gray-200 p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-violet-50 text-violet-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm border border-gray-200 p-8">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio (Optional)</label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-sm bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-sm bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Email Preferences</h2>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 rounded-sm border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates about your analyses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) =>
                            setPreferences({ ...preferences, emailNotifications: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-violet-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-sm border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Marketing Emails</p>
                        <p className="text-sm text-gray-500">Occasional product updates and offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketingEmails}
                          onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-violet-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-sm border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">Weekly Resume Tips</p>
                        <p className="text-sm text-gray-500">Get expert advice in your inbox</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.weeklyTips}
                          onChange={(e) => setPreferences({ ...preferences, weeklyTips: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-violet-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <button
                      onClick={handlePreferencesUpdate}
                      disabled={loading}
                      className="px-6 py-3 rounded-sm bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'data' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Data & Privacy</h2>
                  <div className="space-y-6">
                    {/* Export data */}
                    <div className="p-5 rounded-sm border border-gray-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-sm bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                          📦
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">Export Your Data</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Download all your account data, including profile information and analysis history, as a
                            JSON file.
                          </p>
                          <button
                            onClick={handleExportData}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-sm bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all"
                          >
                            {loading ? 'Exporting...' : 'Download Data'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete account */}
                    <div className="p-5 rounded-sm border border-red-200 bg-red-50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-sm bg-red-100 flex items-center justify-center text-2xl flex-shrink-0">
                          ⚠️
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-red-900 mb-2">Delete Account</h3>
                          <p className="text-sm text-red-700 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-sm bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-all"
                          >
                            {loading ? 'Processing...' : 'Delete Account'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

