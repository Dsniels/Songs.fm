import { Image,  Button, Pressable, Text, ToastAndroid } from 'react-native';
import * as Network from 'expo-network';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link,  router } from 'expo-router';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '@/Styles/styles';

export default function HomeScreen() {



    const deleteToken=async()=>{
     await  AsyncStorage.clear();
       SecureStorage.deleteItemAsync('token').then(()=>{
        ToastAndroid.show('Token eliminado', ToastAndroid.SHORT);
        
        router.push('/login')
      });
    }


  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/WhatsApp Image 2024-07-13 at 12.42.35_1b3f448f.jpg')}
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

