import { Button, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { styles } from "@/Styles/styles";
import { Audio } from "expo-av";
import { useFocusEffect, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { getListOfSongs, getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import Animated, { useAnimatedRef } from "react-native-reanimated";

export default function music() {
   const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([
    {
        id:'',
      name: "",
      image: "",
      artist: "",
      preview_url: "",
    },
  ]);


  const onRefresh = useCallback(() => {

        fetchData()
    
  }, [refreshing]);

  const fetchData = async () => {
      const response = await getRecomendations();
      console.log(response.data.tracks.length)
      let extractedData = response.data.tracks
        .map((track: any) => ({
          id: track.id,
          name: track.name,
          image: track.album.images[0]?.url || null,
          artist: track.artists[0]?.name || "",
          preview_url: track.preview_url || null,
        } ));

        
      extractedData = extractedData.filter((i: any) => i.preview_url !== null );
      console.log(extractedData.length);
      // console.log(extractedData);

      setData(extractedData);
    };

  useEffect(() => {
    
    fetchData();

  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView    refreshControl={
          <RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />
        }
        ref={scrollRef} scrollEventThrottle={16}>

        
        <View style={styles.container}>
          <ThemedView style={styles.textContainer}>
            <ThemedText type="title">Music</ThemedText>
          </ThemedView>
          <View style={styles.container}>

          </View>

          {data ? (
            data.map((item: any) => <Card card={item} />)
          ) : (
            <Text>none</Text>
          )}
        </View>
        
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
