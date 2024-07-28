import {
  View,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useState } from "react";
import { useStateValue } from "@/Context/store";
import { getRecentlySongs, getTop } from "@/Api/SongsActions";
import { styles } from "@/Styles/styles";
import { topGeneros } from "@/service/TopGeners";
import { seedArtist, seedTracks } from "@/service/seeds";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { ListSongs } from "@/components/ListSongs";
import { ListOfArtists } from "@/components/ListOfArtists";
import { SmallListSongs } from "@/components/SmallListSongs";

import {
  artist,
  genero,
  ItemRespone,
  Recently,
  song,
  
} from "@/types/Card.types";

export default function TabTwoScreen() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [generos, setGeneros] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({
    display_name: "",
    images: {url : ''},
  });
  
  const [selectDate, setSelectDate] = useState("short_term");
  const [recent, setRecent] = useState<song[]>([]);
  const [requestArtist, setRequestArtist] = useState<{
    artists: Array<artist>;
    offset: number;
  }>({
    artists: [],
    offset: 0,
  });
  const [requestMusic, setRequestMusic] = useState<{
    songs: Array<song>;
    offsetSongs: number;
  }>({
    songs: [],
    offsetSongs: 0,
  });

  const getDetails = useCallback((Item: artist) => {
    router.push({
      pathname: "(app)/Detalles/[name]",
      params: { id: Item.id, name: Item.name },
    });
  }, []);

  const getSongDetails = useCallback((Item: song) => {
    router.push({
      pathname: "(app)/songsDetails/[song]",
      params: { id: Item.id, name: Item.name, artists: Item.artists[0].name },
    });
  }, []);

  const fetchRecentlySongs = useCallback(async () => {
    const recently: Recently = await getRecentlySongs();
    const newArray = recently.items.map((item) => item.track);
    setRecent(newArray);
    seedTracks(newArray);
  }, []);

  const fetchData = useCallback(async () => {
    const [data, dataTopSongs] = await Promise.all([
      getTop<ItemRespone<artist[]>>("artists", selectDate, requestArtist.offset),
      getTop<ItemRespone<song[]>>("tracks", selectDate, requestMusic.offsetSongs),

    ]);

    setRequestArtist((prev) => ({
      ...prev,
      artists: data.items,
    }));

    setRequestMusic((prev) => ({
      ...prev,
      songs: dataTopSongs.items,
    }));

    const top = topGeneros(data);
    setGeneros(top);

    seedTracks(dataTopSongs.items);
    seedArtist(data);
  }, [selectDate]);

  useEffect(() => {

    if (sesionUsuario) {
      setUsuario(sesionUsuario.usuario);

    }
  }, [sesionUsuario]);

const onRefresh = useCallback(() => {
    setLoading(true);


     return Promise.all([fetchData(), fetchRecentlySongs()]).then(() => (
    setLoading(false)
     ));
  }, [fetchData]);

  useEffect(() => {
    onRefresh().then(()=>setLoading(false)).catch(() =>{ onRefresh();});
  }, [selectDate]);

  /** 
   * Renders a single genre item within a list.
   * @param {Object} item - The genre item to be rendered.
   * @returns A JSX element representing the genre item.
   */
  const renderGeneroItem = ({ item }: genero) => (
    <View className="m-3 rounded-lg" key={item.name}>
      <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
      <View className="bg-gray-800 h-4 w-60 rounded-lg">
        <View
          className="bg-sky-700 h-full rounded-md"
          style={{ width: `${item.value * 10}%` }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        stickyHeaderHiddenOnScroll
        // skipcq: JS-0417
        renderItem={() => null}
        data={[]}
        // skipcq: JS-0417
        ListHeaderComponent={() => (
          <View className="m-1">
            <View className="flex mt-16 items-center ">
              <Image
                className="w-28 h-28 rounded-full m-4"
                source={{
                  scale: 1,
                  uri:
                  usuario.images.url ||
                    "https://filestore.community.support.microsoft.com/api/images/0ce956b2-9787-4756-a580-299568810730?upload=true",
                }}
              />
              <View>
                <ThemedText type="subtitle">{usuario.display_name}</ThemedText>
              </View>
            </View>
            <View className="m-3 flex text-center items-center justify-center flex-row">
              <ThemedText type="defaultSemiBold">Estadisticas</ThemedText>
              <Picker
                dropdownIconColor="white"
                mode="dialog"
                style={{ color: "white", width: 225 }}
                selectedValue={selectDate}
                onValueChange={(value) => setSelectDate(value)}
              >
                <Picker.Item
                  color="#060C19"
                  label="en el ultimo mes"
                  value={"short_term"}
                />
                <Picker.Item
                  color="#060C19"
                  label="en los ultimos 6 meses"
                  value={"medium_term"}
                />
                <Picker.Item
                  color="#060C19"
                  label="en el ultimo Año"
                  value={"long_term"}
                />
              </Picker>
            </View>
            {loading && <ActivityIndicator size="large" />}
            {!loading && (
              <>
                <View className="bg-opacity-25 rounded-lg m-35 p-3">
                  <ThemedText
                    className="m-3 opacity-100 rounded-full text-center p-5 mb-3"
                    type="subtitle"
                  >
                    Generos que mas escuchas
                  </ThemedText>
                  <FlatList
                    data={generos}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderGeneroItem}
                  />
                </View>
                <ThemedText
                  type="subtitle"
                  className=" m-5 text-white font-bold mt-8"
                >
                  Artistas que mas escuchas
                </ThemedText>
                <FlatList
                  data={requestArtist.artists}
                  keyExtractor={(_, index) => index.toString()}
                  // skipcq: JS-0417
                  renderItem={({ item }) => (
                    <ListOfArtists item={item} getDetails={getDetails} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <ThemedText
                  type="subtitle"
                  className=" m-5 text-white font-bold mt-8"
                >
                  Canciones mas escuchadas
                </ThemedText>
                <FlatList
                  data={requestMusic.songs}
                  keyExtractor={(_, index) => index.toString()}
                  // skipcq: JS-0417
                  renderItem={({ item }) => (
                    <ListSongs item={item} getSongDetails={getSongDetails} />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <ThemedText
                  type="subtitle"
                  className="m-5 m-t-6 text-center p-2 "
                >
                  Escuchadas Recientemente
                </ThemedText>
                <View className="rounded-3xl p-5">
                  {recent?.length > 0 ? (
                    <FlatList
                      data={recent}
                      keyExtractor={(_, index) => index.toString()}
                      // skipcq: JS-0417
                      renderItem={({ item }) => (
                        <SmallListSongs
                          item={item}
                          getSongDetails={getSongDetails}
                        />
                      )}
                    />
                  ) : (
                    <ActivityIndicator size="large" />
                  )}
                </View>
              </>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={false} />
        }
      />
    </SafeAreaView>
  );
}
