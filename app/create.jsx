import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

const Create = () => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    uri: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    location: "Santorini",
  });

  const galleryImages = [
    {
      uri: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
      date: "2024-03-15",
      location: "Eiffel Tower, Paris",
    },
    {
      uri: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      date: "2024-03-14",
      location: "Bali Beach",
    },
    {
      uri: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
      date: "2024-03-14",
      location: "Machu Picchu",
    },
    {
      uri: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      date: "2024-03-13",
      location: "Taj Mahal",
    },
    {
      uri: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9",
      date: "2024-03-13",
      location: "Santorini",
    },
    {
      uri: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d",
      date: "2024-03-12",
      location: "Tokyo Tower",
    },
  ];
  const router = useRouter();
  // Fix the handleExplore function
  const handleNext = () => {
    router.push("/nextCreate");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}></Text>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Main Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: selectedImage.uri }} style={styles.mainImage} />

        {/* Location Info Overlay */}
        <View style={styles.locationOverlay}>
          <Text style={styles.cityState}>{selectedImage.location}</Text>
          <View style={styles.locationDetails}>
            <Feather name="map-pin" size={22} color="#CAC8C8" />
            <Text style={styles.stateCountry}>{selectedImage.location}</Text>
            <Text style={styles.rating}>4.8</Text>
          </View>
        </View>
      </View>

      {/* Gallery Button */}
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={() => setShowGallery(true)}
      >
        <Feather name="image" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Gallery Modal */}
      <Modal
        visible={showGallery}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGallery(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.galleryContainer}>
            <View style={styles.galleryHeader}>
              <TouchableOpacity onPress={() => setShowGallery(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.galleryTitle}>Recent Photos</Text>
              <TouchableOpacity>
                <Text style={styles.nextButton}>Next</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.galleryScroll}>
              {Array.from(new Set(galleryImages.map((img) => img.date))).map(
                (date) => (
                  <View key={date} style={styles.dateSection}>
                    <Text style={styles.dateHeader}>
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <View style={styles.imagesGrid}>
                      {galleryImages
                        .filter((img) => img.date === date)
                        .map((image, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.galleryItem}
                            onPress={() => {
                              setSelectedImage({
                                uri: image.uri,
                                location: image.location,
                              });
                              setShowGallery(false);
                            }}
                          >
                            <Image
                              source={{ uri: image.uri }}
                              style={styles.galleryImage}
                              resizeMode="cover"
                            />
                            <View style={styles.locationLabel}>
                              <Feather
                                name="map-pin"
                                size={12}
                                color="#FFFFFF"
                                style={styles.locationIcon}
                              />
                              <Text style={styles.locationText}>
                                {image.location}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  statusBar: {
    height: 44,
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  time: {
    fontFamily: "Alexandria",
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  nextButton: {
    fontFamily: "Actor",
    fontSize: 16,
    color: "#3897F0",
    letterSpacing: -0.33,
  },
  imageContainer: {
    width: 396.5,
    height: 586.75,
    alignSelf: "center",
    marginTop: 80,
    borderRadius: 40.5,
    overflow: "hidden",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40.5,
  },
  locationOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 101.25,
    backgroundColor: "rgba(29, 29, 29, 0.4)",
    borderRadius: 20.25,
    padding: 15,
    backdropFilter: "blur(27px)",
  },
  cityState: {
    fontFamily: "Poppins",
    fontSize: 21.6,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  locationDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  stateCountry: {
    fontFamily: "Actor",
    fontSize: 18.9,
    color: "#CAC8C8",
    marginLeft: 10,
  },
  rating: {
    fontFamily: "Poppins",
    fontSize: 18.9,
    color: "#CAC8C8",
    position: "absolute",
    right: 10,
  },
  galleryButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#386BF6",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  galleryContainer: {
    height: height * 0.6,
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1E1E1E",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  galleryTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  cancelButton: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  galleryScroll: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  dateSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  dateHeader: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  galleryItem: {
    width: "42.5%",
    aspectRatio: 1,
    marginBottom: 3,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#2C2C2C",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  locationLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 11,
    flex: 1,
  },
});

export default Create;
