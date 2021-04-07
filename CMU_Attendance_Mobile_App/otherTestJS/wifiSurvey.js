
import React, { Component,useState,useEffect } from 'react';
import { SafeAreaView ,Text,View,Button,TextInput} from 'react-native';
import wifi from 'react-native-android-wifi';

const URL = require('./src/config/endpointConfig')

const defaultEndpoint = URL.endpointDefault






const WifiSurvey = () => {
    
    const [wifiListState,setWifiListState] = useState([])
    const [location,setLocation] = useState('')
    const [wifiSurveyResponse,setWifiSurveyResponse] = useState(0)




    const addWifiSurveyAPI = async (wifiList,loc) => {
        await fetch(defaultEndpoint+'/addWifiSurvey', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              wifiList:wifiList,
              location:loc
    
            })
            })
            .then((response) => response.json())
            .then((data) => {
                
                console.log(data);
                setWifiSurveyResponse(data.response)
            })
            .catch((error) => {
            console.error(error);
            });
    }


    const getWifiList = async () => {
        await wifi.reScanAndLoadWifiList(
            async wifis =>{
              var wifiList = JSON.parse(wifis);
                var myWifiList = []
                wifiList.forEach(wifiData => {
                    var myWifiObj = {}
                    const wifiBSSID = wifiData.BSSID
                    const wifiSSID = wifiData.SSID
                    const wifiLevel = wifiData.level
                    myWifiObj.BSSID =  wifiBSSID
                    myWifiObj.SSID =  wifiSSID
                    myWifiObj.level = wifiLevel
                    myWifiList.push(myWifiObj)

                    
                });
                setWifiListState(myWifiList)
                await addWifiSurveyAPI(myWifiList,location)
            },
             error =>
              console.error(error) ||
              wifi.loadWifiList(
                async wifis =>{
                  var wifiList = JSON.parse(wifis);
                  console.log(wifiList);
                  var myWifiList = []
                    wifiList.forEach(wifiData => {
                        var myWifiObj = {}
                        const wifiBSSID = wifiData.BSSID
                        const wifiSSID = wifiData.SSID
                        const wifiLevel = wifiData.level
                        myWifiObj.BSSID =  wifiBSSID
                        myWifiObj.SSID =  wifiSSID
                        myWifiObj.level = wifiLevel
                        myWifiList.push(myWifiObj)
                    });
                    setWifiListState(myWifiList)
                    await addWifiSurveyAPI(myWifiList,location)
                },
                error => console.error(error)
              )
          );
    }

    return(
        <View style={{flex:1}}>
            <View style={{flex:12,justifyContent:'center',alignItems:'center'}}>
                {/* <View>
                {
                    wifiListState.map(wifi => 
                        <Text key={wifi.BSSID} >{wifi.BSSID} {wifi.SSID} ({wifi.level})</Text>
                    )
                }
                </View> */}
                <Text style={{backgroundColor:'yellow'}} >You added {wifiSurveyResponse.docLength} to {wifiSurveyResponse.location}</Text>
            </View>
            <View style={{justifyContent:'space-around',alignItems:'center',flex:2}}>
                <TextInput
                style={{ height: 40,width:200, borderColor: 'gray', borderWidth: 1 }}
                 value={location}
                 onChangeText={(text) => setLocation(text) }
                  />
                <Button title='Get Wi-Fi' onPress={() => getWifiList()} />
            </View>
        </View>
        
    )
}





export default  WifiSurvey