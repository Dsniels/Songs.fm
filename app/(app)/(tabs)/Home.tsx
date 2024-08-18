import {
  View,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useFocusEffect, useRouter } from "expo-router";
import { styles } from "@/Styles/styles";
import { useCallback, useState } from "react";
import { search } from "@/Api/SongsActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import { song, Track } from "@/types/Card.types";
import { SearchModal } from "@/components/SearchModal";

export default function HomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<Track | null>(null);
  const [text, setText] = useState("");

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
    }, []),
  );

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
      pathname: "(app)/songsDetails/[song]",
      params: {
        id: Item.id,
        name: Item.name,
        artists: Item.artists[0].name,
        ImageSong: Item.album.images[0].url,
        preview_url: Item.preview_url,
      },
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
        <View style={styles.titleContainer}>
          <ThemedText className="text-lg text-white font-bold">
            Search For Your Favorite Songs
          </ThemedText>
        </View>
        <Pressable
          className="flex  align-middle m-1 bg-blue-950 rounded-2xl justify-center items-start p-3 shadow-lg shadow-cyan-500/50 "
          onPress={() => setShowModal(true)}
        >
          <View>
            <Ionicons name="search" size={24} color="white" />
          </View>
        </Pressable>

        <SearchModal
          showModal={showModal}
          setShowModal={setShowModal}
          text={text}
          items={items as Track}
          handleSearch={handleSearch}
          handleTextChange={handleTextChange}
          getSongDetails={getSongDetails}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
