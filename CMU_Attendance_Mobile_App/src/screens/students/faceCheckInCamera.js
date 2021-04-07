
'use strict';
import React, { PureComponent } from 'react';
import {  StyleSheet, Text, TouchableOpacity, View,Image,ActivityIndicator,Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Buffer } from 'buffer'
import AsyncStorage from '@react-native-community/async-storage'
import { myEndpointStudent } from '../../config/endpointConfig';
import storage from '@react-native-firebase/storage';
const key = '8b4bdfc570514b1d9e71628238368e3e'
const moment = require('moment')

const URL = require('../../config/endpointConfig')

const myEndpointURL =  URL.myEndpointStudent

var eyeblink =0
var smile = 0
class ExampleApp extends PureComponent {

  

    constructor(props) {
        super(props);
        this.state = {
            studentIDState:'',
            matchResult:null,
            timeCount : 0,
            eyeblinkCount : 0,
            closedEyeTime : [],
            smileTime : [],
            shouldFaceDetect : true,
            mustEyeBlink:Math.floor(Math.random() * 5)+1,
            mustSmile:Math.floor(Math.random() * 5)+1,
            isInprogressModalShow:false
            
        }
    }

    _retrieveUserData = async () => {
        // const  studentID = await AsyncStorage.getItem('uniqueIDStudent');
        const  studentID = await AsyncStorage.getItem('name');
        console.log( studentID);
        this.setState({studentIDState:studentID})
  
    }

    componentDidMount(){
        this._retrieveUserData()
        console.log(this.props.route.params);
    }


    componentWillUnmount(){
        eyeblink =0 
        smile = 0
    }

