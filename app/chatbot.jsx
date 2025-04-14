import React, {useState, useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useRouter} from 'expo-router';

const ChatbotPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user's message to UI
    setMessages((prev) => [...prev, userMessage]);
    setMessage(""); // Clear input

    try {
      // Send to backend/chatbot for a reply
      const res = await fetch("http://localhost:8080/chatbot/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user123", message: userMessage.text }),
      });

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toISOString(),
      };

      // Add bot message to UI
      setMessages((prev) => [...prev, botMessage]);

      // Save both messages to DB
      await fetch("http://localhost:8080/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123", // replace with actual user ID
          userMessage: userMessage.text,
          botMessage: botMessage.text,
        }),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Wanderbot",
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#FFFFFF",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.chatWrapper}>
        <ScrollView style={styles.chatContainer}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.sender === "user" && styles.userContainer,
              ]}
            >
              {msg.sender === "bot" && (
                <View style={styles.botInfo}>
                  <Image
                    source={require("../assets/images/wanderBot.png")}
                    style={styles.botAvatar}
                  />
                  <Text style={styles.messageTime}>
                    Wanderbot • {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              {msg.sender === "user" && (
                <Text style={styles.messageTime}>
                  You • {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === "user" && styles.userMessageBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === "user" && styles.userMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
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
            style={[
              styles.sendButton,
              message.trim() ? styles.activeSendButton : null,
            ]}
            onPress={sendMessage}
          >
            <Feather
              name="send"
              size={20}
              color={message.trim() ? "#FFFFFF" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  backButton: {
    marginLeft: 16,
  },
  chatWrapper: {
    flex: 1,
    position: "relative",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  botAvatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 8,
  },
  messageTime: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#666",
  },
  messageBubble: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 16,
    maxWidth: "80%",
  },
  userContainer: {
    alignItems: "flex-end",
  },
  userMessageBubble: {
    backgroundColor: "#386BF6",
  },
  messageText: {
    fontFamily: "Poppins",
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: "absolute",
    marginBottom: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    color: "#FFFFFF",
    fontFamily: "Poppins",
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
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  activeSendButton: {
    backgroundColor: "#386BF6",
  },
});

export default ChatbotPage;
