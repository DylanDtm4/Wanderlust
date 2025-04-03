import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Easing } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Home from './index'

const { width, height } = Dimensions.get('window');

const surpriseLocations = [
  {
    id: 1,
    name: 'Santorini',
    city: 'Cyclades, Greece',
    author: 'Alice Johnson',
    image:  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' ,
    rating: '4.9',
    description: 'White-washed houses with blue domes overlooking the Aegean Sea'
  },
  {
    id: 2,
    name: 'Machu Picchu',
    city: 'Cusco Region, Peru',
    author: 'John Smith',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Mysterious Incan ruins perched high in the Andes Mountains'
  },
  {
    id: 3,
    name: 'Taj Mahal',
    city: 'Agra, India',
    author: 'Tammy Kean',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100' ,
    rating: '4.8',
    description: 'Majestic white-marble mausoleum symbolizing eternal love'
  },
  {
    id: 4,
    name: 'Mount Fuji',
    city: 'Honshu, Japan',
    author: 'Noah Kim',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: "Japan's tallest peak, often capped with snow, reflecting in serene lakes"
  },
  {
    id: 5,
    name: 'Bali Rice Terraces',
    city: 'Ubud, Indonesia',
    author: 'Ryan Rui',
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.7',
    description: 'Lush, cascading rice paddies blending with Balian beaches'
  },
  {
    id: 6,
    name: 'Colosseum',
    city: 'Rome, Italy',
    author: 'Joseph Jayden',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'Massive ancient amphitheater that once hosted gladiatorial contests'
  },
  {
    id: 7,
    name: 'Northern Lights',
    city: 'Tromsø, Norway',
    author: 'Emma Nielsen',
    image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Mesmerizing aurora borealis dancing across the Arctic sky'
  },
  {
    id: 8,
    name: 'Great Barrier Reef',
    city: 'Queensland, Australia',
    author: 'James Cook',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'World\'s largest coral reef system teeming with marine life'
  },
  {
    id: 9,
    name: 'Petra',
    city: 'Ma\'an, Jordan',
    author: 'Sarah Ahmed',
    image: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Ancient rose-red city carved into desert cliffs'
  },
  {
    id: 10,
    name: 'Zhangjiajie',
    city: 'Hunan, China',
    author: 'Li Wei',
    image: 'https://images.unsplash.com/photo-1537824598505-99ee03483384?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'Towering sandstone pillars that inspired Avatar\'s floating mountains'
  },
  {
    id: 11,
    name: 'Amalfi Coast',
    city: 'Campania, Italy',
    author: 'Marco Rossi',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Dramatic coastline with colorful villages perched on cliffs'
  },
  {
    id: 12,
    name: 'Cappadocia',
    city: 'Nevşehir, Turkey',
    author: 'Mehmet Yilmaz',
    image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'Surreal landscape of hot air balloons over fairy chimneys'
  },
  {
    id: 13,
    name: 'Angkor Wat',
    city: 'Siem Reap, Cambodia',
    author: 'Chen Liu',
    image: 'https://images.unsplash.com/photo-1458571037713-913d8b481dc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Magnificent ancient temple complex in the jungle'
  },
  {
    id: 14,
    name: 'Patagonia',
    city: 'Torres del Paine, Chile',
    author: 'Carlos Rodriguez',
    image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'Dramatic peaks and glaciers at the end of the world'
  },
  {
    id: 15,
    name: 'Sahara Desert',
    city: 'Merzouga, Morocco',
    author: 'Hassan Karim',
    image: 'https://images.unsplash.com/photo-1509022083314-63ffe7e37a7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.7',
    description: 'Endless golden dunes under starlit desert skies'
  },
  {
    id: 16,
    name: 'Banff',
    city: 'Alberta, Canada',
    author: 'Michael Thompson',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Turquoise lakes surrounded by snow-capped Rocky Mountains'
  },
  {
    id: 17,
    name: 'Dubrovnik',
    city: 'Dalmatia, Croatia',
    author: 'Ana Kovač',
    image: 'https://images.unsplash.com/photo-1600041161228-519e6dd27bac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.8',
    description: 'Pearl of the Adriatic with ancient walls and red-tiled roofs'
  },
  {
    id: 18,
    name: 'Yellowstone',
    city: 'Wyoming, USA',
    author: 'David Miller',
    image: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=100',
    rating: '4.9',
    description: 'Geothermal wonders and pristine wilderness in America\'s first national park'
  }
];


