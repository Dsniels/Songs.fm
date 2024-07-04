import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { styles } from '@/Styles/styles'

export default function music() {
  
    return (
        <View style={styles.container}>
            <ThemedView style={styles.textContainer} >
                <ThemedText type='title'>Music</ThemedText>
            </ThemedView>
        </View>
    )
  
}