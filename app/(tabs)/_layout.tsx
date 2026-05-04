import { HapticTab } from '@/components/haptic-tab';
import { ACCENT } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      lazy
      screenOptions={{
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: '#444',
        tabBarStyle: { backgroundColor: '#111115', borderTopColor: '#1e1e26' },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⬡</Text>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>○</Text>,
        }}
      />
      <Tabs.Screen
        name="tax"
        options={{
          title: 'Tax',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>◈</Text>,
        }}
      />
    </Tabs>
  );
}