import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Smile, Camera, Mic, Heart, Plus } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  avatar?: string;
}

const CONTACT_INFO = {
  name: 'Sarah Johnson',
  username: '@sarah_j',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  isOnline: true,
};

const USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! Love your latest Zippclip! 🔥',
      isUser: false,
      timestamp: new Date(Date.now() - 300000),
      avatar: CONTACT_INFO.avatar,
    },
    {
      id: '2',
      text: 'Thanks! Want to collab on the next one?',
      isUser: true,
      timestamp: new Date(Date.now() - 240000),
      avatar: USER_AVATAR,
    },
    {
      id: '3',
      text: 'Absolutely! I have some great ideas',
      isUser: false,
      timestamp: new Date(Date.now() - 180000),
      avatar: CONTACT_INFO.avatar,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
        avatar: USER_AVATAR,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'That sounds amazing! 🎬',
          'Can\'t wait to see what we create together!',
          'Let\'s make it viral! 🚀',
          'Your creativity is inspiring! ✨',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date(),
          avatar: CONTACT_INFO.avatar,
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !item.isUser && (!prevMessage || prevMessage.isUser || 
      item.timestamp.getTime() - prevMessage.timestamp.getTime() > 300000);
    const isConsecutive = prevMessage && prevMessage.isUser === item.isUser && 
      item.timestamp.getTime() - prevMessage.timestamp.getTime() < 60000;
    const showTime = !isConsecutive || index === messages.length - 1;

    return (
      <View style={styles.messageWrapper}>
        <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
          {!item.isUser && (
            <View style={styles.avatarContainer}>
              {showAvatar ? (
                <TouchableOpacity>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                </TouchableOpacity>
              ) : (
                <View style={styles.avatarSpacer} />
              )}
            </View>
          )}
          <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble, isConsecutive && styles.consecutiveMessage]}>
            <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          </View>
          {item.isUser && (
            <TouchableOpacity style={styles.messageActions}>
              <Heart size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {showTime && (
          <Text style={[styles.timestamp, item.isUser ? styles.userTimestamp : styles.botTimestamp]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={[styles.messageContainer, styles.botMessage]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: CONTACT_INFO.avatar }} style={styles.avatar} />
        </View>
        <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0f172a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <TouchableOpacity style={styles.headerTitleContainer}>
              <Image source={{ uri: CONTACT_INFO.avatar }} style={styles.headerAvatar} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerName}>{CONTACT_INFO.name}</Text>
                <Text style={styles.headerUsername}>{CONTACT_INFO.username}</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, CONTACT_INFO.isOnline && styles.onlineStatus]} />
                  <Text style={styles.headerStatus}>
                    {CONTACT_INFO.isOnline ? 'Active now' : 'Last seen recently'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={22} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={22} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreVertical size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />
        
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.mediaButton}>
              <Plus size={22} color="#14b8a6" />
            </TouchableOpacity>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Send a message..."
                placeholderTextColor="#666"
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <View style={styles.inputActions}>
                <TouchableOpacity style={styles.inputActionButton}>
                  <Camera size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputActionButton}>
                  <Smile size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            {inputText.trim() ? (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Send size={18} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton}>
                <Mic size={22} color="#14b8a6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  messageWrapper: {
    marginVertical: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 44,
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  avatarSpacer: {
    width: 36,
    height: 36,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consecutiveMessage: {
    marginTop: 2,
  },
  userBubble: {
    backgroundColor: '#14b8a6',
    borderBottomRightRadius: 8,
  },
  botBubble: {
    backgroundColor: '#1f1f1f',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  typingBubble: {
    paddingVertical: 18,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  messageActions: {
    paddingLeft: 8,
    paddingBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  userTimestamp: {
    textAlign: 'right',
    marginRight: 52,
  },
  botTimestamp: {
    textAlign: 'left',
    marginLeft: 52,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14b8a6',
  },
  inputContainer: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  mediaButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1f1f1f',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    color: '#ffffff',
    paddingVertical: 8,
    lineHeight: 20,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputActionButton: {
    padding: 6,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14b8a6',
    shadowColor: '#14b8a6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerUsername: {
    color: '#14b8a6',
    fontSize: 14,
    marginTop: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 6,
  },
  onlineStatus: {
    backgroundColor: '#14b8a6',
  },
  headerStatus: {
    color: '#999',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
});