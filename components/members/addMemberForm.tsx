import React from 'react';
import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Controller, useForm, ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const AddMemberForm = () => {
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
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    console.log(data);
    // Add your submission logic here
    setIsLoading(false);
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
          {isLoading ? 'Adding Member...' : 'Add Member'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddMemberForm;
