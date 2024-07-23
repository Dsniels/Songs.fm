import { View, Text } from 'react-native'
import React, { Dispatch, useCallback, useEffect, useState } from 'react'
import * as SecureStorage from 'expo-secure-store';
import { router } from 'expo-router';
import { refreshToken } from '@/Api/SpotifyAuth';
import { getprofile } from '@/Api/UserAction';


export const useAuth = (dispatch : Dispatch<any>, ) => {
    
const [servidorResponse, setServidorResponse] = useState(false);


const getData = useCallback(async () => {
    try {
      const token = (await SecureStorage.getItemAsync("token")) || false;
      if (!token) {
        return router.push("/login");
      }
      
      const fecha = await SecureStorage.getItemAsync("expira");

      if (fecha === null) {
        return router.push("/login");
      } else {
        const Today = new Date();
        const expiracion = new Date(fecha);


        if (Today.getTime() > expiracion.getTime()) {      
            await refreshToken();
        }
      }



      if (!servidorResponse && token) {
        await getprofile(dispatch);
        setServidorResponse(true);
          setInterval(() => {
          getData()
          }, 3600000); 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },[dispatch]);
  useEffect(()=>{
     getData()



},[getData])
  return null

}



