import { Entypo } from '@expo/vector-icons';
import { Image, View } from 'react-native';
import { Text } from '../nativewindui/Text';
import Avatar from '../Avatar';

interface MemberCardProps {
  name: string;
  created_at: string;
  id: string;
  image: string;
}

const MemberCard = ({ name, created_at, id, image }: MemberCardProps) => {
  return (
    <View className="mb-3 flex flex-row items-center justify-between rounded-lg bg-[#1F1F1F] px-3 py-4">
      <View className="flex-row items-center gap-3">
        <Avatar
          image_url={image}
          className="h-12 w-12 rounded-full"
          icon={<Entypo name="user" size={24} color="white" />}
        />
        <View>
          <Text className="text-lg font-semibold text-white">{name}</Text>
          <Text className="text-sm text-gray-400">
            Member since {new Date(created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Entypo name="chevron-right" size={24} color="white" />
    </View>
  );
};

export default MemberCard;
