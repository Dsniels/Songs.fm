import HttpCliente from '../service/HttpCliente';

export const getArtistInformation = async (id:string ) =>{
    const [info, songs, albums, artists] = await Promise.all([infoArtista(id), TopSongsArtista(id),TopAlbumsArtista(id), similarArtist(id)])
    return {Info : info, Songs : songs, Albums : albums, Artists : artists}
}


const infoArtista = (id:string ) => {
    return new Promise((resolve, reject)=>{
        HttpCliente.get(`/artists/${id}`).then((response:any)=>{
            resolve(response.data || {});
        }).catch(console.log)
    })
}


const TopSongsArtista = (id:string) : Promise<any[]> => {
    return new Promise((resolve, reject)=>{
        HttpCliente.get(`/artists/${id}/top-tracks`).then((response:any)=>{
            resolve(response.data.tracks || []);
        }).catch(console.log)
    })
}


const TopAlbumsArtista = (id:string) : Promise<any[]> => {
    return new Promise((resolve, reject)=>{
        HttpCliente.get(`/artists/${id}/albums?limit=10`).then((response:any)=>{
            resolve(response.data.items || []);
        }).catch(console.log)
    })
}


const similarArtist = (id:string) : Promise<any[]> =>{
    return new Promise((resolve, reject)=>{
        HttpCliente.get(`/artists/${id}/related-artists`).then((response:any)=>{
            resolve(response.data.artists || []);
        }).catch(console.log)
    })
}