import React, { useState, useEffect } from 'react';
import { Tabs, Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import TabBar from '../components/TabBar';
import LoginScreen from './LoginScreen';
import SplashScreen from './splash';
import { useFonts } from 'expo-font';

// Keep the splash screen visible while we fetch resources
const _layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  //const [isSplash, setisSplash] = useState(false);
  

  useEffect(() => {
    // Simulate splash screen delay
    setTimeout(() => {
      setIsLoading(false);
      return <SplashScreen/>
      
    }, 4000);
  }, []);

  // Show loading spinner while app is loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }
  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen setIsAuthenticated={setIsAuthenticated} />;
  }

  // Show tabs only after the user is authenticated
  return (
    <>
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="create" options={{ title: 'Create' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
    </>
  );

};

export default _layout;