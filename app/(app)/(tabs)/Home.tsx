import {
  View,
  Button,
  Pressable,
  Text,
  ToastAndroid,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
<<<<<<< HEAD
import { Link, useFocusEffect, useNavigation, useRouter } from "expo-router";
=======
import {
  Link,
  router,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
>>>>>>> 60d89176b2f52bb3efce1a62f903a82a1377ce53
import * as SecureStorage from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/Styles/styles";
import { useCallback, useEffect, useState } from "react";
import { search } from "@/Api/SongsActions";
import { SmallListSongs } from "@/components/SmallListSongs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { song } from "@/types/Card.types";

export default function HomeScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const nav = useNavigation();
  const [items, setItems] = useState<any | undefined>(undefined);
  const [text, setText] = useState("");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
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
        setItems(undefined);
        setShowModal(false);
      };

      return () => {
        handleRouteChange();
      };
    }, []),
  );
  const deleteToken = async () => {
    await AsyncStorage.clear();
    SecureStorage.deleteItemAsync("token").then(() => {
      ToastAndroid.show("Token eliminado", ToastAndroid.SHORT);

      router.push("/login");
    });
  };

  const handleSearch = () => {
    if (!text) setItems(undefined);
    search(text).then((data) => {
      setItems(data);
    });
  };

  const handleTextChange = (t: string) => {
    setText(t);
    if (t === " ") setItems(undefined);
  };

  const getSongDetails = (Item: song) => {
    return router.push({
      pathname: `(app)/songsDetails/[song]`,
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

        <Modal
          className="bg-[#000818] m-0 rounded-lg"
          animationType="slide"
          visible={showModal}
          onRequestClose={() => {
            setItems(undefined);
            setShowModal(false);
          }}
        >
          <View className="flex-1 p-2 bg-[#000818]">
            <ThemedView className="bg-[#000818] flex  align-middle items-center p-2 content-center m-1 text-white  flex-row">
              <Ionicons name="search" size={24} color="white" />
              <TextInput
                className="flex-auto bg-blue-950 text-white p-3 m-2 rounded-2xl"
                value={text}
                clearTextOnFocus
                onTextInput={handleSearch}
                onChangeText={handleTextChange}
              />
            </ThemedView>

            {items && showModal ? (
              <FlatList
                data={items.tracks.items}
                renderItem={({ item }) => (
                  <SmallListSongs item={item} getSongDetails={getSongDetails} />
                )}
                keyExtractor={(item) => item.id}
              />
            ) : null}
          </View>
        </Modal>

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
