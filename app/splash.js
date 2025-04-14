import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const planePosition = new Animated.ValueXY({ x: -180, y: height / 3 });

  useEffect(() => {
    // Plane animation sequence
    Animated.sequence([
      // Fly across screen
      Animated.timing(planePosition.x, {
        toValue: width + 50,
        duration: 4000,
        useNativeDriver: true,
      }),
      // Reset position to start
      Animated.timing(planePosition.x, {
        toValue: -50,
        duration: 0,
        useNativeDriver: true,
      }),
      // Fly to logo
      Animated.timing(planePosition, {
        toValue: { x: width / 25, y: height / 10 - 45 },
        duration: 4000,
        useNativeDriver: true,
      })
    ]).start();

    // Original animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();

    const timer = setTimeout(() => {
      // No need to navigate here, the _layout will handle it
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#ADD8E6', '#6699CC', '#ADD8E6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.planeContainer,
          {
            transform: [
              { translateX: planePosition.x },
              { translateY: planePosition.y },
              { rotate: '45deg' }
            ]
          }
        ]}
      >
        <Feather name="send" size={24} color="#FFFFFF" />
      </Animated.View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <MaterialCommunityIcons name="compass-rose" size={120} color="#FFFFFF" />
        <View style={styles.circleOverlay} />
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeTo}>Welcome to</Text>
        <Text style={styles.appTitle}>WanderLust</Text>
        <Text style={styles.tagline}>Your Journey Begins Here</Text>
      </Animated.View>

      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  circleOverlay: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeTo: {
    fontFamily: 'Poppins',
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  appTitle: {
    fontFamily: 'Poppins',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagline: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    bottom: 50,
    left: -50,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: height / 2,
    right: -20,
  },
  planeContainer: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default SplashScreen;