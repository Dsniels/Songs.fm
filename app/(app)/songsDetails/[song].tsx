import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
import { getSongInfo } from "@/Api/SongsActions";
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
        await sound.playAsync();
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
      const { Info, Features } = await getSongInfo(id);
      setTrack((prev) => ({
        ...prev,
        info: Info || {},
        audioFeatures: Features || {},
      }));
      const description = await getInfo(name, artists, true);
      const informacion =  description
        .map((item: any) => extractInfo(item))
        .join("   ");
      setInformacion(informacion);
    };
    fetchData();
  }, [navigation]);

  const getDetails = useCallback((Item: any) => {
    return router.replace({
      pathname: `(app)/Detalles/[name]`,
      params: { id: Item.id, name: Item.name },
    });
  },[]);

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
      <View className="mb-0 mt-3 flex justify-evenly flex-wrap flex-row content-evenly w-fit">
        <Pressable
          className="w-44 p-2 bg-opacity-70"
          style={{ backgroundColor: !showAbout ? "#0284c7" : "transparent" }}
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
          style={{ backgroundColor: showAbout ? "#0284c7" : "transparent" }}
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
        <View className=" bg-opacity-80 bg-sky-600 m-1 mt-0 pt-0 -top-4 w-full p-7 ">
          <ThemedText type="defaultSemiBold">Artistas</ThemedText>

          <ThemedView className=" flex flex-row justify-center content-center items-center bg-sky-600">
            <ScrollView className="bg-sky-600" horizontal style={{ width: 80 }}>
              {Track.info.artists? Track.info.artists.map((item: any, index: number) => (
                <Pressable
                  className="rounded-3xl m-3 px-2 bg-[#1F283D]"
                  onPress={() => getDetails(item)}
                  key={index}
                >
                  <ThemedText type="default">{item.name}</ThemedText>
                </Pressable>
              )) : (<ActivityIndicator size='large' />)}
            </ScrollView>

            {currentSound === null ? (
              <Pressable
                className="bg-sky-600"
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
          </ThemedView>

          <View className=" flex flex-wrap mt-8 flex-row ">
            <ThemedText style={{ marginBottom: 10 }} type="subtitle">
              Caracteristicas de la cancion
            </ThemedText>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.danceability * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>Danceability</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.acousticness * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>Acousticness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.energy * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>Energy</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.instrumentalness * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>Instrumentalness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.liveness * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
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
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.speechiness * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>speechiness</ThemedText>
            </View>
            <View style={styles.caracteristica}>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#14181E",
                  width: 100,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#091F98",
                    height: "100%",
                    width: `${Track.audioFeatures.valence * 100}%`,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <ThemedText style={{ fontSize: 12 }}>valence</ThemedText>
            </View>
          </View>
        </View>
      ) : showAbout && informacion ? (
        <>
          <View className=" bg-opacity-80 bg-sky-600 m-1 mt-0 pt-0 -top-4 w-fit ">
            <ThemedText
              className="p-7"
              style={{ justifyContent: "center", textAlign: "justify" }}
            >
              {informacion}
            </ThemedText>
          </View>

        </>
      ) : (
        <View className="bg-opacity-80 bg-sky-600 flex justify-stretch content-center items-center align-middle m-1 mt-0 pt-0 -top-4 w-fit h-36 ">
        <ActivityIndicator className="m-8" size='large'/>
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