const SurprisePage = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sparkleAnim] = useState(new Animated.Value(0));

  // Initialize with a random location
  useEffect(() => {
    getRandomLocation();
    startSparkleAnimation();
  }, []);

  const startSparkleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getRandomLocation = () => {
    const randomIndex = Math.floor(Math.random() * surpriseLocations.length);
    setCurrentLocation(surpriseLocations[randomIndex]);
  };

  const handleLocationPress = () => {
    if (currentLocation) {
      router.push({
        pathname: '/post',
        params: { 
          image: currentLocation.image,
          location: currentLocation.name,
          author: currentLocation.author,
          city: currentLocation.city
        }
      });
    }
  };

  const handleCancel = () => {
    router.push({Home});
  };

  const handleSurpriseAgain = () => {
    getRandomLocation();
  };

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  if (!currentLocation) {
    return null; // or a loading spinner
  }

  return (
    <LinearGradient 
      colors={['#E6F0FF', '#FFFFFF']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Surprise Me</Text>
        <TouchableOpacity onPress={handleSurpriseAgain}>
          <Text style={styles.doneButton}>Try Again</Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeContainer}>
        {/* Sparkles */}
        <Animated.View style={[styles.sparkle, styles.sparkle1, { opacity: sparkleOpacity }]} />
        <Animated.View style={[styles.sparkle, styles.sparkle2, { opacity: sparkleOpacity }]} />
        <Animated.View style={[styles.sparkle, styles.sparkle3, { opacity: sparkleOpacity }]} />
        <Animated.View style={[styles.sparkle, styles.sparkle4, { opacity: sparkleOpacity }]} />
        <Animated.View style={[styles.sparkle, styles.sparkle5, { opacity: sparkleOpacity }]} />

        {/* Stars */}
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star1} />
        <Feather name="star" size={60} color="#A9C0FF" style={styles.star2} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Your Next Adventure Awaits</Text>
        <Text style={styles.subHeaderText}>We've picked something special just for you</Text>

        {/* Location Card */}
        <TouchableOpacity 
          style={styles.cardContainer}
          onPress={handleLocationPress}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: currentLocation.image }}
            style={styles.cardImage}
          />
          <BlurView intensity={80} style={styles.cardOverlay}>
            <Text style={styles.locationTitle}>{currentLocation.name}</Text>
            <View style={styles.locationInfo}>
              <Feather name="map-pin" size={20} color="#CAC8C8" />
              <Text style={styles.locationText}>{currentLocation.city}</Text>
              <Text style={styles.rating}>{currentLocation.rating} ★</Text>
            </View>
            <Text style={styles.locationDescription}>{currentLocation.description}</Text>
          </BlurView>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.likeButton}>
            <Feather name="heart" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleSurpriseAgain}>
            <Feather name="refresh-cw" size={20} color="#386BF6" />
            <Text style={styles.nextButtonText}>Try Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  cancelButton: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#262626',
  },
  pageTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
  },
  doneButton: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: '#386BF6',
  },
  decorativeContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  sparkle: {
    position: 'absolute',
    width: 25,
    height: 16,
    backgroundColor: '#386BF6',
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
  },
  sparkle1: {
    top: '20%',
    left: '10%',
  },
  sparkle2: {
    bottom: '25%',
    right: '15%',
  },
  sparkle3: {
    top: '30%',
    right: '20%',
    backgroundColor: '#A9C0FF',
  },
  sparkle4: {
    bottom: '40%',
    left: '20%',
    backgroundColor: '#A9C0FF',
  },
  sparkle5: {
    top: '50%',
    right: '30%',
    backgroundColor: '#386BF6',
  },
  star1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    opacity: 0.7,
  },
  star2: {
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    transform: [{ scaleX: -1 }],
    opacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  headerText: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '700',
    color: '#386BF6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeaderText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardContainer: {
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  locationTitle: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  rating: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 'auto',
  },
  locationDescription: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.85,
    marginTop: 30,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#386BF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom:50,
  },
  nextButtonText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    color: '#386BF6',
    marginLeft: 10,
    
  },
});

export default SurprisePage;