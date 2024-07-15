import axios, { AxiosResponse } from 'axios';
const GeniusApi = axios.create({
    baseURL:process.env.EXPO_PUBLIC_BASE_URL_GENIUS,
    headers :{
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GENIUS_ACCESSTOKEN}`
    }
})

export const getInfo = async (search:string,artists:string)=>{

  const changed = search.replace(/\s*\(.*?\)\s*/g, '').trim();

  const {status,data} = await GeniusApi.get(`/search?q=${changed+artists}`);
  if(status !== 200){
    throw new Error('Sin info')
  }
  
  const {response} = data;
  const {result}= response.hits.find((i:any)=>(
    i.result.artist_names.toLocaleLowerCase().includes(artists.toLocaleLowerCase())
  ))
  console.log(JSON.stringify(result,null,2))
  const id = result.id;
  
  const annotations : any = await getAnnotations(id);
  console.log(annotations.response.song.description.dom.children)
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



 
