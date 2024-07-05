import { Button, Pressable, Text, View } from "react-native";
import * as AuthSession from 'expo-auth-session';
import { useEffect, useState } from "react";
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {REACT_APP_CLIENTE_ID} from '@env';
import { styles } from "@/Styles/styles";
import { Link, Redirect, router } from "expo-router";

import { AxiosResponse } from "axios";
import { getprofile } from "@/Api/UserAction";
import { useStateValue } from "@/Context/store";
import { checkToken, getAccessToken } from "@/Api/SpotifyAuth";


WebBrowser.maybeCompleteAuthSession();
export default function login() {
  const [{sesionUsuario}, dispatch] = useStateValue();
    
    const URI = AuthSession.makeRedirectUri({native :'myapp://', path:'/login'})
    const endpoints = { 
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
  }

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: REACT_APP_CLIENTE_ID || '',
        scopes: ['user-read-email', 'user-read-private', 'user-top-read'],
        responseType: 'code',
        redirectUri: URI,
        usePKCE:false
      },
      endpoints
    );
    const setData = async(data : any)=>{
        await AsyncStorage.setItem('code',data);
    }
    
    useEffect(()=>{
      const fetchData = async (code : string)=>{
          const response :any= await getAccessToken(code, dispatch);
          const refresh_token : string= response.data?.refresh_token;
          const token : string = response.data?.access_token;
          console.log(token)
          const expira = response.data.expira;
          checkToken(expira);
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('refresh_token', refresh_token);
          if(token){
           router.replace('(tabs)')
          }

        }
         if(response?.type === 'success'){
            const {code} = response.params;
            fetchData(code);
            setData(code);   
        }

    },[response, request])

    return(
    <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Conecta tu cuenta de Spotify</ThemedText>
          <Button title="Conectar" onPress={()=>promptAsync()}/>
            <Text>Hola</Text>
          
      </ThemedView>

    )
}