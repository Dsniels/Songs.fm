import { Button, SafeAreaView, Text, View } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { styles } from '@/Styles/styles'
import { Audio } from 'expo-av';
import { useFocusEffect, useNavigation } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'
import { getRecomendations } from '@/Api/SongsActions'
import Card from '@/components/Card'

export default function music() {
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const navigation = useNavigation();
    const useSwiper = useRef(null).current
     const play = async()=>{   

        //const {sound}  : any = await Audio.Sound.createAsync({uri:'https://p.scdn.co/mp3-preview/c4f4406777deb17f09c0237b22044a8b18d986a4?cid=cfe923b2d660439caf2b557b21f31221'});
        const sound = new Audio.Sound()
        await sound.loadAsync({uri:'https://p.scdn.co/mp3-preview/c4f4406777deb17f09c0237b22044a8b18d986a4?cid=cfe923b2d660439caf2b557b21f31221'})
        setSound(sound);
        
        await sound.playAsync();
     }
     const stop = async()=>{
        await sound?.stopAsync();
   
     }
     const isFocused = useIsFocused();
    useFocusEffect(
        React.useCallback(() => {
        const onBlur = async () => {
            await stop();
        };
     

        return () => onBlur();
        }, [sound])
    );
    const [data, setData]= useState([{
        name : '',
        image : '',
        artist : '',
        preview_url:''
    }])

    useEffect(() => {
        const fetchData =async()=>{
            const response = await getRecomendations();
            console.log(response.data.tracks.length)
            const extractedData = response.data.tracks.map((track:any) => ({
                name: track.name,
                image: track.album.images[0]?.url || null,
                artist: track.artists[0]?.name || '',
                preview_url: track.preview_url || null
            })).filter((i:any) => i.preview_url !== null && i.image !==null)
            console.log(extractedData.length);
            

            setData(extractedData);


        }
        //fetchData()


  }, []);
  
    return (
      
        <View style={styles.container}>
            <ThemedView style={styles.textContainer} >
                <ThemedText type='title'>Music</ThemedText>
            </ThemedView>
            <View style={styles.container}>
                <Button title="Play Sound" onPress={play} />
                <Text style={{color:'white'}}>{isFocused ? 'focused' : 'unfocused'}</Text>
                <Button title='Stop Music' onPress={stop} />
            </View>
        
                {data ? data.map((item:any)=>(
                    <Card card={item}/>
                    
                )) :(<Text>none</Text>)}
         
        </View>
   
        
    )
  
}