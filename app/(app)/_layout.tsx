import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  View,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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
  useEffect(() => {
    AppState.addEventListener("change", async (state) => {
      if (state === "inactive") {
        await AsyncStorage.clear();
      }
    });
  }, []);

  if (sesionUsuario) {
    !sesionUsuario.usuario ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : null;
  }

  useAuth(dispatch);

  return (
    <Stack screenOptions={{ headerTransparent: false }}>
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
          contentStyle: { backgroundColor: "#000818" },
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
