import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import {  Recommendatios, song } from "@/types/Card.types";

export default function music() {
  const [data, setData] = useState<song[]>([]);

  useEffect(() => {
    if (data.length <= 5) {
      fetchData().then((traks: song[] ) => {
        setData((prev: song[]) => [...prev, ...traks]);
      });
    }
  }, [data]);

  // const onRefresh = useCallback(() => {
  //   fetchData().then((tracks: any) => {
  //     setData((prev) => [...prev, tracks]);
  //   });
  // }, []);


  const fetchData = useCallback(async () : Promise<Recommendatios[]> => {
    const data_response: Recommendatios[] = await getRecomendations();

    const data_result = data_response
      .flat()
      .filter((i: Recommendatios) => i.preview_url !== null);

    const extractedData = data_result
    return extractedData;
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#000818", flex: 1 }}>
      {data.length >= 0 ? (
        <View style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
          <SwipeCard items={data} setItems={setData}>
            {(item: Recommendatios) => <Card card={item} />}
          </SwipeCard>
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </SafeAreaView>
  );
}
