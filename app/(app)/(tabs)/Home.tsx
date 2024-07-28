import {
  View,
  Button,
  Pressable,
  Text,
  ToastAndroid,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useFocusEffect, useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/Styles/styles";
import { useCallback, useEffect, useState } from "react";
import { search } from "@/Api/SongsActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { song, Track } from "@/types/Card.types";
import { SearchModal } from "@/components/SearchModal";

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<Track | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [items]);
  useFocusEffect(
    useCallback(() => {
      const handleRouteChange = () => {
        setText("");
        setItems(null);
        setShowModal(false);
      };

      return () => {
        handleRouteChange();
      };
    }, [])
  );
  const deleteToken = async () => {
    await AsyncStorage.clear();
    SecureStorage.deleteItemAsync("token").then(() => {
      ToastAndroid.show("Token eliminado", ToastAndroid.SHORT);

      router.push("/login");
    });
  };

  const handleSearch = () => {
    if (!text) setItems(null);
    search(text).then((data) => {
      setItems(data);
    });
  };

  const handleTextChange = (t: string) => {
    setText(t);
    if (t) setItems(null);
  };

  const getSongDetails = (Item: song) => {
    return router.push({
      pathname: '(app)/songsDetails/[song]',
      params: { id: Item.id, name: Item.name, artists: Item.artists[0].name },
    });
  };

  return (
    <SafeAreaView
      style={styles.container}
      className="flex-1 m-0 bg-[#000818]  p-9 "
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Pressable
          className="flex  align-middle m-1 bg-blue-950 rounded-2xl justify-center items-start p-3 shadow-lg shadow-cyan-500/50 "
          onPress={() => setShowModal(true)}
        >
          <View>
            <Ionicons name="search" size={24} color="white" />
          </View>
        </Pressable>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Hola Mundo</ThemedText>
          <HelloWave />
        </ThemedView>

        <Button color="blue" title="delete token" onPress={deleteToken} />
    <SearchModal
          showModal={showModal}
          setShowModal={setShowModal}
          text={text}
          items={items as Track}
          handleSearch={handleSearch}
          handleTextChange={handleTextChange}
          getSongDetails={getSongDetails}
        />
        

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
