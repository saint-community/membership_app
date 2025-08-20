import { Ionicons } from '@expo/vector-icons';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import MemberCard from './memberCard';
import { useColors } from '~/theme/colors';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

interface Member {
  id: string;
  name: string;
  created_at: string;
  image: string;
}

const MembersList = () => {
  // Sample data - replace with your actual data source
  const members: Member[] = [
    { id: '1', name: 'John Doe', created_at: '2023-01-01', image: 'https://placeholder.com/user1' },
    {
      id: '2',
      name: 'Jane Smith',
      created_at: '2023-01-02',
      image: 'https://placeholder.com/user2',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      created_at: '2023-01-03',
      image: 'https://placeholder.com/user3',
    },
    {
      id: '4',
      name: 'Bob Brown',
      created_at: '2023-01-04',
      image: 'https://placeholder.com/user4',
    },
    {
      id: '5',
      name: 'Charlie Davis',
      created_at: '2023-01-05',
      image: 'https://placeholder.com/user5',
    },
    {
      id: '6',
      name: 'Diana Evans',
      created_at: '2023-01-06',
      image: 'https://placeholder.com/user6',
    },
    {
      id: '7',
      name: 'Frank Green',
      created_at: '2023-01-07',
      image: 'https://placeholder.com/user7',
    },
    {
      id: '8',
      name: 'Grace Harris',
      created_at: '2023-01-08',
      image: 'https://placeholder.com/user8',
    },
    {
      id: '9',
      name: 'Hank Irving',
      created_at: '2023-01-09',
      image: 'https://placeholder.com/user9',
    },
    {
      id: '10',
      name: 'Ivy Jackson',
      created_at: '2023-01-10',
      image: 'https://placeholder.com/user10',
    },
  ];

  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <View className="flex-1 p-4">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">My Members</Text>
        <View />
      </View>
      <FlatList<Member>
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemberCard
            name={item.name}
            created_at={item.created_at}
            id={item.id}
            image={item.image}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <View className="absolute bottom-16 right-8">
        <TouchableOpacity
          onPress={() => router.push('/add-member')}
          className="h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-[#2A2A2A]/90 bg-opacity-20 shadow-lg backdrop-blur-2xl">
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MembersList;
