import { ActivityIndicator, SafeAreaView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "@/Styles/styles";
import { getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import * as Network from "expo-network";
import { ThemedText } from "@/components/ThemedText";

export default function music() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length <= 5) {
      fetchData().then((traks: any) => {
        setData((prev: any) => [...prev, ...traks]);
      });
    }
  }, [data]);

  const onRefresh = useCallback(() => {
    fetchData().then((tracks: any) => {
      setData((prev) => [...prev, tracks]);
    });
  }, []);

  const fetchData = useCallback(async () => {
    const data_response: any[] = await getRecomendations();

    if (data_response.length === 0) {
      return onRefresh();
    }

    const data_result = data_response
      .flat()
      .filter((i: any) => i.preview_url !== null);

    const extractedData = data_result.map((track: any) => ({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url || null,
      artist: track.artists[0]?.name || "",
      preview_url: track.preview_url,
    }));
    return extractedData;
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#000818", flex: 1 }}>
      {data.length >= 0 ? (
        <View style={{ display:'flex', marginTop: 10, marginBottom: 10 }}>
           <SwipeCard items={data} setItems={setData}>
            {(item: any) => <Card card={item} />}
          </SwipeCard>
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </SafeAreaView>
  );
}
