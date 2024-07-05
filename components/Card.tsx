import { styles } from "@/Styles/styles";
import { CardType } from "@/types/Card.types";
import { View, Image, Text } from "react-native";

const Card = ({card} : {card : CardType} ) =>(
    
    <View
     style={styles.card} 
    >
        <Image style={styles.imageCard}
            source ={{uri:card.image||''}}
            resizeMode="cover"
            />
            <View style={styles.CardDescription}>
                <Text style={styles.cardContent}> {`${card.name},${card.artist}`}</Text>
                <Text style={styles.cardContent}>{card.preview_url}</Text>
            </View>

    </View>
)


export default Card;