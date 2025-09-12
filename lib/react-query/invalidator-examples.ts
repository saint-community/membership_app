import { useGlobalInvalidator, globalInvalidator } from './query-client';

// Example 1: Using the hook in a React component
export const ExampleComponent = () => {
  const { invalidateByKey, invalidateByUrl, invalidateMultiple } = useGlobalInvalidator();

  const handleRefreshMembers = () => {
    // Invalidate using URL constant key
    invalidateByUrl('THIS_MEMBER');
  };

  const handleRefreshPrayers = () => {
    // Invalidate using custom query key
    invalidateByKey('prayers');
  };

  const handleRefreshMultiple = () => {
    // Invalidate multiple queries at once
    invalidateMultiple(['THIS_MEMBER', 'PRAYER_MEETINGS', 'custom-key']);
  };

  return null; // Component implementation...
};

// Example 2: Using outside React components (in services, utilities, etc.)
export const someApiService = {
  updateMember: async (memberId: string, data: any) => {
    // Make API call...
    const response = await fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Invalidate related queries after successful update
      globalInvalidator.invalidateMultiple(['THIS_MEMBER', 'MEMBER']);
    }

    return response.json();
  },

  deleteMember: async (memberId: string) => {
    // Make API call...
    const response = await fetch(`/api/members/${memberId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Invalidate members list
      globalInvalidator.invalidateByUrl('THIS_MEMBER');
    }

    return response.json();
  },

  // Use in background sync operations
  syncAllData: async () => {
    try {
      // Sync data with server...
      // TODO: Implement actual server sync logic
      const syncWithServer = async () => {
        // Add your sync implementation here
        return Promise.resolve();
      };

      await syncWithServer();

      // Invalidate all cached data to refetch fresh data
      globalInvalidator.invalidateAll();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  },
};

// Example 3: Custom hook that uses the invalidator
export const useRefreshData = () => {
  const { invalidateMultiple } = useGlobalInvalidator();

  return {
    refreshMemberData: () => invalidateMultiple(['THIS_MEMBER', 'MEMBER']),
    refreshPrayerData: () => invalidateMultiple(['PRAYER_MEETINGS', 'PRAYER_PARTICIPANTS']),
    refreshStudyData: () => invalidateMultiple(['STUDY_GROUPS', 'SUBMISSIONS']),
  };
};
