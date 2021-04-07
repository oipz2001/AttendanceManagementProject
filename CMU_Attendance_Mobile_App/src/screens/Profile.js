import React,{useEffect, useState} from 'react'
import { Button, View,Text,StyleSheet,StatusBar,FlatList,TouchableOpacity,Image,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage'
import {useFocusEffect} from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AzureAuth from 'react-native-azure-auth';
const azureAuth = new AzureAuth({
  clientId: '234c43b9-e653-4646-97c6-1903cfac1c03'
});
const MyProfile = ({navigation}) => {
    const [user, setuser] = useState('')
    const [mail, setmail] = useState([])
    const [userId, setuserId] = useState('')
    const [jobtitle, setjobtitle] = useState('')
    const [profilePhoto,setprofilePhoto] = useState('')
    const [teacherIDState,setTeacherIDState] = useState(null)

    const _retrieveData = async () => {
        try {
          const name = await AsyncStorage.getItem('name');
          const id = await AsyncStorage.getItem('id');
          const mail = await AsyncStorage.getItem('mail');
          const jobtitle = await AsyncStorage.getItem('jobtitle');
          if (name !== null) {
            console.log(name);
            console.log(id);
            console.log(mail);
            console.log(jobtitle);

            
            setuser(name)
            setmail(id)
            setuserId(mail)
            setjobtitle(jobtitle)

          }
        } catch (error) {
          // Error retrieving data
        }
      };

      const _retrieveUserData = async () => {
        // const  teacherID = await AsyncStorage.getItem('uniqueIDStudent');
        const  id = await AsyncStorage.getItem('name');
        const mail = await AsyncStorage.getItem('mail');
        const status = await AsyncStorage.getItem('jobtitle');
        const url = await storage().ref(id).getDownloadURL().then(
          function onResolve(foundURL) {
            setprofilePhoto(foundURL)
          }, 
          function onReject(error){ 
              const url_notFound = "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
              setprofilePhoto(url_notFound)
          });
        // setTeacherIDState(teacherID)
        setuserId(id)
        setmail(mail)
        setjobtitle(status)
  
      }

      useEffect(() => {
        _retrieveUserData()
      },[])


      const _onLogout = () => {
        azureAuth.webAuth
          .clearSession()
          .then(success => {
            AsyncStorage.removeItem('name')
            AsyncStorage.removeItem('mail')
            AsyncStorage.removeItem('id')
            AsyncStorage.removeItem('jobtitle')
            navigation.navigate('Login')
          })
          .catch(error => console.log(error));
      };

    
    return(
        
          <View style={styles.profile}>
            <View style={{marginBottom:25}}>
            <Text style={{fontSize:20}}>ข้อมูลโปรไฟล์</Text>
            </View>
            {
              profilePhoto != '' ?
              <Image
                        style={{width:250,height:250}}
                        source={{
                        uri: profilePhoto
                        }}
              />
              :
              <ActivityIndicator size={50} color="#9E76B4" />
               

            }
            <View style={{marginTop:15}}>
              <Text >ชื่อ: {userId} </Text> 
              <Text>อีเมลล์: {mail} </Text> 
              <Text>สถานะ: {jobtitle} </Text>
            </View>
            <TouchableOpacity onPress={_onLogout} style={{backgroundColor:'#9E76B4',padding:12,elevation:5,borderRadius:20,marginTop:10}}>
              <Text style={{color:'white'}}>ออกจากระบบ</Text>
            </TouchableOpacity> 
          </View>
        
        // <WebView source={{ uri: 'https://reactnative.dev/' }} />
    )

}

const styles = StyleSheet.create({
  profile : {
      justifyContent:'center',
      alignItems:'center',
      flex:1,
      backgroundColor:'white',
      margin:20,
      marginVertical:100,
      borderRadius:20,
      elevation:2
  }
})


export default MyProfile