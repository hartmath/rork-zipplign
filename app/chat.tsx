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
import { Send, ArrowLeft } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  avatar?: string;
}

const CONTACT_INFO = {
  name: 'Sarah Johnson',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
};

const USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      avatar: CONTACT_INFO.avatar,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
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

      // Simulate a response after a short delay
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! This is a demo response.',
          isUser: false,
          timestamp: new Date(),
          avatar: CONTACT_INFO.avatar,
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.botMessage]}>
      {!item.isUser && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, item.isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {item.isUser && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
    </View>
  );

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
            <View style={styles.headerTitleContainer}>
              <Image source={{ uri: CONTACT_INFO.avatar }} style={styles.headerAvatar} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerName}>{CONTACT_INFO.name}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
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
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#ffffff' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#0d9488',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#e2e8f0',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: '#94a3b8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#334155',
    color: '#e2e8f0',
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#0d9488',
  },
  sendButtonInactive: {
    backgroundColor: '#475569',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  headerStatus: {
    color: '#0d9488',
    fontSize: 12,
    marginTop: 2,
  },
});