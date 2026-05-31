import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const userDetails = route.params.data;
  const userEmail = userDetails.email;
  const [eventName, setEventName] = useState("");
  const [eventList, setEventList] = useState("");

  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  function handleSearch(e) {
    const search = e.nativeEvent.text;
    setEventName(search);
    console.log(eventName);
  }

  const eventJoinRequest = (name) => {
    const eventRequestDetails = {
      name: name,
      request: userEmail,
    };
    axios
      .post(`${API_URL}/eventjoin`, eventRequestDetails)
      .then((res) => console.log(res));
    navigation.navigate("Home", { data: userDetails });
  };


  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/eventdetails`
      ); 
      setEvents(response.data); 
      setLoading(false); 
    } catch (err) {
      setError("Error fetching events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View className="my-1">
      <TouchableOpacity
        className="bg-slate-800 rounded-2xl"
        onPress={() => eventJoinRequest(item.name)}
      >
        <Text className="text-xl font-bold text-white text-center m-auto my-5">
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }


  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
        Join An Event
      </Text>

      <View className="flex mx-10 space-y-4 my-10">
        <Text className="text-center t.alignAuto text-[38px]">
          Search event name
        </Text>
        <View className="bg-black/5 p-5 rounded-2xl w-full">
          <TextInput
            placeholder=""
            placeholderTextColor={"gray"}
            onChange={(e) => handleSearch(e)}
          />
        </View>
        <TouchableOpacity
          className="bg-slate-800 px-4 py-2 rounded-2xl h-20"
          onPress={() => eventJoinRequest(eventName)}
        >
          <Text className="text-xl font-bold text-white text-center m-auto">
            Request membership
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center t.alignAuto text-[38px]">
        View all events
      </Text>
      <View className="flex-1 px-10">
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      </View>

      {/* Back button */}
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View className="flex-row items-center">
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


