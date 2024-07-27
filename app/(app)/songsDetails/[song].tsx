import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  Link,
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AddToFav, deleteFromFav, getSongInfo } from "@/Api/SongsActions";
import { ThemeProvider, useIsFocused } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getInfo } from "@/Api/AnnotatiosActions";
import { extractInfo } from "@/service/FormatData";

interface ITrack {
  info: any;
  audioFeatures: any;
  similarSongs?: any;
}

const SongDetails = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [informacion, setInformacion] = useState("");
  const [like, setLike] = useState<boolean>(false);

  const playSound = async (soundUri: string) => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
    }
    const sound = new Audio.Sound();
    try {
      const soundLoaded = (await sound.loadAsync({ uri: soundUri })).isLoaded;
      if (soundLoaded) {
        setCurrentSound(sound);
        await sound.setIsLoopingAsync(true);
        sound
          .playAsync()
          .catch((e) =>
            ToastAndroid.showWithGravity(
              e,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            )
          );
      }
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const pause = async () => {
    await currentSound?.stopAsync();
    await currentSound?.unloadAsync();
    setCurrentSound(null);
  };

  const navigation = useNavigation();
  const [Track, setTrack] = useState<ITrack>({
    info: {},
    audioFeatures: {},
    similarSongs: [],
  });
  const {
    name = "",
    id = "",
    artists = "",
  } = useLocalSearchParams<{
    name?: string;
    id?: string;
    artists?: string;
  }>();
  useFocusEffect(
    useCallback(() => {
      const onBlur = async () => {
        if (currentSound) {
          const status = await currentSound.getStatusAsync();
          if (status?.isLoaded) {
            currentSound.pauseAsync();
          }
        }
      };
      return () => onBlur();
    }, [currentSound, isFocused])
  );

  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });
    const fetchData = async () => {
      const [{ Info, Features, Like }, description]: any[] = await Promise.all([
        getSongInfo(id),
        getInfo(name, artists, true),
      ]);
      setTrack((prev) => ({
        ...prev,
        info: Info || {},
        audioFeatures: Features || {},
      }));
      setLike(Like);
      const informacion = description
        .map((item: any) => extractInfo(item))
        .join(" ");
      setInformacion(informacion);
    };
    fetchData().catch((e) =>
      ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER)
    );
  }, [navigation]);

  const getDetails = useCallback((Item: any) => {
    return router.replace({
      pathname: `(app)/Detalles/[name]`,
      params: { id: Item.id, name: Item.name },
    });
  }, []);
  const handleLike = async (id: string) => {
    await AddToFav(id);
    setLike(true);
  };
  const handleUnLike = async (id: string) => {
    await deleteFromFav(id);
    setLike(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri:
              Track.info?.album?.images?.[0]?.url ||
              "https://th.bing.com/th/id/OIP.dfpjYr0obWlvVKnjJ9ccyQHaHJ?rs=1&pid=ImgDetMain",
          }}
          style={{ width: "100%", height: 400 }}
        />
      }
    >
      <View className="flex flex-row justify-end items-center p-2">
                  {like ? (
              <Pressable className="m-2" onPress={(_) => handleUnLike(Track.info?.id)}>
                <Ionicons name="heart" size={40} color="red" />
              </Pressable>
            ) : (
              <Pressable className="m-2" onPress={(_) => handleLike(Track.info?.id)}>
                <Ionicons name="heart-outline" size={40} color="red" />
              </Pressable>
            )}

            {currentSound === null && Track.info.preview_url ? (
              <Pressable
                className="bg-cyan-950"
                style={styles.playButton}
                onPress={() => playSound(Track.info?.preview_url || " ")}
              >
                <Ionicons name="play" size={30} color="white" />
              </Pressable>
            ) : (
              <Pressable style={styles.playButton} onPress={() => pause()}>
                <Ionicons name="pause" size={30} color="white" />
              </Pressable>
            )}
          </View>
      <View className="mb-0 mt-3 flex justify-evenly flex-wrap flex-row content-evenly w-fit">
        <Pressable
          className="w-44 p-2 bg-opacity-70"
          style={{ backgroundColor: !showAbout ? "#000818" : "transparent" }}
          onPress={() => setShowAbout(false)}
        >
          <ThemedText
            className="flex w-full justify-center text-center"
            type="subtitle"
          >
            Caracteristicas
          </ThemedText>
        </Pressable>
        <Pressable
          className=" flex flex-wrap w-40 text-center align-middle justify-items-center content-center justify-center bg-opacity-70 "
          style={{ backgroundColor: showAbout ? "#000818" : "transparent" }}
          onPress={() => setShowAbout(true)}
        >
          <ThemedText
            className="flex w-20  justify-center content-center text-center"
            type="subtitle"
          >
            About
          </ThemedText>
        </Pressable>
      </View>

      {showAbout === false && Track.info ? (
        <View className=" bg-opacity-80 bg-[#000818] m-1 mt-0 pt-0 -top-4 w-full p-7 ">
          <ThemedText type="defaultSemiBold">Artistas</ThemedText>

          <ThemedView className=" flex flex-row justify-center content-center items-center bg-[#000218]">
            <ScrollView
              className="bg-[#000818]"
              horizontal
              style={{ width: 80 }}
            >
              {Track.info.artists ? (
                Track.info.artists.map((item: any, index: number) => (
                  <Pressable
                    className="rounded-3xl m-3 px-2 bg-[#1F283D]"
                    onPress={() => getDetails(item)}
                    key={index}
                  >
                    <ThemedText type="default">{item.name}</ThemedText>
                  </Pressable>
                ))
              ) : (
                <ActivityIndicator size="large" />
              )}
            </ScrollView>
            

          </ThemedView>

          <View className=" flex flex-wrap mt-8 flex-row ">

            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.danceability * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>Danceability</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.acousticness * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>Acousticness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.energy * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>Energy</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                 <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.instrumentalness * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>Instrumentalness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.liveness * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>liveness</ThemedText>
            </View>
            <View
              style={{
                margin: 10,
                flexDirection: "column",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText type="default">
                {Track.audioFeatures.loudness}
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }}>loudness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.speechiness * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>speechiness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
              className="bg-gray-800"
                style={{
                  height: 10,
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                className="bg-sky-700"
                  style={{
                    height: "100%",
                    width: `${Track.audioFeatures.valence * 100}%`,
                    borderRadius: 5,
                  }}
                 />
              </View>
              <ThemedText style={{ fontSize: 12 }}>valence</ThemedText>
            </View>
          </View>
        </View>
      ) : showAbout && informacion ? (
        <>
          <View className=" bg-opacity-80 bg-[#000818] m-1 mt-0 pt-0 -top-4 w-fit ">
            <ThemedText
              className="p-7"
              style={{ justifyContent: "center", textAlign: "justify" }}
            >
              {informacion}
            </ThemedText>
          </View>
        </>
      ) : (
        <View className="bg-opacity-80 bg-cyan-950 flex justify-stretch content-center items-center align-middle m-1 mt-0 pt-0 -top-4 w-fit h-36 ">
          <ActivityIndicator className="m-8" size="large" />
        </View>
      )}
      <View style={{ marginTop: 30, marginBottom: 20 }}>
        <ThemedText type="title">Links</ThemedText>
        <Pressable
          onPress={() => Linking.openURL(Track.audioFeatures.uri || "")}
        >
          <ThemedText
            type="link"
            style={{ justifyContent: "center", textAlign: "justify" }}
          >
            Escuchar en Spotify
          </ThemedText>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
};

export default SongDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    display: "flex",
    backgroundColor: "green",
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  caracteristica: {
    margin: 10,
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
