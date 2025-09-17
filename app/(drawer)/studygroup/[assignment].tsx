import {
  View,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { getStudyGroupDateRange, isValidUrl } from '~/utils/studyGroupUtils';
import { Text } from '~/components/nativewindui/Text';
import dayjs from 'dayjs';
import { Button } from '~/components/Button';
import { useMutation } from '@tanstack/react-query';
import {
  createSubmission,
  CreateSubmissionRequest,
  deleteSubmission,
  updateSubmission,
  UpdateSubmissionRequest,
} from '~/services/api/submission';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import { useMe } from '~/hooks/data/me';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { ParticipantSelectorSheet } from '~/components/prayer/ParticipantSelectorSheet';

const openInAppBrowser = async (url: string) => {
  if (url) {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: '#000',
      dismissButtonStyle: 'close',
    });
  }
};

const AssignmentDetail = () => {
  const RetrievedAssignment = useLocalSearchParams();
  const assignment = JSON.parse(decodeURIComponent(RetrievedAssignment.assignment as string));

  const isSubmission = !!assignment.study_group_id;

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        {isSubmission ? (
          <SubmissionView assignment={assignment} />
        ) : (
          <AssignmentView assignment={assignment} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssignmentDetail;

const AssignmentView = ({ assignment }: { assignment: any }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState<any>('');
  const [link, setLink] = useState('');
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [isSelectParticipant, setIsSelectParticipant] = useState(false);
  const [selectedParticipant, setSelectedPartcipant] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const { data: me } = useMe();
  const { data } = useGetAllMembers();

  const participants = useMemo(
    () =>
      (Array.isArray(data?.data)
        ? [{ _id: `${me?.id}`, full_name: 'Myself' }, ...data.data]
        : []) as any,
    [data?.data, me?.id]
  );

  const isCurrentUser = useMemo(
    () => (selectedParticipant || '') === `${me?.id}`,
    [selectedParticipant, me?.id]
  );

  console.log({ selectedParticipant, me, isCurrentUser });
  const selectedName = useMemo(
    () =>
      participants.filter((p: any) => p._id === selectedParticipant).map((p: any) => p.full_name),
    [participants, selectedParticipant]
  );

  const mutation = useMutation({
    mutationFn: (body: CreateSubmissionRequest) => createSubmission(body),
    onSuccess: (data) => {
      setIsLinkModalVisible(false);
      setModalMessage(
        <Text>
          You have successfully submitted {isCurrentUser ? 'your' : `${selectedName}’s`} assignment
          on <Text className="font-bold">{assignment.title}</Text>
        </Text>
      );
      // router.dismissTo('/(drawer)/(tabs)/study?tab=submissions');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      console.log(message);
      Toast.show({
        text1: 'Failed to submit assignment',
        text2: message,
        type: 'error',
        visibilityTime: 3000,
      });
    },
  });

  const handleSubmitAssignment = useCallback(() => {
    mutation.mutate({
      study_group_id: assignment.id,
      assignment_link: link,
      isOnline,
      member_worker_id: selectedParticipant || undefined,
    });
  }, [assignment.id, link, isOnline, selectedParticipant, mutation]);

  return (
    <View className="h-full p-6">
      <View className="mb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="absolute z-10">
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className="mb-4 flex-1 text-center text-2xl font-bold">Study Group</Text>
      </View>

      {/* Assignment Details */}
      <Text className="mb-4 text-xl font-semibold">{assignment.title}</Text>
      <Text className="mb-4 text-lg">
        {`Study group questions (${getStudyGroupDateRange(assignment.due_date)}) on ${assignment.title}`}
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

        {assignment.questions?.map((question: string, index: number) => (
          <View className="mb-4 flex-row items-start" key={index}>
            <Text className="mr-2 text-base">{`${index + 1}.`}</Text>
            <Text className="flex-1 text-base">{`${question}`}</Text>
          </View>
        ))}
      </View>

      {/* Dates */}
      <View>
        <Text className="mb-2 text-lg text-[#959595]">
          Uploaded: {dayjs(assignment.created_at).format('DD MMM, YYYY hh:mmA')}
        </Text>
        <Text className="text-lg text-[#959595]">
          Due: {dayjs(assignment.due_date).format('DD MMM, YYYY')}
        </Text>
      </View>
      <View className="mt-4 flex-1 flex-col items-center justify-center border">
        <Button
          title="Upload Assignment"
          onPress={() => {
            setIsOnline(true);
            setIsSelectParticipant(true);
          }}
        />

        <TouchableOpacity
          className="my-6 items-center justify-center border"
          onPress={() => {
            setIsOnline(false);
            setIsSelectParticipant(true);
          }}>
          {mutation.isPending && !link ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="font-medium text-[#ff007f]">I have submitted offline</Text>
          )}
        </TouchableOpacity>
      </View>
      <MessageModal
        isVisible={!!modalMessage}
        onClose={() => {
          if (modalMessage) {
            setModalMessage('');
            router.replace('/(drawer)/(tabs)/study?tab=submissions');
          }
        }}
        message={modalMessage}
        type="success"
      />
      <LinkModal
        isVisible={isLinkModalVisible}
        onClose={() => {
          setIsLinkModalVisible(false);
        }}
        link={link}
        setLink={setLink}
        onSubmit={handleSubmitAssignment}
        isLoading={mutation.isPending}
      />

      <ParticipantSelectorSheet
        singleSelection
        visible={isSelectParticipant}
        participants={participants}
        onToggle={(id: string) => {
          if (isOnline) {
            setSelectedPartcipant(id);
            setIsSelectParticipant(false);
            setIsLinkModalVisible(true);
          } else {
            setSelectedPartcipant(id);
            handleSubmitAssignment();
            setIsSelectParticipant(false);
          }
        }}
        onDone={() => {
          setIsSelectParticipant(false);
        }}
      />
    </View>
  );
};

const SubmissionView = ({ assignment }: { assignment: any }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState<any>('');
  const [link, setLink] = useState(assignment.assignment_link);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mutation = useMutation({
    mutationFn: (body: UpdateSubmissionRequest) => updateSubmission(assignment.id, body),
    onSuccess: () => {
      setIsLinkModalVisible(false);
      setModalMessage(
        <Text>
          You have successfully edited your assignment link on{' '}
          <Text className="font-bold">{assignment.study_group_title}</Text>
        </Text>
      );
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      console.log(message);
      Toast.show({
        text1: 'Failed to submit assignment',
        text2: message,
        type: 'error',
        visibilityTime: 3000,
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteSubmission(assignment.id),
    onSuccess: (data) => {
      setIsLinkModalVisible(false);
      setConfirmDelete(false);
      setModalMessage(
        <Text>
          You have successfully deleted your assignment on{' '}
          <Text className="font-bold">{assignment.study_group_title}</Text>
        </Text>
      );
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      console.log(message);
      Toast.show({
        text1: 'Failed to delete assignment',
        text2: message,
        type: 'error',
        visibilityTime: 3000,
      });
    },
  });

  const handleSubmitAssignment = () => {
    mutation.mutate({
      assignment_link: link,
    });
  };

  const handleDeleteSubmission = () => {
    deleteMutation.mutate();
  };

  return (
    <View className="h-full flex-1 p-6">
      <View className="mb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="absolute z-10">
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className="mb-4 flex-1 text-center text-2xl font-bold">Study Group</Text>
      </View>

      <View className="mb-4 flex-1">
        <Text className="mb-4 text-xl font-semibold">{assignment.study_group_title}</Text>
        <Text className="mb-4 text-lg">
          {`Study group questions (${getStudyGroupDateRange(assignment.due_date)}) on ${assignment.study_group_title}`}
        </Text>

        <TouchableOpacity onPress={() => openInAppBrowser(assignment.assignment_link)}>
          <Text className="mb-6 text-lg">
            Submission Link:{' '}
            <Text className="text-[#2563EB] underline">{assignment.assignment_link}</Text>
          </Text>
        </TouchableOpacity>

        <View className="my-3">
          <Text className="mb-2 text-lg font-medium">Note:</Text>
          <Text className="text-base">{assignment.note}</Text>
        </View>

        <View>
          <Text className="text-md mb-2">Status: {assignment.status} </Text>
          <Text className="text-md mb-2 text-[#959595]">
            Submitted {assignment?.is_late ? 'Late' : ''}:{' '}
            {dayjs(assignment.submitted_at).format('DD MMM, YYYY hh:mmA')}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-1 flex-col items-center justify-center border">
        <Button title="Edit Link" onPress={() => setIsLinkModalVisible(true)} />

        <TouchableOpacity
          className="my-6 items-center justify-center border"
          onPress={() => setConfirmDelete(true)}>
          {mutation.isPending && !link ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-sm font-medium text-[#ff007f] underline">Delete submission</Text>
          )}
        </TouchableOpacity>
      </View>
      <MessageModal
        isVisible={!!modalMessage}
        onClose={() => {
          if (modalMessage) {
            setModalMessage('');
            setLink('');
            router.replace('/(drawer)/(tabs)/study?tab=submissions');
          }
        }}
        message={modalMessage}
        type="success"
      />
      <MessageModal
        isVisible={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        message={
          <Text>
            You are about to delete your assignment upload on{' '}
            <Text className="font-bold">{assignment.study_group_title}</Text>
          </Text>
        }
        type="warning"
        confirmAction={handleDeleteSubmission}
        isLoading={deleteMutation.isPending}
      />
      <LinkModal
        isVisible={isLinkModalVisible}
        onClose={() => {
          setIsLinkModalVisible(false);
        }}
        link={link}
        setLink={setLink}
        onSubmit={handleSubmitAssignment}
        isLoading={mutation.isPending}
        isEdit
      />
    </View>
  );
};

function MessageModal({
  isVisible,
  onClose,
  message,
  type,
  confirmAction,
  isLoading,
}: {
  isVisible: boolean;
  onClose: () => void;
  message: any;
  type: 'success' | 'error' | 'warning';
  confirmAction?: () => void;
  isLoading?: boolean;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['55%'], []);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, onClose]);

  return (
    <BottomSheetWrapper
      ref={bottomSheetRef}
      initialIndex={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      enableDynamicSizing={false}>
      <BottomSheetView className="flex-1 px-4">
        <View className="h-[350px] flex-1">
          <View className="flex-1 items-center justify-center">
            <Ionicons
              name={
                type === 'success'
                  ? 'checkmark-circle-outline'
                  : type === 'error'
                    ? 'close-circle-outline'
                    : 'alert-circle-outline'
              }
              size={120}
              color={type === 'success' ? '#4CAF50' : type === 'error' ? '#D32F2F' : '#FFA000'}
            />
            <Text className="leading my-3 text-center text-[16px]  dark:text-white">{message}</Text>
          </View>
          {confirmAction && (
            <Button
              title="Confirm"
              onPress={confirmAction}
              className="mt-4"
              isLoading={isLoading}
            />
          )}
        </View>
      </BottomSheetView>
    </BottomSheetWrapper>
  );
}

function LinkModal({
  isVisible,
  onClose,
  link,
  setLink,
  onSubmit,
  isLoading,
  isEdit,
}: {
  isVisible: boolean;
  onClose: () => void;
  link: string;
  setLink: (link: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEdit?: boolean;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['50%'], []);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, onClose]);

  const handleSubmit = () => {
    if (!link?.trim()) {
      return Toast.show({
        text1: 'Please enter a link',
        type: 'error',
      });
    }
    if (!isValidUrl(link)) {
      return Toast.show({
        text1: 'Please enter a valid link',
        type: 'error',
      });
    }
    onSubmit();
  };

  return (
    <BottomSheetWrapper
      ref={bottomSheetRef}
      initialIndex={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      enableDynamicSizing={false}>
      <View className="h-[320px] flex-1">
        <View className="flex-1 gap-8">
          <Text className="text-center font-bold">
            {isEdit ? 'Edit Assignment Link' : 'Upload Assignment'}
          </Text>
          <View>
            <Text className="text-md mb-2 font-medium  dark:text-white">Link:</Text>
            <TextInput
              value={link}
              onChangeText={setLink}
              placeholder="Input link to your assignment"
              placeholderTextColor="#9CA3AF"
              className="rounded-lg border border-gray-700 bg-white px-4 py-3  dark:bg-background dark:text-white"
              autoFocus
              editable={!isLoading}
              autoCapitalize="none"
            />
          </View>
          {!isEdit && (
            <View>
              <Text className="text-md mb-2 font-medium  dark:text-white">Note:</Text>
              <TextInput
                placeholder="Any additional note..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                className="min-h-[100px] rounded-lg border  border-gray-700 bg-white px-4 py-3 dark:bg-background dark:text-white"
                editable={!isLoading}
              />
            </View>
          )}
        </View>
        <Button
          title={isEdit ? 'Done' : 'Submit Assignment'}
          onPress={handleSubmit}
          isLoading={isLoading}
        />
      </View>
    </BottomSheetWrapper>
  );
}