    _getFaceID = async (bufferValue) => {
        var faceID = ''
        await fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/detect', {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': key,
              'Content-Type':'application/octet-stream'
            },
            body: bufferValue
            
            
          })
          .then(res => res.json())
          .then(data => {
              if(data.length != 0)
                faceID = data[0].faceId
              else
                faceID = 'No face detected'
          })
          .catch((error) => {
            console.error(error);
          });
    
            return faceID
          
      }
    
      _FindSimilarity = async (faceId,faceListId) => { //convert face image to face id
        var matchResult = ''
        await fetch('https://southeastasia.api.cognitive.microsoft.com/face/v1.0/findsimilars', {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': key,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
              faceId: faceId,
              faceListId: faceListId
          })
            
            
          })
          .then(res => res.json())
          .then(data => {
              matchResult = data
          })
          .catch((error) => {
            console.error(error);
          });
    
            return matchResult
    
        
      }

      checkInAPI = async (studentID,teacherID,uqID) => {
        const checkDate = moment(new Date()).format('YYYY-MM-DD').toString()
        const timestamp = moment(new Date()).format('HH:mm').toString()
        const myCheckInFetchData = {
          studentID:studentID,
          teacherID:teacherID,
          uqID:uqID,
          checkDate:checkDate,
          timestamp:timestamp
        }
     try {
      const response =  await fetch(myEndpointURL+'/checkIn', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          checkInFetchData:myCheckInFetchData
        })
        })
      const data = response.json()
      console.log(data);
      this.props.navigation.navigate('StudentHome')
     } catch (error) {
       console.log(error);
     }

          // .then((response) => response.json())
          // .then(async (data) => {
              
          //     console.log(data);
          //     this.props.navigation.navigate('StudentHome')
          // })
          // .catch((error) => {
          // console.error(error);
          // });
      }
    
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> ยิ้ม {(this.state.mustSmile-smile)>=0 ? this.state.mustSmile-smile : 0} ครั้ง และ กระพริบตา {(this.state.mustEyeBlink-eyeblink)>=0 ? this.state.mustEyeBlink-eyeblink : 0} ครั้ง   </Text>
            {this.state.matchResult == null ? <></> : (this.state.matchResult == true) ?
            <View style={{alignSelf:'center',backgroundColor:'green',padding:5,borderRadius:10}}>
            <Text style={{color:'white'}}>ใบหน้าตรงกัน</Text>
            </View> 
            : 
            <View style={{alignSelf:'center',backgroundColor:'red',padding:2}}> 
            <Text style={{color:'white'}}>ใบหน้าไม่ตรงกัน กรุณาลองอีกครั้ง</Text>
            </View>
            }
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
          
          // onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //   console.log(barcodes);
          // }}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
          faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
          onFacesDetected={this.state.shouldFaceDetect ? this.handleFaceDetected : null}
        />
         
        {/* <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Smile : {smile} </Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> EyeBlink : {eyeblink} </Text>
          </TouchableOpacity>
        </View> */}
        <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isInprogressModalShow}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:8,marginBottom:190}}>
                    
                    <View style={{flex:1,justifyContent:'center',marginTop:20}}>
                      <View style={{flex:1,justifyContent:'space-evenly',alignItems:'center'}}>
                        <Image source={require('../../assets/vectors/icons8-facial-recognition-100.png')} style={{width:60,height:60}} />
                        <Text>กำลังตรวจสอบใบหน้า...</Text> 
                      </View>
                      <View style={{flex:1,justifyContent:'center'}}>
                        <ActivityIndicator size={50} color="#9E76B4" />
                      </View>
                            
                        
                    
                    </View>
                </View>
        </Modal>
        
      </View>
    );
  }

  handleFaceDetected = async (faceArray) => {
    var leftEyeOpenProp = faceArray.faces[0].leftEyeOpenProbability.toFixed(3) ;
    var rightEyeOpenProp = faceArray.faces[0].rightEyeOpenProbability.toFixed(3) ;
    var smilingProb = faceArray.faces[0].smilingProbability.toFixed(6) ;

      
    this.setState({timeCount : this.state.timeCount+1})
    // console.log("right: "+ leftEyeOpenProp + "  left: "+rightEyeOpenProp + "  smile: "+smilingProb + "  " + this.state.timeCount);
    if(leftEyeOpenProp < 0.5 && rightEyeOpenProp < 0.5 ){
      var eyeClosedCount = 1
      this.state.closedEyeTime.push(this.state.timeCount)
      var closedEyeTime = this.state.closedEyeTime 
      if(closedEyeTime.length != 0){
        
        for(var i=0;i<closedEyeTime.length-1;i++){

          if((closedEyeTime[i+1]-closedEyeTime[i]) > 2)
          {
            eyeClosedCount+=1
            
          }

        }
        eyeblink=eyeClosedCount
        
      } 
      
    }
    if(smilingProb > 0.98){
      var smileCount = 1
      this.state.smileTime.push(this.state.timeCount)
      var smileTime = this.state.smileTime
      if(smileTime.length !=0){
        for(var i=0;i<smileTime.length-1;i++){
          if(smileTime[i+1]-smileTime[i] > 3){
            smileCount+=1
          }
        }
        smile=smileCount
      }
    }
    
    if(eyeblink >= this.state.mustEyeBlink && smile >= this.state.mustSmile ){
        
        this.setState({shouldFaceDetect:false,isInprogressModalShow:true})
        await this.takePictureMatch()
        
    }
};

takePictureMatch = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      var base64String = await data.base64; 
      var bufferValue = await Buffer.from(base64String,"base64");
      var faceID = ''

      await this._getFaceID(bufferValue)
      .then(faceId => {
        faceID = faceId
      })

      if(faceID == 'No face detected'){
        this.setState({matchResult:null})
      }
      else{
          await this._FindSimilarity(faceID,this.state.studentIDState.replace(' ', '').toLowerCase())
          .then(async matchResult => {
            console.log(matchResult );
            if(matchResult.length != 0){
              
            //   this.props.navigation.navigate('StudentHome')
            if(matchResult[0].confidence >= 0.7){
              this.setState({matchResult:true,
                isInprogressModalShow:false,
                shouldFaceDetect:false,
                })
                await this.checkInAPI(
                    this.props.route.params.studentID,
                    this.props.route.params.teacherID,
                    this.props.route.params.uqID
                    )
            }
            }
            else{
              
              smile=0
              eyeblink=0
              this.setState({matchResult:false,
                isInprogressModalShow:false,
                mustEyeBlink:Math.floor(Math.random() * 3)+1,
                mustSmile:Math.floor(Math.random() * 3)+1,
                shouldFaceDetect:true,
                timeCount : 0,
                eyeblinkCount : 0,
                closedEyeTime : [],
                smileTime : [],
            }
                )
            }
          })  
      }
    }
  };
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

export default ExampleApp