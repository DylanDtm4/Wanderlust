import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/images/Logo2.png';


const savedLocations = [
  {
    uri: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
    date: '2024-03-15',
    location: 'Eiffel Tower, Paris',
    author: 'Alice Johnson',
    city: 'Paris, France',
  },
  {
    uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
    date: '2024-03-14',
    location: 'Bali Beach',
    author: 'John Doe',
    city: 'Bali, Indonesia',
  },
  {
    uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
    date: '2024-03-14',
    location: 'Machu Picchu',
    author: 'Emily Smith',
    city: 'Cusco, Peru',
  },
  {
    uri: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d',
    date: '2024-03-12',
    location: 'Tokyo Tower',
    author: 'Michael Brown',
    city: 'Tokyo, Japan',
  },
];

const savedHotels = [
  {
    uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    date: '2024-03-15',
    name: 'Luxury Resort, Maldives',
    author: 'Sophia Lee',
    city: 'Malé, Maldives',
  },
  {
    uri: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
    date: '2024-03-14',
    name: 'Mountain Lodge, Switzerland',
    author: 'Daniel Green',
    city: 'Zermatt, Switzerland',
  },
];

const savedFood = [
  {
    uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    date: '2024-03-15',
    name: 'Sushi Platter, Tokyo',
    author: 'Olivia White',
    city: 'Tokyo, Japan',
  },
  {
    uri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    date: '2024-03-14',
    name: 'Pasta, Italy',
    author: 'James Black',
    city: 'Rome, Italy',
  },
];

const savedAdventures = [
  {
    uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
    date: '2024-03-15',
    name: 'Hiking, Machu Picchu',
    author: 'Emma Taylor',
    city: 'Cusco, Peru',
  },
  {
    uri: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff',
    date: '2024-03-14',
    name: 'Scuba Diving, Great Barrier Reef',
    author: 'William Clark',
    city: 'Cairns, Australia',
  },
];

const Saved = () => {
   
  const [activeTab, setActiveTab] = useState('Location'); // State to track active tab
  const router = useRouter(); // Router for navigation

  // Function to handle item click
  const handleItemClick = (image, location, author,city) => {
    router.push({
      pathname: '/post',
      params: { image, location, author , city },
    });
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    let data;
    switch (activeTab) {
      case 'Location':
        data = savedLocations;
        break;
      case 'Hotels':
        data = savedHotels;
        break;
      case 'Food':
        data = savedFood;
        break;
      case 'Adventure':
        data = savedAdventures;
        break;
      default:
        data = [];
    }

    return data.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={styles.savedItem}
        onPress={() => handleItemClick(item.uri, item.location || item.name, item.author)}
      >
        <Image source={{ uri: item.uri }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.location || item.name}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#425884" />
      </TouchableOpacity>
    ));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
      {/* Logo at the top right */}
      <Image
      source={Logo}
      style={styles.logo}
      resizeMode="contain"
    />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.wanderlustText}>Wanderlust</Text>
          <Text style={styles.savedText}>Saved</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryContainer}>
          {['Location', 'Hotels', 'Food', 'Adventure'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.categoryTab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeTab === tab && styles.activeCategoryText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Saved Items */}
        <ScrollView style={styles.savedItemsContainer}>
          {renderContent()}
        </ScrollView>
      </View>
    </>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },logo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 100, // Adjust the size as needed
    height: 100, // Adjust the size as needed
  },
  header: {
    padding: 30,
    paddingTop: 100,
    marginBottom: 5,
  },
  wanderlustText: {
    fontFamily: 'Poppins',
    fontSize: 32,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: -0.01,
  },
  savedText: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '700',
    color: '#386BF6',
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 28,
    marginTop: 20,
  },
  categoryTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 33,
  },
  activeTab: {
    backgroundColor: '#386BF6',
  },
  categoryText: {
    fontFamily: 'Actor',
    fontSize: 14,
    color: 'black',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  savedItemsContainer: {
    flex: 1,
    padding: 20,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    shadowColor: 'rgba(66, 88, 132, 0.1)',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 5,
  },
  itemImage: {
    width: 51,
    height: 56,
    borderRadius: 7,
    backgroundColor: '#E6E6E6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    color: '#767676',
  },
  itemDate: {
    fontFamily: 'Actor',
    fontSize: 8,
    color: 'rgba(66, 88, 132, 0.5)',
    marginTop: 2,
  },
});