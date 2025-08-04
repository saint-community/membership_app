import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useEffect, useState, useRef } from 'react';

interface NotificationItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  iconBackgroundColor: string;
}

function NotificationItem({ icon, title, time, iconBackgroundColor }: NotificationItemProps) {
  return (
    <TouchableOpacity className="mb-3 flex-row items-center rounded-lg bg-gray-800 px-4 py-4">
      <View
        className={`mr-3 h-8 w-8 items-center justify-center rounded-full`}
        style={{ backgroundColor: iconBackgroundColor }}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-white">{title}</Text>
        <Text className="text-sm text-gray-400">{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

interface SwipeOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
  direction: 'left' | 'right';
}

function SwipeOverlay({ isVisible, onDismiss, direction }: SwipeOverlayProps) {
  const { width, height } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(direction === 'left' ? width : -width)).current;
  const fingerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      // Start the finger animation
      const fingerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(fingerScale, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(fingerScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      // Start the slide animation
      const slideAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(slideAnim, {
            toValue: direction === 'left' ? -width * 0.3 : width * 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: direction === 'left' ? width : -width,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(500),
        ])
      );

      fingerAnimation.start();
      slideAnimation.start();

      return () => {
        fingerAnimation.stop();
        slideAnimation.stop();
      };
    }
  }, [isVisible, slideAnim, fingerScale, width, direction]);

  if (!isVisible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onDismiss}
      className="absolute inset-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      {/* Finger icon with animation */}
      <Animated.View
        style={{
          position: 'absolute',
          top: height * 0.35,
          [direction === 'left' ? 'right' : 'left']: 50,
          transform: [{ translateX: slideAnim }, { scale: fingerScale }],
        }}>
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

export default function Notifications() {
  const router = useRouter();
  const [showSwipeLeftOverlay, setShowSwipeLeftOverlay] = useState(true);
  const [showSwipeRightOverlay, setShowSwipeRightOverlay] = useState(false);

  const handleDismissLeftOverlay = () => {
    setShowSwipeLeftOverlay(false);
    setShowSwipeRightOverlay(true);
  };

  const handleDismissRightOverlay = () => {
    setShowSwipeRightOverlay(false);
  };

  const notifications = [
    {
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Prayer attendance marked',
      time: '2 hours ago',
      iconBackgroundColor: '#FFD93D',
    },
    {
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Prayer attendance marked',
      time: '2 hours ago',
      iconBackgroundColor: '#FFD93D',
    },
    {
      icon: <Ionicons name="book" size={16} color="white" />,
      title: 'Blessed in Christ Kingdom Track 1 submitted',
      time: '2 hours ago',
      iconBackgroundColor: '#FF6B6B',
    },
    {
      icon: <Ionicons name="book" size={16} color="white" />,
      title: 'Blessed in Christ Kingdom Track 1 submitted',
      time: '2 hours ago',
      iconBackgroundColor: '#FF6B6B',
    },
    {
      icon: <Ionicons name="people" size={16} color="white" />,
      title: 'John Doe successfully added as a member',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FF6B9D',
    },
    {
      icon: <Ionicons name="people" size={16} color="white" />,
      title: 'John Doe successfully added as a member',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FF6B9D',
    },
    {
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Upcoming prayer vigil: 10:00PM, 12/03/2025',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FFD93D',
    },
    {
      icon: <FontAwesome5 name="pray" size={16} color="white" />,
      title: 'Upcoming prayer vigil: 10:00PM, 12/03/2025',
      time: '10:00PM, Monday 2 July, 2026',
      iconBackgroundColor: '#FFD93D',
    },
  ];

  return (
    <View className="pt-safe flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">Notifications</Text>
          <TouchableOpacity>
            <Text className="text-base text-red-400">Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <View className="px-4">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              icon={notification.icon}
              title={notification.title}
              time={notification.time}
              iconBackgroundColor={notification.iconBackgroundColor}
            />
          ))}
        </View>
      </ScrollView>

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
    </View>
  );
}
