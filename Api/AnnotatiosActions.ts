import { annotationResponse, annotations } from '@/types/Card.types';
import axios, { AxiosResponse } from 'axios';
import { configureProps } from 'react-native-reanimated/lib/typescript/ConfigHelper';
const GeniusApi = axios.create({
    baseURL:process.env.EXPO_PUBLIC_BASE_URL_GENIUS,
    headers :{
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GENIUS_ACCESSTOKEN}`
    }
})

export const getInfo = async (search:string,artists:string, song : boolean)=>{

  const changed = search.replace(/\s*\(.*?\)\s*/g, '').trim();
  const query = song ? changed.concat(artists) : search
  const {status,data} = await GeniusApi.get(`/search?q=${query.replace(' ', '%20')}`);
  if(status !== 200){
    throw new Error('Sin info')
  }
  
  const {response} = data;

  const {result}= response.hits.find((i:annotations)=>{
    return i.result.artist_names.toLocaleLowerCase().includes(artists.toLocaleLowerCase()) 
  }) || false
  if(!result) return ["?"]
  let id = result.id;
  if(song){
    id = result.id;
  }else{
    id = result.primary_artist.id
  }
  
  const annotations : annotationResponse = await getAnnotations(id, song ? 'songs' :'artists');

    return annotations || ["?"]
}


const getAnnotations =(id:string, term : "songs" | "artists") : Promise<annotationResponse>=>{
  return new Promise((resolve, reject)=>{
    GeniusApi.get(`/${term}/${id}`).then((response : AxiosResponse)=>{
      if(response.status === 200){
        if(term === 'songs') {
          resolve(response.data.response.song.description.dom.children)

        }else{
          resolve(response.data.response.artist.description_annotation.annotations[0].body.dom.children)
        }

      }else{
        throw new Error('No Informacion')
      }

    }).catch(reject)
  })
}



 
