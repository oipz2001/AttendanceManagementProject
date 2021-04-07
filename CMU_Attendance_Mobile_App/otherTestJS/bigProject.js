import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ClippingRectangle, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
export default function App() {


  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [shouldFaceDetected, setShouldFaceDetected] = useState(true)
  const [whiteBalance, setWhiteBalance] = useState(Camera.Constants.WhiteBalance.auto);
  const [status, setStatus] = useState('Auto')
  const [faceinframe, setFaceinframe] = useState('NO')
  const [warning, setWarning] = useState(' ')

 

  
  let COUNTER_EYE_CONSEC_FRAMES = 90
  let YAWN_CONSEC_FRAMES = 80
  let EAR_TH = 1.3
  let MAR_TH = 65
  let COUNTER_m
  let COUNTER_e =0
  let playmusic =0
  let YAWN = 0
  let BLINK = 0
  let timecounter =0
  
  const handleFacesDetected = async (faceArray) => {
    // console.log(faceArray.faces.length)
    
    if(faceArray.faces.length != 0){
      
      setFaceinframe('YES')
      
      
      
      let left = faceArray.faces[0].leftEyeOpenProbability
      let right = faceArray.faces[0].rightEyeOpenProbability
      let EAR = right+left/2
      let buttomm =  faceArray.faces[0].bottomMouthPosition.y
      let nose = faceArray.faces[0].noseBasePosition.y
      let MAR = buttomm - nose
      timecounter += 1
      
      if(timecounter>=1650){YAWN = 0,BLINK = 0}
      //EYE CLOSE
      if(EAR <= EAR_TH){

        //EYE CLOSE MOUTH OPEN
        if(MAR >= MAR_TH){ 
          COUNTER_e += 1
          COUNTER_m += 1
        }

        //EYE CLOSE MOUTH CLOSE  
        if(MAR <  MAR_TH){
          COUNTER_e += 1
          COUNTER_m = 0
        }
      }

      // EYE OPEN
      if(EAR >EAR_TH){ 
        COUNTER_e  = 0

        // EYE OPEN MOUTH OPEN
        if(MAR >= MAR_TH){
          
          COUNTER_m += 1
        }
        
        // EYE OPEN MOUTH CLOSE
        if(MAR <  MAR_TH){
        
          COUNTER_m = 0
        }
      
      }
      
    
    if(COUNTER_e>=30){YAWN +=1}
    console.log(COUNTER_e) 
      
      
      
      //await sound.loadAsync(require('./assets/alarm2.mp3'));
     // await sound.playAsync();
     // if(EAR=0){await sound.unloadAsync();await sound.stopAsync();}
    
     
      }
    else setFaceinframe('NO')
    
    
    
  }
   
  const onPressSunny = () => {
    setStatus('Sunny')
    setWhiteBalance(Camera.Constants.WhiteBalance.sunny)
  }
  const onPressAuto = () => {
    setStatus('Auto')
    setWhiteBalance(Camera.Constants.WhiteBalance.auto)
  }
  const onPressShadow = () => {
    setStatus('Shadow')
    setWhiteBalance(Camera.Constants.WhiteBalance.Shadow)
  }
  const onPressIncandescent = () => {
    setStatus('Incandescent')
    setWhiteBalance(Camera.Constants.WhiteBalance.Incandescent)
  }
  const onPressFluorescent = () => {
    setStatus('Fluorescent')
    setWhiteBalance(Camera.Constants.WhiteBalance.Fluorescent)
  }
  return (
    
    <View style={styles.container}>
      <View  style={{flex:2,flexDirection:'collum',justifyContent:'center',marginStart:15}}>
      <Text>   </Text>
      <Text>  WhiteBalance mode : {status} </Text>
      <Text>  Face detect : {faceinframe}  {warning} </Text>
      <Text>  YAWN : {YAWN} </Text>
      </View>
     <View style={{flex:12}}> 
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
          // onFacesDetected={this.handleFaceDetected}
        />
        
      <Camera 
      style={styles.camera} 
      whiteBalance = {whiteBalance}
      type={Camera.Constants.Type.front}
      onFacesDetected={shouldFaceDetected ? handleFacesDetected : null }
      faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.all,
        runClassifications: FaceDetector.Constants.Classifications.all,
        tracking: true,
      }}
      >
      <Text > {warning} </Text> 

      </Camera>
      </View>
     
      <View  style={{flex:1,flexDirection:'row',justifyContent:'center'}}>
        <View style={{backgroundColor:'purple'}}>
          <Button title='Incandescent' color= 'black' onPress={() => onPressIncandescent()} />
        </View>
        <View style={{backgroundColor:'orange'}}>
          <Button title='Sunny' color= 'black' onPress={() => onPressSunny()}  />
        </View>
        <View style={{backgroundColor:'white'}}>
          <Button title='Auto'color= 'black' onPress={() => onPressAuto()} />
        </View>
        <View style={{backgroundColor:'gray'}}>
          <Button title='Shadow' color= 'black' onPress={() => onPressShadow()} />
        </View>
        <View style={{backgroundColor:'cyan'}}>
          <Button title='Fluorescent' color= 'black' onPress={() => onPressFluorescent()} />
        </View>
       
      </View>
    </View>
  );
}









const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  
  
});