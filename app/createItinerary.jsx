import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

const CreateItinerary = () => {
  const { picture, inputData } = useLocalSearchParams();
  const formData = JSON.parse(inputData);
  const router = useRouter();
  const [days, setDays] = useState([]);
  const [dayTitle, setDayTitle] = useState("");
  const [dayNumber, setDayNumber] = useState("");
  const [activityText, setActivityText] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [activities, setActivities] = useState([]);
  const addActivity = () => {
    if (activityTime && activityText) {
      setActivities([
        ...activities,
        { time: activityTime, activity: activityText },
      ]);
      setActivityText("");
      setActivityTime("");
    }
  };

  const deleteActivity = (index) => {
    const updated = [...activities];
    updated.splice(index, 1);
    setActivities(updated);
  };

  const addDay = () => {
    if (dayNumber && dayTitle && activities.length > 0) {
      const newDay = {
        day: parseInt(dayNumber),
        title: dayTitle,
        activities: activities,
      };
      setDays([...days, newDay]);
      setDayNumber("");
      setDayTitle("");
      setActivities([]);
    }
  };

  const deleteDay = (index) => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
  };
  const uploadToCloudinary = async (localUri) => {
    const data = new FormData();

    data.append("file", {
      uri: localUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doynqhkzz/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      return result.secure_url; // or result.url
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("Image upload failed.");
    }
  };
  const handlePost = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User is not logged in.");
      }

      // Step 1: Get the username from the backend using userID
      const response = await fetch(
        `https://wanderlustbackend-s12f.onrender.com/user/username/${user.uid}`
      );

      if (!response.ok) {
        throw new Error("Failed to retrieve username");
      }

      const data = await response.json();
      const username = data.username;

      // Step 2: Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(picture);
      if (!imageUrl) throw new Error("Failed to upload image to Cloudinary");

      // Step 3: Post the data to your backend MongoDB
      const postResponse = await fetch(
        "https://wanderlustbackend-s12f.onrender.com/create/post", // Remember to fix the URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: user.uid,
            username: username,
            picture: imageUrl,
            title: formData.title,
            location: formData.location,
            city: formData.city,
            bestTime: formData.bestTime,
            duration: formData.duration,
            lowerBudget: formData.lowerBudget,
            upperBudget: formData.upperBudget,
            activities: formData.activities,
            description: formData.description,
            itinerary: days,
          }),
        }
      );

      if (!postResponse.ok) throw new Error("Failed to create post in DB");
      router.push("/");
      alert("Post created successfully!");
    } catch (err) {
      console.error("Post error:", err);
      alert("Error creating post: " + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Create Post",
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#FFFFFF",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/nextCreate")}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <Text style={styles.header}>Create New Itinerary</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Day Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter day number"
            placeholderTextColor="#666"
            value={dayNumber}
            onChangeText={setDayNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Day Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor="#666"
            value={dayTitle}
            onChangeText={setDayTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity Time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 9:00 AM"
            placeholderTextColor="#666"
            value={activityTime}
            onChangeText={setActivityTime}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity Description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Visit Eiffel Tower"
            placeholderTextColor="#666"
            value={activityText}
            onChangeText={setActivityText}
          />
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={addActivity}>
          <Feather name="plus-circle" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Activity</Text>
        </TouchableOpacity>

        {activities.map((a, i) => (
          <View key={i} style={styles.activityPreviewContainer}>
            <Text style={styles.activityPreview}>
              • {a.time} - {a.activity}
            </Text>
            <TouchableOpacity onPress={() => deleteActivity(i)}>
              <Feather name="trash-2" size={18} color="#FF6666" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.postButton} onPress={addDay}>
          <Text style={styles.postButtonText}>Add Day to Itinerary</Text>
        </TouchableOpacity>

        {days.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Current Itinerary:</Text>
            {days.map((d, i) => (
              <View key={i} style={styles.dayBlock}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>
                    Day {d.day}: {d.title}
                  </Text>
                  <TouchableOpacity onPress={() => deleteDay(i)}>
                    <Feather name="trash-2" size={18} color="#FF6666" />
                  </TouchableOpacity>
                </View>
                {d.activities.map((a, j) => (
                  <Text key={j} style={styles.dayActivity}>
                    - {a.time} • {a.activity}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}

        {days.length > 0 && (
          <TouchableOpacity style={styles.postButton} onPress={handlePost}>
            <Text style={styles.postButtonText}>POST</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    flex: 1,
  },
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "700",
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    color: "#FFFFFF",
    fontFamily: "Poppins",
    fontSize: 16,
  },
  sectionHeader: {
    color: "#386BF6",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins",
    marginTop: 30,
    marginBottom: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#386BF6",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    justifyContent: "center",
  },
  postButton: {
    backgroundColor: "#386BF6",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "600",
    marginLeft: 8,
  },
  activityPreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  activityPreview: {
    color: "#CCCCCC",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  dayBlock: {
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  dayTitle: {
    color: "#FFFFFF",
    fontFamily: "Poppins",
    fontWeight: "700",
  },
  dayActivity: {
    color: "#CCCCCC",
    fontSize: 14,
    fontFamily: "Poppins",
  },
  backButton: {
    marginLeft: 16,
  },
});

export default CreateItinerary;
