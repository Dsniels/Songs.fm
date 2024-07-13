import axios, { AxiosResponse } from 'axios';
import qs from "querystring";
const GeniusApi = axios.create({
    baseURL:process.env.EXPO_PUBLIC_BASE_URL_GENIUS,
    headers :{
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GENIUS_ACCESSTOKEN}`
    }
})

export const getInfo = async (search:string,artists:string)=>{

  const {status,data} = await GeniusApi.get(`/search?q=${search+artists}`);
  if(status !== 200){
    throw new Error('Sin info')
  }
  const {response} = data;
  const id = response.hits[0].result.id;
  
  const annotations : any = await getAnnotations(id);
  if(annotations.response.song.artist_names.includes(artists)){

}
    return annotations.response.song.description.dom.children
}


const getAnnotations =(id:string)=>{
  return new Promise((resolve, reject)=>{
    GeniusApi.get(`/songs/${id}`).then((response : AxiosResponse)=>{
      if(response.status === 200){
        resolve(response.data)
      }else{
        throw new Error('No Informacion')
      }

    }).catch(reject)
  })
}



 
