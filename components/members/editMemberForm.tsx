import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Text } from '../nativewindui/Text';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateMember } from '~/hooks/mutations/members/useUpdateMember';
import { useDeleteMember } from '~/hooks/mutations/members/useDeleteMember';
import { useGetMember } from '~/hooks/queries/members/useGetMember';
import { DropdownSelect } from '../common/DropdownSelect';
import { DatePicker } from '../common/DatePicker';
import { PhoneNumberInput } from '../common/PhoneNumberInput';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useColors } from '~/lib/useColorScheme';
import { DEPARTMENTS } from '~/utils/constants';

interface EditMemberFormProps {
  memberId: string;
}

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
      onPress={noEdit ? undefined : onPress}
      className="mb-4 flex-row items-center justify-between rounded-lg bg-white px-4 py-4 dark:bg-[#1F1F1F]">
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
  fieldType?: 'text' | 'select' | 'date' | 'phone';
  selectItems?: string[];
}

function BottomSheetModal({
  isVisible,
  title,
  value,
  onClose,
  onSave,
  multiline = false,
  fieldType = 'text',
  selectItems = [],
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

  const renderDatePicker = () => (
    <DatePicker
      value={inputValue}
      onChange={setInputValue}
      placeholder={`Select ${title.toLowerCase()}`}
    />
  );

  const renderSelect = () => (
    <DropdownSelect
      items={selectItems}
      value={inputValue}
      onChange={setInputValue}
      placeholder={`Select ${title.toLowerCase()}`}
    />
  );

  const renderTextInput = () => (
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
  );

  const renderPhoneInput = () => (
    <PhoneNumberInput
      value={inputValue}
      onChange={setInputValue}
      placeholder={`Enter ${title.toLowerCase()}`}
    />
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

        {fieldType === 'date' && renderDatePicker()}
        {fieldType === 'select' && renderSelect()}
        {fieldType === 'phone' && renderPhoneInput()}
        {(fieldType === 'text' || !fieldType) && renderTextInput()}
      </BottomSheetView>
    </BottomSheet>
  );
}

const EditMemberForm = ({ memberId }: EditMemberFormProps) => {
  const colors = useColors();
  const [formInitialized, setFormInitialized] = useState(false);
  const [modalState, setModalState] = useState<{
    isVisible: boolean;
    title: string;
    field: string;
    multiline?: boolean;
    fieldType?: 'text' | 'select' | 'date' | 'phone';
    selectItems?: string[];
  }>({
    isVisible: false,
    title: '',
    field: '',
    multiline: false,
    fieldType: 'text',
    selectItems: [],
  });

  const memberSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    gender: z.string().min(1, 'Gender is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    cell: z.string().optional(),
    fellowship: z.string().optional(),
    department: z.string().optional(),
    dateJoined: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.string().min(1, 'Date of Birth is required'),
    church: z.string().optional(),
  });

  type MemberFormData = z.infer<typeof memberSchema>;

  const { data: memberData, isLoading: memberLoading, error } = useGetMember(memberId);

  console.log(JSON.stringify(memberData, null, 2));

  const { isLoading, onSubmit: submitToAPI } = useUpdateMember();
  const { isLoading: isDeleting, onSubmit: deleteMember } = useDeleteMember();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<MemberFormData>({
    mode: 'onChange',
    resolver: zodResolver(memberSchema),
    // Don't set defaultValues here - we'll reset when data loads
  });

  const [profileData, setProfileData] = useState<{
    fullName: string;
    gender: string;
    email: string;
    phone: string;
    cell: string;
    fellowship: string;
    department: string;
    dateJoined: string;
    address: string;
    dateOfBirth: string;
    church: string;
  }>({
    fullName: '',
    gender: '',
    email: '',
    phone: '',
    cell: '',
    fellowship: '',
    department: '',
    dateJoined: '',
    address: '',
    dateOfBirth: '',
    church: '',
  });

  // Populate form with member data when loaded - proper React Hook Form way
  useEffect(() => {
    if (memberData?.data && !formInitialized) {
      const member = memberData.data;
      console.log('Populating form with member data:', member);

      const initialData = {
        fullName: member.full_name || '',
        gender: member.gender || '',
        email: member.email || '',
        phone: member.phone || '',
        cell: member.cell_id?.toString() || '',
        fellowship: member.fellowship_id?.toString() || '',
        department: '', // Not available in API response
        dateJoined: new Date(member.date_joined_church).toLocaleDateString() || '',
        address: member.address || '',
        dateOfBirth: new Date(member.date_of_birth).toLocaleDateString() || '',
        church: member.church_id?.toString() || '',
      };

      reset(initialData);
      setProfileData(initialData);
      setFormInitialized(true);
    }
  }, [memberData, reset, formInitialized]);

  const openModal = useCallback(
    (
      title: string,
      field: string,
      multiline: boolean = false,
      fieldType: 'text' | 'select' | 'date' | 'phone' = 'text',
      selectItems: string[] = []
    ) => {
      setModalState({
        isVisible: true,
        title,
        field,
        multiline,
        fieldType,
        selectItems,
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
      fieldType: 'text',
      selectItems: [],
    });
  }, []);

  const handleSave = useCallback(
    (value: string) => {
      setProfileData((prev) => {
        const updated = {
          ...prev,
          [modalState.field]: value,
        };

        // Update form values as well
        reset(updated);
        return updated;
      });

      // Auto-submit the form when a field is updated
      setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 100);
    },
    [modalState.field, reset, handleSubmit]
  );

  const getCurrentValue = () => {
    return profileData[modalState.field as keyof typeof profileData] || '';
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const deleteSheetRef = useRef<BottomSheet>(null);

  const handleDeleteConfirmation = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirmation(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirmation(false);
    deleteMember(memberId);
  }, [deleteMember, memberId]);

  const renderBackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} />,
    []
  );

  const onSubmit = (data: MemberFormData) => {
    // Transform the form data to match API contract
    const apiData = {
      full_name: data.fullName,
      phone: data.phone,
      address: data.address,
      church: data.church,
      date_of_birth: data.dateOfBirth,
      date_joined_church: data.dateJoined,
      cell_id: data.cell,
      fellowship_id: data.fellowship,
      department_id: data.department,
    };

    submitToAPI(memberId, apiData);
  };

  // Show loading until we have data AND form is populated
  if (memberLoading && !formInitialized) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <ActivityIndicator size="large" color="#FF007F" />
        <Text className="mt-4 dark:text-white">Loading member data...</Text>
      </View>
    );
  }

  // Show error if data fetch failed
  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500">Failed to load member data</Text>
        <Text className="mt-2 dark:text-gray-400">{error?.message || 'Please try again'}</Text>
      </View>
    );
  }

  return (
    <View className="pt-safe flex-1 ">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
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
          <Text className="mt-2 text-base">{profileData.fullName}</Text>
          <Text className="text-sm text-gray-400">{profileData.email}</Text>
        </View>

        {/* Editable Fields */}
        <View className="gap-0">
          <EditableField
            label="Full name"
            value={profileData.fullName}
            onPress={() => openModal('Full Name', 'fullName')}
          />

          <EditableField
            label="Gender"
            value={profileData.gender}
            onPress={() => openModal('Gender', 'gender', false, 'select', ['Male', 'Female'])}
          />

          <EditableField
            label="Email"
            value={profileData.email}
            onPress={() => openModal('Email', 'email')}
          />

          <EditableField
            label="Phone Number"
            value={profileData.phone}
            onPress={() => openModal('Phone Number', 'phone')}
          />

          {/* <EditableField
            label="Cell"
            value={profileData.cell}
            onPress={() => openModal('Cell', 'cell')}
            noEdit
          /> */}

          {/* <EditableField
            label="Fellowship"
            value={profileData.fellowship}
            onPress={() => openModal('Fellowship', 'fellowship')}
            noEdit
          /> */}

          <EditableField
            label="Department"
            value={profileData.department}
            onPress={() =>
              openModal('Department', 'department', false, 'select', DEPARTMENTS)
            }
          />

          <EditableField
            label="Date joined Church"
            value={profileData.dateJoined}
            onPress={() => openModal('Date joined Church', 'dateJoined', false, 'date')}
          />

          <EditableField
            label="Address"
            value={profileData.address}
            onPress={() => openModal('Address', 'address', true)}
          />

          <EditableField
            label="Date of Birth"
            value={profileData.dateOfBirth}
            onPress={() => openModal('Date of Birth', 'dateOfBirth', false, 'date')}
          />

          {/* <EditableField
            label="Church"
            value={profileData.church}
            onPress={() => openModal('Church', 'church')}
            noEdit
          /> */}
        </View>

        {/* Delete Member Button */}
        <View className="mx-4 mb-8 mt-8">
          <TouchableOpacity
            className="h-12 w-full items-center justify-center rounded-lg bg-red-500"
            onPress={handleDeleteConfirmation}
            disabled={isDeleting}>
            <Text className="text-base font-semibold text-white">
              {isDeleting ? 'Deleting Member...' : 'Delete Member'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomSheetModal
        isVisible={modalState.isVisible}
        title={modalState.title}
        value={getCurrentValue().toString()}
        onClose={closeModal}
        onSave={handleSave}
        multiline={modalState.multiline}
        fieldType={modalState.fieldType}
        selectItems={modalState.selectItems}
      />

      <BottomSheet
        ref={deleteSheetRef}
        index={showDeleteConfirmation ? 0 : -1}
        handleIndicatorStyle={{ backgroundColor: colors.primary }}
        backdropComponent={renderBackdropComponent}
        snapPoints={['40%']}
        enablePanDownToClose
        // containerStyle={{ backgroundColor: colors.background }}
        backgroundStyle={{ backgroundColor: colors.background }}
        onClose={handleDeleteCancel}>
        <BottomSheetView className="h-full flex-1 justify-center px-4 ">
          <View className="mb-6 items-center">
            <Text className="text-center text-gray-600 dark:text-gray-400">
              Are you sure you want to delete{' '}
              <Text className="font-semibold dark:text-white">{profileData.fullName}</Text> ? This
              action cannot be undone.
            </Text>
          </View>

          <View className="flex-row gap-3">
            {/* <TouchableOpacity
              className="flex-1 h-12 items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-600"
              onPress={handleDeleteCancel}>
              <Text className="font-semibold text-gray-800 dark:text-white">Cancel</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              className="h-12 flex-1 items-center justify-center rounded-lg bg-red-500"
              onPress={handleDeleteConfirm}>
              <Text className="font-semibold text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default EditMemberForm;
