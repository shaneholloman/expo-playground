import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './contexts/ThemeContext';
import useThemedNavigation from './hooks/useThemedNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const { screenOptions } = useThemedNavigation();
  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <Stack screenOptions={screenOptions} />
            </ThemeProvider>
        </GestureHandlerRootView>
  );
}
