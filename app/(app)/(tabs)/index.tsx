import {
  View,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useState } from "react";
import {
  GetCurrentlyPlayingSong,
  getRecentlySongs,
  getTop,
} from "@/Api/SongsActions";
import { styles } from "@/Styles/styles";
import { topGeneros } from "@/service/TopGeners";
import { seedTracks } from "@/service/seeds";
import { router } from "expo-router";
import { ListSongs } from "@/components/ListSongs";
import { ListOfArtists } from "@/components/ListOfArtists";
import { SmallListSongs } from "@/components/SmallListSongs";
import { Feather } from "@expo/vector-icons";
import { artist, ItemRespone, song } from "@/types/Card.types";
import { Settings } from "@/components/Settings";
import RangePicker from "@/components/RangePicker";
import ListGeners from "@/components/ListGenrs";
import UserProfile from "@/components/UserProfile";

export default function TabTwoScreen() {
  const [generos, setGeneros] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectDate, setSelectDate] = useState("short_term");
  const [recent, setRecent] = useState<song[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<song | undefined>(
    undefined,
  );
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
      params: {
        id: Item.id,
        name: Item.name,
        imagenArtist: Item.images[0].url,
      },
    });
  }, []);

  const getCurrentlyPlaying = () => {
    GetCurrentlyPlayingSong().then((response) => {
      setCurrentlyPlaying(response.item);
    });
  };

  const fetchRecentlySongs = useCallback(async () => {
    const recently = await getRecentlySongs();
    const newArray = recently.items.map((item) => item.track);
    setRecent(newArray);
    queueMicrotask(() => seedTracks(newArray));
  }, []);

  const fetchData = useCallback(async () => {
    const [data, dataTopSongs] = await Promise.all([
      getTop<ItemRespone<artist[]>>(
        "artists",
        selectDate,
        requestArtist.offset,
      ),
      getTop<ItemRespone<song[]>>(
        "tracks",
        selectDate,
        requestMusic.offsetSongs,
      ),
    ]);

    setRequestArtist((prev) => ({ ...prev, artists: data.items }));
    setRequestMusic((prev) => ({ ...prev, songs: dataTopSongs.items }));
    setGeneros(topGeneros(data));
    queueMicrotask(() => {
      // seedArtist(data)
      seedTracks(dataTopSongs.items);
    });
  }, [selectDate]);

  const onRefresh = useCallback(async () => {
    try {
      setLoading(true);
      getCurrentlyPlaying();
      await Promise.all([fetchData(), fetchRecentlySongs()]);
      setLoading(false);
    } catch (_) {
      onRefresh();
    }
  }, [fetchData]);

  useEffect(() => {
    onRefresh();
  }, [selectDate, onRefresh]);

  const getSongDetails = (Item: song) => {
    return router.push({
      pathname: "(app)/songsDetails/[song]",
      params: {
        id: Item.id,
        name: Item.name,
        artists: Item.artists[0].name,
        ImageSong: Item.album.images[0].url,
        preview_url: Item.preview_url,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container]} className="flex-1">
      <View className="w-10/12 m-2 mt-10 flex justify-end content-end items-end ">
        <TouchableOpacity onPress={() => setModal(true)}>
          <Feather name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        stickyHeaderHiddenOnScroll
        renderItem={() => null}
        data={[]}
        ListHeaderComponent={() => (
          <View className="flex-1 items-center justify-center m-1 mt-16">
            <Settings modal={modal} setModal={setModal} />
            <View>
              <UserProfile currentlyPlaying={currentlyPlaying as song} />
              <RangePicker
                selectDate={selectDate}
                setSelectDate={setSelectDate}
              />
            </View>
            {loading && <ActivityIndicator size="large" />}
            {!loading && (
              <>
                <View className="bg-opacity-25 rounded-lg m-35 p-3">
                  <ThemedText
                    className="m-3 opacity-100 rounded-full text-center p-5 mb-3"
                    type="subtitle"
                  >
                    Most listened genres
                  </ThemedText>
                  <FlatList
                    data={generos}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ index, item }) => (
                      <ListGeners item={item} index={index} />
                    )}
                  />
                </View>
                <ThemedText
                  type="subtitle"
                  className=" m-5 text-white font-bold mt-8"
                >
                  Most listened artists
                </ThemedText>
                <FlatList
                  data={requestArtist.artists}
                  keyExtractor={(_, index) => index.toString()}
                  // skipcq: JS-0417
                  renderItem={({ item, index }) => (
                    <ListOfArtists
                      index={index + 1}
                      item={item}
                      getDetails={getDetails}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <ThemedText
                  type="subtitle"
                  className=" m-5 text-white font-bold mt-8"
                >
                  Most listened songs
                </ThemedText>
                <FlatList
                  data={requestMusic.songs}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <ListSongs
                      index={index + 1}
                      item={item}
                      getSongDetails={getSongDetails}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <ThemedText
                  type="subtitle"
                  className="m-5 m-t-6 text-center p-2 "
                >
                  Recently played
                </ThemedText>
                <View className=" flex-1 p-1 w-full">
                  {recent?.length > 0 ? (
                    <FlatList
                      data={recent}
                      keyExtractor={(_, index) => index.toString()}
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
