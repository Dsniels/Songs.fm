import { Button, Text } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { REACT_APP_CLIENTE_ID } from "@env";
import { styles } from "@/Styles/styles";
import { router } from "expo-router";
import { useStateValue } from "@/Context/store";
import { checkToken, getAccessToken } from "@/Api/SpotifyAuth";

WebBrowser.maybeCompleteAuthSession();
export default function login() {
  const [{ sesionUsuario }, dispatch] = useStateValue();

  const URI = AuthSession.makeRedirectUri({
    native: "myapp://",
    path: "/login",
  });
  const endpoints = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: REACT_APP_CLIENTE_ID || "",
      scopes: ["user-read-email", "user-read-private", "user-top-read"],
      responseType: "code",
      redirectUri: URI,
      usePKCE: false,
    },
    endpoints
  );
  const storeData = async (key: string, data: string) => {
    await AsyncStorage.setItem(key, data);
  };

  const handleResponse = async (code: string) => {
    const { data }: any = await getAccessToken(code, dispatch);
    const { refresh_token, access_token, expira } = data;
    checkToken(expira);

    await storeData("token", access_token);
    await storeData("refresh_token", refresh_token);

    if (access_token) {
      router.replace("(tabs)");
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleResponse(code);
      storeData("code", code);
    }
  }, [response]);

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">Conecta tu cuenta de Spotify</ThemedText>
      <Button title="Conectar" onPress={() => promptAsync()} />
      <Text>Hola</Text>
    </ThemedView>
  );
}
