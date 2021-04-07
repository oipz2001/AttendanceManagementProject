
'use strict';
import React, { PureComponent } from 'react';
import {  StyleSheet, Text, TouchableOpacity, View,Image,Modal,ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Buffer } from 'buffer'
import AsyncStorage from '@react-native-community/async-storage'
import { myEndpointStudent } from '../../config/endpointConfig';
import storage from '@react-native-firebase/storage';
const key = '8b4bdfc570514b1d9e71628238368e3e'


class CameraAddFaceList extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            studentIDState:'',
            studentNameState : '',
            studentMailState : '',
            isInprogressModalShow:false
        }
    }

    

    _retrieveUserData = async () => {
        // const  studentID = await AsyncStorage.getItem('uniqueIDStudent');
        // const studentName = await AsyncStorage.getItem('NameStudent');
        const  studentID = await AsyncStorage.getItem('name');
        // const studentName = await AsyncStorage.getItem('name');
        const  studentMail = await AsyncStorage.getItem('mail');
        console.log(studentID,studentMail);
        this.setState({studentIDState:studentID,studentNameState:studentID,studentMailState:studentMail})
  
    }

    componentDidMount(){
      // console.log(this.props.route.params.response);
        this._retrieveUserData()
    }

    

   


    
  render() {
    return (
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(navigation.getParam('response'))}</Text> */}
        <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> ถ่ายภาพใบหน้าเพื่อบันทึกลงในฐานข้อมูล</Text>
          </TouchableOpacity>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}

          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
        <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isInprogressModalShow}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:8,marginBottom:190}}>
                    <View style={{flex:2,justifyContent:'space-evenly',alignItems:'center'}}>
                      <Image source={require('../../assets/vectors/icons8-facial-recognition-100.png')} style={{width:80,height:80}} />
                      <Text>กำลังบันทึก กรุณารอสักครู่...</Text>
                    </View>
                    <View style={{flex:1}}>
                      <ActivityIndicator size={50} color="#9E76B4" />
                    </View>
                    
                </View>
        </Modal>
      </View>
    );
  }

 

  takePicture = async () => {
    if (this.camera) {
      this.setState({isInprogressModalShow:true})
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      const reference = await storage().ref().child(this.state.studentIDState);
      await reference.putFile(data.uri)
      var base64String = data.base64; 
      var bufferValue = Buffer.from(base64String,"base64");
      var faceListId = this.state.studentIDState.replace(' ', '').toLowerCase()
      await this.CreateFaceList(faceListId,faceListId+'_Face')
      await this.AddToFaceList(faceListId,bufferValue)
      
    
    }
  };

 



   CreateFaceList = async (faceListId,faceName) => { //Create empty face list id
        await fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId, {
            method: 'PUT',
            headers: {
            'Content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': key
            
            },
            body:  JSON.stringify({name:faceName})
            
            
        })
        .then(res => res.text())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });


        
    }

    AddToFaceList = async (faceListId,binaryData) => { // Add URL image to specific face list id
        
        await fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists/'+faceListId+'/persistedFaces', {
            method: 'POST',
            headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type':'application/octet-stream'
            },
            body: binaryData
            
            
        })
        .then(res => res.json())
        .then(async data => {
          
            if(this.props.route.params.response == false){
              await this._AddStudentFaceListDB(this.state.studentIDState,this.state.studentMailState)
            }
            else if(this.props.route.params.response == null){
              await this._AddNewStudent(this.state.studentIDState,this.state.studentNameState,this.state.studentMailState)
            }

            
            
            
        })
        .catch((error) => {
            console.log(error);
        });
    }

    ListFaceList = async () => { //Get whole face list 
        
        await fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/facelists', {
            method: 'GET',
            headers: {'Ocp-Apim-Subscription-Key': key}
            
            
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        });
    }


    _AddStudentFaceListDB = async (studentID,studentMail) => {
      console.log('_AddStudentFaceListDB');
      console.log(studentID);
      await fetch(myEndpointStudent+'/addFaceListToStudent', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          faceListId:studentID,
          studentMail:studentMail

        })
        })
        .then((response) => response.json())
        .then((data) => {
            this.setState({isInprogressModalShow:false})
            this.props.navigation.goBack()
            this.props.navigation.navigate('StudentHome')
        })
        .catch((error) => {
        console.error(error);
        });
    }

    _AddNewStudent = async (studentID,studentName,studentMail) => {
      console.log('_AddNewStudent');
      await fetch(myEndpointStudent+'/addNewStudent', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentID: studentID,
          faceListId:studentID ,
          studentName: studentName,
          studentMail:studentMail


        })
        })
        .then((response) => response.json())
        .then((data) => {
          this.props.navigation.goBack()
          this.props.navigation.navigate('StudentHome')
        })
        .catch((error) => {
        console.error(error);
        });

    }

    

    





}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CameraAddFaceList