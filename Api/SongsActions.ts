import { Axios, AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getTop = ( type:string, offset:number = 0,) : Promise<AxiosResponse<any>> =>{
    return new Promise((resolve, reject) => {
        HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=long_term`)
                    .then((response:AxiosResponse)=>{
                        resolve(response.data);
                    })
                    .catch((e:any) => {
                        console.log('ErrorGetTop',e);
                        resolve(e);
                    })
        
    })

}


export const getRecomendations = async () : Promise<any>=>{
    const geners_seed = await AsyncStorage.getItem('seedGeneros');
    console.log('generos seed',geners_seed);
    const seed_songs = await AsyncStorage.getItem('seedTrack');
    console.log('seed Song', seed_songs)
    const more_recommendations = await getCombinedRecommendations();
    const leng = Object.values(more_recommendations);
    console.log('combinedLength:', leng.length)


    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_tracks=${seed_songs}&seed_genres=${geners_seed}&min_danceability=0.4&min_energy=0.4&min_popularity=60`)
                    .then((response:any)=>{
                        const combined = {...more_recommendations, ...response.data.tracks}
                        const result = Object.values(combined);
                        console.log('RESULT:', result, result.length)
                        resolve(result);
                    })
                    .catch((e:any)=>{
                        console.log(e);
                    })
    })
}



export const getListOfSongs = (trakcs : string[]) : Promise<AxiosResponse<any>> => {
    return new Promise((resolve, reject)=>{
        HttpCliente.get(`/tracks?ids=${trakcs}`)
                    .then((response : AxiosResponse)=>{
                        resolve(response.data.tracks);
                    })
                    .catch((e:any)=>{
                        resolve(e)
                    })
    })
}



 async function getCombinedRecommendations() {
  try {
    const recommendations_seedGeneros = await getRecommendationsSeedGeneros();
    const recommendations_seedSongs = await getRecommendationsSeedSongs();
    const recommendations_seedArtists = await getRecommendationsSeedArtist();
    console.log('recomendation length', recommendations_seedGeneros.length, recommendations_seedSongs.length, recommendations_seedArtists.length);

    const result = {...recommendations_seedGeneros, ...recommendations_seedSongs, ...recommendations_seedArtists};
    //const result = Object.values(combined)
    return result;
  } catch (error) {
    console.error("Error al obtener las recomendaciones:", error);
  }
}


export const getRecommendationsSeedGeneros = async () : Promise<any>=>{
    const geners_seed = await AsyncStorage.getItem('seedGeneros');
    console.log('generos seed',geners_seed);



    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_genres=${geners_seed}&min_danceability=0.4&min_energy=0.4&min_popularity=60`)
                    .then((response:any)=>{
                        resolve(response.data.tracks);
                    })
                    .catch((e:any)=>{
                        console.log(e);
                    })
    })
}



export const getRecommendationsSeedSongs= async () : Promise<any>=>{
    const seed_songs = await AsyncStorage.getItem('seedLongTrack');
    console.log('seed Song', seed_songs)


    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_tracks=${seed_songs}&min_danceability=0.4&min_popularity=60`)
                    .then((response:any)=>{
                        resolve(response.data.tracks);
                    })
                    .catch((e:any)=>{
                        console.log(e);
                    })
    })
}



export const getRecommendationsSeedArtist= async () : Promise<any>=>{
    const seed_songs = await AsyncStorage.getItem('seedArtists');


    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_artists=${seed_songs}&min_popularity=60`)
                    .then((response:any)=>{
                        if(response.data.tracks.length === 0) console.log('no hay canciones')
                        resolve(response.data.tracks);
                    })
                    .catch((e:any)=>{
                        console.log(e);
                    })
    })
}