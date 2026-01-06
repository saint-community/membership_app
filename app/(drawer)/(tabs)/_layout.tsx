import { Tabs } from 'expo-router';
import { StyleSheet, Animated, View, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Feather, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useColors } from '~/lib/useColorScheme';

const AnimatedTabIcon = ({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) => {
  const colors = useColors();
  const translateY = new Animated.Value(focused ? (Platform.OS === 'web' ? -30 : -18) : 0);
  const scale = new Animated.Value(focused ? 1.1 : 1);
  const cutoutOpacity = new Animated.Value(focused ? 1 : 0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: focused ? (Platform.OS === 'web' ? -30 : -18) : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(cutoutOpacity, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  return (
    <View style={styles.tabContainer}>
      {/* SVG cutout with rounded outer edges */}
      <Animated.View
        style={[
          styles.cutoutContainer,
          {
            opacity: cutoutOpacity,
          },
        ]}>
        <Svg width="90" height="45" style={styles.svgCutout} viewBox="0 0 90 45">
          <Path d="M90 0C73 0 87.5 45 45 45C2.5 45 17.5 0 0 0H90Z" fill={colors.background} />
        </Svg>
      </Animated.View>

      {/* Icon container */}
      <Animated.View
        style={[
          styles.iconContainer,
          focused && styles.activeIconContainer,
          {
            transform: [{ translateY }, { scale }],
          },
        ]}>
        {children}
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const colors = useColors();
  const notActiveColor = '#666666';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: colors.foreground,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 24,
        },
        tabBarBackground: () => (
          <View
            className="bg-tab-bar-background flex-1"
            style={{ backgroundColor: colors.tabBarBackground }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Feather name="home" color={focused ? 'white' : notActiveColor} size={24} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <FontAwesome5 name="pray" color={focused ? 'white' : notActiveColor} size={24} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <Ionicons name="book-outline" color={focused ? 'white' : notActiveColor} size={24} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <FontAwesome6 name="users" color={focused ? 'white' : notActiveColor} size={24} />
            </AnimatedTabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused}>
              <MaterialIcons name="list-alt" color={focused ? 'white' : notActiveColor} size={24} />
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  cutoutContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? -5 : 1,
    left: -15,
    width: 90,
    height: 45,
    zIndex: 1,
  },
  svgCutout: {
    position: 'absolute',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  activeIconContainer: {
    backgroundColor: '#e91e63',
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
