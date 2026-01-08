import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useColors } from '~/lib/useColorScheme';
import { useMe } from '~/hooks/data/me';
import { useUpdateProfile } from '~/hooks/mutations/auth/useUpdateProfile';
import { UpdateProfileRequest } from '~/services/api/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';

interface EditableFieldProps {
  label: string;
  value: string;
  onPress: () => void;
  noEdit?: boolean;
}

function EditableField({ label, value, onPress, noEdit = false }: EditableFieldProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4 flex-row items-center justify-between rounded-lg bg-white px-4 py-4 dark:bg-gray-800">
      <View className="">
        <Text className="text-base ">{value || 'Not set'}</Text>
        <Text className="mb-1 text-sm text-gray-400">{label}</Text>
      </View>
      {!noEdit && <FontAwesome6 name="pencil" size={16} color={colors.primary} />}
    </TouchableOpacity>
  );
}

interface BottomSheetModalProps {
  isVisible: boolean;
  title: string;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}

function BottomSheetModal({
  isVisible,
  title,
  value,
  onClose,
  onSave,
  multiline = false,
  keyboardType = 'default',
}: BottomSheetModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputValue, setInputValue] = useState(value);
  const colors = useColors();

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
      setInputValue(value);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, value]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  const snapPoints = React.useMemo(() => ['40%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
    []
  );

  const isPhoneField = keyboardType === 'phone-pad' && title.toLowerCase().includes('phone');

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.foreground }}
      backdropComponent={renderBackdrop}>
      <BottomSheetView className="flex-1 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-base text-destructive-foreground">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold ">{title}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-base text-accent">Save</Text>
          </TouchableOpacity>
        </View>

        {isPhoneField ? (
          <PhoneNumberInput
            value={inputValue}
            onChange={setInputValue}
            placeholder={`Enter ${title.toLowerCase()}`}
          />
        ) : (
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={`Enter ${title.toLowerCase()}`}
            placeholderTextColor="#9CA3AF"
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
            className="rounded-lg bg-white px-4 py-3 dark:bg-gray-700 dark:text-white"
            autoFocus
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const colors = useColors();
  const { data: me, isLoading: userLoading, error } = useMe();
  const { isLoading, onSubmit: submitToAPI } = useUpdateProfile();


  const [formInitialized, setFormInitialized] = useState(false);
  const [modalState, setModalState] = useState<{
    isVisible: boolean;
    title: string;
    field: string;
    multiline?: boolean;
    keyboardType?: 'default' | 'phone-pad' | 'email-address';
  }>({
    isVisible: false,
    title: '',
    field: '',
    multiline: false,
    keyboardType: 'default',
  });

  // Zod schema for form validation - following editMemberForm pattern
  const profileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    phone_number: z.string().optional(),
    house_address: z.string().optional(),
    work_address: z.string().optional(),
    facebook_username: z.string().optional(),
    twitter_username: z.string().optional(),
    instagram_username: z.string().optional(),
    profile_image: z.string().optional(),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(profileSchema),
  });

  const [profileData, setProfileData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    house_address: '',
    work_address: '',
    facebook_username: '',
    twitter_username: '',
    instagram_username: '',
    profile_image: '',
  });

  // Populate form with user data when loaded - following editMemberForm pattern
  useEffect(() => {
    if (me && !formInitialized) {
      console.log('Populating form with user data:', me);

      const initialData: ProfileFormData = {
        first_name: me.first_name || '',
        last_name: me.last_name || '',
        phone_number: me.phone_number || '',
        house_address: me.house_address || '',
        work_address: me.work_address || '',
        facebook_username: me.facebook_username || '',
        twitter_username: me.twitter_username || '',
        instagram_username: me.instagram_username || '',
        profile_image: me.profile_image_url || '',
      };

      reset(initialData);
      setProfileData(initialData);
      setFormInitialized(true);
    }
  }, [me, reset, formInitialized]);

  const onSubmit = useCallback(
    (data: ProfileFormData) => {
      console.log('Form submitting with data:', data);

      // Transform the form data to match API contract - following editMemberForm pattern
      const apiData: UpdateProfileRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        house_address: data.house_address,
        work_address: data.work_address,
        facebook_username: data.facebook_username,
        twitter_username: data.twitter_username,
        instagram_username: data.instagram_username,
        profile_image_url: data.profile_image,
      };

      console.log('API data being sent:', apiData);
      submitToAPI(apiData);
    },
    [submitToAPI]
  );

  // Image picker functions
  const pickImageFromLibrary = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to change your profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image:', imageUri);
        
       
     
          // Create FormData object for image upload
          const formData = new FormData();
          formData.append('profile_image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg'
          } as any);

          
          
          
            // Submit form with new data
            submitToAPI(formData);
          }
        
      
    } catch (error) {
      console.error('Error picking image from library:', error);
      Alert.alert('Error', 'Failed to select image from library');
    }
  }, [profileData, reset, onSubmit]);

  const takePhoto = useCallback(async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please grant camera permission to take a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Captured image:', imageUri);
      
          // Create FormData object for image upload
          const formData = new FormData();
          formData.append('profile_image', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg'
          } as any);

          
          
          
            // Submit form with new data
            submitToAPI(formData);
        
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  }, [profileData, reset, onSubmit]);

  const showImagePicker = useCallback(() => {
    Alert.alert(
      'Select Profile Image',
      'Choose how you would like to select your profile image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImageFromLibrary },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }, [takePhoto, pickImageFromLibrary]);

  const openModal = useCallback(
    (
      title: string,
      field: string,
      multiline: boolean = false,
      keyboardType: 'default' | 'phone-pad' | 'email-address' = 'default'
    ) => {
      setModalState({
        isVisible: true,
        title,
        field,
        multiline,
        keyboardType,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState({
      isVisible: false,
      title: '',
      field: '',
      multiline: false,
      keyboardType: 'default',
    });
  }, []);

  const handleSave = useCallback(
    (value: string) => {
      console.log('Field updated:', modalState.field, 'New value:', value);

      const updated = {
        ...profileData,
        [modalState.field]: value,
      };

      setProfileData(updated);
      // Update form values as well
      reset(updated);

      onSubmit(updated);
    },
    [modalState.field, reset, onSubmit, profileData, handleSubmit]
  );

  const getCurrentValue = () => {
    return profileData[modalState.field as keyof typeof profileData] || '';
  };

  // Show loading until we have data AND form is populated
  if (userLoading && !formInitialized) {
    return (
      <View className="pt-safe flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-white" />
        <Text className="mt-2 text-gray-400">Loading profile...</Text>
      </View>
    );
  }

  // Show error if data fetch failed
  if (error) {
    return (
      <View className="pt-safe flex-1 items-center justify-center bg-background">
        <Text className="text-red-500">Failed to load profile data</Text>
        <Text className="mt-2 dark:text-gray-400">{error?.message || 'Please try again'}</Text>
      </View>
    );
  }

  return (
    <View className="pt-safe flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">Edit Profile</Text>
          <View className="w-6" />
        </View>

        {/* Profile Image */}
        <View className="mb-8 items-center">
          <TouchableOpacity 
            onPress={showImagePicker} 
            disabled={isLoading}
            className="relative"
          >
            <Image
              source={{
                uri:
                  profileData.profile_image ||
                  me?.profile_image_url ||
                  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              }}
              className="h-24 w-24 rounded-full bg-gray-300"
            />
            
            {/* Upload indicator overlay */}
            {isLoading && (
              <View className="absolute inset-0 h-24 w-24 rounded-full bg-black/50 items-center justify-center">
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
            
            {/* Camera icon button */}
            <View className="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-2">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="mt-2 text-base">{`${profileData.first_name} ${profileData.last_name}`}</Text>
          <Text className="text-sm text-gray-400">{me?.email}</Text>
        </View>

        {/* Read-only Fields */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-semibold">Profile Information</Text>
          <EditableField
            label="First Name"
            value={profileData.first_name}
            onPress={() => openModal('First Name', 'first_name')}
          />

          <EditableField
            label="Last Name"
            value={profileData.last_name}
            onPress={() => openModal('Last Name', 'last_name')}
          />

          <EditableField label="Gender" value={me?.gender || 'Not set'} onPress={() => {}} noEdit />

          <EditableField label="Status" value={me?.status || 'Not set'} onPress={() => {}} noEdit />

          <EditableField label="Email" value={me?.email || 'Not set'} onPress={() => {}} noEdit />

          <EditableField
            label="Church"
            value={me?.church_name || 'Not set'}
            onPress={() => {}}
            noEdit
          />

          <EditableField
            label="Fellowship"
            value={me?.fellowship_name || 'Not set'}
            onPress={() => {}}
            noEdit
          />

          <EditableField
            label="Cell"
            value={me?.cell_name || 'Not set'}
            onPress={() => {}}
            noEdit
          />
        </View>

        {/* Editable Fields */}

        <EditableField
          label="Phone Number"
          value={profileData.phone_number || ''}
          onPress={() => openModal('Phone Number', 'phone_number', false, 'phone-pad')}
        />

        <EditableField
          label="Home Address"
          value={profileData.house_address || ''}
          onPress={() => openModal('Home Address', 'house_address', true)}
        />

        <EditableField
          label="Work Address"
          value={profileData.work_address || ''}
          onPress={() => openModal('Work Address', 'work_address', true)}
        />

        <EditableField
          label="Facebook Username"
          value={profileData.facebook_username || ''}
          onPress={() => openModal('Facebook Username', 'facebook_username')}
        />

        <EditableField
          label="Twitter Username"
          value={profileData.twitter_username || ''}
          onPress={() => openModal('Twitter Username', 'twitter_username')}
        />

        <EditableField
          label="Instagram Username"
          value={profileData.instagram_username || ''}
          onPress={() => openModal('Instagram Username', 'instagram_username')}
        />
      </ScrollView>

      <BottomSheetModal
        isVisible={modalState.isVisible}
        title={modalState.title}
        value={getCurrentValue()}
        onClose={closeModal}
        onSave={handleSave}
        multiline={modalState.multiline}
        keyboardType={modalState.keyboardType}
      />
    </View>
  );
}
