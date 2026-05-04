import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StoreProvider, useStore } from '../store';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutInner() {
  const store = useStore();
  if (!store?.loaded) return null;
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="client-detail" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <ThemeProvider value={DarkTheme}>
        <RootLayoutInner />
        <StatusBar style="light" />
      </ThemeProvider>
    </StoreProvider>
  );
}