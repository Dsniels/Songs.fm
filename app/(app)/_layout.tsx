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
            console.log(token);
            console.log(!servidorResponse)
            if(!servidorResponse && token){
                await getprofile(dispatch);
                setServidorResponse(true);
                console.log(sesionUsuario)
            }
        }
        getData();
        console.log(servidorResponse)
        console.log('sesionUsuario layout',sesionUsuario);
    }, [servidorResponse, dispatch, sesionUsuario])

    return(
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown:false, contentStyle:{backgroundColor:'#024554'}}}/>
            <Stack.Screen name="login" options={{presentation:'modal', headerShown:false}}/>
        </Stack>
    )
}