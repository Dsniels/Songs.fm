import { styles } from "@/Styles/styles";
import { CardType } from "@/types/Card.types";
import { View, Image, Text } from "react-native";

const Card = ({ card, isFirst, swipe }: { card: CardType, isFirst: any, swipe: any }) => {
  return (
    <View style={styles.card}>
      <Image
        style={styles.imageCard}
        source={{ uri: card.image || 'https://images.pexels.com/photos/145707/pexels-photo-145707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
        resizeMode="cover"
      />
      <View style={styles.CardDescription}>
        <Text style={styles.cardContent}> {`${card.name},${card.artist}`}</Text>
      </View>
    </View>
  );
};

export default Card;
