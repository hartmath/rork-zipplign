import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  ViewToken,
  StatusBar,
  Animated,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { Heart, MessageCircle, Share2, Bookmark, Music, Bell, X, Send, Zap } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { mockPosts } from "@/mocks/posts";
import type { Post } from "@/types/post";
import { useRefresh } from "./_layout";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { setRefreshTrigger } = useRefresh();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string, Array<{id: string, username: string, text: string, avatar: string}>>>({});
  const [refreshing, setRefreshing] = useState(false);
  const likeAnimations = useRef<Map<string, Animated.Value>>(new Map());

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

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
    setSelectedPostId(postId);
    setShowCommentModal(true);
  };

  const handleSendComment = () => {
    if (!commentText.trim() || !selectedPostId) return;
    
    const newComment = {
      id: Date.now().toString(),
      username: "you",
      text: commentText.trim(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };

    setComments(prev => ({
      ...prev,
      [selectedPostId]: [...(prev[selectedPostId] || []), newComment]
    }));
    
    setCommentText("");
    handleHaptic();
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPostId(null);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleHaptic();
    
    setTimeout(() => {
      console.log('Refreshed feed');
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    setRefreshTrigger(onRefresh);
  }, [onRefresh, setRefreshTrigger]);

  const handleNavPress = (nav: string) => {
    handleHaptic();
    switch (nav) {
      case 'Events':
        router.push('/events');
        break;
      case 'Store':
        router.push('/store');
        break;
      case 'Zippers':
        router.push('/zippers');
        break;
      case 'Live':
        router.push('/live');
        break;
      default:
        console.log(`Navigate to ${nav}`);
    }
  };

  const renderPost = ({ item, index }: { item: Post; index: number }) => {
    const isLiked = likedPosts.has(item.id);
    const isBookmarked = bookmarkedPosts.has(item.id);
    const isFollowed = followedUsers.has(item.username);
    const likeAnimation = getOrCreateLikeAnimation(item.id);

    return (
      <View style={[styles.postContainer, { height: SCREEN_HEIGHT }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.backgroundImage} />
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />

        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          {/* PIP for remix videos */}
          {item.isRemix && item.originalPost && (
            <View style={styles.pipContainer}>
              <Image source={{ uri: item.originalPost.thumbnail }} style={styles.pipVideo} />
              <View style={styles.pipOverlay}>
                <Image source={{ uri: item.originalPost.userAvatar }} style={styles.pipAvatar} />
                <Text style={styles.pipUsername} numberOfLines={1}>@{item.originalPost.username}</Text>
              </View>
            </View>
          )}

          <View style={styles.header}>
            <View style={styles.headerNavigation}>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('Events')}>
                <Text style={styles.navText}>Events</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('Store')}>
                <Text style={styles.navText}>Store</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('Zippers')}>
                <Text style={styles.navText}>Zippers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => handleNavPress('For you')}>
                <Text style={[styles.navText, styles.activeNavText]}>For you</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('Live')}>
                <Text style={styles.navText}>Live</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Bell size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[styles.content, { paddingBottom: insets.bottom + 60 }]}>
            <View style={styles.sidebar}>
              <TouchableOpacity style={styles.profileButton} onPress={() => router.push(`/user-profile?username=${item.username}&avatar=${encodeURIComponent(item.userAvatar)}`)}>
                <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                {!isFollowed && (
                  <TouchableOpacity 
                    style={styles.followButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFollow(item.username);
                    }}
                  >
                    <Text style={styles.followText}>+</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleLike(item.id)}
              >
                <Animated.View style={[styles.likeAnimation, { transform: [{ scale: likeAnimation }] }]}>
                  <Heart 
                    size={28} 
                    color={isLiked ? "#14b8a6" : "#fff"} 
                    fill={isLiked ? "#14b8a6" : "transparent"}
                    strokeWidth={2}
                  />
                </Animated.View>
                <Text style={styles.actionText}>{item.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
                <MessageCircle size={28} color="#fff" strokeWidth={2} />
                <Text style={styles.actionText}>{item.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleBookmark(item.id)}
              >
                <Bookmark 
                  size={28} 
                  color={isBookmarked ? "#14b8a6" : "#fff"}
                  fill={isBookmarked ? "#14b8a6" : "transparent"}
                  strokeWidth={2}
                />
                <Text style={styles.actionText}>{item.bookmarks}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={28} color="#fff" strokeWidth={2} />
                <Text style={styles.actionText}>{item.shares}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.remixButton} 
                onPress={() => handleRemix(item.id)}
              >
                <Zap size={28} color="#14b8a6" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.musicButton} onPress={handleHaptic}>
                <Animated.View style={[styles.musicAnimation, {
                  transform: [{ rotate: isPlaying ? '360deg' : '0deg' }]
                }]}>
                  <Image source={{ uri: item.musicCover }} style={styles.musicCover} />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.push(`/user-profile?username=${item.username}&avatar=${encodeURIComponent(item.userAvatar)}`)}>
                <Text style={styles.username}>@{item.username}</Text>
              </TouchableOpacity>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.musicInfo}>
                <Music size={14} color="#fff" />
                <Text style={styles.musicText} numberOfLines={1}>
                  {item.music}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={mockPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#14b8a6"
            colors={["#14b8a6"]}
          />
        }
      />
      
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
            {selectedPostId && getPostComments(selectedPostId).map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <TouchableOpacity onPress={() => {
                  closeCommentModal();
                  router.push(`/user-profile?username=${comment.username}&avatar=${encodeURIComponent(comment.avatar)}`);
                }}>
                  <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                </TouchableOpacity>
                <View style={styles.commentContent}>
                  <TouchableOpacity onPress={() => {
                    closeCommentModal();
                    router.push(`/user-profile?username=${comment.username}&avatar=${encodeURIComponent(comment.avatar)}`);
                  }}>
                    <Text style={styles.commentUsername}>@{comment.username}</Text>
                  </TouchableOpacity>
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
  postContainer: {
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: SCREEN_WIDTH,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  navItem: {
    paddingVertical: 4,
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#14b8a6",
  },
  activeNavText: {
    color: "#14b8a6",
    fontWeight: "600",
  },
  likeAnimation: {
    // Animation container
  },
  musicAnimation: {
    // Music rotation animation
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
  remixButton: {
    alignItems: 'center',
    gap: 2,
  },
  pipContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14b8a6',
    zIndex: 10,
  },
  pipVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pipAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pipUsername: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
});