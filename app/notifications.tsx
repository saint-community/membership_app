import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useColors } from '~/theme/colors';

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  iconBackgroundColor: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

function NotificationItem({
  icon,
  title,
  time,
  iconBackgroundColor,
  onSwipeLeft,
  onSwipeRight,
}: NotificationItemProps) {
  const renderRightActions = () => (
    <TouchableOpacity
      onPress={onSwipeLeft}
      className="flex-1 flex-row items-center justify-end rounded-lg bg-red-500 px-10"
      style={{ width: 80 }}>
      <View className="items-center justify-center">
        <Ionicons name="trash" size={24} color="white" />
        <Text className="text-sm text-white">Delete</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLeftActions = () => (
    <TouchableOpacity
      onPress={onSwipeRight}
      className="flex-1 flex-row items-center justify-start rounded-lg bg-[#C3974D] px-10"
      style={{ width: 80 }}>
      <View className="items-center justify-center">
        <MaterialIcons name="snooze" size={24} color="white" />
        <Text className="text-sm text-white">Snooze</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-3">
      <ReanimatedSwipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        friction={2}
        enableTrackpadTwoFingerGesture
        onSwipeableWillOpen={(direction) => {
          if (direction === 'left' && onSwipeRight) {
            runOnJS(onSwipeRight)();
          } else if (direction === 'right' && onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          }
        }}>
        <View className="flex-row items-center rounded-lg bg-white px-4 py-4 dark:bg-gray-800">
          <View
            className={`mr-3 h-8 w-8 items-center justify-center rounded-full`}
            style={{ backgroundColor: iconBackgroundColor }}>
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium ">{title}</Text>
            <Text className="text-sm text-slate-500 dark:text-gray-400">{time}</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
}

interface SwipeOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  direction: 'left' | 'right';
}

function SwipeOverlay({ isVisible, onDismiss, direction }: SwipeOverlayProps) {
  const { width, height } = Dimensions.get('window');
  const slideAnim = useSharedValue(direction === 'left' ? width : -width);
  const fingerScale = useSharedValue(1);

  useEffect(() => {
    if (isVisible) {
      // Start the finger scale animation
      fingerScale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        false
      );

      // Start the slide animation
      const startSlideAnimation = () => {
        slideAnim.value = direction === 'left' ? width : -width;
        slideAnim.value = withDelay(
          500,
          withRepeat(
            withSequence(
              withTiming(direction === 'left' ? -width * 0.3 : width * 0.3, { duration: 1500 }),
              withTiming(direction === 'left' ? width : -width, { duration: 0 })
            ),
            -1,
            false
          )
        );
      };

      startSlideAnimation();
    } else {
      // Reset animations when not visible
      fingerScale.value = 1;
      slideAnim.value = direction === 'left' ? width : -width;
    }
  }, [isVisible, slideAnim, fingerScale, width, direction]);

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideAnim.value }, { scale: fingerScale.value }],
    };
  });

  if (!isVisible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onDismiss}
      className="absolute inset-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      {/* Finger icon with animation */}
      <Animated.View
        style={[
          slideAnimatedStyle,
          {
            position: 'absolute',
            top: height * 0.35,
            [direction === 'left' ? 'right' : 'left']: 50,
          },
        ]}>
        <View className="items-center">
          <Ionicons
            name={direction === 'left' ? 'hand-left' : 'hand-right'}
            size={40}
            color="#FF007F"
          />
        </View>
      </Animated.View>

      {/* Instructional text */}
      <View className="absolute bottom-40 left-0 right-0 items-center px-8">
        <Text className="text-center text-lg font-medium text-white">
          {direction === 'left'
            ? 'Swipe left to delete notifications'
            : 'Swipe right to snooze notifications'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyNotifications() {
  return (
    <View className="h-full flex-1 items-center justify-center px-8">
      <View className="mb-6 items-center justify-center">
        <View className="relative">
          <MaterialCommunityIcons name="bell-ring-outline" size={100} color="#374151" />
          {/* <View className="absolute -right-2 -top-2">
            <Text className="text-4xl font-bold text-[#FF007F]">Z</Text>
          </View>
          <View className="absolute -top-4 right-2">
            <Text className="text-2xl font-bold text-[#FF007F]">Z</Text>
          </View> */}
        </View>
      </View>
      <Text className="mb-2 text-center text-lg font-medium text-gray-400">
        Nothing new under the sun... uh, in your notifications.
      </Text>
    </View>
  );
}

export default function Notifications() {
  const router = useRouter();
  const [showSwipeLeftOverlay, setShowSwipeLeftOverlay] = useState(true);
  const [showSwipeRightOverlay, setShowSwipeRightOverlay] = useState(false);
  const colors = useColors();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Prayer attendance marked',
      time: '2 hours ago',
      iconBackgroundColor: '#FFD93D',
    },
    {
      id: 2,
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Prayer attendance marked',
      time: '2 hours ago',
      iconBackgroundColor: '#FFD93D',
    },
    {
      id: 3,
      icon: <Ionicons name="book" size={16} color="white" />,
      title: 'Blessed in Christ Kingdom Track 1 submitted',
      time: '2 hours ago',
      iconBackgroundColor: '#FF6B6B',
    },
    {
      id: 4,
      icon: <Ionicons name="book" size={16} color="white" />,
      title: 'Blessed in Christ Kingdom Track 1 submitted',
      time: '2 hours ago',
      iconBackgroundColor: '#FF6B6B',
    },
    {
      id: 5,
      icon: <Ionicons name="people" size={16} color="white" />,
      title: 'John Doe successfully added as a member',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FF6B9D',
    },
    {
      id: 6,
      icon: <Ionicons name="people" size={16} color="white" />,
      title: 'John Doe successfully added as a member',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FF6B9D',
    },
    {
      id: 7,
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Upcoming prayer vigil: 10:00PM, 12/03/2025',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FFD93D',
    },
    {
      id: 8,
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Upcoming prayer vigil: 10:00PM, 12/03/2025',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FFD93D',
    },
  ]);

  const handleDismissLeftOverlay = () => {
    setShowSwipeLeftOverlay(false);
    setShowSwipeRightOverlay(true);
  };

  const handleDismissRightOverlay = () => {
    setShowSwipeRightOverlay(false);
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleSnoozeNotification = (id: number) => {
    // For now, just remove it from the list - in a real app you'd move it to a snoozed state
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <View className="pt-safe flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold ">Notifications</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text className="text-base text-red-400 underline">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List or Empty State */}
        {notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <View className="px-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                icon={notification.icon}
                title={notification.title}
                time={notification.time}
                iconBackgroundColor={notification.iconBackgroundColor}
                onSwipeLeft={() => handleDeleteNotification(notification.id)}
                onSwipeRight={() => handleSnoozeNotification(notification.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {notifications.length > 0 && (
        <>
          <SwipeOverlay
            isVisible={showSwipeLeftOverlay}
            onDismiss={handleDismissLeftOverlay}
            direction="left"
          />
          <SwipeOverlay
            isVisible={showSwipeRightOverlay}
            onDismiss={handleDismissRightOverlay}
            direction="right"
          />
        </>
      )}
    </View>
  );
}
