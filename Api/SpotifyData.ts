import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as AuthSession from 'expo-auth-session';
import { REACT_APP_CLIENTE_ID, REACT_APP_CLIENTE_SECRET } from '@env'; // Asegúrate de tener CLIENTE_SECRET disponible
import { Buffer } from 'buffer'; // Importa Buffer de la librería 'buffer'
import qs from 'querystring'



const instancia = axios.create();

 const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (Buffer.from(REACT_APP_CLIENTE_ID + ':' +REACT_APP_CLIENTE_SECRET).toString('base64'))
  };

export const getAccessToken = async(code: string) => {
    const URI = AuthSession.makeRedirectUri({ native: 'myapp://', path: '/login' })
    const data = {
        "code" :code,
        "redirect_uri": URI,
        "grant_type": 'authorization_code',
    };

    return new Promise((resolve, reject) => {
        instancia.post("https://accounts.spotify.com/api/token", qs.stringify(data),  {headers}).then((response: AxiosResponse<any>) => {
            resolve(response)
        }).catch((e: any) => {
            resolve(e);
        })
    })
}




