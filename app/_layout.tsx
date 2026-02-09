import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from './contexts/ThemeContext';
import useThemedNavigation from './hooks/useThemedNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { screenOptions } = useThemedNavigation();
  return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <Stack screenOptions={screenOptions}>
                    <Stack.Screen name="index" />
                    <Stack.Screen
                        name="screens/bottom-acc"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="screens/native-sheet"
                        options={{
                            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
                            sheetGrabberVisible: true,
                            sheetAllowedDetents: [0.4],
                            sheetCornerRadius: 24,
                            headerShown: false,
                            contentStyle: { backgroundColor: 'transparent' },

                            // Control the backdrop dimming (0 = no dim, 1 = full dim)
                            // Or use 'transparent' for no overlay at all:
                            //sheetBackdropColor: 'transparent',
                        }}
                    />
                </Stack>
            </ThemeProvider>
        </GestureHandlerRootView>
  );
}
