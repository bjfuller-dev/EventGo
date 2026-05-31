import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [testDetails, setTestDetails] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const [email, setEmail] = useState("");

  const testEventName = route.params.data;
  const eventNumber = route.params.event;

  async function getUserDetails() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    axios
      .post(`${API_URL}/userdetails`, { token: token })
      .then((res) => {
        console.log(res.data);
        setUserDetails(res.data.data);
      });
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  console.log("user email: ", userDetails.mail);

  async function deleteEvent() {
    const base = `${API_URL}/eventdetails/`;
    axios.delete(base + testEventName).then((res) => {
      console.log(res.data);
      if (res.data.status == "Ok.") {
        deleteOwned();
        removeEventFromUsers();
        Alert.alert("Event successfully deleted.");
        getUserDetails();
        navigation.navigate("Home", { data: userDetails });
      } else {
        Alert.alert("Event could not be deleted.");
      }
    });
  }

  async function deleteOwned() {
    const userEmail = await userDetails.email;
    const base = `${API_URL}/owned/`;
    axios.delete(base + userEmail + "/" + testEventName).then((res) => {
      console.log(res.data);
    });
  }

  const removeEventFromUsers = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/removejoined`,
        {
          joined: testEventName, 
        }
      );

      if (response.data.message) {
        console.log(response.data.message); 
        alert(response.data.message); 
      }
    } catch (error) {

      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        alert(`Error: ${error.response.data.error}`);
      } else {
        console.error("Error sending request:", error.message);
        alert("An error occurred while trying to remove the event.");
      }
    }
  };

  async function handleEmail() {
    const creatorEmail = userDetails.email;
    setEmail(creatorEmail);
  }

  useEffect(() => {
    const eventInfo = route.params.data;
    setTestDetails(eventInfo);
    handleEmail();
  }, []);

  const eventForward = async () => {
    console.log("event name: ", testEventName);
    console.log("event week number: ", eventNumber + 1);
    const eventRequestDetails = {
      name: testEventName,
      event: eventNumber + 1,
    };
    axios
      .post(`${API_URL}/eventforward`, eventRequestDetails)
      .then((res) => {
        console.log(res.data);
        if (res.data.status == "Ok.") {
          Alert.alert("Event successfully moved forward 1 week.");
          navigation.navigate("Owned", { data: userDetails });
        } else {
          Alert.alert("Event could not be moved forward.");
        }
      });
  }



  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[53px]">
        Event settings
      </Text>
      <View className="flex mx-10 space-y-4">
        <View className="flex mx-10 space-y-4 my-10">
          <Text className="text-center t.alignAuto text-[38px]">
            {testDetails}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-slate-800 px-4 rounded-2xl"
          onPress={() => deleteEvent()}
        >
          <Text className="text-xl font-bold text-white text-center m-auto my-5">
            Delete event
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex mx-10 space-y-4 my-20">
        <TouchableOpacity
          className="bg-slate-800 px-4 rounded-2xl"
          onPress={() => eventForward()}
        >
          <Text className="text-xl font-bold text-white text-center m-auto my-5">
            Start next week
          </Text>
        </TouchableOpacity>
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


