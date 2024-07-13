import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { getArtistInformation } from '@/Api/ArtistsActions';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SongDetails from '../songsDetails/[song]';

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
            <ThemedText type='subtitle'>Top {infoArtist.info?.popularity ?? 'N/A'}°</ThemedText>
            <ThemedText type='subtitle'>Géneros</ThemedText>
            <ThemedText numberOfLines={3} >{infoArtist.info?.genres?.join(', ') || 'No disponible'}</ThemedText>
          </View>
          <View>
            <ThemedText type='subtitle'>Te podria interasar...</ThemedText>
            {infoArtist.artists.length > 0 ? (
                infoArtist.artists.map((item: any) => (
                    <Pressable key={item.id} onPress={()=>getDetails(item)} >
                    <View key={item.id}>
                    <Image source={{ uri: item.images?.[0]?.url }} style={{ width: 50, height: 50 }} />
                    <ThemedText numberOfLines={1} ellipsizeMode='clip' >{item.name}</ThemedText>
                    </View>
                    </Pressable>
                ))
                ) : (
                <ThemedText>No hay canciones disponibles</ThemedText>
                )}
            <ThemedText type='subtitle'>Canciones Top</ThemedText>
            {infoArtist.songs.length > 0 ? (
              infoArtist.songs.map((item: Tracks) => (
                <Pressable onPress={()=>getSongDetails(item)} key={item.id}>
                  <Image source={{ uri: item.album?.images?.[0]?.url }} style={{ width: 50, height: 50 }} />
                  <ThemedText numberOfLines={1} ellipsizeMode='clip' >{item.name}</ThemedText>
                </Pressable>
              ))
            ) : (
              <ThemedText>No hay canciones disponibles</ThemedText>
            )}
            <ThemedText type='subtitle'>Albumes</ThemedText>
            {infoArtist.albums.length > 0 ? (
              infoArtist.albums.map((item: any) => (
                <View key={item.id}>
                  <Image source={{ uri: item.images?.[0]?.url }} style={{ width: 50, height: 50 }} />
                  <ThemedText numberOfLines={1} ellipsizeMode='clip' >{item.name}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText>No hay canciones disponibles</ThemedText>
            )}
          </View>
        </View>
      ) : null}
    </ParallaxScrollView>
  );
};

export default Detalles;

const styles = StyleSheet.create({});
