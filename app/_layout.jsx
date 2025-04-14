import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Slot, useRouter } from 'expo-router';
import { View, Animated, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import LoginScreen from './LoginScreen';
import SplashScreen from './splash';
import Signup from './signup';

const _layout = () => {
  const [appState, setAppState] = useState('splash'); // 'splash', 'login', 'signup', 'app'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false); // New state to track if root layout is ready
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const loginPosition = useRef(new Animated.Value(300)).current;
  const router = useRouter();

  useEffect(() => {
    // Simulate splash screen delay
    setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setAppState('login');
        Animated.timing(loginPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setIsAppReady(true); // Mark the layout as ready after login animation
        });
      });
    }, 2000);

    // Simulate authentication check (replace with your actual auth logic)
    setTimeout(() => {
      setIsAuthenticated(false); 
    }, 2500);
  }, []);

  if (!isAppReady && appState === 'login') {
    return (
      <Animated.View
        style={[styles.fullScreen, { transform: [{ translateX: loginPosition }] }]}
      >
        <LoginScreen setIsAuthenticated={setIsAuthenticated} />
      </Animated.View>
    );
  }

  if (appState === 'splash') {
    return (
      <Animated.View style={[styles.fullScreen, { opacity: splashOpacity }]}>
        <SplashScreen />
      </Animated.View>
    );
  }

  const handleScreenChange = (screen) => {
    setAppState(screen);
  };

  return (
    <View style={styles.fullScreen}>
      {isAuthenticated ? (
        <Tabs tabBar={(props) => <TabBar {...props} />}>
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
          <Tabs.Screen name="create" options={{ title: 'Create' }} />
          <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
          <Tabs.Screen name="Profile" options={{ title: 'Profile' }} />
        </Tabs>
      ) : (
        appState === 'login' ? (
          <LoginScreen 
            setIsAuthenticated={setIsAuthenticated}
            onSignup={() => handleScreenChange('signup')}
          />
        ) : (
          appState === 'signup' && (
            <Signup 
            setIsAuthenticated={setIsAuthenticated}
            onLogin={() => handleScreenChange('login')} />
          )
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
});

export default _layout;