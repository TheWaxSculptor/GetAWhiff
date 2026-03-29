import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { sendGroqMessage, ChatMessage } from '../api/groqApi';
import { AdBanner } from '../components/AdBanner';
import { NotebookHeader } from '../components/NotebookHeader';

export default function ConsultantScreen() {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Welcome to Wakeup Whiff! I'm your holistic guide. Ask me about natural living, global herbs & roots, wellness, or cannabis strains."
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSaveKey = () => {
    if (apiKey.trim().length > 10) {
      setHasKey(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newChatHistory: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newChatHistory);
    setLoading(true);

    try {
      const apiMessages = newChatHistory
        .filter((_, idx) => idx !== 0)
        .map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await sendGroqMessage(apiMessages, apiKey.trim());
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `🚨 Error: ${error.message}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };



  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && <Ionicons name="leaf" size={16} color={Colors.ink} style={{ marginBottom: 4 }} />}
        <Text style={[styles.messageText, isUser && styles.userText]}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <NotebookHeader title="Holistic Consultant" />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about herbs, natural living..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]} 
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons name="send" size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
      <AdBanner />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  chatList: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  messageBubble: { 
    maxWidth: '85%', 
    padding: Spacing.md, 
    borderRadius: Radius.md, 
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  userBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: Colors.white, 
    borderBottomRightRadius: 2,
    borderStyle: 'dashed',
  },
  aiBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: Colors.white, 
    borderTopLeftRadius: 2 
  },
  messageText: { 
    fontFamily: Fonts.handwritten, 
    fontSize: 16, 
    color: Colors.ink, 
    lineHeight: 22 
  },
  userText: { color: Colors.ink },

  inputArea: { 
    flexDirection: 'row', 
    padding: Spacing.md, 
    alignItems: 'flex-end', 
    backgroundColor: Colors.white, 
    borderTopWidth: 1, 
    borderColor: Colors.ink 
  },
  textInput: { 
    flex: 1, 
    minHeight: 44, 
    maxHeight: 120, 
    backgroundColor: Colors.parchment, 
    borderRadius: Radius.md, 
    paddingHorizontal: Spacing.md, 
    paddingTop: 12, 
    paddingBottom: 12, 
    color: Colors.ink, 
    fontFamily: Fonts.handwritten, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: Colors.ink 
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: Colors.ink, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: Spacing.sm 
  },
});
