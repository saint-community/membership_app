import { Ionicons } from '@expo/vector-icons';
import { Text, View, FlatList } from 'react-native';
import MemberCard from './memberCard';

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
    { id: '3', name: 'Alice Johnson', created_at: '2023-01-03', image: 'https://placeholder.com/user3' },
    { id: '4', name: 'Bob Brown', created_at: '2023-01-04', image: 'https://placeholder.com/user4' },
    { id: '5', name: 'Charlie Davis', created_at: '2023-01-05', image: 'https://placeholder.com/user5' },
    { id: '6', name: 'Diana Evans', created_at: '2023-01-06', image: 'https://placeholder.com/user6' },
    { id: '7', name: 'Frank Green', created_at: '2023-01-07', image: 'https://placeholder.com/user7' },
    { id: '8', name: 'Grace Harris', created_at: '2023-01-08', image: 'https://placeholder.com/user8' },
    { id: '9', name: 'Hank Irving', created_at: '2023-01-09', image: 'https://placeholder.com/user9' },
    { id: '10', name: 'Ivy Jackson', created_at: '2023-01-10', image: 'https://placeholder.com/user10' },
  ];

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold text-white">Members List</Text>
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
      />
      <View className="absolute bottom-16 right-8">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#2a2a2ac9] shadow-lg">
          <Ionicons name="add" size={30} color="white" />
        </View>
      </View>
    </View>
  );
};

export default MembersList;
