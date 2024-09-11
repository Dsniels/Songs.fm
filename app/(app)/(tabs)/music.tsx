import {
  ActivityIndicator,
  SafeAreaView,
  ToastAndroid,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import { Recommendatios, song } from "@/types/Card.types";
import { loadSongs } from "@/service/loadSongs";

export default function music() {
  const [data, setData] = useState<song[]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const data_response: Recommendatios[] = await getRecomendations();
      const data_result = data_response.filter(
        (i: Recommendatios) => i.preview_url !== null,
      );
      const songs = await loadSongs(data_result);

      setData((prev) => [...prev, ...songs]);
    } catch (_) {
      setErrorCount((prev) => prev + 1);
      if (errorCount < 3) {
        fetchData();
      } else {
        ToastAndroid.show("Ocurrio un error vuelve a intentarlo mas tarde", 20);
      }
    }
  }, []);

  useEffect(() => {
    if (data.length <= 10) {
      fetchData();
    }
  }, [data]);

  return (
    <SafeAreaView style={{ backgroundColor: "#000000", flex: 1 }}>
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
