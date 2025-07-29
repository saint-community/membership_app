import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: '#1F1F1F', height: '100%', flexDirection: 'row' }}>
      <View className="w-[310px] flex-1  px-4 py-5">
        <View className="mb-8">
          <View className="mb-3 h-[92px] w-[92px] items-center justify-center rounded-full bg-black">
            <Ionicons name="person" size={52} color="white" />
          </View>
          <Text className="text-lg font-medium text-white">Temitope Sanusi</Text>
          <Text className="text-sm text-gray-400">temitosanusij@gmail.com</Text>
        </View>

        <View className="mt-16 flex-1">
          <View className="">
            <Text className="text-base text-white">Change Password</Text>
          </View>
          <View className="py-8">
            <Text className="text-base text-white">Notifications</Text>
          </View>
          <View className="">
            <Text className="text-base text-white">Settings</Text>
          </View>
        </View>

        <View className="mt-auto w-full  pt-6">
          <View className="flex-row items-center justify-center">
            <View className="mr-3 h-5 w-5">
              <Ionicons name="log-out-outline" size={20} color="red" />
            </View>
            <Text className="text-base font-bold text-red-600">Logout</Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
    </Drawer>
  );
}
