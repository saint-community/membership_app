import { View, SafeAreaView, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { getStudyGroupDateRange } from '~/utils/studyGroupUtils';
import { Text } from '~/components/nativewindui/Text';

const AssignmentDetail = () => {
  const RetrievedAssignment = useLocalSearchParams();
  const assignment = JSON.parse(decodeURIComponent(RetrievedAssignment.assignment as string));

  const openInAppBrowser = async (url: string) => {
    if (url) {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: '#000',
        dismissButtonStyle: 'close',
      });
    }
  };
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
      <View className="h-full p-6">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="absolute z-10">
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <Text className="mb-4 flex-1 text-center text-2xl font-bold">Study Group</Text>
        </View>

        {/* Assignment Details */}
        <Text className="mb-4 text-xl font-semibold">{assignment.title}</Text>
        <Text className="mb-4 text-lg">
          {`Study group questions (${getStudyGroupDateRange(assignment.dueDate)}) on ${assignment.title}`}
        </Text>

        {/* Clickable Link */}
        <TouchableOpacity onPress={() => openInAppBrowser(assignment.link)}>
          <Text className="mb-6 text-lg">
            Link to download track:{' '}
            <Text className="text-[#2563EB] underline">{assignment.link}</Text>
          </Text>
        </TouchableOpacity>

        {/* Questions */}
        <View className="my-3" style={{ height: 200 }}>
          <Text className="mb-2 text-lg font-medium">Study Questions:</Text>
          <FlatList
            data={assignment.questions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="mb-4">
                <Text className="text-base">{item}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={true}
          />
        </View>

        {/* Dates */}
        <View>
          <Text className="mb-2 text-lg text-[#959595]">Uploaded: {assignment.uploadTime}</Text>
          <Text className="text-lg text-[#959595]">Due: {assignment.dueDate}</Text>
        </View>
        <View className="mt-4 flex-1 flex-col items-center justify-center border">
          <TouchableOpacity className="w-full items-center justify-center rounded-lg bg-[#FF007F] p-6">
            <Text className="text-2xl font-bold text-white">Upload Assignment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="my-6 items-center justify-center border">
            <Text className="text-2xl font-bold text-[#ff007f]">I have submitted offline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AssignmentDetail;
