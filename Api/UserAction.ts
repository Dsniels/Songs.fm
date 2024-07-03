import { AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';

export const getprofile =():Promise<AxiosResponse<any>>=>{
    return new Promise((resolve, reject)=>{
        
        HttpCliente.get('/me').then((response:AxiosResponse)=>{
            console.log('user Response : ',response)
            resolve(response)
        }).catch((e:any)=>resolve(e))
    })
}


