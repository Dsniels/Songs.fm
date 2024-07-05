import { getRecomendations } from "@/Api/SongsActions";
import AsyncStorage from "@react-native-async-storage/async-storage"


export const seedGeners=async(seedGeners:string)=>{
    AsyncStorage.setItem('seedGeneros',seedGeners)
}

const getTracksSeed =(data:any)=>{
    const fsd = data?.map((i:any)=>i.id)[0]
    return fsd?.toString()
}


export const seedTracks = async (data:any) =>{ 
    const ids :any = getTracksSeed(data.items) ||''
   await AsyncStorage.setItem('seedTrack', ids);
   getRecomendations()
}