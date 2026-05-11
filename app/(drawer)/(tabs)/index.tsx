import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Header } from '~/components/Header';
import { MetricsGrid } from '~/components/MetricsGrid';
import { QuickActions } from '~/components/QuickActions';
import { useCallback } from 'react';
import { useMe } from '~/hooks/data/me';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { useSubmissionStats } from '~/hooks/queries/submissions/useSubmissionStats';
import type { MetricData, ActionData } from '~/types/dashboard';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';
import { useColors } from '~/lib/useColorScheme';

export default function Home() {
  const router = useRouter();
  const colors = useColors();
  const { data: me, refetch: refetchMe } = useMe();
  const { data: submissionStats, error, refetch: refetchSubmissionStats } = useSubmissionStats();
  const { data: membersData, refresh: refreshMembers } = useGetAllMembers();

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchMe(), refetchSubmissionStats(), refreshMembers()]);
  }, [refetchMe, refetchSubmissionStats, refreshMembers]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    minimumRefreshDuration: 800,
  });

  // Sample data for metrics
  const metrics: MetricData[] = [
    {
      icon: <Ionicons name="people" size={24} color="#FF6B9D" />,
      value: membersData?.data?.length || 0,
      label: 'Total Members',
      onPress: () => console.log('Total Members pressed'),
    },
    {
      icon: <FontAwesome5 name="pray" size={24} color="#FFD93D" />,
      value: '0/4',
      label: 'Prayer Meeting',
      onPress: () => console.log('Prayer Meeting pressed'),
    },
    {
      icon: <Ionicons name="book" size={24} color="#FF6B6B" />,
      value: submissionStats?.total_submissions,
      label: 'Study Group',
      onPress: () => console.log('Study Group pressed'),
    },
    {
      icon: <MaterialIcons name="list-alt" color="#4ECDC4" size={24} />,
      value: '0',
      label: 'Reports Submitted',
      onPress: () => console.log('Reports Submitted pressed'),
    },
  ];

  // Sample data for quick actions
  const actions: ActionData[] = [
    {
      icon: <FontAwesome5 name="pray" size={24} color="#FFD93D" />,
      title: 'Mark Prayer Meeting Attendance',
      subtitle: 'Weekly prayer group/vigils',
      onPress: () => router.push('/prayer'),
    },
    {
      icon: <Ionicons name="book" size={24} color="#FF6B6B" />,
      title: 'Submit Study Group Assignment',
      subtitle: 'Blessed in Christ Kingdom Track 1',
      onPress: () => router.push('/study'),
    },
    {
      icon: <Ionicons name="people" size={24} color="#FF6B9D" />,
      title: 'Add a Member',
      subtitle: 'Add a member to your already existing list',
      onPress: () => router.push('/add-member'),
    },
  ];

  return (
    <View className="py-safe flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.background}
          />
        }>
        <Header
          userName={me?.first_name}
          notificationCount={1}
          onNotificationPress={() => router.push('/notifications')}
          onProfilePress={() => router.push('/profile-option')}
        />
        <MetricsGrid metrics={metrics} />
        <QuickActions actions={actions} />
      </ScrollView>
    </View>
  );
}
