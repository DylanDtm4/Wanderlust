import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Mapview from 'react-native-maps'
//import { AppleMaps, GoogleMaps } from 'expo-maps';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Location');
  const [spots, setSpots] = useState([]);

  const categories = ['Location', 'Hotels', 'Food', 'Adventure'];

  // Mock data for spots
  const spotsData = {
    Location: [
      { id: 1, name: 'Santorini', image: { uri: 'https://images.unsplash.com/photo-1570077188670-6a96fe70f8a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 2, name: 'Machu Picchu', image: { uri: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 3, name: 'Maldives', image: { uri: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
    ],
    Hotels: [
      { id: 1, name: 'Burj Al Arab', image: { uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 2, name: 'Marina Bay Sands', image: { uri: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 3, name: 'The Peninsula', image: { uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
    ],
    Food: [
      { id: 1, name: 'Noma Copenhagen', image: { uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 2, name: 'Tsuta Tokyo', image: { uri: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 3, name: 'Le Bernardin', image: { uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
    ],
    Adventure: [
      { id: 1, name: 'Bungee NZ', image: { uri: 'https://images.unsplash.com/photo-1600021292732-c8473091f981?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 2, name: 'Safari Kenya', image: { uri: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
      { id: 3, name: 'Ice Climbing', image: { uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }},
    ],
  };

  const handleTabClick = (category) => {
    setActiveTab(category);
    setSpots(spotsData[category]);
  };


  return (
    <>
      {/* Hide the header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Main Container */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.exploreText}>Explore</Text>
            <Text style={styles.aspenText}>Aspen</Text>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>Aspen, USA</Text>
          </View>
          <TouchableOpacity style={styles.surpriseMeButton}>
            <Text style={styles.surpriseMeText}>Surprise Me</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Find things to do</Text>
        </View>

        {/* Category Tabs */}
        <View style={styles.category}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tabItem,
                activeTab === category && styles.tabItemActive,
              ]}
              onPress={() => handleTabClick(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === category && styles.tabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {/*<Image
            style={styles.mapImage}
            source={require('../assets/images/Map.png')}
            resizeMode="cover"
          />
          */}
          {/*Install npx expo install react-native-maps */}
          <Mapview style={styles.mapImage}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421}}
          >

          </Mapview>
        </View>

        {/* Spots Container */}
        
        <ScrollView style={styles.spotsContainer}>
          {spots.map((spot) => (
            <View key={spot.id} style={styles.spotCard}>
              <Image source={spot.image} style={styles.spotImage} />
              <Text style={styles.spotName}>{spot.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Explore;

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 35,
  },
  exploreText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '400',
    color: '#1E1E1E',
  },
  aspenText: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: '500',
    color: '#386BF6',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#386BF6',
    marginRight: 6,
  },
  locationText: {
    fontFamily: 'Actor',
    fontSize: 15,
    color: 'black',
  },
  surpriseMeButton: {
    backgroundColor: '#386BF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  surpriseMeText: {
    fontFamily: 'Actor',
    fontSize: 12,
    color: '#FFFFFF',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E3E6',
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(30, 30, 30, 0.87)',
  },

  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E2E3E6',
  },
  tabItemActive: {
    backgroundColor: '#176FF2',
  },
  tabText: {
    fontFamily: 'Actor',
    fontSize: 14,
    color: '#1E1E1E',
  },
  tabTextActive: {
    fontFamily: 'Actor',
    fontSize: 14,
    color: '#FFFFFF',
  },

  
  mapContainer: {
    flex: 1,
    position: 'relative', // Ensure the map is the base layer
    alignItems: 'center',

  },
  mapImage: {
    width: 450,
    height: 555,
  },

  spotsContainer: {
    position: 'absolute',
    top: 300,
    left: 250,
    //right: 20,
    height: 650,
    width:200,
    //overflow: 'visible',
    zIndex: 1,
  },
  spotCard: {
    width: '90%',
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  spotImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  spotName: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    padding: 12,
    textAlign: 'left',
  },
});
