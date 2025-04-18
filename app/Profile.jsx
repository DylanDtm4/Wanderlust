import React from "react";
import { useRouter, Stack } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import profile1 from "../assets/images/profile1.jpg";
import fuji from "../assets/images/fuji.png";
import paris from "../assets/images/paris.png";
import profile6 from "../assets/images/profile6.jpg";
import profile7 from "../assets/images/profile7.webp";
import profile4 from "../assets/images/profile4.webp";
import gridPosts from "../assets/images/gridIcon.png";

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 40) / 3; // Adjusted for 3 columns and spacing

const Profile = () => {
    const router = useRouter();

    const handleAddCardPress = () => {
        router.push("/create");
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    statusBarAnimation: "slide",
                    statusBarStyle: "dark",
                }}
            />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.usernameText}>john_doe</Text>
                    {/* Optional: Add settings icon here */}
                    {/* <TouchableOpacity>
                        <Ionicons name="settings-outline" size={24} color="#262626" />
                    </TouchableOpacity> */}
                </View>

                <View style={styles.profileContainer}>
                    <Image source={profile1} style={styles.profileImage} />
                    <View style={styles.statsContainer}>
                        {[
                            { label: "Posts", value: 54 },
                            { label: "Followers", value: 834 },
                            { label: "Following", value: 162 },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.statItem}>
                                <Text style={styles.statNumber}>{item.value}</Text>
                                <Text style={styles.statLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.profileInfo}>
                    <Text style={styles.nameBold}>John Doe</Text>
                    <Text style={styles.bio}>Travel blogs in Texas</Text>
                    <Text style={styles.bio}>Follow me for an adventure</Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push("/EditProfileScreen")}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tabBar}>
                    <TouchableOpacity style={styles.tabItem}>
                        <Image source={gridPosts} style={styles.tabIcon} />
                    </TouchableOpacity>
                    {/* Add more tabs here if needed (e.g., tagged posts) */}
                    {/* <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="pricetag-outline" size={24} color="#262626" />
                    </TouchableOpacity> */}
                </View>

                <View style={styles.gridContainer}>
                    <Card image={fuji} location="Fuji, Tokyo" />
                    <Card image={profile6} location="Aspen, CO" />
                    <Card image={profile7} location="Toronto, ON" />
                    <Card image={paris} location="Paris, France" />
                    <Card image={profile4} location="Beijing, China" />
                    <TouchableOpacity style={styles.addCard} onPress={handleAddCardPress}>
                        <Ionicons name="add-circle-outline" size={30} color="#386BF6" />
                    </TouchableOpacity>
                    {/* Add more cards here */}
                </View>
            </ScrollView>
        </>
    );
};

const Card = ({ image, location }) => (
    <View style={styles.card}>
        <Image source={image} style={styles.cardImage} />
        {location && <Text style={styles.cardLocation}>{location}</Text>}
    </View>
);

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50, // Adjust for status bar
        paddingBottom: 15,
    },
    usernameText: {
        fontFamily: "Poppins-SemiBold", // Ensure you have this font
        fontSize: 20,
        color: "#262626",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#eee",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        flex: 1,
        marginLeft: 20,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#262626",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
    },
    profileInfo: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    nameBold: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#262626",
        marginBottom: 5,
    },
    bio: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },
    editButton: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        alignSelf: "flex-start",
    },
    editButtonText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingVertical: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    tabIcon: {
        width: 24,
        height: 24,
        tintColor: "#262626",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        paddingTop: 10,
        justifyContent: "space-between",
    },
    card: {
        width: cardSize,
        height: cardSize,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 10,
        overflow: "hidden",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    cardLocation: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "#fff",
        paddingVertical: 5,
        paddingHorizontal: 8,
        fontSize: 12,
    },
    addCard: {
        width: cardSize,
        height: cardSize,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});