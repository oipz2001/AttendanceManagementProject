import React, { useState,useEffect } from "react";
import {  Text, StyleSheet, View,Button } from "react-native";
import CheckBox from '@react-native-community/checkbox'



const App = () => {
  const [isMon, setIsMon] = useState(false);
  const [isTue, setIsTue] = useState(false);
  const [isWed, setIsWed] = useState(false);
  const [isThu, setIsThu] = useState(false);
  const [isFri, setIsFri] = useState(false);
  const [isSat, setIsSat] = useState(false);
  const [isSun, setIsSun] = useState(false);






const myDupDay = () => {
    console.log(isMon + ' '  +isTue + ' ' + isWed + ' ' + isThu + ' ' + isFri + ' ' + isSat + ' ' + isSun );
}
  
 

  return (
    <View >
      <View style={{flexDirection:'row'}} >
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Mon</Text>
        <CheckBox
          value={isMon}
          onValueChange={setIsMon}
        />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Tue</Text>
        <CheckBox
          value={isTue}
          onValueChange={setIsTue}
        />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Wed</Text>
        <CheckBox
          value={isWed}
          onValueChange={setIsWed}
        />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Thu</Text>
        <CheckBox
          value={isThu}
          onValueChange={setIsThu}
        />
        </View>
        
        
        
        
        
      </View>
      <View style={{flexDirection:'row'}} >
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Fri</Text>
        <CheckBox
          value={isFri}
          onValueChange={setIsFri}
        />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Sat</Text>
        <CheckBox
          value={isSat}
          onValueChange={setIsSat}
        />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <Text>Sun</Text>
        <CheckBox
          value={isSun}
          onValueChange={setIsSun}
        />
        </View>
        </View>

      <Button title='Dupday' onPress={myDupDay}  />
      


     
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   checkbox: {
//     alignSelf: "center",
//   },
//   label: {
//     margin: 8,
//   },
// });

export default App
