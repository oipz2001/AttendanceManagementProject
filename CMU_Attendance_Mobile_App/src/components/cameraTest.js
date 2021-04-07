'use strict';
import React, { PureComponent } from 'react';
import {  StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
var eyeblink =0
var smile = 0
class ExampleApp extends PureComponent {

  

    constructor(props) {
        super(props);
        this.state = {
            timeCount : 0,
            eyeblinkCount : 0,
            closedEyeTime : [],
            smileTime : [],
            shouldFaceDetect : true
            
        }
  }
    
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> กรุณายิ้ม หรือ กระพริบตา   </Text>
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
          // onFacesDetected={this.handleFaceDetected}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity> */}
          <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Smile : {smile} </Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.capture}>
            <Text style={{ fontSize: 14 }}> EyeBlink : {eyeblink} </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  handleFaceDetected = (faceArray) => {
    var leftEyeOpenProp = faceArray.faces[0].leftEyeOpenProbability.toFixed(3) ;
    var rightEyeOpenProp = faceArray.faces[0].rightEyeOpenProbability.toFixed(3) ;
    var smilingProb = faceArray.faces[0].smilingProbability.toFixed(6) ;
    
     
      console.log(this.state.timeCount);
    this.setState({timeCount : this.state.timeCount+1})
    console.log("right: "+ leftEyeOpenProp + "  left: "+rightEyeOpenProp + "  smile: "+smilingProb + "  " + this.state.timeCount);
    if(leftEyeOpenProp < 0.5 && rightEyeOpenProp < 0.5 ){
      var eyeClosedCount = 1
      this.state.closedEyeTime.push(this.state.timeCount)
      var closedEyeTime = this.state.closedEyeTime 
      console.log(closedEyeTime);
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
    
    console.log(smile);
    

    
    
    
    // if(eyeblink == 5){
        
    //     this.setState({shouldFaceDetect:false})
    //     this.takePicture()
        
    // }
};

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      // this.props.onPicture(data);
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