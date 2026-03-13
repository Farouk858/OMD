import React, { useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { useChat } from './src/hooks/useChat';
import { colors } from './src/constants/theme';

type Screen = 'home' | 'chat';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [initialText, setInitialText] = useState<string | undefined>();
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  const handleSelectQuestion = (question: string) => {
    setInitialText(question);
    setScreen('chat');
    // Auto-send after a short delay to let the screen mount
    setTimeout(() => sendMessage(question), 150);
  };

  const handleStartChat = () => {
    setInitialText(undefined);
    setScreen('chat');
  };

  const handleNewChat = () => {
    clearMessages();
    setInitialText(undefined);
    setScreen('home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.bgPrimary}
        translucent={Platform.OS === 'android'}
      />

      {screen === 'home' ? (
        <HomeScreen
          onSelectQuestion={handleSelectQuestion}
          onStartChat={handleStartChat}
        />
      ) : (
        <ChatScreen
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onNewChat={handleNewChat}
          initialText={screen === 'chat' && messages.length === 0 ? undefined : undefined}
        />
      )}
    </SafeAreaProvider>
  );
}
