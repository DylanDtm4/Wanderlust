import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const initialMessages = [
  {
    id: '1',
    user: 'Sarah Parker',
    avatar: require('../assets/images/profile1.jpg'),
    lastMessage: 'Hey! Id love to join your trip to Paris!',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    user: 'Mike Thompson',
    avatar: require('../assets/images/profile2.jpg'),
    lastMessage: 'The itinerary looks perfect 👌',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    user: 'Emma Wilson',
    avatar: require('../assets/images/profile3.jpg'),
    lastMessage: 'When are we planning to meet?',
    time: '3h ago',
    unread: false,
  },
  {
    id: '4',
    user: 'John Davis',
    avatar: require('../assets/images/profile4.webp'),
    lastMessage: 'Thanks for sharing the details!',
    time: '1d ago',
    unread: false,
  },
];

const Messages = () => {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');

  const renderMessage = ({ item }) => (
    <TouchableOpacity 
      style={styles.messageContainer}
      onPress={() => router.push({
        pathname: '/chat',
        params: { 
          userId: item.id,
          userName: item.user,
          userAvatar: item.avatar,
        }
      })}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <Text style={[styles.lastMessage, item.unread && styles.unreadMessage]}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Messages",
          headerStyle: {
            backgroundColor: '#1E1E1E',
          },
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={styles.activeFilterText}>All Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Unread</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Archived</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity style={styles.newMessageButton}>
          <Feather name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#386BF6',
  },
  filterText: {
    color: '#666',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#386BF6',
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    color: '#666',
    fontFamily: 'Poppins',
    fontSize: 12,
  },
  lastMessage: {
    color: '#999',
    fontFamily: 'Poppins',
    fontSize: 14,
  },
  unreadMessage: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  newMessageButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#386BF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Messages;