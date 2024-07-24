import { ActivityIndicator,SafeAreaView, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "@/Styles/styles";
import {  getRecomendations } from "@/Api/SongsActions";
import Card from "@/components/Card";
import { SwipeCard } from "@/components/SwipeCard";
import * as Network from 'expo-network';



export default function music() {
  const [data, setData] = useState<any[]>([]);

  
  useEffect(() => {

    if (data.length <= 5) {
      fetchData().then((traks: any) =>{
        setData((prev: any) => [...prev, ...traks])
      }

      )
    }
  }, [data]);

  const onRefresh = useCallback(() => {
   fetchData().then((tracks: any) => {
      setData((prev)=>[...prev, tracks]);
    })
  }, []);

  const fetchData = useCallback(async () => {
    const data_response: any[] = await Promise.all([getRecomendations(), getRecomendations()]) 
    if(data_response.length === 0){
       return onRefresh()
    }
    
        
    const data_result = data_response.flat().filter((i:any)=>i.preview_url !== null);
    const extractedData = data_result.map((track: any) => ({
      id: track.id,
      name: track.name,
      image: track.album.images[0]?.url || null,
      artist: track.artists[0]?.name || "",
      preview_url: track.preview_url,
    }))
    return extractedData;
  },[]);

  return (
    <SafeAreaView style={[styles.container, {width:'100%', height:'100%'}]}>

        {data.length >= 0 ? (
          <View style={{  marginTop: 40 }}>
            <SwipeCard items={data} setItems={setData}>
              {(item: any) => (
                <Card card={item}/>
              )}
            </SwipeCard>
          </View>
        ) : (
          <ActivityIndicator size='large' />
        )}

    </SafeAreaView>
  );
}
