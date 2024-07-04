
import {
 Image,
  View,
  ScrollView,
  Text,
  ImageBackground,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { useStateValue } from "@/Context/store";
import { getTop } from "@/Api/SongsActions";
import { styles } from "@/Styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { topGeneros } from "@/service/TopGeners";

export default function TabTwoScreen() {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [generos, setGeneros] = useState([]);
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
  }, [sesionUsuario, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await getTop("artists", requestArtist.offset);
      setRequestArtist((prev) => ({
        ...prev,
        artists: data.items,
      }));
      const generos = data.items.map((item:any)=> item.genres).flat();

      const top = topGeneros(generos)
      console.log('topGeneros',top)
      
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      const data: any = await getTop("tracks", requestMusic.offsetSongs);
      setRequestMusic((prev) => ({
        ...prev,
        songs: data.items,
      }));
    };
    fetchSongs();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={

        <Image
          source={{
            uri:
              'https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          }}
          style={{ width: 500, height: 300 }}
        />
        
      }
    >
      <View>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Hola {usuario.display_name}!</ThemedText>
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
                source={{ uri: item.images[0].url }}
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
                source={{ uri: item.album.images[0].url }}
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
  );
}
