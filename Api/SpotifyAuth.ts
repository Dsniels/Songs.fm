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
            expira.setSeconds(expira.getSeconds() + 3600);
            dispatch({

                autenticado : true
            })            
            console.log('token response', response)
            response.data.expira = expira;
            resolve(response)
        }).catch((e: any) => {
            console.log(e)
            resolve(e);
        })
    })
}


export const checkToken = (expira:any)=>{
    const date = new Date();
    if(date === expira){
        AsyncStorage.removeItem('token');
        
        console.log('Expiro')
    }else{
        console.log(date, expira)
    }
}




