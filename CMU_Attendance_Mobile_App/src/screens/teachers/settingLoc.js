import React,{useEffect, useState} from 'react'
import { Button, View,Text,StyleSheet,FlatList,StatusBar,TouchableOpacity,Image,PermissionsAndroid,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import wifi from 'react-native-android-wifi';
import MultiSelect from 'react-native-multiple-select';
import Icon from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import CheckBox from '@react-native-community/checkbox'

const URL = require('../../config/endpointConfig')
// const myEndpointURL =  URL.localEndpoint
const myEndpointURL =  URL.myEndpointTeacher

const SettingLoc = ({navigation,route}) => {
    const [wifiList,setWifiList] = useState([])
    const [selectedItems,setSelectedItems] = useState([])
    const [isAutoSelected, setAutoSelection] = useState(true);

    const [classData,setClassData] = useState(null)

    // useEffect(() => {
    //   console.log(selectedItems);
    // },[selectedItems])

    useEffect(() => {
      let isMounted = true;

      if(isMounted){
        setClassData(route.params)
        getWifiList()
      }
        // const interval =  setInterval(() => {
        //   getWifiList()
        // }, 60000);
        // return () => clearInterval(interval);

        return () => {isMounted = false }

        
         
        
       
          
       
        
        
        
    },[])

    

    const onSelectedItemsChange = (selectedItems) => {
        // var selectedItems_modifiedList = []
        // for(var i=0;i<selectedItems.length;i++){
        //   selectedItems_modifiedList.push(selectedItems[i].split('.')[0])
        // }
        
        // setSelectedItems(selectedItems_modifiedList) 
        setSelectedItems(selectedItems)
     };

    



    const getWifiList = async () => {
      await askForUserPermissions();

      await wifi.reScanAndLoadWifiList(
        wifis =>{
          var wifiArray = JSON.parse(wifis);
            var keycap = 'capabilities'
            var keyfre = 'frequency'
            var keytime = 'timestamp'
        for(var i=0;i<wifiArray.length;i++)
        {
            delete wifiArray[i][keycap]
            delete wifiArray[i][keyfre]
            delete wifiArray[i][keytime]
        }   

        var wifiArray_modified = wifiArray
          for( var i=0;i<wifiArray.length;i++){
            if(wifiArray[i].level > -45){
              wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Great)' + wifiArray[i].level + ' dBm ' + wifiArray[i].BSSID)
            }
            else if(wifiArray[i].level > -60){
              wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Strong)'+ wifiArray[i].level+ ' dBm '  + wifiArray[i].BSSID)
            }
            else if(wifiArray[i].level > -70){
              wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Good)'+ wifiArray[i].level+ ' dBm '+ wifiArray[i].BSSID)
            }else{
              wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Weak)'+ wifiArray[i].level+ ' dBm '+ wifiArray[i].BSSID)
            }
            
            wifiArray_modified[i] = { BSSID_dotConcat: wifiArray[i].BSSID.concat('.'+ i.toString())  ,  SSID:wifiArray[i].SSID  , level:wifiArray[i].level}
            // console.log(wifiArray_modified[i]);
          }
            
          // setWifiList(wifiArray.sort((a, b) => parseInt(b.level) - parseInt(a.level)))
          setWifiList( wifiArray_modified.sort((a, b) => parseInt(b.level) - parseInt(a.level)))
        },
        error =>
          console.error(error) ||
          wifi.loadWifiList(
            wifis =>{
              var wifiArray = JSON.parse(wifis);
              var keycap = 'capabilities'
              var keyfre = 'frequency'
              var keytime = 'timestamp'
          for(var i=0;i<wifiArray.length;i++)
          {
              delete wifiArray[i][keycap]
              delete wifiArray[i][keyfre]
              delete wifiArray[i][keytime]
          }   

          var wifiArray_modified = wifiArray
            for( var i=0;i<wifiArray.length;i++){
              if(wifiArray[i].level > -45){
                wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Great)' + wifiArray[i].level + ' dBm')
              }
              else if(wifiArray[i].level > -60){
                wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Strong)'+ wifiArray[i].level+ ' dBm')
              }
              else if(wifiArray[i].level > -70){
                wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Good)'+ wifiArray[i].level+ ' dBm')
              }else{
                wifiArray[i].SSID = wifiArray[i].SSID.concat(' (Weak)'+ wifiArray[i].level+ ' dBm')
              }
              
              wifiArray_modified[i] = { BSSID_dotConcat: wifiArray[i].BSSID.concat('.'+ i.toString())  ,  SSID:wifiArray[i].SSID  , level:wifiArray[i].level}
              // console.log(wifiArray_modified[i]);
            }
              
            // setWifiList(wifiArray.sort((a, b) => parseInt(b.level) - parseInt(a.level)))
            setWifiList( wifiArray_modified.sort((a, b) => parseInt(b.level) - parseInt(a.level)))
            },
            error => console.error(error)
          )
      );
        
       
    }

      const showWifiList = () => {
            getWifiList()
            // console.log('Name: ' +wifiList[0].SSID + ' level: ' +wifiList[0].level );
            console.log(wifiList[0].BSSID_dotConcat.split('.')[0]);
            
            
        
    }

    const showSelectedWifi = () => {
      var selectedItems_result = []
      for(var i=0;i<selectedItems.length;i++){
           selectedItems_result.push(selectedItems[i].split(".")[0])
      }
      console.log(selectedItems_result);

      
      
  
}

    

    const _addSessionAPI = async () => {
      var myClassDataJSON = classData
      myClassDataJSON.isAutoSelectMACSet = isAutoSelected
      var myWifiList = []
      console.log(wifiList);
      if(isAutoSelected == true){
        for(var i=0;i<wifiList.length;i++){
          myWifiList.push(wifiList[i].BSSID_dotConcat.split('.')[0])
        }
        myClassDataJSON.macAddrList = myWifiList
      }
      else{
        myClassDataJSON.macAddrList = selectedItems
      }

      

      
      console.log(JSON.stringify( myClassDataJSON));

      await fetch(myEndpointURL+'/addSession', {
      method: 'POST',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify( myClassDataJSON)
      })
      .then((response) => response.json())
      .then((data) => {
          
          console.log(data);
          
      })
      .catch((error) => {
      console.error(error);
      });
    }


     async function askForUserPermissions() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Wifi networks',
              'message': 'We need your permission in order to find wifi networks'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Thank you for your permission! :)");
          } else {
            console.log("You will not able to retrieve wifi available networks list");
          }
        } catch (err) {
          console.warn(err)
        }
      }

    
    return(
        <>
        
        
        <View style={{backgroundColor:'white', margin:10,padding:10,borderRadius:20,elevation:7,paddingBottom:25,flex:1,alignItems:'center',justifyContent:'space-between'}}>
        <View style={{padding:10,marginTop:15,backgroundColor:'#9E76B4',borderRadius:20,padding:20}}>
          <Text style={{fontSize:20,color:'white',alignSelf:'center'}}>*คำแนะนำ*</Text>
          <Text style={styles.textColor}>1.อยู่ในบริเวณที่ต้องการให้ทำการเช็คชื่อ</Text>
          <Text style={styles.textColor}>2.เลือกสัญญาณ Wi-Fi โดยจะให้ระบบเลือกอัตโนมัติหรือเลือกด้วยตนเอง</Text>
          <Text style={styles.textColor}>3.ควรเลือกจากความแรงของสัญญาณที่มากที่สุดเพื่อจำกัดขอบเขตให้อยู่ในบริเวณมากที่สุด</Text>
        </View>
        { !isAutoSelected &&
        <View style={{backgroundColor:'#9E76B4',width:350,borderRadius:25,elevation:8,padding:15}}>
        <SectionedMultiSelect
          items={wifiList}
          IconRenderer={Icon}
          uniqueKey="BSSID_dotConcat"
          selectText="เลือก Wi-Fi"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          displayKey='SSID'
          // expandDropDowns={true}
          colors={{selectToggleTextColor:'#ffffff',chipColor:'#ffffff'}}
        />
        </View>
        
        }
        <View style={{flexDirection:'row',alignItems:'baseline'}}>
            <CheckBox value={isAutoSelected} onValueChange={setAutoSelection} />
            <Text>ให้ระบบเลือกสัญญาณอัตโนมัติ</Text>
        </View> 
        <View style={{marginBottom:50}}>
        {
          wifiList.length != 0 ? 
          <TouchableOpacity onPress={async () => {
                    if(wifiList.length != 0){
                    await _addSessionAPI()
                    navigation.navigate('TeacherHome')
                    }
          }} style={{backgroundColor:'#9E76B4',padding:10,elevation:7,borderRadius:20}}>
          <Text style={{fontSize:20,color:'white'}}>สร้างห้อง</Text>
        </TouchableOpacity>
        :
        <ActivityIndicator size="large" color='red' animating={true} />
        }
        </View>
        
        
      </View>
        
      
       
        </>
    )

}

const styles = StyleSheet.create({
  textColor : {
    color : 'white'
  }
})

export default SettingLoc
