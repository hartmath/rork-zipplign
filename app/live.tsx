import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  Radio, 
  Users, 
  Heart, 
  MessageCircle, 
  Gift, 
  Share2, 
  Send,
  Eye,
  Clock
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  streamerAvatar: string;
  thumbnail: string;
  viewers: number;
  category: string;
  isLive: boolean;
  duration?: string;
  startedAt: string;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isGift?: boolean;
  giftType?: string;
}

const mockLiveStreams: LiveStream[] = [
  {
    id: '1',
    title: 'Digital Art Creation Live Session 🎨',
    streamer: 'ArtistMike',
    streamerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    viewers: 1250,
    category: 'Art',
    isLive: true,
    startedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Music Production Masterclass',
    streamer: 'BeatMaker',
    streamerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    viewers: 890,
    category: 'Music',
    isLive: true,
    startedAt: '45 minutes ago',
  },
  {
    id: '3',
    title: 'Photography Tips & Tricks',
    streamer: 'PhotoMaster',
    streamerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    viewers: 2100,
    category: 'Photography',
    isLive: true,
    startedAt: '1 hour ago',
  },
  {
    id: '4',
    title: 'Fashion Design Workshop',
    streamer: 'DesignPro',
    streamerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    viewers: 567,
    category: 'Fashion',
    isLive: false,
    duration: '2:30:15',
    startedAt: 'Ended 30 minutes ago',
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    username: 'CreativeFan',
    message: 'Amazing work! Love the colors you chose 🎨',
    timestamp: '2m ago',
  },
  {
    id: '2',
    username: 'ArtLover23',
    message: 'Can you show us the brush settings?',
    timestamp: '1m ago',
  },
  {
    id: '3',
    username: 'DigitalArtist',
    message: 'This is so inspiring! Thank you for sharing',
    timestamp: '30s ago',
    isGift: true,
    giftType: '🎁',
  },
  {
    id: '4',
    username: 'NewViewer',
    message: 'Just joined! What software are you using?',
    timestamp: '10s ago',
  },
];

export default function LiveScreen() {
  const insets = useSafeAreaInsets();
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isLiked, setIsLiked] = useState(false);
  const [viewerCount, setViewerCount] = useState(1250);

  useEffect(() => {
    if (selectedStream) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 10) - 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: 'You',
        message: chatMessage,
        timestamp: 'now',
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const renderLiveStream = (stream: LiveStream) => (
    <TouchableOpacity 
      key={stream.id} 
      style={styles.streamCard}
      onPress={() => setSelectedStream(stream)}
    >
      <View style={styles.streamImageContainer}>
        <Image source={{ uri: stream.thumbnail }} style={styles.streamImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.streamGradient}
        />
        
        {stream.isLive ? (
          <View style={styles.liveIndicator}>
            <Radio size={12} color="#fff" fill="#ef4444" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        ) : (
          <View style={styles.recordedIndicator}>
            <Clock size={12} color="#fff" />
            <Text style={styles.recordedText}>{stream.duration}</Text>
          </View>
        )}
        
        <View style={styles.viewersBadge}>
          <Eye size={12} color="#fff" />
          <Text style={styles.viewersText}>{stream.viewers.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.streamInfo}>
        <View style={styles.streamerInfo}>
          <Image source={{ uri: stream.streamerAvatar }} style={styles.streamerAvatar} />
          <View style={styles.streamerDetails}>
            <Text style={styles.streamTitle} numberOfLines={2}>{stream.title}</Text>
            <Text style={styles.streamerName}>{stream.streamer}</Text>
            <Text style={styles.streamTime}>{stream.startedAt}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChatMessage = (message: ChatMessage) => (
    <View key={message.id} style={styles.chatMessage}>
      <Text style={styles.chatUsername}>{message.username}</Text>
      <Text style={styles.chatText}>
        {message.isGift && <Text style={styles.giftIcon}>{message.giftType} </Text>}
        {message.message}
      </Text>
      <Text style={styles.chatTime}>{message.timestamp}</Text>
    </View>
  );

  if (selectedStream) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            title: selectedStream.streamer,
            headerStyle: { backgroundColor: '#14b8a6' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '600' },
          }} 
        />
        
        <View style={styles.livePlayerContainer}>
          <Image source={{ uri: selectedStream.thumbnail }} style={styles.livePlayer} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.livePlayerGradient}
          />
          
          <View style={styles.livePlayerOverlay}>
            <View style={styles.livePlayerHeader}>
              <View style={styles.liveStatus}>
                <Radio size={16} color="#fff" fill="#ef4444" />
                <Text style={styles.liveStatusText}>LIVE</Text>
                <View style={styles.viewersCount}>
                  <Users size={14} color="#fff" />
                  <Text style={styles.viewersCountText}>{viewerCount.toLocaleString()}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.livePlayerActions}>
              <TouchableOpacity 
                style={styles.liveActionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Heart 
                  size={24} 
                  color={isLiked ? '#ef4444' : '#fff'} 
                  fill={isLiked ? '#ef4444' : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.liveActionButton}>
                <MessageCircle size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.liveActionButton}>
                <Gift size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.liveActionButton}>
                <Share2 size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.chatContainer}>
          <Text style={styles.chatHeader}>Live Chat</Text>
          <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
            {chatMessages.map(renderChatMessage)}
          </ScrollView>
          
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Say something..."
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Send size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Live Streaming',
          headerStyle: { backgroundColor: '#14b8a6' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Streams</Text>
          <Text style={styles.headerSubtitle}>
            Watch live streams from your favorite creators
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Live</Text>
          {mockLiveStreams.filter(stream => stream.isLive).map(renderLiveStream)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recordings</Text>
          {mockLiveStreams.filter(stream => !stream.isLive).map(renderLiveStream)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  streamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  streamImageContainer: {
    position: 'relative',
    height: 200,
  },
  streamImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  streamGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordedIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recordedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewersBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  streamInfo: {
    padding: 16,
  },
  streamerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  streamerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  streamerDetails: {
    flex: 1,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 22,
  },
  streamerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14b8a6',
    marginBottom: 2,
  },
  streamTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  livePlayerContainer: {
    position: 'relative',
    height: 250,
  },
  livePlayer: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  livePlayerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  livePlayerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  livePlayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewersCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  viewersCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  livePlayerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  liveActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  chatHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 12,
  },
  chatUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14b8a6',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 2,
  },
  giftIcon: {
    fontSize: 16,
  },
  chatTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});