import { AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';


export const getTop = ( type:string, offset:number = 0,) : Promise<AxiosResponse<any>> =>{
    return new Promise((resolve, reject) => {
        HttpCliente.get(`/me/top/${type}?offset=${offset}&time_range=long_term`)
                    .then((response:AxiosResponse)=>{
                        resolve(response.data);
                    })
                    .catch((e:any) => {
                        resolve(e);
                    })
        
    })

}