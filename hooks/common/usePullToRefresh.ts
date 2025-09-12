import { useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<any>;
  minimumRefreshDuration?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  minimumRefreshDuration = 1000,
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    const startTime = Date.now();

    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumRefreshDuration - elapsedTime);

      // Ensure minimum refresh duration for better UX
      setTimeout(() => {
        setIsRefreshing(false);
      }, remainingTime);
    }
  }, [isRefreshing, onRefresh, minimumRefreshDuration]);

  return {
    isRefreshing,
    onRefresh: handleRefresh,
  };
};
