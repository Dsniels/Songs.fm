import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";
import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SecureStorage from 'expo-secure-store';
import { DiscoveryDocument, refreshAsync, RefreshTokenRequestConfig, TokenResponse, TokenResponseConfig } from "expo-auth-session";
type TokenConfigType = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  issued_at : number
};
const CustomHeader = () => {
  return (
    <View style={styles.header}>
      <LinearGradient
        colors={["rgba(0,0,0,255)", "transparent"]}
        style={{
          height: 90,
          borderBottomColor: "transparent",
          borderBottomWidth: 0,
        }}
      />
    </View>
  );
};

export default function Applayout() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [servidorResponse, setServidorResponse] = useState(false);
  const [tokenValido, setTokenValido] = useState<boolean>(false)
 

  useEffect(() => {
  const getData = async () => {
    try {
      const token = await SecureStorage.getItemAsync('token') || false;
      console.log(token)
      if (!token) {
        return router.push("/login");
      }
      const tokenSTRING = await SecureStorage.getItemAsync('TokenConfig') 
          console.log(tokenSTRING)

        if (!tokenSTRING) {
          throw new Error('TokenConfig is missing');
        }

      const TokenConfig :TokenConfigType = JSON.parse(tokenSTRING);
      console.log('Token COnfig',TokenConfig);
        const isTokenExpired = (tokenConfig: TokenConfigType): boolean => {
          const currentTime = Date.now();
          const expirationTime = TokenConfig.issued_at + (tokenConfig.expires_in * 1000);
          return currentTime >= expirationTime;
        };
      if(TokenConfig){
        var tokenResponse = new TokenResponse({accessToken:TokenConfig.access_token, issuedAt:TokenConfig.issued_at, expiresIn:TokenConfig.expires_in, refreshToken:TokenConfig.refresh_token});
        console.log(tokenResponse.shouldRefresh());

        if(isTokenExpired(TokenConfig)){
          const refresConfig : RefreshTokenRequestConfig = {clientId:process.env.EXPO_PUBLIC_CLIENTE_ID || '', refreshToken : TokenConfig.refresh_token }
          console.log(refresConfig);
          const endpointRefres : Pick<DiscoveryDocument,"tokenEndpoint"> = {tokenEndpoint: "https://accounts.spotify.com/api/token"} 
          tokenResponse = await tokenResponse.refreshAsync(refresConfig,endpointRefres);
          console.log(tokenResponse)
          await SecureStorage.setItemAsync('TokenConfig', JSON.stringify(tokenResponse.getRequestConfig()))

        }
        if (!servidorResponse) {
              await getprofile(dispatch);
              router.replace('/(tabs)');
              setServidorResponse(true);
        }
      }


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getData();
}, [sesionUsuario, servidorResponse, dispatch]);
 

  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerBlurEffect: "dark",
         }}
      />
      <Stack.Screen
        name="login"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="Detalles/[name]"
        options={{
          headerTransparent: true,
          headerBackground: () => <CustomHeader />,
          headerShadowVisible: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Stack.Screen
        name="songsDetails/[song]"
        options={{
          headerTransparent: true,
          headerBackground: () => <CustomHeader />,
          headerShadowVisible: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100, // Altura del encabezado, ajusta según sea necesario
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    shadowColor: "transparent",
  },
});
