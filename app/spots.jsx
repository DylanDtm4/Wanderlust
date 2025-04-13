import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const Spots = () => {
  const params = useLocalSearchParams();
  const spotsData = JSON.parse(params.spotsData);

  // Flatten the spotsData object into a single array
  const allSpots = Object.values(spotsData).flat();

  // Add unique index to each spot to ensure unique keys
  const spotsWithUniqueKeys = allSpots.map((spot, index) => ({
    ...spot,
    uniqueKey: `${spot.id}-${index}`
  }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {spotsWithUniqueKeys.map((spot) => (
            <TouchableOpacity 
              key={spot.uniqueKey}  
              style={styles.spotCard}
              activeOpacity={0.9}
            >
              <Image 
                source={spot.image} 
                style={styles.spotImage} 
                resizeMode="cover"
              />
              
              <View style={styles.spotContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotLocation}>
                    <Ionicons name="location" size={14} color="#666" /> {spot.location}
                  </Text>
                </View>
                
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={20} color="#386BF6" />
              </TouchableOpacity>
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
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 30,
    paddingTop: 50,
  },
  spotCard: {
    width: CARD_WIDTH,
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    alignSelf: 'center',
  },
  spotImage: {
    width: '100%',
    height: 220,
  },
  spotContent: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  spotLocation: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 5,
  },
  saveButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Spots;