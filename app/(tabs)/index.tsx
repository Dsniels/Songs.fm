import { Image, StyleSheet, Platform, Button, Pressable, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Navigator } from 'expo-router';
import { makeRedirectUri } from 'expo-auth-session';
import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '@/Styles/styles';
export default function HomeScreen() {



useFocusEffect(
  useCallback(() => {
    const getItem = async () => {
      const code =await AsyncStorage.getItem('code');
    };
    getItem();

    // Opcional: Retornar una función de limpieza si es necesario
    return () => {
      // Código de limpieza aquí
    };
  }, [])
);
  const toLogin = () => {
    Navigator({} )
  }


  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hola Mundo</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Conecta tu cuenta de Spotify</ThemedText>
          <Link style={styles.LinkLogin}  href='/login'>
            <Pressable >
              <Text style={{color:'white', fontStyle:'normal', fontWeight:"bold"}}   >Login</Text>
            </Pressable>
          </Link>
      </ThemedView>

    
    </ParallaxScrollView>
  );
}

