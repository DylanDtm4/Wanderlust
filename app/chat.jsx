import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Animated } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

const Chat = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey! I\'d love to join your trip to Paris!',
      sender: params.userId,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      text: 'That would be great! When are you free to discuss the details?',
      sender: 'me',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '3',
      text: 'How about tomorrow at 3pm? I can meet at the coffee shop near Central Park.',
      sender: params.userId,
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ]);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const toggleMenu = () => {
    if (showMenu) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleAction = (action) => {
    toggleMenu();
    // Handle the selected action (block, report, or favorite)
    console.log(`User selected to ${action} ${params.userName}`);
  };

  const sendMessage = () => {
    if (message.trim().length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'me',
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Stack.Screen
        options={{
          // In the header title component
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Image 
                source={params.userAvatar} 
                style={styles.headerAvatar}
              />
              <Text style={styles.headerTitle}>{params.userName}</Text>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/messages')} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.chatWrapper}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageContainer,
                msg.sender === 'me' ? styles.userContainer : null
              ]}
            >
              // In the message rendering section
              {msg.sender !== 'me' && (
                <View style={styles.botInfo}>
                  <Image 
                    source={params.userAvatar} 
                    style={styles.botAvatar}
                  />
                  <Text style={styles.messageTime}>
                    {params.userName} • {formatTime(msg.timestamp)}
                  </Text>
                </View>
              )}
              
              {msg.sender === 'me' && (
                <Text style={styles.messageTime}>
                  You • {formatTime(msg.timestamp)}
                </Text>
              )}
              
              <View style={[
                styles.messageBubble,
                msg.sender === 'me' ? styles.userMessageBubble : null
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.sender === 'me' ? styles.userMessageText : null
                ]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Action Menu Modal */}
        {showMenu && (
          <TouchableOpacity 
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={toggleMenu}
          >
            <Animated.View 
              style={[
                styles.menuContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleAction('favorite')}
              >
                <MaterialIcons name="favorite-border" size={22} color="#FFFFFF" />
                <Text style={styles.menuItemText}>Add to Favorites</Text>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.destructiveMenuItem]}
                onPress={() => handleAction('block')}
              >
                <MaterialIcons name="block" size={22} color="#FF453A" />
                <Text style={[styles.menuItemText, styles.destructiveText]}>Block User</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.destructiveMenuItem]}
                onPress={() => handleAction('report')}
              >
                <MaterialIcons name="report" size={22} color="#FF453A" />
                <Text style={[styles.menuItemText, styles.destructiveText]}>Report User</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="white"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.attachButton}>
            <Feather name="paperclip" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendButton, message.trim() ? styles.activeSendButton : null]}
            onPress={sendMessage}
          >
            <Feather name="send" size={20} color={message.trim() ? "#FFFFFF" : "#666"} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    marginLeft: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  chatWrapper: {
    flex: 1,
    position: 'relative',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chatContentContainer: {
    paddingBottom: 100,
  },
  messageContainer: {
    marginBottom: 24,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 8,
  },
  messageTime: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  messageBubble: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 16,
    maxWidth: '80%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  userMessageBubble: {
    backgroundColor: '#386BF6',
  },
  messageText: {
    fontFamily: 'Poppins',
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderTopWidth: 1,
    borderTopColor: '#333',
    position: 'absolute',
    marginBottom: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: 15,
    maxHeight: 100,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSendButton: {
    backgroundColor: '#386BF6',
  },
  // Menu styles
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 14,
    paddingVertical: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 101,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Poppins',
  },
  destructiveMenuItem: {
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
  },
  destructiveText: {
    color: '#FF453A',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#383838',
    marginVertical: 4,
  },
});

export default Chat;