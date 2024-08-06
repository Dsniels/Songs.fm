import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { getArtistInformation } from "@/Api/ArtistsActions";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "@/Styles/styles";
import { getInfo } from "@/Api/AnnotatiosActions";
import { extractInfo } from "@/service/FormatData";
import { ListOfArtists } from "@/components/ListOfArtists";
import { SmallListSongs } from "@/components/SmallListSongs";
import { album, artist, items, song } from "@/types/Card.types";

type ArtistInfo = {
  info: artist;
  songs: song[];
  albums: album[];
  artists: artist[];
};

const Detalles = () => {
  const navigation = useNavigation();
  const [informacion, setInformacion] = useState<string>("");
  const [ShowMore, setShowMore] = useState(false);
  const {
    name = "",
    id = "",
    imagenArtist,
  } = useLocalSearchParams<{
    name?: string;
    id?: string;
    imagenArtist: string;
  }>();
  const [infoArtist, setInfo] = useState<ArtistInfo>({
    info: {
      id: "",
      name: "",
      images: [{ url: "" }],
      genres: [],
      popularity: 0,
      uri: "",
    },
    songs: [],
    albums: [],
    artists: [],
  });

  const getDetails = (Item: artist) => {
    return router.push({
      pathname: "(app)/Detalles/[name]",
      params: {
        id: Item.id,
        name: Item.name,
        imagenArtist: Item.images[0].url,
      },
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });

    const fetchData = async () => {
      try {
        const [artistInfoResult, descriptionResult] = await Promise.all([
          getArtistInformation(id),
          getInfo(name, name, false),
        ]);

        const {
          Info,
          Songs = [],
          Albums = [],
          Artists = [],
        } = artistInfoResult;
        setInfo({
          info: Info,
          songs: Songs,
          albums: Albums,
          artists: Artists,
        });

        if (descriptionResult) {
          let info = descriptionResult.map((i) => extractInfo(i)).join(" ");
          if (informacion === "?") info = "I Dont found it  :(";

          setInformacion(info);
        } else {
          setInformacion("I Dont found it  :(");
        }
      } catch (e) {
        ToastAndroid.showWithGravity(
          `${e}`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    };

    fetchData();
  }, [name, id, navigation]);

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
    <SafeAreaView style={{ backgroundColor: "#000818", flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#000818", dark: "#000818" }}
        headerImage={
          <Image
            source={{
              uri: infoArtist.info.images[0].url || imagenArtist,
            }}
            style={{ width: "100%", height: 400 }}
          />
        }
      >
        {!informacion && (
          <View className="flex-1 h-full m-auto ">
            <ActivityIndicator size="large" />
          </View>
        )}
        {informacion && (
          // skipcq: JS-0415
          <>
            <View className="flex m-5 ">
              <ThemedText type="subtitle">Who is {name}?</ThemedText>
              <Pressable
                className="flex"
                // skipcq: JS-0417
                onPress={() =>
                  ShowMore ? setShowMore(false) : setShowMore(true)
                }
              >
                <ThemedText
                  className="text-justify mb-0 mt-3 h-auto"
                  numberOfLines={ShowMore ? undefined : 2}
                  lineBreakMode="clip"
                >
                  {informacion}
                </ThemedText>
                {informacion.length > 2 && (
                  <ThemedText className="mt-0" type="link">
                    ...{ShowMore ? "show less" : "show more"}
                  </ThemedText>
                )}
              </Pressable>
            </View>
            <View>
              <View style={{ margin: 30 }}>
                <ThemedText type="subtitle">
                  Popularity {infoArtist.info.popularity} of 100
                </ThemedText>

                <ThemedText style={{ marginTop: 20 }} type="subtitle">
                  Genres
                </ThemedText>
                <ThemedText numberOfLines={3}>
                  {infoArtist.info.genres.join(", ") || "No disponible"}
                </ThemedText>
              </View>
              <View>
                <ThemedText style={{ marginTop: 20 }} type="subtitle">
                  Top Songs
                </ThemedText>
                {infoArtist.songs ? (
                  infoArtist.songs.map((item: song, index: number) => (
                    <SmallListSongs
                      key={index}
                      item={item}
                      // skipcq: JS-0417
                      getSongDetails={getSongDetails}
                    />
                  ))
                ) : (
                  <ThemedText>No hay canciones disponibles</ThemedText>
                )}
                <ThemedText style={{ marginTop: 20 }} type="subtitle">
                  Albums
                </ThemedText>
                <ScrollView horizontal>
                  {infoArtist.albums?.map((item: album) => (
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
                  ))}
                </ScrollView>

                <ThemedText style={{ marginTop: 20 }} type="subtitle">
                  You may be interested...
                </ThemedText>

                <FlatList
                  horizontal
                  data={infoArtist.artists}
                  // skipcq: JS-0417
                  renderItem={({ item }: items<artist>) => (
                    <ListOfArtists item={item} getDetails={getDetails} />
                  )}
                />

                <View style={{ marginTop: 30, marginBottom: 20 }}>
                  <ThemedText type="title">Links</ThemedText>
                  <Pressable
                    // skipcq: JS-0417
                    onPress={() => Linking.openURL(infoArtist.info.uri || "")}
                  >
                    <ThemedText
                      type="link"
                      style={{ justifyContent: "center", textAlign: "justify" }}
                    >
                      Listen on Spotify
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Detalles;
