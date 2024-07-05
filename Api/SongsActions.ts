import { AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getTop = ( type:string, offset:number = 0,) : Promise<AxiosResponse<any>> =>{
    return new Promise((resolve, reject) => {
        HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=long_term`)
                    .then((response:AxiosResponse)=>{
                        console.log(response);
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
    const seed_songs = await AsyncStorage.getItem('seedTrack');


    return new Promise((resolve, reject) =>{
        HttpCliente.get(`/recommendations?seed_tracks=${seed_songs}&seed_genres=${geners_seed}`)
                    .then((response:AxiosResponse)=>{
                        resolve(response);
                    })
                    .catch((e:any)=>{
                        console.log(e);
                    })
    })
}