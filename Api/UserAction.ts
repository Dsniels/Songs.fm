import { AxiosResponse } from 'axios';
import HttpCliente from '../service/HttpCliente';
import { Dispatch } from 'react';

export const getprofile =(dispatch : Dispatch<any>):Promise<AxiosResponse<any>>=>{
    return new Promise((resolve, reject)=>{
        HttpCliente.get('/me').then((response:AxiosResponse)=>{
            console.log(response.data)
            dispatch({
                type : 'INICIAR_SESION',
                usuario : response.data,
                     })
            resolve(response)
        }).catch((e:any)=>{
            console.log('Error get Profile',e);
            resolve(e)})
    })
}


