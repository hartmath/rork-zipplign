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
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Send, ArrowLeft, Phone, Video, MoreVertical, Smile, Camera, Mic } from 'lucide-react-native';

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

    return (
      <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            {showAvatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
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
            <TouchableOpacity style={styles.inputButton}>
              <Camera size={24} color="#666" />
            </TouchableOpacity>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Message..."
                placeholderTextColor="#666"
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Smile size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {inputText.trim() ? (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Send size={20} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.inputButton}>
                <Mic size={24} color="#666" />
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
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarSpacer: {
    width: 32,
    height: 32,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  consecutiveMessage: {
    marginTop: 2,
  },
  userBubble: {
    backgroundColor: '#14b8a6',
    borderBottomRightRadius: 6,
  },
  botBubble: {
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 6,
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#ffffff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
  inputContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: '#ffffff',
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14b8a6',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerUsername: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginRight: 6,
  },
  onlineStatus: {
    backgroundColor: '#14b8a6',
  },
  headerStatus: {
    color: '#666',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
});