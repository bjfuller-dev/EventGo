import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [userOwned, setUserOwned] = useState("");
  const [userDetails, setUserDetails] = useState("");

  async function getParams() {
    const paramData = await route.params.data;
    setUserOwned(paramData);
  }

  useEffect(() => {
    getParams();
  }, []);

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

console.log('User email is: ', userDetails.email)


  const renderOwned = ({ item }) => (
    <View className="my-1">
      <TouchableOpacity
        className="bg-slate-800 rounded-2xl"
        onPress={() => navigation.navigate("OwnedEvent", { data: item, user: userDetails.email })}
      >
        <Text className="text-xl font-bold text-white text-center m-auto my-5">
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderJoined = ({ item }) => (
    <View className="my-1">
      <TouchableOpacity
        className="bg-slate-800 rounded-2xl"
        onPress={() =>
          navigation.navigate("JoinedEvent", {
            data: item,
            user: userDetails.email,
          })
        }
      >
        <Text className="text-xl font-bold text-white text-center m-auto my-5">
          {item}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />
      <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
        Your Events
      </Text>
      <Text className="text-center t.alignAuto text-[38px]">
        Created events
      </Text>
      <View className="absolute my-40 w-full flex-row justify-center">
        <View className="flex-1 px-10">
          <FlatList data={userOwned.owned} renderItem={renderOwned} />

          <Text className="text-center t.alignAuto text-[38px]">
            Joined events
          </Text>
          <FlatList data={userOwned.joined} renderItem={renderJoined} />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 left-0">
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


