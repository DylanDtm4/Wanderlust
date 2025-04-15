import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const NextCreate = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    city: "",
    bestTime: "",
    duration: "",
    lowerBudget: "",
    upperBudget: "",
    activities: "",
    description: "",
  });

  const handlePost = () => {
    // Handle post submission
    console.log(formData);
    router.push("/");
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
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              placeholderTextColor="#666"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
          </View>

          {/* Location Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              placeholderTextColor="#666"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>

          {/* Trip Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Best Time to Visit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., December - March"
              placeholderTextColor="#666"
              value={formData.bestTime}
              onChangeText={(text) =>
                setFormData({ ...formData, bestTime: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5-7 Days"
              placeholderTextColor="#666"
              value={formData.duration}
              onChangeText={(text) =>
                setFormData({ ...formData, duration: text })
              }
            />
          </View>

          {/* Budget Range */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Lower Budget</Text>
              <TextInput
                style={styles.input}
                placeholder="$"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={formData.lowerBudget}
                onChangeText={(text) =>
                  setFormData({ ...formData, lowerBudget: text })
                }
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Upper Budget</Text>
              <TextInput
                style={styles.input}
                placeholder="$"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={formData.upperBudget}
                onChangeText={(text) =>
                  setFormData({ ...formData, upperBudget: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activities</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Skiing, Hiking"
              placeholderTextColor="#666"
              value={formData.activities}
              onChangeText={(text) =>
                setFormData({ ...formData, activities: text })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your experience..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>
        </View>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  backButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
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
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "#386BF6",
    margin: 16,
    marginBottom: 150,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: "600",
  },
});

export default NextCreate;
