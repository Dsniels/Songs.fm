import { Axios, AxiosResponse } from "axios";
import HttpCliente from "../service/HttpCliente";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { seeds } from "@/service/seeds";

export const getTop = (
  type: string,
  offset: number = 0
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=long_term`)
      .then((response: AxiosResponse) => {
        resolve(response.data);
      })
      .catch((e: any) => {
        console.log("ErrorGetTop", e);
        resolve(e);
      });
  });
};

export const getRecomendations = async (): Promise<any> => {

  const {songs, artists, generos} = await seeds();

  return new Promise((resolve, reject) => {
    HttpCliente.get(
      `/recommendations?seed_tracks=${songs}&seed_genres=${generos}&seed_artists=${artists}`
    )
      .then((response: any) => {
        resolve(response.data?.tracks );
      })
      .catch((e: any) => {
        reject([]);
        console.log(e);
      });
  });
};

const similarSongs =async (id : string, features:any) : Promise<any> =>{
  return new Promise((resolve, reject)=>{
    HttpCliente.get(`/recommendations?seed_tracks=${id}&target_danceability=${features.danceability}&target_energy=${features.energy}&target_instrumentalness=${features.instrumentalness}`)
                .then((response)=>{
                  resolve(response.data || [])
                })
  })
}


export const getListOfSongs = (
  tracks: string[]
): Promise<AxiosResponse<any>> => {
  return new Promise((resolve, reject) => {
    HttpCliente.get(`/tracks?ids=${tracks}`)
      .then((response: AxiosResponse) => {
        resolve(response.data.tracks);
      })
      .catch((e: any) => {
        resolve(e);
      });
  });
};

export const getSongInfo = async (id:string) =>{
  const [info, features] = await Promise.all([songInfo(id), AudioFeatures(id)]);
  const similar_songs = await similarSongs(id,features)
  return {Info : info, Features : features, Similar : similar_songs};
}

const songInfo = (id : string) =>{

  return new Promise ((resolve, reject) =>{
    HttpCliente.get(`/tracks/${id}`).then((response : any) =>{
      resolve(response.data || {})
    }).catch((e)=>resolve(e))
  })
}


const AudioFeatures = (id:string) : Promise<any> =>{
  return new Promise((resolve, reject)=>{
    HttpCliente.get(`/audio-features/${id}`).then((response:any)=>{
      resolve(response.data)
    }).catch(resolve)
  })
}