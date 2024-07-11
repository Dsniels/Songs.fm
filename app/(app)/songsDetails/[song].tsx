import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { getSongInfo } from "@/Api/SongsActions";
import { ThemeProvider } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import { Audio } from "expo-av";

interface ITrack {
  info: any;
  audioFeatures: any;
  similarSongs? : any;
}

const SongDetails = () => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

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
    similarSongs : []
  });
  const { name = "", id = "" } = useLocalSearchParams<{
    name?: string;
    id?: string;
  }>();
  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });
    const fetchData = async () => {
      const { Info, Features } = await getSongInfo(id);
      setTrack((prev)=>({
        ...prev,
        info: Info || {},
        audioFeatures: Features || {},
      }));
      console.log(Track.similarSongs[0].album.images[0].url)
    };
    console.log(name, id);
    fetchData();
  }, [navigation]);
  const getSongDetails =(Item:any)=>{
    return router.push({pathname:`(app)/songsDetails/[song]`, params:{id:Item.id, name:Item.name}})
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri:
              Track.info?.album?.images?.[0]?.url ||
              "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={{ width: "100%", height: 400 }}
        />
      }
    >
      {Track.info ? (
        <View>
          {Track.info.artists?.map((item: any, index: number) => (
            <ThemedView key={index}>
              <ThemedText type="title">{item.name}</ThemedText>
            </ThemedView>
          ))}
          {currentSound === null ? (
            <Pressable onPress={() => playSound(Track.info?.preview_url || "")}>
              <ThemedText> Play</ThemedText>
            </Pressable>
          ) : (
            <Pressable onPress={() => pause()}>
              <ThemedText> stop</ThemedText>
            </Pressable>
          )}

          <View>
            <ThemedText>
              Danceability: {Track.audioFeatures.danceability}
            </ThemedText>
            <ThemedText>
              Acousticness: {Track.audioFeatures.acousticness}
            </ThemedText>
            <ThemedText>Duracion: {Track.audioFeatures.duration_ms}</ThemedText>
            <ThemedText>Energy: {Track.audioFeatures.energy}</ThemedText>
            <ThemedText>Instrumentalness: {Track.audioFeatures.instrumentalness}</ThemedText>

          </View>
          <View>
            
          </View>
        </View>
      ) : (
        <ThemedText> undefined </ThemedText>
      )}
    </ParallaxScrollView>
  );
};

export default SongDetails;

const styles = StyleSheet.create({});
