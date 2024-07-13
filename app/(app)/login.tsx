import { Button, Text } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { styles } from "@/Styles/styles";
import { router, useSegments } from "expo-router";
import { useStateValue } from "@/Context/store";
import * as Linking from 'expo-linking';
import * as SecureStorage from 'expo-secure-store';

import { checkToken, getAccessToken } from "@/Api/SpotifyAuth";

WebBrowser.maybeCompleteAuthSession();
export default function login() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [TOKEN, setToken] = useState<string | null>('')

  const [CODE, setCode] = useState('');
  const URI = AuthSession.makeRedirectUri({
    native: "myapp://",
    path: "/login",
  });
  
  const discovery = {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
  };
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CLIENTE_ID || "",
      clientSecret : process.env.EXPO_PUBLIC_CLIENTE_SECRET || '',
      scopes: ["user-read-email", "user-read-private", "user-top-read"],
      responseType: "code",
      redirectUri:  Linking.createURL('login') ,
      usePKCE: false,
    },
    discovery
  );
    const storeData = async (key: string, data: string) => {
      try {
        await SecureStorage.setItemAsync(key, data);
      } catch (error) {
        console.log(error)
        throw new Error(`${error}`);
      }

  };

  const handleResponse = async (AccessCode: string) => {
     const  {data } : any = await getAccessToken(AccessCode, dispatch);
     await SecureStorage.setItemAsync('TokenConfig', JSON.stringify(data))
    const {  access_token} = data;
  if (access_token) {
      await storeData("token", access_token)
      router.replace("/(tabs)");
  }
   
  };


  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      setCode(code)
      handleResponse(code);

    }
  }, [response]);

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">Conecta tu cuenta de Spotify</ThemedText>
      <Button title="Conectar" onPress={() => promptAsync()} />
      <Text>Hola</Text>
       <ThemedText>Token:{TOKEN}</ThemedText>
       <ThemedText>code:{CODE}</ThemedText>

      <ThemedText>{Linking.createURL('login')}</ThemedText>
    </ThemedView>
  );
}
