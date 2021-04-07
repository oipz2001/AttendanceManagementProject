import React,{useEffect,useState} from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
const moment = require('moment')
const Acti = () => {

  const [count,setCount]  = useState(moment(new Date().toLocaleString()).format('YYYY-MM-DD'))
  const [actIndicator,setActIndicator] = useState(true)

  useEffect(() =>{
    const interval =  setInterval(async () => {
          setCount( moment(new Date().toLocaleString()).format('HH:mm'))

          
          }, 1000);

          if(count==10){
            setActIndicator(false)
          }
    return () => clearInterval(interval);
  },[count])



  

  return (
  <View style={[styles.container, styles.horizontal]}>
    <Text>{count}</Text>
    <ActivityIndicator color='green'  />
    <ActivityIndicator size="large" color='red' animating={actIndicator} />
    <ActivityIndicator size="small" color="#0000ff" />
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
)

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default Acti