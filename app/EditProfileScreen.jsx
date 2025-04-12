import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from 'expo-router'; // Import useRouter
import profilePic from '../assets/images/profile1.jpg';

// Divider Component
const Divider = () => <View style={styles.divider} />;

// Form Field Component
const FormField = ({ label, value, inputType, multiline = false, onChangeText }) => (
  <View style={styles.formFieldContainer}>
    <View style={styles.labelContainer}>
      <Text style={styles.labelText}>{label}</Text>
    </View>
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={
          inputType === "email" ? "email-address" : inputType === "tel" ? "phone-pad" : "default"
        }
        secureTextEntry={inputType === "password"}
        multiline={multiline}
        style={styles.input}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </View>
  </View>
);

// Form Section Component
const FormSection = ({ title, children }) => (
  <View>
    {title && (
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    )}
    <View style={styles.formSection}>{children}</View>
  </View>
);

// Profile Photo Component
const ProfilePhoto = () => (
  <View style={styles.profilePhotoContainer}>
    <View style={styles.photoWrapper}>
      <Image
        source={profilePic}
        style={styles.profileImage}
        accessibilityLabel="Profile"
      />
    </View>
    <TouchableOpacity style={styles.changePhotoButton}>
      <Text style={styles.changePhotoText}>Change Profile Photo</Text>
    </TouchableOpacity>
  </View>
);

// Main Edit Profile Screen Component
const EditProfileScreen = () => {
  const router = useRouter(); // Initialize the router

  const handleCancel = () => {
    router.push('/Profile'); // Explicitly go to the profile route
  };

  const handleDone = () => {
    // In a real application, you would save the updated profile data here
    console.log("Profile data saved (simulated)");
    router.push('/Profile'); // Explicitly go to the profile route
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}> {/* Add onPress for Cancel */}
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        <TouchableOpacity onPress={handleDone}> {/* Add onPress for Done */}
          <Text style={styles.headerDoneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <ProfilePhoto />

          <View style={styles.formContainer}>
            <FormSection>
              <FormField label="Name" value="Jacob West" inputType="text" />
              <Divider />
              <FormField label="Username" value="jacob_w" inputType="text" />
              <Divider />
              <FormField label="Locations" value="Texas | Toronto | Chicago" inputType="text" />
              <Divider />
              <FormField
                label="Description"
                value="Travel blogs in Texas Follow me for an adventure"
                inputType="text"
                multiline
              />
            </FormSection>
          </View>

          <View style={styles.formContainer}>
            <FormSection title="Account Information">
              <FormField label="Email" value="jacob.west@gmail.com" inputType="email" />
              <Divider />
              <FormField label="Phone" value="+1 202 555 0147" inputType="tel" />
              <Divider />
              <FormField label="Gender" value="Male" inputType="text" />
              <Divider />
              <FormField label="Current Location" value="North America" inputType="text" />
            </FormSection>
          </View>
        </View>
      </ScrollView>
      {/* Re-render your custom header here */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.headerDoneButton}>Done</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

// ... rest of your styles

//export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 60,
    borderBottomColor: "#e5e7eb",
  },
  headerButtonText: {
    color: "#3b82f6",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerDoneButton: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  profilePhotoContainer: {
    alignItems: "center",
  },
  photoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoButton: {
    marginTop: 8,
  },
  changePhotoText: {
    color: "#3b82f6",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 24,
  },
  formSection: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitleContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  formFieldContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  labelContainer: {
    width: "33%",
  },
  labelText: {
    color: "#6b7280",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    color: "#1f2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 16,
  },
});

export default EditProfileScreen;
