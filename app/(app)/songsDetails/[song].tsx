import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {  getSongInfo } from "@/Api/SongsActions";
import { ThemeProvider, useIsFocused } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getInfo } from "@/Api/AnnotatiosActions";

interface ITrack {
  info: any;
  audioFeatures: any;
  similarSongs?: any;
}

const SongDetails = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const isFocused = useIsFocused();
  const [informacion, setInformacion] = useState('')
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
  const { name = "", id = "", artists='' } = useLocalSearchParams<{
    name?: string;
    id?: string;
    artists?:string
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

  const extractInfo = (node:any)=>{
    let data = [];
    if(typeof(node) === 'string' && node !== '.'){
      data.push(node)
    }else if(node.children){
      node.children.map((i:any)=>{
        data.push(extractInfo(i));
      })
    }
    return data.join('');

  }
  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });
      const fetchData = async () => {
      const { Info, Features } = await getSongInfo(id);
      setTrack((prev) => ({
        ...prev,
        info: Info || {},
        audioFeatures: Features || {},
      }));
      const description = await getInfo(name, artists);
      const informacion = description.map((item:any)=>extractInfo(item)).join(" ")
      setInformacion(informacion);
      

    };
    fetchData();
  }, [navigation]);
  const getSongDetails = (Item: any) => {
    return router.push({
      pathname: `(app)/songsDetails/[song]`,
      params: { id: Item.id, name: Item.name },
    });
  };
  const getDetails = (Item: any) => {
    return router.replace({
      pathname: `(app)/Detalles/[name]`,
      params: { id: Item.id, name: Item.name },
    });
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
      <View style={{ top: -30, left: 300 }}></View>
      {Track.info ? (
        <View>
          <ThemedText type="subtitle">Artistas</ThemedText>

          <ThemedView
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <ScrollView horizontal style={{width:80}}>
              {Track.info.artists?.map((item: any, index: number) => (
                <Pressable style={{borderRadius:40,margin:10, paddingHorizontal:8,backgroundColor:'#1F283D'}} onPress={() => getDetails(item)} key={index}>
                  <ThemedText type="default">{item.name}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>

            {currentSound === null ? (
              <Pressable
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

          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
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
          <View style={{marginTop:30, marginBottom:20}}>
            <ThemedText type="title">About</ThemedText>
            <ThemedText style={{justifyContent:'center',textAlign:"justify"}}>{informacion}</ThemedText>
          </View>
        </View>
      ) : (
        <ThemedText> undefined </ThemedText>
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
