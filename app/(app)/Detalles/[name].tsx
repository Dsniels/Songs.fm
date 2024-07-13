import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { getArtistInformation } from '@/Api/ArtistsActions';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SongDetails from '../songsDetails/[song]';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '@/Styles/styles';

interface Tracks {
  album: any;
  id: string;
  name: string;
}

interface ArtistInfo {
  info: any;
  songs: Tracks[];
  albums: any[];
  artists:any[]
}

const Detalles = () => {
  const navigation = useNavigation();
  const { name = '', id = '' } = useLocalSearchParams<{ name?: string; id?: string }>();
  const [infoArtist, setInfo] = useState<ArtistInfo>({
    info: {},
    songs: [],
    albums: [],
    artists : []
  });
  const getDetails =(Item:any)=>{
    return router.push({pathname:`(app)/Detalles/[name]`, params:{id:Item.id, name:Item.name}})
  }
  
  useEffect(() => {
    navigation.setOptions({ title: name, headerBlurEffect:"regular", });

    const fetchData = async () => {
      try {
        const { Info, Songs = [], Albums = [], Artists = []} = await getArtistInformation(id);
        setInfo({
          info: Info || {},
          songs: Songs || [],
          albums: Albums || [],
          artists : Artists
        });
      } catch (error) {
        console.error('Error fetching artist information:', error);
      }
    };

    fetchData();
  }, [name, id, navigation]);
    const getSongDetails =(Item:any)=>{
    return router.push({pathname:`(app)/songsDetails/[song]`, params:{id:Item.id, name:Item.name}})
  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: infoArtist.info?.images?.[0]?.url || 'https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
          }}
          style={{ width: '100%', height: 400 }}
        />
      }
    >
      {infoArtist.info?.images?.[0]?.url ? (
        <View>
          <View>
            <ThemedText type='subtitle'>Popularidad:</ThemedText>
            <View style={{ height: 10, backgroundColor: '#14181E', width: 200, borderRadius: 5 }}>
                      <View
                        style={{
                          backgroundColor: '#091F98',
                          height: '100%',
                          width: `${infoArtist.info?.popularity}%`,
                          borderRadius: 5,
                        }}
                      ></View>
                    </View>
            
            
            <ThemedText style={{marginTop:20}} type='subtitle'>Géneros</ThemedText>
            <ThemedText numberOfLines={3} >{infoArtist.info?.genres?.join(', ') || 'No disponible'}</ThemedText>
          </View>
          <View>
            
            <ThemedText style={{marginTop:20}} type='subtitle'>Canciones Top</ThemedText>
            {infoArtist.songs.length > 0 ? (
              infoArtist.songs.map((item: Tracks) => (
                <Pressable style={{backgroundColor:'#060C19',display:'flex', flexDirection:'row', justifyContent:'flex-start', alignContent:'center', alignItems:'center', margin:10}} onPress={()=>getSongDetails(item)} key={item.id}>
                  <Image source={{ uri: item.album?.images?.[0]?.url }} style={{ width: 50, height: 50 }} />
                  <ThemedText numberOfLines={1} ellipsizeMode='clip' style={{marginLeft:10}} >{item.name}</ThemedText>
                </Pressable>
              ))
            ) : (
              <ThemedText>No hay canciones disponibles</ThemedText>
            )}
            <ThemedText style={{marginTop:20}} type='subtitle'>Albumes</ThemedText>
            <ScrollView horizontal>
            {infoArtist.albums.length > 0 ? (
              infoArtist.albums.map((item: any) => (
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
        
              ))
            ) : (
              <ThemedText>No hay canciones disponibles</ThemedText>
            )}
            </ScrollView>
            <ThemedText style={{marginTop:20}} type='subtitle'>Te podria interasar...</ThemedText>
            <ScrollView  horizontal>
            {infoArtist.artists.length > 0 ? (
                infoArtist.artists.map((item: any) => (
                    <Pressable style={{height:200, width:200, margin:20,marginTop:10,borderRadius:100}} key={item.id} onPress={()=>getDetails(item)} >
                      <ImageBackground
                        key={item.id}
                        style={[styles.TopArtist]}
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
                          borderRadius:400
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
                <ThemedText>No hay canciones disponibles</ThemedText>
                )}
                </ScrollView>
          </View>
        </View>
      ) : null}
    </ParallaxScrollView>
  );
};

export default Detalles;

