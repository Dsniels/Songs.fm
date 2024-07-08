import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, View } from "react-native";
import { Audio } from "expo-av";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

export const SwipeCard = <T,>({ children, items, setItems }: any) => {
  const { height } = Dimensions.get("screen");
  const swipe = useRef(new Animated.ValueXY()).current;
  const titlSign = useRef(new Animated.Value(1)).current;
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const isFocused = useIsFocused()
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy, y0 }) => {
        swipe.setValue({ x: dx, y: dy });
        titlSign.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);
      },
      onPanResponderRelease: (_, { dx, dy }) => {
        const direction = Math.sign(dx);
        const isSwipedOffScreen = Math.abs(dx) > 100;

        if (isSwipedOffScreen) {
          Animated.timing(swipe, {
            duration: 100,
            toValue: {
              x: direction * 500,
              y: dy,
            },
            useNativeDriver: true,
          }).start(removeTopCard);
          return;
        }
        Animated.spring(swipe, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const playSound = async (soundUri: string) => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
    }
    const sound = new Audio.Sound();
    try {
      const soundLoaded =  (await sound.loadAsync({ uri: soundUri })).isLoaded
      if(soundLoaded){
        setCurrentSound(sound);
        await sound.playAsync();
      }

    } catch (error) {
      console.error("Error ", error);
    }
  };

  useEffect(() => {
    if (items.length > 0 ) {
      playSound(items[0].preview_url);
    }


  }, [items]);

  const removeTopCard = useCallback(async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
    }
    setItems((prevState: any) => prevState.slice(1));
    swipe.setValue({ x: 0, y: 0 });
  }, [swipe, setItems, currentSound]);

  const rotate = Animated.multiply(swipe.x, titlSign).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: ["8deg", "0deg", "-8deg"],
  });

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  };
  useFocusEffect(
    useCallback(() => {
       const playCurrentSound = async () => {
        if (isFocused && currentSound) {
          const status = await currentSound.getStatusAsync().catch(console.log);
          if (status?.isLoaded && !status.isPlaying) {
            await currentSound.playAsync().catch(console.log);
          }
        }
      };

      playCurrentSound();
      const onBlur = async () => {
        if (currentSound) {
          const status = await currentSound.getStatusAsync();
          if (status?.isLoaded) {
            currentSound.pauseAsync();
          }
        }
      };

      return () => onBlur();
    }, [currentSound, isFocused])
  );
  return (
    <View>
      <View>
        {items.map((item: any, index: number) => (
          <Animated.View
            key={index}
            style={[index === 0 ? animatedCardStyle : {}]}
            {...(index === 0 ? panResponder.panHandlers : {})}
          >
            {children(item, swipe, index === 0)}
          </Animated.View>
        ))}
      </View>
    </View>
  );
};