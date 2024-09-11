import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    // display: "flex",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#25292e",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    margin: 20,
    padding: 0,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  stepContainer: {
    display: "flex",
    flexWrap: "wrap",
    padding: 10,
    height: 500,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-between",
    margin: 30,
  },
  reactLogo: {
    height: "100%",
    width: 500,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  LinkLogin: {
    display: "flex",
    backgroundColor: "green",
    width: 200,
    height: 40,
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  fixedTop: {
    zIndex: 1,
    position: "absolute",
    top: 0,
  },
  linearGradient: {
    height: 200,
  },
  TopSongs: {
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 50,
  },
  TopArtist: {
    width: "100%",
    height: "100%",
    margin: 20,
    borderRadius: 50,
  },
  card: {
    position: "absolute",
    height: 750,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 40,
    marginHorizontal: 30,
    width: 350,
    padding: 0,
  },
  imageCard: {
    borderRadius: 20,
    flex: 1,
    width: 380,
    height: 750,
  },
  CardDescription: {
    margin: 8,
    padding: 7,
    width: 300,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    flexDirection: "column",
    height: "100%",
    position: "absolute",
    left: 10,
    bottom: 10,
  },
  cardContent: {
    textAlign: "justify",
    padding: 10,
    width: 250,
    fontSize: 20,
    color: "white",
    textShadowColor: "black",
    textShadowRadius: 20,
  },
  scrollView: {
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
