import React, { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import type { Post, ZipperUser, ZippLine } from '@/types/post';
import { mockPosts } from '@/mocks/posts';

interface ZipplignState {
  // User state
  currentUser: ZipperUser | null;
  isAuthenticated: boolean;
  
  // Posts and interactions
  posts: Post[];
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  followedUsers: Set<string>;
  
  // Zip lines
  activeZipLines: ZippLine[];
  
  // Draft management
  drafts: Post[];
  
  // Location and discovery
  nearbyPosts: Post[];
  
  // Actions
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  toggleFollow: (username: string) => void;
  joinZipLine: (postId: string) => void;
  saveDraft: (post: Partial<Post>) => void;
  publishPost: (post: Post) => void;
  loadNearbyPosts: (location?: { lat: number; lng: number }) => void;
  authenticateUser: (user: ZipperUser) => void;
  signOut: () => void;
}

const STORAGE_KEYS = {
  LIKED_POSTS: 'zipplign_liked_posts',
  BOOKMARKED_POSTS: 'zipplign_bookmarked_posts',
  FOLLOWED_USERS: 'zipplign_followed_users',
  DRAFTS: 'zipplign_drafts',
  CURRENT_USER: 'zipplign_current_user',
};

export const [ZipplignProvider, useZipplign] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<ZipperUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [activeZipLines, setActiveZipLines] = useState<ZippLine[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [nearbyPosts, setNearbyPosts] = useState<Post[]>([]);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [likedData, bookmarkedData, followedData, draftsData, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LIKED_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_POSTS),
        AsyncStorage.getItem(STORAGE_KEYS.FOLLOWED_USERS),
        AsyncStorage.getItem(STORAGE_KEYS.DRAFTS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER),
      ]);

      if (likedData) {
        setLikedPosts(new Set(JSON.parse(likedData)));
      }
      if (bookmarkedData) {
        setBookmarkedPosts(new Set(JSON.parse(bookmarkedData)));
      }
      if (followedData) {
        setFollowedUsers(new Set(JSON.parse(followedData)));
      }
      if (draftsData) {
        setDrafts(JSON.parse(draftsData));
      }
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error persisting ${key}:`, error);
    }
  };

  const toggleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      persistData(STORAGE_KEYS.LIKED_POSTS, Array.from(newSet));
      return newSet;
    });

    // Update post likes count
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentLikes = parseInt(post.hearts.replace('K', '000').replace('M', '000000'));
        const newLikes = likedPosts.has(postId) ? currentLikes - 1 : currentLikes + 1;
        const formattedLikes = newLikes >= 1000000 
          ? `${(newLikes / 1000000).toFixed(1)}M`
          : newLikes >= 1000 
          ? `${Math.floor(newLikes / 1000)}K`
          : newLikes.toString();
        return { ...post, hearts: formattedLikes };
      }
      return post;
    }));
  }, [likedPosts]);

  const toggleBookmark = useCallback((postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      persistData(STORAGE_KEYS.BOOKMARKED_POSTS, Array.from(newSet));
      return newSet;
    });
  }, []);

  const toggleFollow = useCallback((username: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      persistData(STORAGE_KEYS.FOLLOWED_USERS, Array.from(newSet));
      return newSet;
    });
  }, []);

  const joinZipLine = useCallback((postId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    // Create or update zip line
    setActiveZipLines(prev => {
      const existingLine = prev.find(line => line.originalPost.id === postId);
      if (existingLine) {
        return prev.map(line => 
          line.id === existingLine.id 
            ? { ...line, totalZippers: line.totalZippers + 1 }
            : line
        );
      } else {
        const newLine: ZippLine = {
          id: `zipline_${postId}_${Date.now()}`,
          originalPost,
          zippers: [],
          totalZippers: 1,
          isActive: true,
        };
        return [...prev, newLine];
      }
    });

    // Update post zippers count
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const currentZippers = parseInt(post.zippers);
        return { ...post, zippers: (currentZippers + 1).toString() };
      }
      return post;
    }));
  }, [posts]);

  const saveDraft = useCallback((post: Partial<Post>) => {
    const draft: Post = {
      id: `draft_${Date.now()}`,
      username: currentUser?.username || 'anonymous',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      thumbnail: post.thumbnail || '',
      description: post.description || '',
      music: post.music || '',
      musicCover: post.musicCover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150',
      likes: '0',
      comments: '0',
      shares: '0',
      bookmarks: '0',
      hearts: '0',
      zippers: '0',
      duration: post.duration || 0,
      isPGN: post.isPGN || false,
      isRemix: post.isRemix || false,
      originalPost: post.originalPost,
      ...post,
    };

    setDrafts(prev => {
      const newDrafts = [...prev, draft];
      persistData(STORAGE_KEYS.DRAFTS, newDrafts);
      return newDrafts;
    });
  }, [currentUser]);

  const publishPost = useCallback((post: Post) => {
    setPosts(prev => [post, ...prev]);
    
    // Remove from drafts if it was a draft
    if (post.id.startsWith('draft_')) {
      setDrafts(prev => {
        const newDrafts = prev.filter(d => d.id !== post.id);
        persistData(STORAGE_KEYS.DRAFTS, newDrafts);
        return newDrafts;
      });
    }
  }, []);

  const loadNearbyPosts = useCallback((location?: { lat: number; lng: number }) => {
    // Simulate loading nearby posts based on location
    // In a real app, this would make an API call
    const shuffledPosts = [...mockPosts].sort(() => Math.random() - 0.5);
    setNearbyPosts(shuffledPosts.slice(0, 10));
  }, []);

  const authenticateUser = useCallback((user: ZipperUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    persistData(STORAGE_KEYS.CURRENT_USER, user);
  }, []);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  return {
    currentUser,
    isAuthenticated,
    posts,
    likedPosts,
    bookmarkedPosts,
    followedUsers,
    activeZipLines,
    drafts,
    nearbyPosts,
    toggleLike,
    toggleBookmark,
    toggleFollow,
    joinZipLine,
    saveDraft,
    publishPost,
    loadNearbyPosts,
    authenticateUser,
    signOut,
  };
});