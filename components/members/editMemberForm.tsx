import React, { useEffect } from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Controller, useForm, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateMember } from '~/hooks/mutations/members/useUpdateMember';
import { useGetMember } from '~/hooks/queries/members/useGetMember';

interface EditMemberFormProps {
  memberId: string;
}

const EditMemberForm = ({ memberId }: EditMemberFormProps) => {
  const memberSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    gender: z.string().min(1, 'Gender is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    cell: z.string().optional(),
    fellowship: z.string().min(1, 'Fellowship is required'),
    department: z.string().min(1, 'Department is required'),
    dateJoined: z.date(),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.date(),
    church: z.string().min(1, 'Church name is required'),
  });

  type MemberFormData = z.infer<typeof memberSchema>;
  
  const { data: memberData, isLoading: memberLoading, error } = useGetMember(memberId);
  const { isLoading, onSubmit: submitToAPI } = useUpdateMember();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      email: '',
      phone: '',
      cell: '',
      fellowship: '',
      department: '',
      dateJoined: new Date(),
      address: '',
      dateOfBirth: new Date(),
      church: '',
    },
  });

  // Populate form with member data when loaded
  useEffect(() => {
    if (memberData?.data && memberData.success) {
      const member = memberData.data;
      reset({
        fullName: member.name || '',
        gender: '', // This field may not exist in API response
        email: member.email || '',
        phone: member.phone || '',
        cell: member.cellId || '',
        fellowship: member.fellowshipId || '',
        department: member.role || '',
        dateJoined: new Date(), // Default to current date
        address: '', // This field may not exist in API response
        dateOfBirth: new Date(), // Default to current date
        church: '', // This field may not exist in API response
      });
    }
  }, [memberData, reset]);

  const onSubmit = (data: any) => {
    // Transform the form data to match API contract
    const apiData = {
      name: data.fullName,
      phone: data.phone,
      role: data.department,
      fellowshipId: data.fellowship,
      cellId: data.cell,
    };
    
    submitToAPI(memberId, apiData);
  };

  const renderField = (name: keyof MemberFormData, label: string, placeholder: string, options = {}) => (
    <View className="" key={name}>
      <Text className="mb-1 text-lg font-bold text-white dark:text-black">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="h-14 w-full rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3 text-base text-white dark:text-white"
            placeholder={placeholder}
            placeholderTextColor="#666"
            value={value instanceof Date ? value.toISOString() : value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...options}
          />
        )}
      />
      {errors[name] && <Text className="mt-1 text-xs text-red-500">{errors[name].message}</Text>}
    </View>
  );

  const formFields = [
    { name: 'fullName', label: 'Full Name', placeholder: 'Full Name' },
    {
      name: 'gender',
      label: 'Gender',
      placeholder: 'Gender',
      customRender: true,
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Email Address',
      options: { keyboardType: 'email-address', autoCapitalize: 'none' },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      placeholder: 'Phone Number',
      options: { keyboardType: 'phone-pad' },
    },
    { name: 'cell', label: 'Cell', placeholder: 'Cell' },
    { name: 'fellowship', label: 'Fellowship', placeholder: 'Fellowship' },
    { name: 'department', label: 'Department', placeholder: 'Department' },
    { name: 'address', label: 'Address', placeholder: 'Address' },
    { name: 'church', label: 'Church', placeholder: 'Church Name' },
  ];

  if (memberLoading) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <ActivityIndicator size="large" color="#FF007F" />
        <Text className="mt-4 text-white">Loading member data...</Text>
      </View>
    );
  }

  if (error || !memberData?.success) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-500">Failed to load member data</Text>
        <Text className="mt-2 text-gray-400">{error?.message || 'Please try again'}</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="px-4">
      
      {formFields.map((field) =>
        field.customRender
          ? renderField('gender', 'Gender', 'Select gender', {
              control,
              name: 'gender',
              render: ({
                field: { onChange, value },
              }: {
                field: ControllerRenderProps<any, string>;
              }) => (
                <View className="flex-row space-x-4">
                  {['Male', 'Female'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      onPress={() => onChange(gender)}
                      className={`rounded-xl border border-[#333] p-3 ${
                        value === gender ? 'bg-[#FF007F]' : 'bg-[#2A2A2A]'
                      }`}>
                      <Text className="text-white">{gender}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ),
            })
          : renderField(field.name as keyof MemberFormData, field.label, field.placeholder, field.options)
      )}

      <TouchableOpacity
        className={`h-12 w-full items-center justify-center rounded-lg my-12 bg-[#FF007F] ${
          isValid && !isLoading ? 'bg-[#FF007F]' : 'bg-[#353535]'
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading || !isValid}>
        <Text className="text-base font-semibold text-white">
          {isLoading ? 'Updating Member...' : 'Update Member'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditMemberForm;