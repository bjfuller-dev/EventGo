import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
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

  const renderAttend = ({ item }) => {
    const isPaid = testDetails.payment.includes(item); 

    return (
      <TouchableOpacity className="bg-slate-800 rounded-2xl">
        <Text
          className={`text-lg my-2 text-center ${
            isPaid ? "text-green-500" : "text-red-500"
          }`}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[53px]">
        Payment Record
      </Text>

      <View className="flex mx-10 space-y-4 my-10">
        <Text className="text-center t.alignAuto text-[38px]">
          {testDetails.name}
        </Text>
      </View>
      <View className="flex mx-10 space-y-4">
        <Text className="text-center t.alignAuto text-[25px]">Attendees</Text>
      </View>
      <View className="px-10">
        <FlatList
          data={testDetails.attend}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAttend}
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
