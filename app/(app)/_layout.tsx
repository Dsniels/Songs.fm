import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SplashScreen, Stack } from "expo-router";
import { AppState, StyleSheet, View } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import NetInfo from "@react-native-community/netinfo";

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
SplashScreen.preventAutoHideAsync();

export default function Applayout() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [Connection, setConnection] = useState<boolean | null>(true);
  useEffect(() => {
    // AppState.addEventListener("change", async (state) => {
    //   if (state === "inactive") {
    //     await AsyncStorage.clear();
    //   }
    // });
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const NotConnection = () => (
    <View className="flex-1 bg-slate-900 items-center justify-center">
      <Feather name="wifi-off" size={100} color="white" />
      <ThemedText type="subtitle">Sin Conexion a internet</ThemedText>
    </View>
  );
  useAuth(dispatch).finally(() => {
    SplashScreen.hideAsync();
  });

  return Connection ? (
    <Stack
      screenOptions={{
        animation: "simple_push",
        animationDuration: 9000,
        headerTransparent: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerBlurEffect: "dark",
        }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="Detalles/[name]"
        options={{
          animation: "simple_push",
          animationDuration: 9000,
          headerTransparent: true,
          contentStyle: { backgroundColor: "#000000" },
          headerBackground: () => <CustomHeader />,
          headerShadowVisible: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Stack.Screen
        name="songsDetails/[song]"
        options={{
          animation: "simple_push",
          animationDuration: 9000,
          headerTransparent: true,
          headerBackground: () => <CustomHeader />,
          headerShadowVisible: true,
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
    </Stack>
  ) : (
    <NotConnection />
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    shadowColor: "transparent",
  },
});
