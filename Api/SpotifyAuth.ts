import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as AuthSession from 'expo-auth-session';
import { REACT_APP_CLIENTE_ID, REACT_APP_CLIENTE_SECRET } from '@env'; // Asegúrate de tener CLIENTE_SECRET disponible
import { Buffer } from 'buffer'; // Importa Buffer de la librería 'buffer'
import qs from 'querystring'
import { Dispatch } from "react";



const instancia = axios.create();

 const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (Buffer.from(REACT_APP_CLIENTE_ID + ':' +REACT_APP_CLIENTE_SECRET).toString('base64'))
  };

export const getAccessToken = async(code: string, dispatch:Dispatch<any>) => {
    const URI = AuthSession.makeRedirectUri({ native: 'myapp://', path: '/login' })
    const data = {
        "code" :code,
        "redirect_uri": URI,
        "grant_type": 'authorization_code',
    };

    return new Promise((resolve, reject) => {
        instancia.post("https://accounts.spotify.com/api/token", qs.stringify(data),  {headers}).then((response: AxiosResponse<any>) => {
            const expira = new Date();
            console.log(response.data)
            expira.setSeconds(expira.getSeconds() + 3600);
            response.data.expira = expira;
            resolve(response)
        }).catch((e: any) => {
            console.log(e)
            resolve(e);
        })
    })
}


export const checkToken = async (expira:any)=>{
    const date_actual = new Date();
    if(date_actual >= expira){
        await AsyncStorage.removeItem('token').then(()=>console.log('removed'));
    }else{
        await AsyncStorage.setItem('expira', expira.toString());
    }
}

export const refreshToken = async () : Promise<AxiosResponse<any>>=>{
    const refresh = await AsyncStorage.getItem('refresh_token');
    const body = {
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh,
    }

 
    console.log('peticion para refrescar token')

    return new Promise((resolve, reject)  =>{
        instancia.post('https://accounts.spotify.com/api/token',qs.stringify(body),{headers})
                .then( async (response: AxiosResponse) =>{
            
                        const expira = new Date();
                        expira.setSeconds(expira.getSeconds() + 3600 );
                        response.data.expira = expira;
                        checkToken(expira);
                        setTimeout(refreshToken,3600000)
                        await AsyncStorage.setItem('token', response.data.access_token);
                        resolve(response)
                      })
                    .catch((e)=>{
                        console.log('error al refrescar token', e)
                        resolve(e)
                    })
    })


}


