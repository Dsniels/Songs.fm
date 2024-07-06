import { Axios, AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getTop = ( type:string, offset:number = 0,) : Promise<AxiosResponse<any>> =>{
    return new Promise((resolve, reject) => {
        HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=short_term`)
                    .then((response:AxiosResponse)=>{
                        resolve(response.data);
                    })
                    .catch((e:any) => {
                        console.log('ErrorGetTop',e);
                        resolve(e);
                    })
        
    })

}


export const getRecomendations = async () : Promise<AxiosResponse<any>>=>{
    const geners_seed = await AsyncStorage.getItem('seedGeneros');
    console.log('generos seed',geners_seed);
    const seed_songs = await AsyncStorage.getItem('seedTrack');
    console.log('seed Song', seed_songs)


    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_tracks=${seed_songs}&seed_genres=${geners_seed}&min_danceability=0.4&min_energy=0.4&min_popularity=60`)
                    .then((response:AxiosResponse)=>{
                        resolve(response);
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