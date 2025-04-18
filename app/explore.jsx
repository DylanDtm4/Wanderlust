import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Stack } from 'expo-router';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');
const SPOT_CARD_WIDTH = width * 0.65;

const Explore = () => {
  const [activeTab, setActiveTab] = useState('Location');
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const router = useRouter();
  
  const handleSeeAll = () => {
    router.push({
      pathname: '/spots',
      params: { spotsData: JSON.stringify(spotsData) }
    });
  };
  const categories = [
    { id: 'Location', icon: 'location' },
    { id: 'Hotels', icon: 'bed' },
    { id: 'Food', icon: 'restaurant' },
    { id: 'Adventure', icon: 'bicycle' },
  ];

  const spotsData = {
    Location: [
      { 
        id: 1, 
        name: 'Times Square', 
        location: 'New York City',
        image: require('../assets/images/timesquare.jpg')},

      { 
        id: 2, 
        name: 'Empire State Building', 
        location: 'New York City',
        image: { uri: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80' }
      },
      { 
        id: 3, 
        name: 'Central Park', 
        location: 'New York City',
        image: { uri: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80' }
      },
      { 
        id: 4, 
        name: 'Maldives', 
        location: 'Indian Ocean',
        image: { uri: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
    ],
    Hotels: [
      { 
        id: 1, 
        name: 'Burj Al Arab', 
        location: 'Dubai',
        image: { uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
      { 
        id: 2, 
        name: 'Marina Bay Sands', 
        location: 'Singapore',
        image: { uri: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
      { 
        id: 3, 
        name: 'The Peninsula', 
        location: 'Hong Kong',
        image: { uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
    ],
    Food: [
      { 
        id: 1, 
        name: 'Noma Copenhagen', 
        location: 'Denmark',
        image: { uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
      { 
        id: 2, 
        name: 'Tsuta Tokyo', 
        location: 'Japan',
        image: { uri: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
      { 
        id: 3, 
        name: 'Le Bernardin', 
        location: 'New York',
        image: { uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
    ],
    Adventure: [
      { 
        id: 1, 
        name: 'Bungee NZ', 
        location: 'New Zealand',
        image: { uri: 'https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80' }
      },
      { 
        id: 2, 
        name: 'Safari Kenya', 
        location: 'Kenya',
        image: { uri: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
      { 
        id: 3, 
        name: 'Ice Climbing', 
        location: 'Canada',
        image: { uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' }
      },
    ],
  };

  const handleTabClick = (category) => {
    setActiveTab(category);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.exploreText}>Explore</Text>
            <Text style={styles.aspenText}>Aspen</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color="#386BF6" />
            <Text style={styles.locationText}>Aspen, USA</Text>
          </View>
        </View>

        {/* Search Bar 
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchText}>Find things to do</Text>
        </TouchableOpacity>
        */}

        {/* Category Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.tabItem,
                activeTab === category.id && styles.tabItemActive,
              ]}
              onPress={() => handleTabClick(category.id)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={activeTab === category.id ? '#fff' : '#386BF6'} 
                style={styles.tabIcon}
              />
              <Text style={[
                styles.tabText,
                activeTab === category.id && styles.tabTextActive,
              ]}>
                {category.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map */}
        
        <View style={[
          styles.mapContainer,
          isMapFullScreen && styles.fullScreenMap
        ]}>
          <TouchableOpacity 
            style={styles.mapTouchable}
            activeOpacity={1}
            onPress={() => setIsMapFullScreen(!isMapFullScreen)}
          >
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: 40.758896,
                longitude: -73.985130,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Spots Carousel */}
        <View style={styles.spotsTitleContainer}>
          <Text style={styles.spotsTitle}>Popular {activeTab.toLowerCase()}</Text>
          <TouchableOpacity 
            style={styles.seeAllButton} 
            activeOpacity={0.8}
            onPress={handleSeeAll}
          >
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={16} color="#386BF6" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spotsContainer}
        >
          {spotsData[activeTab].map((spot) => (
            <TouchableOpacity 
              key={spot.id} 
              style={styles.spotCard}
              activeOpacity={0.9}
            >
              <Image 
                source={spot.image} 
                style={styles.spotImage} 
                resizeMode="cover"
              />
              <View style={styles.spotOverlay} />
              
              <View style={styles.spotContent}>
                <View style={styles.spotHeader}>
                  <Text style={styles.spotName} numberOfLines={2}>{spot.name}</Text>
                  <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
                    <Ionicons name="bookmark" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.spotDetails}>
                  <Ionicons name="location" size={16} color="#FFFFFF" />
                  <Text style={styles.spotLocation}>{spot.location || 'Aspen, USA'}</Text>
                </View>
                
                <View style={styles.spotFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                  <Text style={styles.priceText}>$200/night</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  headerLeft: {
    flex: 1,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  aspenText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#386BF6',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#1E1E1E',
    fontWeight: '500',
    marginLeft: 6,
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#386BF6',
    marginRight: 6,
  },
  locationText: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryContainer: {
    paddingBottom: 20,
    paddingRight: 20,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginRight: 10,
  },
  tabItemActive: {
    backgroundColor: '#386BF6',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#386BF6',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#E2E3E6',
  },
  fullScreenMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    borderRadius: 0,
    zIndex: 100,
  },
  mapTouchable: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  spotsTitleContainer: {
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  seeAllText: {
    fontSize: 14,
    color: '#386BF6',
    fontWeight: '500',
    marginRight: 5,
  },
  spotsContainer: {
    paddingBottom: 120,
    
  },
  spotCard: {
    
    width: SPOT_CARD_WIDTH,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  spotImage: {
    width: '100%',
    height: 237,
  },
  spotOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  spotContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  spotDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  spotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 5,
  },
});

export default Explore;

