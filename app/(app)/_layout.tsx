import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";
import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

  useEffect(() => {
    const getData = async () => {
      const validToken = await AsyncStorage.getItem("expira").then(
        (fecha: string | null) => {
          const Today = new Date();
          const expiracion = new Date(fecha || "");

          if (Today >= expiracion) {
            return false;
          }
          return true;
        }
      );
      if (!validToken) {
        await refreshToken();
      }

      const token = (await AsyncStorage.getItem("token")) || false;
      if (!token) {
        router.push("/login");
      }
      if (!servidorResponse && token) {
        await getprofile(dispatch).then(() => {
          router.replace('/(tabs)')
          setServidorResponse(true)});
      }
    };
    getData();
  }, [sesionUsuario]);

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
