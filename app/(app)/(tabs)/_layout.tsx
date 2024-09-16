import { router, Tabs } from "expo-router";
import { useCallback, useEffect } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import * as SecureStorage from "expo-secure-store";

export default function TabLayout() {
  const colorScheme = "dark";

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
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000000",
          zIndex: 1000,
          borderColor: "#000000",
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
          lazy: false,
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
          lazy: false,
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
  );
}
