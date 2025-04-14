import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter} from 'expo-router';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();
  return (
    <KeyboardAvoidingView x
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Wanderbot",
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#FFFFFF',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.chatWrapper}>
        <ScrollView style={styles.chatContainer}>
          {/* Bot Welcome Message */}
          <View style={styles.messageContainer}>
            <View style={styles.botInfo}>
              <Image 
                source={require('../assets/images/wanderBot.png')} 
                style={styles.botAvatar}
              />
              <Text style={styles.messageTime}>Wanderbot • 2:10 PM</Text>
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Hello Traveler! Welcome to Wanderlust bot! I was made with ✧. Type down any question you have about Wanderlust!
              </Text>
            </View>
          </View>

          {/* User Message */}
          <View style={[styles.messageContainer, styles.userContainer]}>
            <Text style={styles.messageTime}>You • 2:12 PM</Text>
            <View style={[styles.messageBubble, styles.userMessageBubble]}>
              <Text style={[styles.messageText, styles.userMessageText]}>
                Welcome
              </Text>
            </View>
          </View>
        </ScrollView>

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
  chatWrapper: {
    flex: 1,
    position: 'relative',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 8,
  },
  messageTime: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#666',
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
});

export default ChatbotPage;