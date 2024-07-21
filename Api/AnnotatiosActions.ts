import axios, { AxiosResponse } from 'axios';
const GeniusApi = axios.create({
    baseURL:process.env.EXPO_PUBLIC_BASE_URL_GENIUS,
    headers :{
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GENIUS_ACCESSTOKEN}`
    }
})

export const getInfo = async (search:string,artists:string, song : boolean)=>{

  const changed = search.replace(/\s*\(.*?\)\s*/g, '').trim();
  const query = song ? changed+artists : search
  const {status,data} = await GeniusApi.get(`/search?q=${query}`);
  if(status !== 200){
    throw new Error('Sin info')
  }
  
  const {response} = data;
  const {result}= response.hits.find((i:any)=>{
    // console.log(JSON.stringify(response,null,2))
    return i.result.artist_names.toLocaleLowerCase().includes(artists.toLocaleLowerCase())
  })
  let id = result.id;
  if(song){
    id = result.id;
  }else{
    id = result.primary_artist.id
  }
  
  const annotations : any = await getAnnotations(id, song? 'songs' :'artists');
  // console.log(annotations)

    return annotations || ["?"]
}


const getAnnotations =(id:string, term : "songs" | "artists")=>{
  console.log(term)
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



 
