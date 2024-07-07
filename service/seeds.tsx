import AsyncStorage from "@react-native-async-storage/async-storage"


export const seedGeners=async(seedGeners:string)=>{
    AsyncStorage.setItem('seedGeneros',seedGeners)
}

const getTracksSeed =(data:any)=>{
    const fsd = data?.map((i:any)=>i.id)
    return fsd
}


export const seedTracks = async (data:any) =>{ 
    const ids :any = getTracksSeed(data.items)[0]
   await AsyncStorage.setItem('seedTrack', ids.toString());
}

export const seedArtist = async (data : any)=>{
    const ids = getTracksSeed(data.items).slice(0,4);
    await AsyncStorage.setItem('seedArtists', ids.toString())
}

export const seedLongTracks = async (data:any) =>{ 
    const ids :any = getTracksSeed(data.items).slice(0,4)
   await AsyncStorage.setItem('seedLongTrack', ids.toString());
}