import { View, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { cn } from '~/lib/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TabBar = ({
  tab,
  setTab,
}: {
  tab: 'assignments' | 'submissions';
  setTab: (t: 'assignments' | 'submissions') => void;
}) => {
  const assignmentsScale = useSharedValue(1);
  const submissionsScale = useSharedValue(1);

  useEffect(() => {
    assignmentsScale.value = withTiming(tab === 'assignments' ? 1.05 : 1, { duration: 200 });
    submissionsScale.value = withTiming(tab === 'submissions' ? 1.05 : 1, { duration: 200 });
  }, [tab]);

  const assignmentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: assignmentsScale.value }],
  }));

  const submissionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submissionsScale.value }],
  }));
  console.log('tab', tab);

  return (
    <View className="mb-4 flex-row p-1">
      <AnimatedPressable
        onPress={() => setTab('assignments')}
        style={assignmentStyle}
        className="flex-1 py-2">
        <Text
          className={cn(
            'text-center text-base font-medium',
            tab === 'assignments' ? 'text-white' : 'text-gray-300'
          )}>
          Weekly Assignments
        </Text>
        {tab === 'assignments' && (
          <View
            className="absolute bottom-0 flex
           w-[100%] items-center rounded-full">
            <View
              className=" h-[3px] w-[40%] justify-center
           rounded-full bg-pink-600"
            />
          </View>
        )}
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => setTab('submissions')}
        style={submissionStyle}
        className="flex-1 py-2">
        <Text
          className={cn(
            'text-center text-base font-medium',
            tab === 'submissions' ? 'text-white' : 'text-gray-300'
          )}>
          Submissions
        </Text>
        {tab === 'submissions' && (
          <View
            className="absolute bottom-0 flex
           w-[100%] items-center rounded-full">
            <View
              className=" h-[3px] w-[40%] justify-center
           rounded-full bg-pink-600"
            />
          </View>
        )}
      </AnimatedPressable>
    </View>
  );
};

export default TabBar;
