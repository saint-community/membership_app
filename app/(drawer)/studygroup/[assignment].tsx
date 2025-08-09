import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';


const AssignmentDetail = () => {
  const RetrievedAssignment = useLocalSearchParams();
  console.log('RetrievedAssignment:', RetrievedAssignment);
  return (
    <SafeAreaView>
      <Text>Assignment</Text>
    </SafeAreaView>
  );
};

export default AssignmentDetail;
