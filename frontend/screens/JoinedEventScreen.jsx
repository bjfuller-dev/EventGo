import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const testEventName = route.params.data;
  const userEmailParam = route.params.user;

  const [userDetails, setUserDetails] = useState("");

  async function getUserDetails() {
    const token = await AsyncStorage.getItem("token");
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

  const [testDetails, setTestDetails] = useState("");

  const [remaining, setRemaining] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventMonth, setEventMonth] = useState("");
  const [eventYear, setEventYear] = useState("");
  const [eventHour, setEventHour] = useState("");
  const [eventMinute, setEventMinute] = useState("");
  const [eventSecond, setEventSecond] = useState("");

  const [eventCloseTime, setEventCloseTime] = useState("");
  const [eventCloseDays, setEventCloseDays] = useState("");

  const [eventOpenTime, setEventOpenTime] = useState("");
  const [eventOpenDay, setEventOpenDay] = useState("");

  const [selected, setSelected] = useState(false);

  async function getEventMatch() {
    try {
      const base = `${API_URL}/eventdetails/`;
      axios
        .get(base + testEventName)
        .then((res) => {
          if (res.data.status == "Ok.") {
            setTestDetails(res.data.data);
          } else {
            Alert.alert("Could not find the details for this event.");
          }
        })
        .catch((e) => console.log(e));
    } catch (error) {
      Alert.alert("Error fetching event details.");
    }
  }

  useEffect(() => {
    getEventMatch();
  }, []);

  const [signUpWindow, setSignUpWindow] = useState(false); // Tracks if within sign-up window

  const [openString, setOpenString] = useState("");

  async function getEventDate() {
    const currentDate = new Date();
    const eventStart = await testDetails.start;

    const adjustedDate = new Date(eventStart);
    console.log('original: ', adjustedDate);

    adjustedDate.setDate(adjustedDate.getDate() + (7 * testDetails.event));

    console.log("adjusted: ", adjustedDate);

    const startDateString = JSON.stringify(adjustedDate);
    const [startDate, startTime] = startDateString.split("T");
    const [startYear, startMonth, startDay] = startDate.split("-");
    const [startTrim, startTrimYear] = startYear.split('"');
    const [startHour, startMinute, startSecond] = startTime.split(":");
    const startHourBST = parseInt(startHour) + 1;
    setEventDate(startDay);
    setEventMonth(startMonth);
    setEventYear(startTrimYear);
    setEventHour(startHourBST);
    setEventMinute(startMinute);
    setEventSecond(startSecond);
    const [signupOpenTime, signupOpenDay] = testDetails.open.split("/");
    const [signupCloseTime, signupCloseDay] = testDetails.close.split("/");
    setEventOpenDay(signupOpenDay);
    setEventOpenTime(signupOpenTime);
    setEventCloseTime(signupCloseTime);
    setEventCloseDays(signupCloseDay);

    const openDate = getAdjustedDate(
      adjustedDate,
      signupOpenTime,
      signupOpenDay
    );
    const closeDate = getAdjustedDate(
      adjustedDate,
      signupCloseTime,
      signupCloseDay
    );

    const openDateString = JSON.stringify(openDate);
    const [openingDate, openTime] = openDateString.split("T");
    const [openYear, openMonth, openDay] = openingDate.split("-");
    const [openTrim, openTrimYear] = openYear.split('"');
    const [openHour, openMinute, openSecond] = openTime.split(":");
    const openHourBST = parseInt(openHour) + 1;

    const openString =
      "Sign up opens " +
      openDay +
      "/" +
      openMonth +
      "/" +
      openTrimYear +
      " at " +
      openHourBST +
      ":" +
      openMinute;

    setOpenString(openString);

  
    if (currentDate >= openDate && currentDate <= closeDate) {
      setSignUpWindow(true);
    } else {
      setSignUpWindow(false);
    }
    console.log("is sign up window?", signUpWindow);
    setLoading(false);
  }

  useEffect(() => {
    getEventDate();
  }, []);

  const getRemaining = async () => {
    const eventAttend = testDetails.attend.length;
    const eventMax = testDetails.max;
    const eventRemaining = eventMax - eventAttend;
    setRemaining(eventRemaining);
  };

  useEffect(() => {
    getRemaining();
  }, []);

  const [isAttending, setIsAttending] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 


  const checkAttendance = async () => {
    const base = `${API_URL}/event/`;
    try {
      const response = await axios.get(
        base + testEventName + "/" + userEmailParam
      );
      setIsAttending(true); 
      setError(null); 
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setIsAttending(false); 
        setError(null); 
      } else {
        setError("An error occurred. Please try again."); 
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    checkAttendance();
  }, []);

  const updateAttend = () => {
    if (!isAttending) {
      const userData = {
        name: testEventName,
        attend: userEmailParam,
      };
      axios
        .post(`${API_URL}/attend`, userData)
        .then((res) => console.log(res));
      handleSelect();
    }
    handleSelect();
  };

  function handleSelect() {
    if (selected) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  }

  async function deleteAttend() {
    const attend = userEmailParam;
    const base = `${API_URL}/removeattend/`;
    axios.delete(base + testEventName + "/" + attend).then((res) => {
      console.log(res.data);
    });
  }

  const [isEventPressed, setIsEventPressed] = useState(false);
  const [isWindowPressed, setIsWindowPressed] = useState(false);

  const handleIsEventPressed = () => {
    setIsEventPressed(true);
  };

  const handleIsWindowPressed = () => {
    setIsWindowPressed(true);
  };


  const getAdjustedDate = (baseDate, timeString, daysBefore) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const adjustedDate = new Date(baseDate);
    adjustedDate.setDate(adjustedDate.getDate() - daysBefore);
    adjustedDate.setHours(hours, minutes, 0, 0);

    return adjustedDate;
  };

  const options = [
    {
      label: "No",
      value: "",
      testID: "switch-no",
      accessibilityLabel: "switch-no",
    },
    {
      label: "Yes",
      value: "",
      testID: "switch-yes",
      accessibilityLabel: "switch-yes",
    },
  ];

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <StatusBar barStyle="dark-content" />

        {/* Title */}
        <Text className="top-0 text-center font-bold t.alignAuto text-[55px]">
          {testDetails.name}
        </Text>

        <View className="flex mx-10 space-y-4">
          {isEventPressed && (
            <TouchableOpacity
              className="bg-slate-800 px-4 rounded-2xl"
              onPress={() => {
                handleIsWindowPressed();
              }}
            >
              <Text className="text-xl font-bold text-white text-center m-auto my-5">
                Check sign up window
              </Text>
            </TouchableOpacity>
          )}

          {!isEventPressed && (
            <TouchableOpacity
              className="bg-slate-800 px-4 rounded-2xl"
              onPress={() => {
                getEventDate();
                getRemaining();
                handleIsEventPressed();
              }}
            >
              <Text className="text-xl font-bold text-white text-center m-auto my-5">
                Get next event
              </Text>
            </TouchableOpacity>
          )}
          {isEventPressed && (
            <View>
              <Text className="text-center text-[20px] font-semibold">
                Next event
              </Text>
              <Text className="my-2 text-center text-[20px]">
                {eventDate}/{eventMonth}/{eventYear} at {eventHour}:
                {eventMinute}
              </Text>
            </View>
          )}
          <View className="space-x-4 justify-center">
            {isAttending && isWindowPressed && signUpWindow ? (
              <View>
                <Text className="text-center font-bold t.alignAuto text-[30px]">
                  Sign up Open
                </Text>
                <SwitchSelector
                  buttonColor="#091229"
                  borderColor="#091229"
                  hasPadding
                  options={options}
                  initial={1}
                  onPress={() => {
                    deleteAttend();
                    setIsAttending(false);
                  }}
                />
              </View>
            ) : isWindowPressed && signUpWindow ? (
              <View>
                <Text className="text-center font-bold t.alignAuto text-[30px]">
                  Sign up Open
                </Text>
                <SwitchSelector
                  buttonColor="#091229"
                  borderColor="#091229"
                  hasPadding
                  options={options}
                  initial={0}
                  onPress={() => {
                    updateAttend();
                    setIsAttending(true);
                  }}
                />
              </View>
            ) : isWindowPressed && !signUpWindow ? (
              <View>
                <Text className="text-center font-bold t.alignAuto text-[30px]">
                  Sign up Closed
                </Text>
                <Text className="my-2 text-center text-[20px]">
                  {openString}
                </Text>
              </View>
            ) : null}
          </View>
          {isEventPressed && (
            <View>
              <Text className="">Spaces remaining</Text>
              <View className="bg-black/5 p-3.5 rounded-2xl w-full">
                <TextInput
                  placeholder={JSON.stringify(remaining)}
                  placeholderTextColor={"gray"}
                  editable={false}
                />
              </View>
            </View>
          )}
          <Text className="">Location</Text>
          <View className="bg-black/5 p-3.5 rounded-2xl w-full">
            <TextInput
              placeholder={testDetails.location}
              placeholderTextColor={"gray"}
              editable={false}
            />
          </View>
          <Text className="">Description</Text>
          <View className="bg-black/5 p-3.5 rounded-2xl w-full">
            <TextInput
              placeholder={testDetails.description}
              placeholderTextColor={"gray"}
              editable={false}
            />
          </View>

          <Text className="">Maximum Spaces</Text>
          <View className="bg-black/5 p-3.5 rounded-2xl w-full">
            <TextInput
              placeholder={JSON.stringify(testDetails.max)}
              placeholderTextColor={"gray"}
              editable={false}
            />
          </View>

          <Text className="">Event fee</Text>
          <View className="bg-black/5 p-3.5 rounded-2xl w-full">
            <TextInput
              placeholder={"£" + JSON.stringify(testDetails.fee)}
              placeholderTextColor={"gray"}
              editable={false}
            />
          </View>

          <View className="my-20">
            <TouchableOpacity
              className="bg-slate-800 rounded-2xl"
              onPress={() => navigation.navigate("Pay", { data: testDetails })}
            >
              <Text className="text-xl font-bold text-white text-center m-auto my-5">
                Pay fee
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={() => navigation.navigate("Browse")}>
          <View className="flex-row items-center space-x-2 px-4 pb-2 absolute bottom-0 left-0">
            <Icon.ArrowLeft height="50" width="50" stroke="black" />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}
