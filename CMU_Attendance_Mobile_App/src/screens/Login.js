import React, {
  useState,useEffect
} from 'react'
import {
  View,
  Text,
  Button,
  TouchableHighlight,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Image
} from 'react-native';
import TextInput from '../components/TextInput'
import AzureAuth from 'react-native-azure-auth';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import TeacherHome from './teachers/Home';

const URL = require('../config/endpointConfig')

const myEndpointURLStudent =  URL.myEndpointStudent
const myEndpointURLTeacher =  URL.myEndpointTeacher

const azureAuth = new AzureAuth({
  clientId: '234c43b9-e653-4646-97c6-1903cfac1c03'
});









const Login = ({navigation}) => {
  const [accessToken, setaccessToken] = useState('')
  const [user, setuser] = useState('')
  const [mail, setmail] = useState('')
  const [userId, setuserId] = useState('')
  const [jobtitle, setjobtitle] = useState('')
  const [isInfoShow,setInfoShow] = useState(false)
  const [studentUserID,setStudentUserID] = useState('')

  const [teacherUserID,setTeacherUserID] = useState('')
  const [teacherUserName,setTeacherUserName] = useState('')
  const [teacherUserMail,setTeacherUserMail] = useState('')

  const [roleState,setRoleState] = useState('Teacher')

 

  useEffect(() => {

    const retrieveUserID = async () => {
      const  studentID = await AsyncStorage.getItem('uniqueIDStudent');

      const  teacherID = await AsyncStorage.getItem('uniqueIDTeacher');
      const  teacherName = await AsyncStorage.getItem('NameTeacher');
      const  teacherMail = await AsyncStorage.getItem('MailTeacher');
      setStudentUserID(studentID)

      setTeacherUserID(teacherID)
      setTeacherUserName(teacherName)
      setTeacherUserMail(teacherMail)
    }

    AsyncStorage.setItem('uniqueIDTeacher','PARINYA')
    // AsyncStorage.setItem('uniqueIDTeacher','LIFT')
    AsyncStorage.setItem('NameTeacher','Parinya Seetawan')
    AsyncStorage.setItem('MailTeacher','parinya_seetawan@cmu.ac.th')

    AsyncStorage.setItem('uniqueIDStudent','SINGKHON KHONGTHAM')
    // AsyncStorage.setItem('uniqueIDStudent','Paradee1')
    AsyncStorage.setItem('NameStudent','Parinyakorn')

    retrieveUserID()

  },[user,studentUserID])


  const checkIfTeacherExist = async (teacherID,teacherMail) => {
    await fetch(myEndpointURLTeacher+'/checkIfTeacherExist', {
      method: 'POST',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacherID:teacherID

      })
      })
      .then((response) => response.json())
      .then(async (data) => {
          
          if(data.response == true){
              navigation.navigate('TeacherHome')
          }else{
            
            await addNewTeacher(teacherID,teacherMail)
          }
      })
      .catch((error) => {
      console.error(error);
      });
  }



  const addNewTeacher = async (teacherID,teacherMail) => {
    console.log(teacherID,teacherMail);
    await fetch(myEndpointURLTeacher+'/addNewTeacher', {
      method: 'POST',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacherID:teacherID,
        teacherName:teacherID,
        teacherMail:teacherMail

      })
      })
      .then((response) => response.json())
      .then((data) => {
          
          console.log(data);
          navigation.navigate('TeacherHome')
      })
      .catch((error) => {
      console.error(error);
      });
  }

  
  

 


 

  
  const _isStudentFaceAdded = async (studentID) => {
    await fetch(myEndpointURLStudent+'/isFaceListAdded?studentID='+studentID)
          .then((response) => response.json())
          .then((data) => {
              if(data.response == true){
                navigation.navigate('StudentHome')
              }
              else if(data.response == false)
              {
                navigation.navigate('StudentAddFaceList',{response:false})
              }else if(data.response == null)
              {
                navigation.navigate('StudentAddFaceList',{response:null})
              }
          })
          .catch((error) => {
              console.error(error);
          });
  }


  const _Login = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize({
        scope: 'openid profile User.Read Mail.Read'
      })
      let info = await azureAuth.auth.msGraphRequest({
        token: tokens.accessToken,
        path: '/me'
      })
      // console.log(tokens.expireOn);
      // AsyncStorage.setItem('uniqueIDStudent',info.displayName)

      AsyncStorage.setItem('name',info.displayName);
      AsyncStorage.setItem('mail',info.mail);
      AsyncStorage.setItem('id',info.id);
      
      console.log(info.displayName);
      
      setuser(info.displayName);
      setmail(info.mail)
      setuserId(info.id)
      setjobtitle(info.jobTitle)
      setInfoShow(true)

      // let role = info.jobTitle
      // let role = 'Employee'
      let role = roleState


      AsyncStorage.setItem('jobtitle',role);
      if(role == "Student"){
        await _isStudentFaceAdded(info.displayName);
      }
      else
      {
        await checkIfTeacherExist(info.displayName,info.mail)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const _onLogout = () => {
    azureAuth.webAuth
      .clearSession()
      .then(success => {
        setaccessToken(null)
        setuser(null)
        setmail(null)
        setuserId(null)
        setjobtitle(null)
        setInfoShow(false)
        AsyncStorage.removeItem('uniqueIDStudent')
        setStudentUserID('')
        AsyncStorage.removeItem('name')
        AsyncStorage.removeItem('mail')
        AsyncStorage.removeItem('id')
        AsyncStorage.removeItem('jobtitle')
      })
      .catch(error => console.log(error));
  };

  const _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'name',
        'Parinya'
      );
    } catch (error) {
      // Error saving data
    }
  };




  return (

   // style = {{flex: 1, justifyContent: 'center',alignItems: 'center'}}
   
    <View style={{flex:1}} >
      <View style={{flex:1,backgroundColor:'white',borderRadius:20,elevation:10,margin:20,alignItems: 'center',justifyContent:'center',borderColor:'#9E76B4',borderWidth:2}}>
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Image source={require('../assets/vectors/cmu_check.png')} style={{width:1.8*180,height:1.8*110}} />
        <Text style={{fontSize:25,fontWeight:'bold',color:'#9E76B4',marginTop:10}}>CMU ATTENDANCE</Text>
      </View>
      <View style={{justifyContent:'center',marginTop:30}}>
        <TouchableOpacity onPress={_Login} style={{backgroundColor:'#9E76B4',padding:15,elevation:2,borderRadius:10,marginBottom:20}}>
          <Text style={{color:'white'}}>เข้าสู่ระบบด้วย CMU Account</Text>
        </TouchableOpacity>
        
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{color:'#9E76B4'}}>Set {roleState} role for demo</Text>
        <Button title='Set Teacher' color='#9E76B4' onPress={() => setRoleState('Teacher')}  />
        <View style={{marginTop:15}}> 
        <Button title='Set Student' color='#9E76B4' onPress={() => setRoleState('Student')}/>
        </View>
      </View>
      
      </View>
      
    
    {/* {isInfoShow &&
    <View style={{backgroundColor:'#9E76B4',marginTop:30,padding:10,elevation:5,borderRadius:20}}>
      <Text style={{color:"white"}} > Name: {user} </Text> 
      <Text style={{color:"white"}} > Mail: {mail} </Text> 
      <Text style={{color:"white"}} > ID: {userId} </Text> 
      <Text style={{color:"white"}} > JobTitle: {jobtitle} </Text>
    </View>
    } */}
    
    {/* <TouchableOpacity onPress={_onLogout} style={{backgroundColor:'#9E76B4',padding:12,elevation:5,borderRadius:20,marginTop:30}}>
      <Text style={{color:'white'}}>Logout</Text>
    </TouchableOpacity>  */}
    {/* <View > */}
      {/* <View style = {{marginTop: 30}} >
        <Button title = "Go to Teacher Home" onPress = {async () => {
          await checkIfTeacherExist(teacherUserID)
          // navigation.navigate('TeacherHome')
      }}/> 
      </View> 
      <Text>{teacherUserID}</Text> */}
      {/* <View style = {{marginTop: 30 }} >
        <Button title = "Go to Student Home" onPress = {async () => {
          navigation.navigate('StudentHome')
          } }/> 
      </View>  */}
      
      {/* <View style = {{marginTop: 30 }} >
        <Button title = "Go to Student Home" onPress = {async () => {
          const  studentID = await AsyncStorage.getItem('uniqueIDStudent');
          await _isStudentFaceAdded(studentID);
          
          }}/> 
      </View>
      <Text>{studentUserID}</Text>  */}
      
    {/* </View> */}
    
    </View>
    
  );

}

export default Login