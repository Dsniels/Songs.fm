import { Button, Pressable, Text, View } from "react-native";
import * as AuthSession from 'expo-auth-session';
import { useEffect } from "react";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { styles } from "@/Styles/styles";
import { Link } from "expo-router";


WebBrowser.maybeCompleteAuthSession();
export  function login() {
    
    const URI = AuthSession.makeRedirectUri({native :'myapp://', path:'/login'})
    console.log(URI)
    const endpoints = { 
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
  }

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId:'7783b093ae68457a9044441573eb49f2',
        scopes: ['user-read-email', 'playlist-modify-public'],
        responseType: 'code',
        redirectUri: URI,
      },
      endpoints
    );
    const setData = async(data : any)=>{
        await AsyncStorage.setItem('code',data);
    }
    useEffect(()=>{
         if(response?.type === 'success'){
            const {code} = response.params;
           setData(code);
            console.log(code);
        }
  
    },[response, request])

    return(
    <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Conecta tu cuenta de Spotify</ThemedText>
         <Link style={styles.LinkLogin}  href='/login'>
            <Pressable >
              <Text style={{color:'white', fontStyle:'normal', fontWeight:"bold"}}   >Login</Text>
            </Pressable>
          </Link>
      </ThemedView>

    )
}