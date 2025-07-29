import { Tabs } from 'expo-router';

import { FontAwesome5, FontAwesome6, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Fontisto name="home" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="pray" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome6 name="users" color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="list-alt" color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
