import { View, Text, ToastAndroid } from 'react-native'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import * as SecureStorage from 'expo-secure-store';
import { router } from 'expo-router';
import { refreshToken } from '@/Api/SpotifyAuth';
import { getprofile } from '@/Api/UserAction';


export const useAuth = (dispatch : Dispatch<any>, ) => {
    
const [servidorResponse, setServidorResponse] = useState(false);


const getData = useCallback(async () => {
      const [token, fecha] : any = await Promise.allSettled([SecureStorage.getItemAsync("token"), SecureStorage.getItemAsync("expira")]);
      if (token.value == null || fecha.value === null) {
        return router.push("/login");
      }
      

        const Today = new Date();
        const expiracion = new Date(fecha.value);

        if (Today.getTime() > expiracion.getTime()) {      
            await Promise.all([refreshToken(), getprofile(dispatch)]).then(()=>setServidorResponse(true));
            
        }

      if (!servidorResponse && token.value) {
        await getprofile(dispatch)
        setServidorResponse(true);
      }
          setInterval(() => {
          getData()
          }, 3600000); 
  },[dispatch]);
  useEffect(()=>{

     getData().catch((e)=>ToastAndroid.showWithGravity(e, ToastAndroid.SHORT, ToastAndroid.CENTER));



},[getData])
  return null

}



