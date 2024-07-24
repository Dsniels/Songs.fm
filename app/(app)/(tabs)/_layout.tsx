import { router, Tabs, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as SecureStorage from 'expo-secure-store';
import { ToastAndroid } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  NetInfo.addEventListener(state => {
    if(!(state.isConnected || state.isWifiEnabled)){
      ToastAndroid.show('No tienes conexion a internet', ToastAndroid.SHORT);
    }
});
useEffect(
  useCallback(() => {

    const fetchData = async()=>{
      const token = await SecureStorage.getItemAsync('token') || false;
      if(!token){
        router.push('/login')
      }
    }
    fetchData();

    return  
  }, [])
);
  return (
    <Tabs
      screenOptions={{
        tabBarStyle:{backgroundColor:'#060C19'},
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
       

       <Tabs.Screen
        name='music'
        options={{
          title : 'Discover',
          tabBarIcon : ({color, focused}) => (
            <TabBarIcon name={focused? 'compass' : 'compass-outline'} color={color}/>
          )
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
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
