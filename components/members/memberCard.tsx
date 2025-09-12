import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../nativewindui/Text';
import Avatar from '../Avatar';
import { useRouter } from 'expo-router';

interface MemberCardProps {
  name: string;
  date_joined_church: string;
  id: string;
  image: string;
}

const MemberCard = ({ name, date_joined_church, id, image }: MemberCardProps) => {
  const router = useRouter();
  return (
    <View className="mb-3 flex flex-row items-center justify-between rounded-xl bg-white px-3 py-4 shadow-lg  dark:bg-gray-800 ">
      <View className="flex-row items-center">
        <Avatar
          image_url={image}
          className="h-12 w-12 rounded-full"
          icon={<Entypo name="user" size={24} color="white" />}
        />
        <View>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-lg font-semibold dark:text-white">{name}</Text>
            <TouchableOpacity onPress={() => router.push(`/edit-member?id=${id}`)}>
              <Text className="text-md text-primary underline">Edit</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-400">
            Member since {new Date(date_joined_church).toLocaleDateString()}
            {/* ,{' '} */}
            {/* {new Date(date_joined_church).toLocaleTimeString()} */}
          </Text>
        </View>
      </View>
      {/* <TouchableOpacity className="p-2" onPress={() => router.push('/(drawer)/(tabs)')}>
        <Entypo name="chevron-right" size={24} color="white" />
      </TouchableOpacity> */}
    </View>
  );
};

export default MemberCard;
