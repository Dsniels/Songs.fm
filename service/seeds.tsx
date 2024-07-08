import AsyncStorage from "@react-native-async-storage/async-storage"





export const seedGeners=async(seedGeners:string)=>{

    AsyncStorage.setItem('seedGeneros',seedGeners)

}

const extractIDs =(data:any)=>{
    const fsd = data?.map((i:any)=>i.id)
    return fsd
}


export const seedTracks = async (data:any) =>{ 
    const ids :any =extractIDs(data.items)
    await AsyncStorage.setItem('seedTrack', ids.toString());
}

export const seedArtist = async (data : any)=>{
    const ids = extractIDs(data.items);
    await AsyncStorage.setItem('seedArtists', ids.toString())
}

const randomIndex = (array : any[])=>{
    return Math.floor(Math.random() * array.length)
}

const convertToArray =(string : string|null) =>{
    return string?.split(',').slice(0) || []
}

const getRandomSeedItem = async (key: string) => {
  const seedString = await AsyncStorage.getItem(key);
  const seedArray = convertToArray(seedString);
  return seedArray[randomIndex(seedArray)];
};

export const seeds = async () => {
  const seedTrack = await getRandomSeedItem('seedTrack');
  const seedArtist = await getRandomSeedItem('seedArtists');
  const seedGeneros = await getRandomSeedItem('seedGeneros');

  return { songs: seedTrack, artists: seedArtist, generos: seedGeneros };
};


