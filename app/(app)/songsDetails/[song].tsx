import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AddToFav, deleteFromFav, getSongInfo } from "@/Api/SongsActions";
import { useIsFocused } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getInfo } from "@/Api/AnnotatiosActions";
import { extractInfo } from "@/service/FormatData";
import { artist, features, song } from "@/types/Card.types";
import { mergeAndStore } from "@/service/seeds";

type ITrack = {
  info: song;
  audioFeatures: features;
};

const SongDetails = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [informacion, setInformacion] = useState("");
  const [like, setLike] = useState<boolean>(false);
  const [loadingSound, setLoadingSound] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const playSound =() => {
    try {
      if (currentSound) {
          currentSound.playAsync().then(() => setPlaying(true))
          .catch((e) =>
            ToastAndroid.showWithGravity(
              e,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            ),
          );
      }
    } catch (e) {ToastAndroid.showWithGravity(`${e}`, ToastAndroid.SHORT, ToastAndroid.CENTER);}
  };

  const pause = async () => {
    await currentSound?.stopAsync();
    setPlaying(false);
  };

  const navigation = useNavigation();
  const [Track, setTrack] = useState<ITrack>({
    info: {
      name: "",
      id: "",
      artists: [],
      album: {
        images: [{ url: "" }],
        id: "",
        name: "",
      },
      preview_url: "",
    },
    audioFeatures: {
      danceability: 0,
      acousticness: 0,
      energy: 0,
      instrumentalness: 0,
      liveness: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      tempo: 0,
      valence: 0,
      uri: "",
    },
  });
  const {
    name = "",
    id = "",
    artists = "",
    ImageSong = "",
  } = useLocalSearchParams<{
    name?: string;
    id?: string;
    artists?: string;
    ImageSong?: string;
  }>();
  useFocusEffect(
    useCallback(() => {
      const onBlur = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            currentSound.unloadAsync();
        }
      };
      return () => onBlur();
    }, [currentSound, isFocused]),
  );

  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });
    const fetchData = async () => {
      const [{ Info, Features, Like }, description] = await Promise.all([
        getSongInfo(id),
        getInfo(name, artists, true),
      ]);
      setTrack((prev) => ({
        ...prev,
        info: Info || {},
        audioFeatures: Features || {},
      }));
      setLike(Like);
      let informacion = description
        // skipcq: JS-0323
        .map((item) => extractInfo(item))
        .join(" ");
        if(informacion === '?') informacion = 'No se encontró información';
      setInformacion(informacion);
      return Info
    };
    fetchData().then(async(info)=>{
      const audio = new Audio.Sound();
      await audio.loadAsync({uri:info.preview_url}, {isLooping:true});
      setCurrentSound(audio);
      setLoadingSound(false);
    }).catch((e) =>
      ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER),
    );
  }, [navigation]);

  const getDetails = useCallback((Item: artist) => {

    return router.replace({
      pathname: "(app)/Detalles/[name]",
      params: { id: Item.id, name: Item.name},
    });
  }, []);
  const handleLike = (id: string) => {
    queueMicrotask(()=>AddToFav(id))
    setLike(true);
    mergeAndStore("seedTrack", [id]);
  };
  const handleUnLike = (id: string) => {
    queueMicrotask(()=>deleteFromFav(id))
    setLike(false);
  };

  return (
    <ParallaxScrollView
    
      headerBackgroundColor={{ light: "#000000", dark: "#000000" }}
      headerImage={
        <Image
          source={{
            uri:
              Track.info.album.images[0].url || ImageSong}}
          style={{ width: "100%", height: 400 }}
        />
      }
    >
      {Track.audioFeatures.acousticness  ? (
        <>
          <View className="flex flex-row justify-end items-center p-2">
            {like ? (
              <Pressable
                className="m-2"
                // skipcq: JS-0417
                onPress={(_) => handleUnLike(Track.info.id)}
              >
                <Ionicons name="heart" size={40} color="red" />
              </Pressable>
            ) : (
              <Pressable
                className="m-2"
                // skipcq: JS-0417
                onPress={(_) => handleLike(Track.info.id)}
              >
                <Ionicons name="heart-outline" size={40} color="red" />
              </Pressable>
            )}

            {loadingSound ? (
              <View style={styles.playButton}>
                <ActivityIndicator size="large" />
              </View>
              ): !playing ? (
              
              <Pressable
                className="bg-cyan-950"
                style={styles.playButton}
                // skipcq: JS-0417
                onPress={() => playSound()}
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
              className="w-44 p-2 bg-opacity-70 rounded-t-md"
              style={{
                backgroundColor: !showAbout ? "#0D0D0D" : "transparent",
              }}
              // skipcq: JS-0417
              onPress={() => setShowAbout(false)}
            >
              <ThemedText
                className="flex w-full justify-center text-center"
                type="subtitle"
              >
                Features
              </ThemedText>
            </Pressable>
            <Pressable
              className=" flex flex-wrap w-40 text-center align-middle justify-items-center content-center justify-center bg-opacity-70  rounded-t-md"
              style={{ backgroundColor: showAbout ? "#0D0D0D" : "transparent" }}
              // skipcq: JS-0417
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

          {showAbout === false ? (
            <View className=" bg-opacity-80 bg-[#0D0D0D] m-1 mt-0 pt-0 -top-4 w-full p-7 rounded-b-md rounded-r-md shadow-sm shadow-gray-700">
              <ThemedText type="defaultSemiBold">Artists</ThemedText>


              <ThemedView className=" flex flex-row justify-center content-center items-center bg-[#0D0D0D]">
                <ScrollView
                  className="bg-[#0D0D0D]"
                  horizontal
                  style={{ width: 80 }}
                >
                  {Track.info.artists ? (
                    Track.info.artists.map((item: artist, index: number) => (
                      <Pressable
                        className="rounded-3xl m-3 px-2 bg-[#1F283D]"
                        // skipcq: JS-0417
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

              <View className=" flex flex-wrap mt-8 flex-row rounded-b-md rounded-r-md shadow-sm shadow-gray-700">
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
                      className="bg-[#0554F2]"
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
                      className="bg-[#0554F2]"
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
                      className="bg-[#0554F2]"
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
                      className="bg-[#0554F2]"
                      style={{
                        height: "100%",
                        width: `${Track.audioFeatures.instrumentalness * 100}%`,
                        borderRadius: 5,
                      }}
                    />
                  </View>
                  <ThemedText style={{ fontSize: 12 }}>
                    Instrumentalness
                  </ThemedText>
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
                      className="bg-[#0554F2]"
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
                      className="bg-[#0554F2]"
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
                      className="bg-[#0554F2]"
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
          ) : showAbout ? (
       
              <View className=" bg-opacity-80 bg-[#0D0D0D] m-1 mt-0 pt-0 -top-4 w-fit rounded-b-md rounded-l-md shadow-sm shadow-gray-700 ">
                <ThemedText
                  className="p-7"
                  style={{ justifyContent: "center", textAlign: "justify" }}
                >
                  {informacion ? informacion : ("Ocurrio un Error")}
                </ThemedText>
              </View>
          ) : (
            <View className="bg-opacity-80 bg-cyan-950 flex justify-stretch content-center items-center align-middle m-1 mt-0 pt-0 -top-4 w-fit h-36 ">
              <ActivityIndicator   className="m-8" size="large" />
            </View>
          )}
          <View style={{ marginTop: 30, marginBottom: 20 }}>
            <ThemedText type="title">Links</ThemedText>
            <Pressable
              // skipcq: JS-0417
              onPress={() => Linking.openURL(Track.audioFeatures.uri || "")}
            >
              <ThemedText
                type="link"
                style={{ justifyContent: "center", textAlign: "justify" }}
              >
                Listen on Spotify
              </ThemedText>
            </Pressable>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" />
      )}
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
