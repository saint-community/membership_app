import React, { useCallback, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useColors } from '~/lib/useColorScheme';

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
        <Text className="text-base ">{value}</Text>
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
}

function BottomSheetModal({
  isVisible,
  title,
  value,
  onClose,
  onSave,
  multiline = false,
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

        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={`Enter ${title.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          className="rounded-lg bg-white px-4 py-3 dark:bg-gray-700 dark:text-white"
          autoFocus
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const colors = useColors();
  const [modalState, setModalState] = useState<{
    isVisible: boolean;
    title: string;
    field: string;
    multiline?: boolean;
  }>({
    isVisible: false,
    title: '',
    field: '',
    multiline: false,
  });

  const [profileData, setProfileData] = useState({
    firstName: 'Temitope',
    lastName: 'Sanusi',
    gender: 'Male',
    status: 'Worker in Training',
    email: 'temitopesanusi@gmail.com',
    phoneNumber: '+234 XXX XXX XXXX',
    cell: 'Home Unit 5',
    numberOfMembers: 3,
    fellowship: 'Fellowship 5',
    department: 'Department 5',
    dateJoinedChurch: '05 - 04 - 1999',
    church: 'Church 5',
    dateOfBirth: '05 - 04 - 1999',
    address: 'No.6, White Street, Surulere, Ikeja, Lagos',
  });

  const openModal = useCallback((title: string, field: string, multiline: boolean = false) => {
    setModalState({
      isVisible: true,
      title,
      field,
      multiline,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isVisible: false,
      title: '',
      field: '',
      multiline: false,
    });
  }, []);

  const handleSave = useCallback(
    (value: string) => {
      setProfileData((prev) => ({
        ...prev,
        [modalState.field]: value,
      }));
    },
    [modalState.field]
  );

  const getCurrentValue = () => {
    return profileData[modalState.field as keyof typeof profileData] || '';
  };

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
          <Text className="e text-lg font-semibold">Edit Profile</Text>
          <View className="w-6" />
        </View>

        {/* Profile Image */}
        <View className="mb-8 items-center">
          <View className="relative">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              }}
              className="h-24 w-24 rounded-full bg-gray-300"
            />
            <TouchableOpacity className="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-2">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-base">{`${profileData.firstName} ${profileData.lastName}`}</Text>
          <Text className="text-sm text-gray-400">{profileData.email}</Text>
        </View>

        {/* Editable Fields */}
        <View className="gap-0">
          <EditableField
            label="Full name"
            value={`${profileData.firstName} ${profileData.lastName}`}
            onPress={() => openModal('Full Name', 'fullName')}
          />

          <EditableField
            label="Gender"
            value={profileData.gender}
            onPress={() => openModal('Gender', 'gender')}
            noEdit
          />

          <EditableField
            label="Status"
            value={profileData.status}
            onPress={() => openModal('Status', 'status')}
            noEdit
          />

          <EditableField
            label="Email"
            value={profileData.email}
            onPress={() => openModal('Email', 'email')}
            noEdit
          />

          <EditableField
            label="Number of Members"
            value={`${profileData.numberOfMembers}`}
            onPress={() => openModal('Number of Members', 'numberOfMembers')}
            noEdit
          />

          <EditableField
            label="Phone Number"
            value={profileData.phoneNumber}
            onPress={() => openModal('Phone Number', 'phoneNumber')}
          />

          <EditableField
            label="Cell"
            value={profileData.cell}
            onPress={() => openModal('Cell', 'cell')}
          />

          <EditableField
            label="Fellowship"
            value={profileData.fellowship}
            onPress={() => openModal('Fellowship', 'fellowship')}
          />

          <EditableField
            label="Department"
            value={profileData.department}
            onPress={() => openModal('Department', 'department')}
          />

          <EditableField
            label="Date joined Church"
            value={profileData.dateJoinedChurch}
            onPress={() => openModal('Date joined Church', 'dateJoinedChurch')}
            noEdit
          />

          <EditableField
            label="Address"
            value={profileData.address}
            onPress={() => openModal('Address', 'address', true)}
          />

          <EditableField
            label="Date of Birth"
            value={profileData.dateOfBirth}
            onPress={() => openModal('Date of Birth', 'dateOfBirth')}
          />

          <EditableField
            label="Church"
            value={profileData.church}
            onPress={() => openModal('Church', 'church', true)}
          />
        </View>
      </ScrollView>

      <BottomSheetModal
        isVisible={modalState.isVisible}
        title={modalState.title}
        value={getCurrentValue().toString()}
        onClose={closeModal}
        onSave={handleSave}
        multiline={modalState.multiline}
      />
    </View>
  );
}
