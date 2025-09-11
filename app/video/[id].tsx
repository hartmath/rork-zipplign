import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Animated,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Heart, MessageCircle, Share2, Bookmark, Music, X, Send, Zap, ArrowLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { mockPosts } from "@/mocks/posts";
import { mockDiscoverVideos } from "@/mocks/discover";
import type { Post } from "@/types/post";

export default function VideoScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string, {id: string, username: string, text: string, avatar: string}[]>>({});
  const likeAnimations = useRef<Map<string, Animated.Value>>(new Map());

  // Find the video from either posts or discover videos
  let videoData: Post | null = null;
  const postData = mockPosts.find(post => post.id === id);
  
  if (postData) {
    videoData = postData;
  } else {
    // Create a mock post from discover video data
    const discoverVideo = mockDiscoverVideos.find(video => video.id === id);
    if (discoverVideo) {
      videoData = {
        id: discoverVideo.id,
        username: "creator_" + discoverVideo.id,
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        thumbnail: discoverVideo.thumbnail,
        description: "Amazing content! Check this out 🔥 #trending #viral",
        music: "Original Sound - creator_" + discoverVideo.id,
        musicCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150",
        likes: discoverVideo.views,
        comments: "1.2K",
        shares: "892",
        bookmarks: "5.6K",
      };
    }
  }

  const handleHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const getOrCreateLikeAnimation = (postId: string) => {
    if (!likeAnimations.current.has(postId)) {
      likeAnimations.current.set(postId, new Animated.Value(1));
    }
    return likeAnimations.current.get(postId)!;
  };

  const toggleLike = (postId: string) => {
    handleHaptic();
    const animation = getOrCreateLikeAnimation(postId);
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId: string) => {
    handleHaptic();
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleFollow = (username: string) => {
    handleHaptic();
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const handleShare = () => {
    handleHaptic();
    console.log('Share functionality would be implemented here');
  };

  const handleRemix = (postId: string) => {
    handleHaptic();
    router.push(`/remix?postId=${postId}`);
  };

  const handleComment = (postId: string) => {
    handleHaptic();
    setShowCommentModal(true);
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !videoData) return;
    
    const newComment = {
      id: Date.now().toString(),
      username: "you",
      text: commentText.trim(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };

    setComments(prev => ({
      ...prev,
      [videoData.id]: [...(prev[videoData.id] || []), newComment]
    }));
    
    setCommentText("");
    handleHaptic();
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setCommentText("");
  };

  const getPostComments = (postId: string) => {
    return comments[postId] || [
      {
        id: "1",
        username: "sarah_designs",
        text: "This is amazing! 🔥",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
      },
      {
        id: "2", 
        username: "creative_mike",
        text: "Love the creativity here!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      }
    ];
  };

  const handleBack = () => {
    handleHaptic();
    router.back();
  };

  if (!videoData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Video not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLiked = likedPosts.has(videoData.id);
  const isBookmarked = bookmarkedPosts.has(videoData.id);
  const isFollowed = followedUsers.has(videoData.username);
  const likeAnimation = getOrCreateLikeAnimation(videoData.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.videoContainer}>
        <Image source={{ uri: videoData.thumbnail }} style={styles.backgroundImage} />
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />

        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButtonHeader} onPress={handleBack}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sidebar}>
              <TouchableOpacity style={styles.profileButton} onPress={() => toggleFollow(videoData.username)}>
                <Image source={{ uri: videoData.userAvatar }} style={styles.avatar} />
                {!isFollowed && (
                  <View style={styles.followButton}>
                    <Text style={styles.followText}>+</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleLike(videoData.id)}
              >
                <Animated.View style={[styles.likeAnimation, { transform: [{ scale: likeAnimation }] }]}>
                  <Heart 
                    size={28} 
                    color={isLiked ? "#14b8a6" : "#fff"} 
                    fill={isLiked ? "#14b8a6" : "transparent"}
                    strokeWidth={2}
                  />
                </Animated.View>
                <Text style={styles.actionText}>{videoData.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(videoData.id)}>
                <MessageCircle size={28} color="#fff" strokeWidth={2} />
                <Text style={styles.actionText}>{videoData.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleBookmark(videoData.id)}
              >
                <Bookmark 
                  size={28} 
                  color={isBookmarked ? "#14b8a6" : "#fff"}
                  fill={isBookmarked ? "#14b8a6" : "transparent"}
                  strokeWidth={2}
                />
                <Text style={styles.actionText}>{videoData.bookmarks}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={28} color="#fff" strokeWidth={2} />
                <Text style={styles.actionText}>{videoData.shares}</Text>
              </TouchableOpacity>

              {/* Ride my Zip Button */}
              <TouchableOpacity 
                style={styles.remixButton} 
                onPress={() => handleRemix(videoData.id)}
              >
                <Zap size={28} color="#14b8a6" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.musicButton} onPress={handleHaptic}>
                <Image source={{ uri: videoData.musicCover }} style={styles.musicCover} />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.username}>@{videoData.username}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {videoData.description}
              </Text>
              <View style={styles.musicInfo}>
                <Music size={14} color="#fff" />
                <Text style={styles.musicText} numberOfLines={1}>
                  {videoData.music}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCommentModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={closeCommentModal}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.commentsContainer}>
            {getPostComments(videoData.id).map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUsername}>@{comment.username}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={[styles.commentInputContainer, { paddingBottom: insets.bottom + 10 }]}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { opacity: commentText.trim() ? 1 : 0.5 }]}
              onPress={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Send size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
  },
  sidebar: {
    position: "absolute",
    right: 12,
    bottom: 80,
    alignItems: "center",
    gap: 20,
  },
  profileButton: {
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
  },
  followButton: {
    position: "absolute",
    bottom: -8,
    backgroundColor: "#14b8a6",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  followText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButton: {
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  musicButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  musicCover: {
    width: "100%",
    height: "100%",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingRight: 80,
    gap: 8,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  musicInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  musicText: {
    color: "#fff",
    fontSize: 13,
    flex: 1,
  },
  likeAnimation: {
    // Animation container
  },
  remixButton: {
    alignItems: 'center',
    gap: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  commentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentItem: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentUsername: {
    color: "#14b8a6",
    fontSize: 14,
    fontWeight: "600",
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#333",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});