import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Settings, History, Star, Bell } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, profile, updateProfile } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');

  const handleUpdateProfile = async () => {
    await updateProfile({ full_name: fullName });
    setIsEditing(false);
  };

  if (!user || !profile) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className={`rounded-lg shadow-xl ${
        isDarkMode ? 'bg-[#1E2A3B]' : 'bg-white'
      } p-8`}>
        <div className="flex items-center space-x-6 mb-8">
          <img
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name || user.email}`}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? 'bg-[#0D1B2A] border-[#17BEBB]'
                      : 'bg-gray-50 border-[#5D87FF]'
                  } border focus:ring-2 focus:ring-opacity-50`}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateProfile}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      isDarkMode
                        ? 'bg-[#17BEBB] text-white'
                        : 'bg-[#5D87FF] text-white'
                    }`}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{profile.full_name || 'Anonymous User'}</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`mt-2 px-4 py-2 rounded-lg text-sm ${
                    isDarkMode
                      ? 'bg-[#0D1B2A] hover:bg-[#17BEBB] hover:bg-opacity-20'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-[#0D1B2A]' : 'bg-gray-50'
          }`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <History className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                <span>Saved 3 new predictions</span>
              </div>
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-blue-500" />
                <span>Updated notification preferences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};