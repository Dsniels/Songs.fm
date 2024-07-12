import { Image, StyleSheet, Platform, Button, Pressable, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Navigator, Redirect, router } from 'expo-router';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '@/Styles/styles';
import { useStateValue } from '@/Context/store';
export default function HomeScreen() {


    const deleteToken=async()=>{
       SecureStorage.deleteItemAsync('token').then(()=>{
        router.push('/login')
      });
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
      <Button color='blue' title='delete token' onPress={deleteToken} />

        <ThemedText type='subtitle'>Conecta tu cuenta de Spotify</ThemedText>
          <Link style={styles.LinkLogin}  href='/login'>
            <Pressable >
              <Text style={{color:'white', fontStyle:'normal', fontWeight:"bold"}}>Login</Text>
            </Pressable>
          </Link>
      </ThemedView>

    
    </ParallaxScrollView>
  );
}

