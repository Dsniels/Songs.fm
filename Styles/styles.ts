import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container : {
    flex: 1,
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
      
    }
})