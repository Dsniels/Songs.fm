import { RefreshControl, SafeAreaView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { styles } from "@/Styles/styles";
import { getListOfSongs, getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SwipeCard } from "@/components/SwipeCard";

export default function music() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length <= 10) {
      fetchData().then((traks: any) =>
        setData((prev: any) => [...prev, ...traks])
      );
      console.log(data.length);
    }
  }, [data]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then((tracks: any) => {
      setData(tracks);
      setRefreshing(false);
    });
  }, []);

  const fetchData = async () => {
    const data_response: any = await getRecomendations();
    console.log('dara response',data_response.length)
    const to_process = data_response
      .filter((i: any) => i.preview_url === null)
      .map((i: any) => i.id)
      .toString();
      console.log('to process', to_process.split(',').length)
    const new_Data : any = await getListOfSongs(to_process);
    console.log('new data', new_Data.filter((i:any)=>i.preview_url !== null).length);
    const data_merge = { ...new_Data, ...data_response };
    const data_result = Object.values(data_merge);
    const extractedData = data_result.map((track: any) => ({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url || null,
      artist: track.artists[0]?.name || "",
      preview_url: track.preview_url,
    })).filter((i:any)=>i.preview_url !== null);
    console.log(extractedData.length);
    return extractedData;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={{ margin: 0, padding: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        {data.length >= 0 ? (
          <View style={{ marginTop: 40 }}>
            <SwipeCard items={data} setItems={setData}>
              {(item: any, swipe: any, isFirst: any) => (
                <Card swipe={swipe} card={item} isFirst={isFirst} />
              )}
            </SwipeCard>
          </View>
        ) : (
          <ThemedText type="subtitle">No Data</ThemedText>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
