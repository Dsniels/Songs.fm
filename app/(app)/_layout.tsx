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
            const token = await AsyncStorage.getItem('token') || false;

            if(!servidorResponse && token){
                console.log('getProfile_layout')
                await getprofile(dispatch);
                setServidorResponse(true);
   
            }
        }
        getData().then(()=>console.log('fetchProfile'))
        console.log(sesionUsuario);
    }, [servidorResponse, sesionUsuario])

    return(
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown:false, contentStyle:{backgroundColor:'#024554'}}}/>
            <Stack.Screen name="login" options={{presentation:'modal', headerShown:false}}/>
        </Stack>
    )
}