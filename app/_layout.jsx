import React, { useState, useEffect, useRef } from 'react';
import { Stack, Tabs, Slot } from 'expo-router';
import { View, ActivityIndicator, Animated, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import LoginScreen from './LoginScreen';
import SplashScreen from './splash';

const _layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  // Animation values
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const loginPosition = useRef(new Animated.Value(300)).current; // Start off-screen to the right

  useEffect(() => {
    // Simulate splash screen delay
    setTimeout(() => {
      // Fade out splash screen
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashVisible(false);
        // Slide in login screen from right
        Animated.timing(loginPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          
        }).start();
      });
      
      // Simulate an authentication check
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 0);
    }, 2000); 
  }, []);

  if (isSplashVisible) {
    return (
      <Animated.View style={[styles.fullScreen, { opacity: splashOpacity }]}>
        <SplashScreen />
      </Animated.View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Animated.View style={[
        styles.fullScreen,
        { transform: [{ translateX: loginPosition }] }
      ]}>
        <LoginScreen setIsAuthenticated={setIsAuthenticated} />
      </Animated.View>
    );
  }

  return (
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
        <Tabs.Screen name="create" options={{ title: 'Create' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default _layout;
