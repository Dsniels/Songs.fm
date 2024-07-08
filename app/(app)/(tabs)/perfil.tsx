import {
  Image,
  View,
  ScrollView,
  Text,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useState } from "react";
import { useStateValue } from "@/Context/store";
import { getTop } from "@/Api/SongsActions";
import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { topGeneros } from "@/service/TopGeners";
import { seedArtist, seedLongTracks, seedTracks } from "@/service/seeds";
export default function TabTwoScreen() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [refreshing, setRefreshing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [generos, setGeneros] = useState<{ name: string; value: number }[]>([]);
  const [usuario, setUsuario] = useState({
    display_name: "",
    images: {
      url: "",
    },
  });

  const [requestArtist, setRequestArtist] = useState({
    artists: [],
    offset: 0,
  });
  const [requestMusic, setRequestMusic] = useState({
    songs: [],
    offsetSongs: 0,
  });

  useEffect(() => {
    if (sesionUsuario?.usuario) {
      setUsuario(sesionUsuario.usuario);
    }
  }, [sesionUsuario, refreshing]);

  const onRefresh = useCallback(() => {
    if (scrollPosition <= 0) {
      // Verifica si el usuario está en la parte superior de la pantalla
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [scrollPosition]);
  const handleScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.y;
    setScrollPosition(position);
  };
  const fetchData = async () => {
    const data: any = await getTop("artists", requestArtist.offset);
    setRequestArtist((prev) => ({
      ...prev,
      artists: data.items,
    }));
    seedArtist(data);
    const top: { name: string; value: number }[] = topGeneros(data);
    setGeneros(top);
  };
  const fetchSongs = async () => {
    const data: any = await getTop("tracks", requestMusic.offsetSongs);
    setRequestMusic((prev) => ({
      ...prev,
      songs: data.items,
    }));
    seedLongTracks(data);
    seedTracks(data);
  };

  useEffect(() => {
    fetchSongs();
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
      >
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
          headerImage={
            <Image
              source={{
                uri: "https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
              }}
              style={{ width: 500, height: 300 }}
            />
          }
        >
          <View>
            <View style={styles.titleContainer}>
              <ThemedText type="title">Hola {usuario.display_name}!</ThemedText>
            </View>
            <View style={{ margin: 10 }}>
              <ThemedText style={{ marginBottom: 10 }} type="subtitle">
                Generos que mas escuchas
              </ThemedText>
              {generos ? (
                generos.map((item: any) => (
                  <View key={item.name}>
                    <ThemedText type="defaultSemiBold">
                      {item.name} {item.value}
                    </ThemedText>
                  </View>
                ))
              ) : (
                <Text>Null</Text>
              )}

              <ThemedText type="default"></ThemedText>
            </View>
            <Text style={{ color: "white", fontWeight: "bold", marginTop: 50 }}>
              Artistas que mas escuchas
            </Text>

            <ScrollView
              style={{
                height: 270,
                borderStyle: "solid",
                margin: 0,
                borderColor: "green",
                borderWidth: 1,
              }}
              horizontal
            >
              {requestArtist.artists ? (
                requestArtist.artists?.map((item: any) => (
                  <ImageBackground
                    key={item.id}
                    style={styles.TopSongs}
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
                ))
              ) : (
                <Text>None</Text>
              )}
            </ScrollView>
            <Text style={{ color: "white", fontWeight: "bold", marginTop: 50 }}>
              Canciones mas escuchadas
            </Text>
            <ScrollView
              style={{
                height: 250,
                borderStyle: "solid",
                margin: 0,
                borderColor: "green",
                borderWidth: 1,
              }}
              horizontal
            >
              {requestMusic ? (
                requestMusic.songs?.map((item: any) => (
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
                ))
              ) : (
                <Text>None</Text>
              )}
            </ScrollView>
          </View>
        </ParallaxScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
