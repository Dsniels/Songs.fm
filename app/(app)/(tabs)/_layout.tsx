import { router, Tabs, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStorage from 'expo-secure-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
useEffect(
  useCallback(() => {

    const fetchData = async()=>{
      const token = await SecureStorage.getItemAsync('token') || false;
      if(!token){
        router.push('/login')
      }
    }
    fetchData();
    //deleteToken();

    return () => {
    };
  }, [])
);
  return (
    <Tabs
      screenOptions={{

        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
       

       <Tabs.Screen
        name='music'
        options={{
          title : 'Music',
          tabBarIcon : ({color, focused}) => (
            <TabBarIcon name={focused? 'musical-note' : 'musical-note-outline'} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
 
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle:{backgroundColor:'0B0033'},
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
          ),
        }}
      />

    </Tabs>
  
  );
}
