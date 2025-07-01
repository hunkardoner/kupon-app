import React, { createContext, useContext, useState } from 'react';

interface ProfileStatsContextType {
  refreshProfileStats: () => void;
  registerStatsRefresh: (callback: () => void) => void;
  unregisterStatsRefresh: (callback: () => void) => void;
}

const ProfileStatsContext = createContext<ProfileStatsContextType | null>(null);

export function ProfileStatsProvider({ children }: { children: React.ReactNode }) {
  const [refreshCallbacks, setRefreshCallbacks] = useState<(() => void)[]>([]);

  const registerStatsRefresh = (callback: () => void) => {
    setRefreshCallbacks(prev => [...prev, callback]);
  };

  const unregisterStatsRefresh = (callback: () => void) => {
    setRefreshCallbacks(prev => prev.filter(cb => cb !== callback));
  };

  const refreshProfileStats = () => {
    refreshCallbacks.forEach(callback => callback());
  };

  return (
    <ProfileStatsContext.Provider
      value={{
        refreshProfileStats,
        registerStatsRefresh,
        unregisterStatsRefresh,
      }}
    >
      {children}
    </ProfileStatsContext.Provider>
  );
}

export function useProfileStats() {
  const context = useContext(ProfileStatsContext);
  if (!context) {
    throw new Error('useProfileStats must be used within a ProfileStatsProvider');
  }
  return context;
}
