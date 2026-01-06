import { View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text } from '../nativewindui/Text';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddMember } from '~/hooks/mutations/members/useAddMember';
import { useMe } from '~/hooks/data/me';
import { cn } from '~/lib/cn';
import { DropdownSelect } from '../common/DropdownSelect';
import { DatePicker } from '../common/DatePicker';

const AddMemberForm = () => {
  const { data: me } = useMe();

  const memberSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    gender: z.string().min(1, 'Gender is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    cell: z.string().optional(),
    fellowship: z.string().min(1, 'Fellowship is required'),
    department: z.string().min(1, 'Department is required'),
    dateJoined: z.string().min(1, 'Date Joined is required'),
    address: z.string().min(1, 'Address is required'),
    dateOfBirth: z.string().min(1, 'Date of Birth is required'),
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
      cell: me?.cell_name || '',
      fellowship: me?.fellowship_name || '',
      department: '',
      dateJoined: '',
      address: '',
      dateOfBirth: '',
      church: me?.church_name || '',
    },
  });

  const { isLoading, onSubmit: submitToAPI } = useAddMember();

  const onSubmit = (data: any) => {
    // Transform the form data to match API contract
    const payload = {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
      date_of_birth: data.dateOfBirth, // Already in YYYY-MM-DD format from DatePicker
      church_id: me?.church_id,
      date_joined_church: data.dateJoined, // Already in YYYY-MM-DD format from DatePicker
      fellowship_id: me?.fellowship_id,
      cell_id: me?.cell_id,
    };

    submitToAPI(payload);
  };

  const renderField = (
    name: keyof MemberFormData,
    label: string,
    placeholder: string,
    options: any = {},
    fieldType: 'text' | 'select' | 'date' = 'text',
    disabled: boolean = false,
    selectItems?: string[]
  ) => (
    <View className="pt-6" key={name}>
      {/* <Text className="mb-1 text-lg font-normal dark:text-white text-black">{label}</Text> */}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          if (fieldType === 'select' && selectItems) {
            return (
              <DropdownSelect
                items={selectItems}
                value={String(value || '')}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
              />
            );
          }

          if (fieldType === 'date') {
            return (
              <DatePicker
                value={String(value || '')}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
              />
            );
          }

          return (
            <TextInput
              className={cn(
                'h-14 w-full rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3 text-base text-foreground dark:text-white',
                disabled && '!text-[#8A8A8A] opacity-50'
              )}
              placeholder={placeholder}
              placeholderTextColor="#666"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!disabled}
              {...options}
            />
          );
        }}
      />
      {errors[name] && <Text className="mt-1 text-xs text-red-500">{errors[name].message}</Text>}
    </View>
  );

  const formFields: {
    name: string;
    label: string;
    placeholder: string;
    options?: any;
    fieldType?: 'text' | 'select' | 'date';
    disabled?: boolean;
    customRender?: boolean;
  }[] = [
    { name: 'fullName', label: 'Full Name', placeholder: 'Full Name' },
    {
      name: 'gender',
      label: 'Gender',
      placeholder: 'Gender',
      customRender: true,
      fieldType: 'select',
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
    { name: 'cell', label: 'Cell', placeholder: 'Cell', disabled: true },
    { name: 'fellowship', label: 'Fellowship', placeholder: 'Fellowship', disabled: true },
    {
      name: 'department',
      label: 'Department',
      placeholder: 'Department',
      fieldType: 'select',
      customRender: true,
      options: [
        'Music Ministry',
        'Guest Ministry',
        'Technical Department',
        'Livingword Media Department',
        'Operations Department',
        "Children's Church",
        'Works Department',
        'Security',
        'Pastors Protocol',
        'Media Team',
      ],
    },
    { name: 'address', label: 'Address', placeholder: 'Address' },
    { name: 'church', label: 'Church', placeholder: 'Church Name', disabled: true },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      placeholder: 'Select date of birth',
      fieldType: 'date',
    },
    {
      name: 'dateJoined',
      label: 'Date Joined',
      placeholder: 'Select date joined church',
      fieldType: 'date',
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="px-4">
      {formFields.map((field) =>
        renderField(
          field.name as keyof MemberFormData,
          field.label,
          field.placeholder,
          field.options || {},
          field.fieldType || 'text',
          field.disabled || false,
          field.name === 'gender'
            ? ['Male', 'Female']
            : field.name === 'department'
              ? [
                  'Music Ministry',
                  'Guest Ministry',
                  'Technical Department',
                  'Livingword Media Department',
                  'Operations Department',
                  "Children's Church",
                  'Works Department',
                  'Security',
                  'Pastors Protocol',
                  'Media Team',
                ]
              : undefined
        )
      )}

      <TouchableOpacity
        className={`my-12 h-12 w-full items-center justify-center rounded-lg bg-[#FF007F] ${
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
