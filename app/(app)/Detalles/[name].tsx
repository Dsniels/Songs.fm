import {
  ActivityIndicator,
  ActivityIndicatorBase,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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

interface Tracks {
  album: any;
  id: string;
  name: string;
}

interface ArtistInfo {
  info: undefined | any;
  songs: Tracks[];
  albums: any[];
  artists: any[];
}

const Detalles = () => {
  const navigation = useNavigation();
  const [informacion, setInformacion] = useState<string | undefined>(undefined);
  const [ShowMore, setShowMore] = useState(false);
  const { name = "", id = "" } = useLocalSearchParams<{
    name?: string;
    id?: string;
  }>();
  const [infoArtist, setInfo] = useState<ArtistInfo>({
    info: undefined,
    songs: [],
    albums: [],
    artists: [],
  });

  const getDetails = (Item: any) => {
    return router.push({
      pathname: "(app)/Detalles/[name]",
      params: { id: Item.id, name: Item.name },
    });
  };

  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect: "regular" });

    const fetchData = async () => {
      const [artistInfoResult, descriptionResult] = await Promise.allSettled([
        getArtistInformation(id),
        getInfo(name, name, false),
      ]);

      if (artistInfoResult.status === "fulfilled") {
        const {
          Info,
          Songs = [],
          Albums = [],
          Artists = [],
        } = artistInfoResult.value;
        setInfo({
          info: Info || {},
          songs: Songs || [],
          albums: Albums || [],
          artists: Artists,
        });
      } else {
        ToastAndroid.showWithGravity(
          artistInfoResult.reason,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

      if (descriptionResult.status === "fulfilled") {
        const description = descriptionResult.value;
        const info = description?.map((i: any) => extractInfo(i)).join("");
        setInformacion(info);
      } else {
        ToastAndroid.showWithGravity(
          descriptionResult.reason,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    };

    fetchData().catch((e) =>
      ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER),
    );
  }, [name, id, navigation]);

  const getSongDetails = (Item: any) => {
    return router.push({
      pathname: "(app)/songsDetails/[song]",
      params: { id: Item.id, name: Item.name, artists: Item.artists[0].name },
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#000818", dark: "#000818" }}
      headerImage={
        <Image
          source={{
            uri:
              infoArtist.info?.images?.[0]?.url ||
              "https://th.bing.com/th/id/OIP.dfpjYr0obWlvVKnjJ9ccyQHaHJ?rs=1&pid=ImgDetMain",
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
        <View className="flex m-5 ">
          <ThemedText type="subtitle">Who is {name}?</ThemedText>
          <Pressable
            className="flex"
            onPress={() => (ShowMore ? setShowMore(false) : setShowMore(true))}
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
      )}
      {infoArtist.info?.genres ? (
        <View>
          <View style={{ margin: 30 }}>
            <ThemedText type="subtitle">Popularidad:</ThemedText>
            <ThemedText type="subtitle">
              {infoArtist.info?.popularity}
            </ThemedText>

            <ThemedText style={{ marginTop: 20 }} type="subtitle">
              Géneros
            </ThemedText>
            <ThemedText numberOfLines={3}>
              {infoArtist.info?.genres?.join(", ") || "No disponible"}
            </ThemedText>
          </View>
          <View>
            <ThemedText style={{ marginTop: 20 }} type="subtitle">
              Canciones Top
            </ThemedText>
            {infoArtist.songs.length > 0 ? (
              infoArtist.songs.map((item: Tracks, index: number) => (
                <SmallListSongs
                  key={index}
                  item={item}
                  getSongDetails={getSongDetails}
                />
              ))
            ) : (
              <ThemedText>No hay canciones disponibles</ThemedText>
            )}
            <ThemedText style={{ marginTop: 20 }} type="subtitle">
              Albumes
            </ThemedText>
            <ScrollView horizontal>
              {infoArtist.albums.length > 0 ? (
                infoArtist.albums?.map((item: any) => (
                  <ImageBackground
                    key={item.id}
                    style={styles.TopSongs}
                    source={{
                      uri:
                        item?.images?.[0]?.url ||
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
                <ThemedText>No hay canciones disponibles</ThemedText>
              )}
            </ScrollView>

            <ThemedText style={{ marginTop: 20 }} type="subtitle">
              Te podría interesar...
            </ThemedText>
            {infoArtist.artists.length > 0 ? (
              <FlatList
                horizontal
                data={infoArtist.artists}
                renderItem={({ item }) => (
                  <ListOfArtists item={item} getDetails={getDetails} />
                )}
              />
            ) : (
              <ActivityIndicator />
            )}

            <View style={{ marginTop: 30, marginBottom: 20 }}>
              <ThemedText type="title">Links</ThemedText>
              <Pressable
                onPress={() => Linking.openURL(infoArtist.info?.uri || "")}
              >
                <ThemedText
                  type="link"
                  style={{ justifyContent: "center", textAlign: "justify" }}
                >
                  Escuchar en Spotify
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </ParallaxScrollView>
  );
};

export default Detalles;
