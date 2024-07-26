import {
  Image,
  View,
  Button,
  Pressable,
  Text,
  ToastAndroid,
  SafeAreaView,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import * as Network from "expo-network";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/Styles/styles";
import { useEffect, useState } from "react";
import { search } from "@/Api/SongsActions";

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setItems(undefined);
        setKeyboardVisible(false);
      }
    );
  }, []);

  const deleteToken = async () => {
    await AsyncStorage.clear();
    SecureStorage.deleteItemAsync("token").then(() => {
      ToastAndroid.show("Token eliminado", ToastAndroid.SHORT);

      router.push("/login");
    });
  };
  const [text, setText] = useState("");
  const [items, setItems] = useState<any | undefined>(undefined);

  const handleSearch = () => {
    console.log(text);
    if (!text) setItems(undefined);
    search(text).then((data) => {
      setItems(data);
      console.log(items);
    });
  };

  const handleTextChange = (t: string) => {
    setText(t);
    if (t === " ") setItems(undefined);
  };

  return (
    <SafeAreaView style={styles.container} className="flex-1 m-0 bg-indigo-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Hola Mundo</ThemedText>
          <HelloWave />
        </ThemedView>

        <Button color="blue" title="delete token" onPress={deleteToken} />
        <ThemedView className="m-1 w-64">
          <ThemedText>Search:</ThemedText>
          <TextInput
            className="bg-green-800 text-white p-3"
            value={text}
            clearTextOnFocus
            onBlur={() => setItems(undefined)}
            onTextInput={handleSearch}
            onChangeText={handleTextChange}
          />
        </ThemedView>

        {items?.tracks ? (
          <ScrollView>
            {items.tracks.items.map((item: any, index: number) => (
              <Text
                className="text-white w-60"
                numberOfLines={1}
                lineBreakMode="clip"
                textBreakStrategy="simple"
                key={index}
              >
                {item.name}
              </Text>
            ))}
          </ScrollView>
        ) : null}
        {!isKeyboardVisible && (
          <Link style={styles.LinkLogin} href="/login">
            <Pressable>
              <Text
                style={{
                  color: "white",
                  fontStyle: "normal",
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </Pressable>
          </Link>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
