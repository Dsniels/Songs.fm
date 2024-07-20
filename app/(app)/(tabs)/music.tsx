import { ActivityIndicator,SafeAreaView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "@/Styles/styles";
import { getListOfSongs, getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import { SwipeCard } from "@/components/SwipeCard";


export default function music() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length <= 10) {
      fetchData().then((traks: any) =>
        setData((prev: any) => [...prev, ...traks])
      );
    }
  }, [data]);

  const onRefresh = useCallback(() => {
    
    fetchData().then((tracks: any) => {
      setData(tracks);
    });
  }, []);

  const fetchData = async () => {
    const data_response: any = await getRecomendations();
    if(data_response.length === 0){
      await onRefresh()
    }
    const to_process = data_response
      .filter((i: any) => i.preview_url === null)
      .map((i: any) => i.id)
      .toString();
    const new_Data : any = await getListOfSongs(to_process);
    const data_merge = { ...new_Data, ...data_response };
    const data_result = Object.values(data_merge).filter((i:any)=>i.preview_url !== null);
    const extractedData = data_result.map((track: any) => ({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url || null,
      artist: track.artists[0]?.name || "",
      preview_url: track.preview_url,
    }))
    return extractedData;
  };

  return (
    <SafeAreaView style={[styles.container, {width:'100%', height:'100%'}]}>

        {data.length >= 0 ? (
          <View style={{  marginTop: 40 }}>
            <SwipeCard items={data} setItems={setData}>
              {(item: any, swipe: any, isFirst: any) => (
                <Card card={item}/>
              )}
            </SwipeCard>
          </View>
        ) : (
          <ActivityIndicator size='large' />
        )}

    </SafeAreaView>
  );
}
