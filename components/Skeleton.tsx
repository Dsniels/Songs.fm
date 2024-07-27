import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.text} />
      <View style={styles.text} />
      <View style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
  },
});

export default SkeletonCard;
