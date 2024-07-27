import { router, Tabs } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import * as SecureStorage from "expo-secure-store";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const colorScheme = "dark";
  const [Connection, setConnection] = useState<boolean | null>(true);

  const NotConnection = () => (
    <View className="flex-1 bg-slate-900 items-center justify-center">
      <Feather name="wifi-off" size={100} color="white" />
      <ThemedText type="subtitle">Sin Conexion a internet</ThemedText>
    </View>
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnection(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(
    useCallback(() => {
      const fetchData = async () => {
        const token = (await SecureStorage.getItemAsync("token")) || false;
        if (!token) {
          router.push("/login");
        }
      };
      fetchData();

      return;
    }, []),
  );
  return Connection ? (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#060C19",
          zIndex: 1000,
          borderColor: "#060C19",
          borderStyle: "solid",
          borderWidth: 1,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="music"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "compass" : "compass-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  ) : (
    <NotConnection />
  );
}
