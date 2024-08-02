import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import { Recommendatios, song } from "@/types/Card.types";

export default function music() {
  const [data, setData] = useState<song[]>([]);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    if (data.length <= 10) {
      fetchData()
        .then((traks: song[]) => {
          setData((prev: song[]) => [...prev, ...traks]);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [data, error]);

  const fetchData = useCallback(async (): Promise<Recommendatios[]> => {
    const data_response: Recommendatios[] = await getRecomendations();
    const data_result = data_response.filter(
      (i: Recommendatios) => i.preview_url !== null,
    );
    const extractedData = data_result;
    return extractedData;
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#000818", flex: 1 }}>
      {data.length > 0 ? (
        <View style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
          <SwipeCard items={data} setItems={setData}>
            {(item: Recommendatios) => <Card card={item} />}
          </SwipeCard>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  );
}
