import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Logo from "../assets/images/Logo2.png";

const { width, height } = Dimensions.get("window");

const CreateItinerary = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [dayTitle, setDayTitle] = useState("");
  const [activities, setActivities] = useState([{ time: "", activity: "", icon: "" }]);

  const handleAddActivity = () => {
    setActivities([...activities, { time: "", activity: "", icon: "" }]);
  };

  const handleChangeActivity = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const handleSubmit = () => {
    router.push({
      pathname: "/Itinerary",
      params: {
        image: "https://source.unsplash.com/featured/?travel",
        location: location || "New Trip",
      },
    });
  };

  return (
    <>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <ImageBackground
        source={{ uri: "https://source.unsplash.com/featured/?travel" }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Itinerary</Text>
            <View style={{ width: 24 }} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#aaa"
            value={location}
            onChangeText={setLocation}
          />

          <TextInput
            style={styles.input}
            placeholder="Day Title (e.g. 'Adventure Day')"
            placeholderTextColor="#aaa"
            value={dayTitle}
            onChangeText={setDayTitle}
          />

          {activities.map((act, index) => (
            <View key={index} style={styles.activityRow}>
              <TextInput
                style={styles.smallInput}
                placeholder="Time"
                placeholderTextColor="#ccc"
                value={act.time}
                onChangeText={(text) => handleChangeActivity(index, "time", text)}
              />
              <TextInput
                style={styles.bigInput}
                placeholder="Activity"
                placeholderTextColor="#ccc"
                value={act.activity}
                onChangeText={(text) => handleChangeActivity(index, "activity", text)}
              />
              <TextInput
                style={styles.iconInput}
                placeholder="Icon"
                placeholderTextColor="#ccc"
                value={act.icon}
                onChangeText={(text) => handleChangeActivity(index, "icon", text)}
              />
            </View>
          ))}

          <TouchableOpacity onPress={handleAddActivity} style={styles.addButton}>
            <Feather name="plus" size={20} color="#386BF6" />
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.saveContainer}>
              <Text style={styles.saveButton}>CREATE</Text>
              <View style={styles.saveButtonIcon}>
                <Feather name="arrow-right" size={20} color="#386BF6" />
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    zIndex: 1,
  },
  logo: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 55,
    height: 55,
    zIndex: 2,
    borderRadius: 50,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
    fontFamily: "Poppins",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  smallInput: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  bigInput: {
    flex: 2,
    marginRight: 5,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  iconInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#386BF6",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  saveContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 30,
  },
  saveButton: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "700",
    color: "#386BF6",
    marginRight: 8,
    zIndex: 1,
  },
  saveButtonIcon: {
    backgroundColor: "rgba(56, 107, 246, 0.1)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateItinerary;
