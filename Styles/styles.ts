import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    container : {
      backgroundColor: '#25292e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer : { 
        flexDirection : 'row',
        gap : 4,
        backgroundColor : '#25292e'
    },
  titleContainer: {
    display:'flex',
    justifyContent:'center',
    top: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin:0,
    padding:0
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  stepContainer: {
    display:"flex",
    flexWrap:'wrap',
    padding:10,
    height:150,
    alignItems:'center',
    textAlign:'center',
    justifyContent:'space-between',
    margin:30
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  LinkLogin : {
    display:'flex',
    backgroundColor:'green',
    width:200,
    height:40,
    padding:10,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',  
    borderRadius:20 
  },

  fixedTop: {
      zIndex: 1,
      position: 'absolute',
      top: 0,

    },
    linearGradient: {
      height: 200,
    },
    TopSongs :{
      width:200,
      height:200,
      margin:20,
      borderRadius:50
      
    },
    card:{
      position:'absolute', top:25,
      height: 750,
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 5,
      borderWidth:2,
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      margin:30,
      width:350,
      shadowRadius: 8,
      shadowOpacity: 0.3,
      elevation: 2,
      padding:0
    },
    imageCard:{
      borderRadius:20,
      flex:1,
      width:380,
      height:750
    },
    CardDescription:{
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      flexDirection: 'column',
      height: '100%',
      position: 'absolute',
      left: 10,
      bottom: 10,
    },
    cardContent :{
      textAlign: 'left',
      fontSize: 20,
      color: 'white',
      textShadowColor: 'black',
      textShadowRadius: 20,
    },
    scrollView: {
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },

})