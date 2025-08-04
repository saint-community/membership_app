import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Header } from '~/components/Header';
import { MetricsGrid } from '~/components/MetricsGrid';
import { QuickActions } from '~/components/QuickActions';
import type { MetricData, ActionData } from '~/types/dashboard';

export default function Home() {
  const router = useRouter();
  // Sample data for metrics
  const metrics: MetricData[] = [
    {
      icon: <Ionicons name="people" size={24} color="#FF6B9D" />,
      value: '158',
      label: 'Total Members',
      onPress: () => console.log('Total Members pressed'),
    },
    {
      icon: <FontAwesome5 name="pray" size={24} color="#FFD93D" />,
      value: '2/4',
      label: 'Prayer Meeting',
      onPress: () => console.log('Prayer Meeting pressed'),
    },
    {
      icon: <Ionicons name="book" size={24} color="#FF6B6B" />,
      value: '3/4',
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
      onPress: () => console.log('Mark Prayer Meeting Attendance pressed'),
    },
    {
      icon: <Ionicons name="book" size={24} color="#FF6B6B" />,
      title: 'Submit Study Group Assignment',
      subtitle: 'Blessed in Christ Kingdom Track 1',
      onPress: () => console.log('Submit Study Group Assignment pressed'),
    },
    {
      icon: <Ionicons name="people" size={24} color="#FF6B9D" />,
      title: 'Add a Member',
      subtitle: 'Add a member to your already existing list',
      onPress: () => console.log('Add a Member pressed'),
    },
  ];

  return (
    <View className="py-safe flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Header
          userName="Temitope"
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
