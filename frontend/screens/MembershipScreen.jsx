import { View, Text, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [isChecked, setChecked] = useState(false);

  const [testDetails, setTestDetails] = useState("");

  useEffect(() => {
    const eventInfo = route.params.data;
    setTestDetails(eventInfo);
  }, []);

  const eventName = testDetails.name;

  const approveRequest = (item) => {
    const eventRequestDetails = {
      name: eventName,
      registered: item,
    };
    axios
      .post(`${API_URL}/eventapprove`, eventRequestDetails)
      .then((res) => console.log(res));
      deleteRequest(item);
      updateJoined(item);
      navigation.navigate("OwnedEvent", { data: testDetails });
  };

  async function deleteRequest(item) {
    const base = `${API_URL}/event/`;
    axios.delete(base + eventName + "/" + item).then((res) => {
      console.log(res.data);
    });
  }

  const updateJoined = (item) => {
    const userData = {
      email: item,
      joined: eventName,
    };
    axios
      .post(`${API_URL}/joined`, userData)
      .then((res) => console.log(res));
  };

  const renderRequest = ({ item }) => (
    <View className="my-1">
      <View className="bg-slate-800 rounded-2xl">
        <TouchableOpacity
          className="absolute right-5 top-1/2 my-[-25]"
          onPress={() => {
            approveRequest(item);
          }}
        >
          <Icon.Check name="Tick" color="green" width={50} height={50} />
        </TouchableOpacity>
        <TouchableOpacity
          className="absolute left-5 top-1/2 my-[-25]"
          onPress={() => {
            deleteRequest(item),
            navigation.navigate("OwnedEvent", { data: testDetails });
          }}
        >
          <Icon.X name="Red X" color="red" width={50} height={50} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white text-center m-auto my-5">
          {item}
        </Text>
      </View>
    </View>
  );

  console.log(testDetails.request);
  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[53px]">
        Membership requests
      </Text>

      <View className="flex mx-10 space-y-4 my-10">
        <Text className="text-center t.alignAuto text-[38px]">
          {testDetails.name}
        </Text>
      </View>
      <View className="flex-1 px-10">
        <FlatList
          data={testDetails.request}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
        />
      </View>
      {/* Back button */}
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate("OwnedEvent", { data: testDetails })}
      >
        <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0">
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


