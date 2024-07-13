import {
  Image,
  View,
  ScrollView,
  Text,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
  Pressable,
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
  const [usuario, setUsuario] = useState({
    display_name: "",
    images: {
      url: "",
    },
  });
  const [selectDate, setSelectDate] = useState("short_term");

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
    const recently: any = await getRecentlySongs();
    const data: any = await getTop(
      "tracks",
      requestMusic.offsetSongs,
      selectDate
    );
    setRequestMusic((prev) => ({
      ...prev,
      songs: data.items,
    }));
    let newArray: any[] = [];
    recently.items.map((item: any) => {
      newArray.push(item.track);
    });
    seedTracks(newArray);
    seedTracks(data.items);
  };

  useEffect(() => {
    fetchSongs();
    fetchData();
  }, [selectDate]);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView
        contentContainerStyle={[styles.scrollView]}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      >
        <View style={{ margin: 10 }}>
          <View style={[styles.titleContainer, { marginTop: 70 }]}>
            <ThemedText type="title">Hola {usuario.display_name}!</ThemedText>
          </View>
          <View
            style={{
              margin: 20,
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <ThemedText type="defaultSemiBold">Estadisticas</ThemedText>
            <Picker
              dropdownIconColor="white"
              mode="dialog"
              style={{ color: "white", width: 250 }}
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
          <View style={{ margin: 10 }}>
            <ThemedText style={{ marginBottom: 10 }} type="subtitle">
              Generos que mas escuchas
            </ThemedText>

            {generos ? (
              generos.map((item: any) => (
                <View style={{ margin: 10 }} key={item.name}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <View
                    style={{
                      height: 10,
                      backgroundColor: "#14181E",
                      width: 200,
                      borderRadius: 5,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#091F98",
                        height: "100%",
                        width: `${item.value * 10}%`,
                        borderRadius: 5,
                      }}
                    ></View>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ height: 500 }}></View>
            )}

            <ThemedText type="default"></ThemedText>
          </View>
          <ThemedText
            type="subtitle"
            style={{
              margin: 20,
              color: "white",
              fontWeight: "bold",
              marginTop: 50,
            }}
          >
            Artistas que mas escuchas
          </ThemedText>

          <ScrollView
            style={{
              height: 270,
              margin: 0,
            }}
            horizontal
          >
            {requestArtist.artists ? (
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
                        style={{
                          display: "flex",
                          zIndex: 0,
                          top: 100,
                          right: 30,
                          margin: 30,
                          width: 200,
                          padding: 20,
                          borderRadius: 400,
                        }}
                        key={item.id}
                      >
                        <Text
                          style={{
                            textTransform: "capitalize",
                            color: "white",
                            fontSize: 18,
                            fontStyle: "normal",
                            fontWeight: "bold",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              ))
            ) : (
              <Text>None</Text>
            )}
          </ScrollView>
          <ThemedText
            type="subtitle"
            style={{
              margin: 20,
              color: "white",
              fontWeight: "bold",
              marginTop: 50,
            }}
          >
            Canciones mas escuchadas
          </ThemedText>
          <ScrollView
            style={{
              height: 250,
              margin: "auto",
            }}
            horizontal
          >
            {requestMusic ? (
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
                        style={{
                          display: "flex",
                          zIndex: 0,
                          top: 95,
                          right: 30,
                          margin: 30,
                          width: 200,
                          padding: 20,
                        }}
                        key={item.id}
                      >
                        <Text
                          style={{
                            textTransform: "capitalize",
                            color: "white",
                            fontSize: 18,
                            fontStyle: "normal",
                            fontWeight: "bold",
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Pressable>
              ))
            ) : (
              <Text>None</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
