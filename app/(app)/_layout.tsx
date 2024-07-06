import { refreshToken } from "@/Api/SpotifyAuth";
import { getprofile } from "@/Api/UserAction";
import { useStateValue } from "@/Context/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";


export default function Applayout (){
    const [{sesionUsuario}, dispatch] = useStateValue();
    const [servidorResponse, setServidorResponse] = useState(false);
    
    useEffect(()=>{


        

        const getData = async()=>{

           const validToken = await AsyncStorage.getItem('expira').then((fecha:string|null)=>{
                const Today = new Date();
                const expiracion = new Date(fecha||'');
                    console.log('Validar fecha',Today, expiracion)

                if(Today>= expiracion){
                    console.log('Fecha no valida',Today, expiracion)
                    return false
                }
                return true;
             })
             if(!validToken){
                await refreshToken().then(()=>console.log('token refrescado'))
             }


            const token = await AsyncStorage.getItem('token') || false;

            if(!servidorResponse && token ){
                await getprofile(dispatch);
                setServidorResponse(true);
   
            }
        }
        getData()
        console.log('***')

    }, [])

    return(
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown:false, contentStyle:{backgroundColor:'#024554'}}}/>
            <Stack.Screen name="login" options={{presentation:'modal', headerShown:false}}/>
        </Stack>
    )
}