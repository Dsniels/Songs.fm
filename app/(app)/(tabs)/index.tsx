import {
  Image,
  View,
  ScrollView,
  Text,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { useStateValue } from "@/Context/store";
import { getRecentlySongs, getTop } from "@/Api/SongsActions";
import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { topGeneros } from "@/service/TopGeners";
import { seedArtist, seedTracks } from "@/service/seeds";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
export default function TabTwoScreen() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [refreshing, setRefreshing] = useState(false);
  const [generos, setGeneros] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({
    display_name: "",
    images: {
      url: "",
    },
  });
  const [selectDate, setSelectDate] = useState("short_term");
  const [recent, setRecent] = useState<any[]>([]);
  const [requestArtist, setRequestArtist] = useState({
    artists: [],
    offset: 0,
  });
  const [requestMusic, setRequestMusic] = useState({
    songs: [],
    offsetSongs: 0,
  });
  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchData(),fetchRecentlySongs(),fetchSongs()])
    if (sesionUsuario?.usuario) {
      setUsuario(sesionUsuario.usuario);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (sesionUsuario?.usuario) {
      setUsuario(sesionUsuario.usuario);
      setRefreshing(false);
    }
  }, [sesionUsuario, refreshing]);

  const getDetails = (Item: any) => {
    return router.push({
      pathname: `(app)/Detalles/[name]`,
      params: { id: Item.id, name: Item.name },
    });
  };
  const getSongDetails = (Item: any) => {
    return router.push({
      pathname: `(app)/songsDetails/[song]`,
      params: { id: Item.id, name: Item.name, artists: Item.artists[0].name },
    });
  };
  const fetchRecentlySongs = async () => {
    const recently: any = await getRecentlySongs();
    let newArray: any[] = [];
    recently.items.map((item: any) => {
      newArray.push(item.track);
    });

    setRecent([...newArray]);
    seedTracks(newArray);
  };

  const fetchData = async () => {
    const data: any = await getTop("artists", requestArtist.offset, selectDate);
    setRequestArtist((prev) => ({
      ...prev,
      artists: data.items,
    }));
    seedArtist(data);
    const top: { name: string; value: number }[] = topGeneros(data);
    setGeneros(top);
  };

  const fetchSongs = async () => {
    const data: any = await getTop(
      "tracks",
      requestMusic.offsetSongs,
      selectDate
    );
    setRequestMusic((prev) => ({
      ...prev,
      songs: data.items,
    }));

    seedTracks(data.items);
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      Promise.all([fetchRecentlySongs(),fetchSongs(),fetchData()])
              .then(()=>setLoading(false))
    }, 5);
    console.log(generos.length <= 0,requestArtist.artists.length)
  }, [selectDate]);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        contentContainerStyle={[styles.scrollView]}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      >
        <View className="m-1">
          <View style={[styles.titleContainer]} className="mt-16">
            <ThemedText type="title">Hola {usuario.display_name}!</ThemedText>
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

          <View className="bg-cyan-700 bg-opacity-100 rounded-lg m-35 p-3">
            <ThemedText
              className="m-3 border-blue-950  opacity-2 rounded-full text-center p-5 mb-3"
              type="subtitle"
            >
              Generos que mas escuchas
            </ThemedText>
            {generos && !loading ? (
              generos.map((item: any) => (
                <View className="m-3 rounded-lg" key={item.name}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>

                  <View className="bg-cyan-900 h-4 w-60 rounded-lg">
                    <View
                      className="bg-cyan-950 h-full rounded-md"
                      style={{
                        width: `${item.value * 10}%`,
                      }}
                    ></View>
                  </View>
                </View>
              ))
            ) : (
              <ActivityIndicator size='large'/>
            )}
          </View>
          <ThemedText
            type="subtitle"
            className=" m-5 text-white font-bold mt-8"
          >
            Artistas que mas escuchas
          </ThemedText>

          <ScrollView className=" h-60 m-auto" horizontal>
            {requestArtist.artists.length >= 0 && !loading? (
              requestArtist.artists?.map((item: any) => (
                <Pressable
                  style={{ elevation: 270 }}
                  key={item.id}
                  onPress={() => getDetails(item)}
                >
                  <ImageBackground
                    key={item.id}
                    style={[styles.TopSongs]}
                    source={{
                      uri:
                        item.images[0].url ||
                        "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    }}
                  >
                    <LinearGradient
                      colors={["rgba(0,0,0,0.8)", "transparent"]}
                      style={styles.linearGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    >
                      <View
                        className=" flex z-0 top-28 right-8 m-8 w-64 p-6 rounded-3xl"
                        key={item.id}
                      >
                        <Text className="capitalize text-white font-bold  ">
                          {item.name}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              ))
            ) : (
              <ActivityIndicator size='large'/>
            )}
          </ScrollView>
          <ThemedText
            type="subtitle"
            className=" m-5 text-white font-bold mt-8"
          >
            Canciones mas escuchadas
          </ThemedText>
          <ScrollView className="h-60 m-auto" horizontal>
            {requestMusic && !loading ? (
              requestMusic.songs?.map((item: any) => (
                <Pressable key={item.id} onPress={() => getSongDetails(item)}>
                  <ImageBackground
                    key={item.id}
                    style={styles.TopSongs}
                    source={{
                      uri:
                        item.album.images[0].url ||
                        "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    }}
                  >
                    <LinearGradient
                      colors={["rgba(0,0,0,0.8)", "transparent"]}
                      style={styles.linearGradient}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    >
                      <View
                        className=" flex z-0 top-28 right-8 m-8 w-56 p-6 rounded-3xl"
                        key={item.id}
                      >
                        <Text lineBreakMode="clip" numberOfLines={1}  className="capitalize text-white font-bold  ">
                          {item.name}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              ))
            ) : (
              <ActivityIndicator size='large'/>
            )}
          </ScrollView>
          <ThemedText
            type="subtitle"
            className="m-5 m-t-6 text-center p-2 "
          >
            Escuchadas Recientemente
          </ThemedText>
          <View className="bg-cyan-950 rounded-3xl p-5">
            {recent.length > 0  && !loading? (
              recent.map((item: any, index: number) => (
                <Pressable
                  className="flex flex-row justify-start items-center border-2 bg-sky-900 p-2 bg-opacity-7 align-middle content-center m-3 rounded-md border-sky-950"
                  onPress={() => getSongDetails(item)}
                  key={index}
                >
                  <Image
                    source={{ uri: item.album?.images?.[0]?.url }}
                    className="w-14 h-14"
                  />
                  <ThemedText
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    style={{ marginLeft: 10, width: 200 }}
                  >
                    {item.name}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              <ActivityIndicator size='large'/>
              )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
