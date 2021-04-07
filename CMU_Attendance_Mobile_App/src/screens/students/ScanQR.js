
'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View,Modal } from 'react-native';
import { RNCamera } from 'react-native-camera';
const URL = require('../../config/endpointConfig')
const myEndpointURL =  URL.myEndpointStudent
import AsyncStorage from '@react-native-community/async-storage'
class QR_Scan extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            shouldBarcodeDetect : false,
            receivedBarcodeData : '',
            scanDirection:null,
            isSelectModalShow:true,
            studentIDState:null
            
        }
    }

    _retrieveUserData = async () => {
      // const  studentID = await AsyncStorage.getItem('uniqueIDStudent');
      const  studentID = await AsyncStorage.getItem('name');
      this.setState({studentIDState:studentID})

  }

    componentDidMount(){
      this._retrieveUserData()
      console.log(this.props.route.params.teacherID + ' ' +this.props.route.params.uqID + '(Scan QR)');
    }


    CollectMapSeatAPI = async (studentID,receivedStudentID,direction) => {
      await fetch(myEndpointURL+'/addMapSeat', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentID:studentID,
          receivedStudentID:receivedStudentID,
          direction:direction,
          teacherID:this.props.route.params.teacherID,
          uqID:this.props.route.params.uqID,
          date:this.props.route.params.date
        })
        })
        .then((response) => response.json())
        .then(async (data) => {
            
            console.log(data);
            this.props.navigation.goBack()
        })
        .catch((error) => {
        console.error(error);
        });
    }


  render() {

    return (
      <View style={styles.container}>
        <View>
        <TouchableOpacity style={styles.capture}>
            <Text style={{ fontSize: 14 }}>กรุณาสแกน QR Code { this.state.scanDirection == null ? '' : (this.state.scanDirection == 0) ? '(Right)' : '(Front)'} </Text>
        </TouchableOpacity>
         
        </View>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          
        onGoogleVisionBarcodesDetected={this.state.shouldBarcodeDetect ? this.handleBarcodeDetected : null}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        />
        
        
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={this.setDetectBarcode.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}>Barcode Detect Enable</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={this.showBarcodeData.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Show Data ({this.state.scanDirection == null ? "" : this.state.scanDirection.toString() }) </Text>
            
          </TouchableOpacity> */}
        </View>
        <Modal
                      animationType="fade"
                      transparent={true}
                      visible={this.state.isSelectModalShow}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      }}
                  >
                    
                      <View style={{backgroundColor:'white',alignItems:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:8,marginBottom:200}}>
                          <View style={{flex:1,justifyContent:'center'}}>
                            <Text>โปรดเลือกทิศทางในการสแกน</Text>
                          </View>
                          <View style={{flex:1,justifyContent:'center'}}>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({scanDirection:1,isSelectModalShow:false,shouldBarcodeDetect:true})}>
                              <Text style={{color:'white'}}>สแกนด้านหน้า</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{flex:1,justifyContent:'center',marginBottom:25}}>
                            <TouchableOpacity style={styles.button} onPress={() => this.setState({scanDirection:0,isSelectModalShow:false,shouldBarcodeDetect:true})}>
                              <Text style={{color:'white'}}>สแกนด้านขวา</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
          </Modal>
      </View>
    );
  }


  handleBarcodeDetected = async ({barcodes}) => {
      if( barcodes[0].type  == 'QR_CODE'){
        const receivedStudentID =  barcodes[0].data
      this.setState({receivedBarcodeData:barcodes[0].data})
      this.setState({shouldBarcodeDetect:false})
      await this.CollectMapSeatAPI(this.state.studentIDState,receivedStudentID,this.state.scanDirection)
    }

  }

  setDetectBarcode = () => {
    this.setState({shouldBarcodeDetect:true})
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    
    }
  };

  showBarcodeData = () => {
    console.log(this.state.receivedBarcodeData);
    
   

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
  button:{
    backgroundColor:'#9E76B4',
    padding:20,
    borderRadius:30,
    elevation:10
  }
});

export default QR_Scan