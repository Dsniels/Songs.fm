import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";
import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as SecureStorage from 'expo-secure-store';

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
      const token = (await SecureStorage.getItemAsync("token")) || false;
      if (!token) {
        return router.push("/login");
      }
      
      const fecha = await SecureStorage.getItemAsync("expira");
      if (fecha === null) {
        setTokenValido(false);
      } else {
        const Today = new Date();
        const expiracion = new Date(fecha);
        if (Today >= expiracion) {
          setTokenValido(false);
        } else {
          setTokenValido(true);
        }
      }

      if (!tokenValido) {
        await refreshToken();
      }

      if (!servidorResponse && token) {
        await getprofile(dispatch);
        router.replace('/(tabs)');
        setServidorResponse(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  getData();
}, [sesionUsuario, tokenValido, servidorResponse, dispatch, router]);


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
