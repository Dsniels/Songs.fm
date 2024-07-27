import { Pressable, Text, ToastAndroid } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { styles } from "@/Styles/styles";
import { router } from "expo-router";
import { useStateValue } from "@/Context/store";
import * as Linking from "expo-linking";
import * as SecureStorage from "expo-secure-store";
import * as Haptics from "expo-haptics";

import { checkToken, getAccessToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";

WebBrowser.maybeCompleteAuthSession();
export default function login() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [TOKEN, setToken] = useState<string | null>("");

  const [CODE, setCode] = useState("");
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
      clientSecret: process.env.EXPO_PUBLIC_CLIENTE_SECRET || "",
      scopes: [
        "user-read-email",
        "user-read-private",
        "user-top-read",
        "user-read-recently-played, user-library-read, user-library-modify,user-library-modify",
      ],
      responseType: "code",
      redirectUri: Linking.createURL("login"),
      usePKCE: false,
    },
    discovery,
  );
  const storeData = async (key: string, data: string) => {
    try {
      await SecureStorage.setItemAsync(key, data);
    } catch (error) {
      throw new Error(`${error}`);
    }
  };

  const handleResponse = async (AccessCode: string) => {
    const { data }: any = await getAccessToken(AccessCode, dispatch);
    const { refresh_token, access_token, expira } = data;
    checkToken(expira);

    if (access_token) {
      Promise.all([
        storeData("token", access_token),
        storeData("refresh_token", refresh_token),
      ]).then(() => {
        getprofile(dispatch).then(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          ToastAndroid.showWithGravity(
            "Sesion Iniciada",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          return router.replace("/(tabs)");
        });
      });
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      handleResponse(code);
    }
  }, [response]);

  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText type="subtitle">Conecta tu cuenta de Spotify</ThemedText>
      <Pressable className="flex bg-green-500" onPress={() => promptAsync()}>
        <Text className="text-cyan-100 ">Iniciar Sesion</Text>
      </Pressable>

      <Text>Hola</Text>
      <ThemedText>Token:{TOKEN}</ThemedText>
      <ThemedText>code:{CODE}</ThemedText>

      <ThemedText>{Linking.createURL("login")}</ThemedText>
    </ThemedView>
  );
}
