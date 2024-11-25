import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { black200, black800 } from '@/utils/colors';
import { StatusBar, Text, View } from 'react-native';
import { chessLogo } from '@/utils/images';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel:false,
        tabBarStyle:{
          backgroundColor:black200
        },
      }}>
      <Tabs.Screen
        name="play"
        options={{
          tabBarIcon: ({  focused }) => (
            <TabBarIcon image={chessLogo} title="Play" focused={focused} />
          ),
        }
      }
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarIcon: ({  focused }) => (
            <TabBarIcon image={chessLogo} title="More" focused={focused}/>
          ),
        }}
      />
    </Tabs>
  );
}
