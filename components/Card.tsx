import { styles } from "@/Styles/styles";
import { CardType } from "@/types/Card.types";
import { useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Image, Text, Button } from "react-native";





const Card = ({card} : {card : CardType} ) => {
    
const [Sound, setSount] = useState<Audio.Sound | undefined>(undefined);

    const play = async () => {
    //const {Sound}  : any = await Audio.Sound.createAsync({uri:'https://p.scdn.co/mp3-preview/c4f4406777deb17f09c0237b22044a8b18d986a4?cid=cfe923b2d660439caf2b557b21f31221'});
    const sound = new Audio.Sound();
    await sound.loadAsync({
      uri: card.preview_url 
    }).then(()=>setSount(sound)).catch(()=> sound.unloadAsync());
    

    await sound.playAsync();
  };
  const stop = async () => {
    await Sound?.stopAsync();
  };
  const isFocused = useIsFocused();
  useFocusEffect(
    useCallback(() => {
      const onBlur = async () => {
        await stop();
      };

      return () => onBlur();
    }, [Sound])
  );
    
    
    
    return(    
    
    <View style={styles.card} >
        <Image style={styles.imageCard}
            source ={{uri:card.image||'https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}}
            resizeMode="cover"
            />
            <View style={styles.CardDescription}>
                <Text style={styles.cardContent}> {`${card.name},${card.artist}`}</Text>
                <View style={{borderStyle:'solid', borderColor:'green', borderWidth:2,  justifyContent:'center',display:'flex', flexWrap:'wrap', flexDirection:'column', gap:2, width:200}}>
                    <Button title='play' onPress={play}/>
                    <Button title="stop" onPress={stop}/>
                </View>
            </View>

    </View>
)}


export default Card;