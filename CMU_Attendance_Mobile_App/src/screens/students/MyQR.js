import React,{useEffect, useState} from 'react'
import { Button, View,Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-generator';
import AsyncStorage from '@react-native-community/async-storage'





const MyQR = ({route}) => {

    const [studentIDState,setStudentIDState] = useState('')

    const _retrieveUserData = async () => {
        // const  studentID = await AsyncStorage.getItem('uniqueIDStudent');
        const  studentID = await AsyncStorage.getItem('name');
        setStudentIDState(studentID)
  
      }
  

      useEffect(() => {
        _retrieveUserData()
      },[])


    useEffect(() => {
        console.log(route.params.sessionID + ' ' +route.params.sessionTitle + '(My QR)');
    })

    return(
        <>
                <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <View style={{backgroundColor:'white',paddingLeft:30,paddingRight:30,paddingTop:70,paddingBottom:70,borderRadius:25,elevation:8}} >
                        <QRCode
                            value={studentIDState}
                            size={300}
                            bgColor='black'
                            fgColor='white'
                        />
                    </View>
                
                
                </SafeAreaView>

        </>
            
        
        
        
        

    );

}

export default MyQR