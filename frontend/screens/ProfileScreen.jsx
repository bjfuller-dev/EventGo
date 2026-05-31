import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen(props) {
   const navigation = useNavigation();
   const route = useRoute();

   const API_URL = process.env.EXPO_PUBLIC_API_URL;

   console.log(props);

   const insets = useSafeAreaInsets();
   
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");

   useEffect(() => {
     const userInfo = route.params.data;
     setName(userInfo.name);
     setEmail(userInfo.email);   
   },[]);


  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Title */}
      <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
        Profile
      </Text>

      {/* Profile details form */}
      <View className="flex mx-10 space-y-4 my-20">
        <Text className="my-2">Name</Text>
        <View className="bg-black/5 p-5 rounded-2xl w-full">
          <TextInput
            placeholder={name}
            placeholderTextColor={"gray"}
            editable={false}
          />
        </View>
        <Text>Email</Text>
        <View className="bg-black/5 p-5 rounded-2xl w-full">
          <TextInput
            placeholder={email}
            placeholderTextColor={"gray"}
            editable={false}
          />
        </View>
      </View>

      {/* Back button */}
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View
          style={{ bottom: insets.bottom }}
          className="absolute left-0 right-0 flex-row justify-between px-5 pb-2"
        >
          <Icon.ArrowLeft height="50" width="50" stroke="black" />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}


