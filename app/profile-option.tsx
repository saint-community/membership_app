import React from 'react';
import { Text, Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/lib/useColorScheme';
import { useMe } from '@/hooks/data/me';
import { logoutUser } from '@/services/api/auth';
import { clearStorage } from '@/utils';
import { Header } from '@/components/Header';

interface ProfileOptionItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function ProfileOptionItem({ icon, title, onPress, showChevron = true }: ProfileOptionItemProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="flex-row items-center px-6 py-5 border-b border-border/30">
      <View className="mr-4 w-10 h-10 items-center justify-center rounded-xl bg-input/20 border border-border/40">
        {React.cloneElement(icon as React.ReactElement, { size: 18, color: colors.foreground })}
      </View>
      <Text className="flex-1 text-base font-inter font-semibold text-foreground">{title}</Text>
      {showChevron && <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

export default function ProfileOption() {
  const router = useRouter();
  const colors = useColors();
  const { data: me } = useMe();

  const logOutAction = () => {
    logoutUser();
    router.replace('/(login)/login');
    clearStorage();
  };

  const logOut = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logOutAction, style: 'destructive' },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <Header title="Account" />
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          activeOpacity={0.7}
          className="mx-6 my-8 flex-row items-center p-6 rounded-[32px] bg-primary/5 border border-primary/10">
          <View className="relative">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              }}
              className="mr-5 h-20 w-20 rounded-full border-4 border-white shadow-xl"
            />
            <View className="absolute bottom-0 right-5 w-6 h-6 bg-primary rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="camera" size={12} color="white" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-poppins font-bold text-foreground">
              {me?.first_name} {me?.last_name}
            </Text>
            <Text className="text-sm font-inter text-muted-foreground mt-1 opacity-70">{me?.email}</Text>
            <View className="bg-primary/10 self-start px-3 py-1 rounded-full mt-3">
              <Text className="text-[10px] font-poppins font-bold text-primary uppercase">Community Member</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        <View className="px-6 mb-2">
          <Text className="text-xs font-inter font-bold text-muted-foreground uppercase tracking-[2px] opacity-60">Preferences</Text>
        </View>

        {/* Profile Options */}
        <View className="flex-1">
          <ProfileOptionItem
            icon={<Ionicons name="lock-closed-outline" />}
            title="Change Password"
            onPress={() => router.push('/change-password')}
          />
          <ProfileOptionItem
            icon={<Ionicons name="settings-outline" />}
            title="Settings"
            onPress={() => router.push('/settings')}
          />
          <ProfileOptionItem
            icon={<Ionicons name="notifications-outline" />}
            title="Notifications"
            onPress={() => router.push('/notifications')}
          />
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-12 mb-8">
          <TouchableOpacity 
            onPress={logOut} 
            activeOpacity={0.6}
            className="flex-row items-center justify-center p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
          >
            <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
            <Text className="ml-3 text-base font-poppins font-bold text-destructive">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
