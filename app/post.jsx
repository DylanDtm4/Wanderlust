import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image, Animated, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

const comments = [
  { text: "Have a nice day bro", author: "TravelLover123", avatar: require('../assets/images/profile1.jpg') },
  { text: "Wow this Trip sounds fun", author: "AdventureSeeker", avatar: require('../assets/images/profile2.jpg') },
  { text: "Wow this is amazing", author: "Wanderer22", avatar: require('../assets/images/profile3.jpg') },
  { text: "I wanna go on this trip now", author: "GlobeTrotter", avatar: require('../assets/images/profile4.webp') }
];

const Post = () => {
  const { image, location, author, city } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [savedCards, setSavedCards] = useState({});
  const lower = Math.floor(Math.random() * 100) + 100;
  const upper = Math.floor(Math.random() * 1000) + 200;
  const [votes, setVotes] = useState(Math.floor(Math.random() * 100000) + 10);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [isSaved, setIsSaved] = useState(false);
  const [voteState, setVoteState] = useState('neutral'); // 'upvoted', 'downvoted', or 'neutral'
  const [voteBgColor, setVoteBgColor] = useState('rgba(0, 0, 0, 0.5)');

  const handleSave = () => {
    setSavedCards(prevState => ({
      ...prevState,
      [location]: !prevState[location]
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentCommentIndex((prevIndex) => 
          (prevIndex + 1) % comments.length
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUpVote = () => {
    if (voteState === 'upvoted') {
      // Already upvoted, do nothing
      return;
    }
    
    if (voteState === 'downvoted') {
      // Changing from downvote to upvote
      setVotes(prevVotes => prevVotes + 2); // +1 to cancel downvote, +1 for upvote
      setVoteState('upvoted');
      setVoteBgColor('#4CAF50'); // Green
    } else {
      // Neutral to upvote
      setVotes(prevVotes => prevVotes + 1);
      setVoteState('upvoted');
      setVoteBgColor('#4CAF50'); // Green
    }
  };

  const handleDownVote = () => {
    if (voteState === 'downvoted') {
      // Already downvoted, do nothing
      return;
    }
    
    if (voteState === 'upvoted') {
      // Changing from upvote to downvote
      setVotes(prevVotes => prevVotes - 2); // -1 to cancel upvote, -1 for downvote
      setVoteState('downvoted');
      setVoteBgColor('#F44336'); // Red
    } else {
      // Neutral to downvote
      setVotes(prevVotes => prevVotes - 1);
      setVoteState('downvoted');
      setVoteBgColor('#F44336'); // Red
    }
  };

  const handleResetVote = () => {
    if (voteState === 'upvoted') {
      setVotes(prevVotes => prevVotes - 1);
    } else if (voteState === 'downvoted') {
      setVotes(prevVotes => prevVotes + 1);
    }
    setVoteState('neutral');
    setVoteBgColor('rgba(0, 0, 0, 0.5)'); // Original color
  };

  const handleMessage = () => {
    router.push('/messages');
  };
  
  const handleFriends = () => {
    router.push('/friends')
  };

  const toggleComments = () => {
    if (showAllComments) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowAllComments(false));
    } else {
      setShowAllComments(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const router = useRouter();
  const handleExplore = () => {
    router.push({
      pathname: '/Itinerary',
      params: { image, location, author, city }
    });
  };

  const renderComment = (comment, index) => (
    <View key={index} style={styles.comment}>
      <Image
        style={styles.commentAvatar}
        source={comment.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{comment.author}</Text>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    setIsLoading(true);
  }, [image]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#386BF6" />
          </View>
        )}
        <ImageBackground
          source={{ uri: image }}
          style={styles.backgroundImage}
          resizeMode="cover"
          onLoad={handleImageLoad}
        >
          {/* Blur Overlay */}
          <View style={styles.blurOverlay} />

          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <View style={styles.starContainer}>
                <Feather name="star" size={25} color="gold" />
                <Text style={styles.rating}>4.5</Text>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              style={[
                styles.savedButton, 
                { backgroundColor: savedCards[location] ? '#386BF6' : 'rgba(255, 255, 255, 0.1)' }
              ]} 
              onPress={handleSave}
            >
              <Feather 
                name="bookmark" 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Author Info */}
            <View style={styles.authorInfo}>
              <Text style={styles.byText}>By: {author}</Text>
              <Text style={styles.locationTitle}>{location}</Text>
            </View>

            {/* Location Info */}
            <View style={styles.locationInfo}>
              <Feather name="map-pin" size={24} color="#386BF6" />
              <Text style={styles.locationText}>{city}</Text>
            </View>

            {/* Voting Buttons */}
            <View style={[styles.votingSection, { backgroundColor: voteBgColor }]}>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={voteState === 'upvoted' ? handleResetVote : handleUpVote}
              >
                <Feather 
                  name="arrow-up" 
                  size={24} 
                  color={voteState === 'upvoted' ? '#FFFFFF' : '#386BF6'} 
                />
              </TouchableOpacity>
              <Text style={styles.voteCount}>{votes}</Text>
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={voteState === 'downvoted' ? handleResetVote : handleDownVote}
              >
                <Feather 
                  name="arrow-down" 
                  size={24} 
                  color={voteState === 'downvoted' ? '#FFFFFF' : '#386BF6'} 
                />
              </TouchableOpacity>
            </View>

            {/* Common Info */}
            <View style={styles.commonInfo}>
              <View style={styles.infoField}>
                <Text style={styles.fieldLabel}>Best Time</Text>
                <Text style={styles.fieldValue}>December - March</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.fieldLabel}>Duration</Text>
                <Text style={styles.fieldValue}>5-7 Days</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.fieldLabel}>Budget</Text>
                <Text style={styles.fieldValue}>${lower}-${upper}</Text>
              </View>
              <View style={styles.infoField}>
                <Text style={styles.fieldLabel}>Activities</Text>
                <Text style={styles.fieldValue}>Skiing, Hiking</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleFriends}>
                <Text style={styles.actionButtonText}>Find Friends</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <TouchableOpacity onPress={toggleComments}>
              <View style={styles.commentsSection}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentsTitle}>Comments</Text>
                  <Text style={styles.commentCount}>3.2k</Text>
                </View>
                
                {!showAllComments ? (
                  <Animated.View style={{ opacity: fadeAnim }}>
                    {renderComment(comments[currentCommentIndex], 0)}
                  </Animated.View>
                ) : (
                  <Animated.View style={{ 
                    opacity: slideAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }]
                  }}>
                    {comments.map((comment, index) => renderComment(comment, index))}
                    <View style={styles.viewMoreContainer}>
                      <Text style={styles.viewMoreText}>View all 3.2k comments</Text>
                      <Feather name="chevron-down" size={16} color="#FFFFFF" />
                    </View>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>

            {/* BOOK SECTION */}
            <TouchableOpacity onPress={handleExplore}>
              <View style={styles.bookContainer}>
                <Text style={styles.bookButton}>Explore!</Text>
                <View style={styles.bookButtonIcon}>
                  <Feather name="arrow-right" size={20} color="#386BF6" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  blurOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    opacity: 0.7,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 67,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 3,
  },
  savedButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  ratingSection: {
    height: 40,
    justifyContent: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authorInfo: {
    marginTop: 45,
    marginBottom: 12,
  },
  byText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  locationTitle: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  locationText: {
    fontFamily: 'Actor',
    fontSize: 16,
    fontStyle: 'bold',
    color: 'white',
    fontWeight: 400,
  },
  votingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-end',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  voteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteCount: {
    fontFamily: 'Actor',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  commonInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fieldValue: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#386BF6',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 110,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentsSection: {
    backgroundColor:  'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentsTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  commentCount: {
    fontFamily: 'Actor',
    fontSize: 13,
    color: '#FFFFFF',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  commentText: {
    fontFamily: 'Actor',
    fontSize: 12,
    color: '#FFFFFF',
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C7C7CC',
    resizeMode: 'cover',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 4,
  },
  bookContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 20,
    marginBottom: 30,
  },
  bookButton: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: '#386BF6',
    marginRight: 8,
  },
  bookButtonIcon: {
    backgroundColor: 'rgba(56, 107, 246, 0.1)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    zIndex: 1,
  },
});

export default Post;