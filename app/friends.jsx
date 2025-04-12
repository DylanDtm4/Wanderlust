import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const friendsData = [
  {
    id: 1,
    name: 'Sarah Parker',
    username: '@sparker',
    location: 'New York, USA',
    mutual: 12,
    avatar: { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    interests: ['Photography', 'Hiking', 'Culture'],
    status: 'Exploring Tokyo right now! 🗼',
  },
  {
    id: 2,
    name: 'Mike Chen',
    username: '@miketravel',
    location: 'Toronto, Canada',
    mutual: 8,
    avatar: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    interests: ['Food', 'Adventure', 'Cities'],
    status: 'Planning next trip to Paris',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    username: '@emmaw',
    location: 'London, UK',
    mutual: 15,
    avatar: { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
    interests: ['Nature', 'Photography', 'History'],
    status: 'Just returned from Iceland!',
  },
  {
    id: 4,
    name: 'Alex Rivera',
    username: '@alexr',
    location: 'Barcelona, Spain',
    mutual: 6,
    avatar: { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    interests: ['Beach', 'Culture', 'Food'],
    status: 'Looking for travel buddies in Europe',
  },
];

const FindFriends = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderFriendCard = (friend) => (
    <TouchableOpacity key={friend.id} style={styles.friendCard}>
      <View style={styles.cardHeader}>
        <Image source={friend.avatar} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.username}>{friend.username}</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color="#666" />
            <Text style={styles.location}>{friend.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.status}>{friend.status}</Text>
      
      <View style={styles.interestsContainer}>
        {friend.interests.map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.mutualContainer}>
        <Feather name="users" size={14} color="#666" />
        <Text style={styles.mutualText}>{friend.mutual} mutual friends</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Friends</Text>
        <TouchableOpacity>
          <Feather name="filter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search travelers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Friends List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {friendsData.map(friend => renderFriendCard(friend))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    marginTop: 2,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  friendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: '#386BF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#F0F7FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 12,
    color: '#386BF6',
    fontWeight: '500',
  },
  mutualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
  },
});

export default FindFriends;