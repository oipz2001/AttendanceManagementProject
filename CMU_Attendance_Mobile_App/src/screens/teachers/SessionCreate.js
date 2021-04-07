import React,{useState,useEffect} from 'react'
import { Button, View,Text,StyleSheet,Platform,TouchableOpacity  } from 'react-native'
import {Picker} from '@react-native-community/picker'
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../components/TextInput'
import DateTimePicker from '@react-native-community/datetimepicker';
const moment = require('moment')
import CheckBox from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
const URL = require('../../config/endpointConfig')
// const myEndpointURL =  URL.localEndpoint
const myEndpointURL =  URL.myEndpointTeacher


const TeacherSessionCreate = ({navigation}) => {
    //Term and Year
    const [selectedTermValue, setSelectedTermValue] = useState("2/2563");

    //Date Peroid

        //Date default
    const [date_start,setDate_start] = useState(new Date())
    const [date_end,setDate_end] = useState(new Date())
        //Date Setected
        // YYYY-MM-DD
    const [selectedDateStart,setSelectedDateStart] = useState(moment(new Date()).format('YYYY-MM-DD').toString())
    const [selectedDateEnd,setSelectedDateEnd] = useState(moment(new Date()).format('YYYY-MM-DD').toString())
        //Show Date Picker
    const [showDatePicker_start,setShowDatePicker_start] = useState(false)
    const [showDatePicker_end,setShowDatePicker_end] = useState(false)

    const [isLocationSelected, setLocationSelection] = useState(true);
    const [isSeatmapCreate,setSeatmapCreate] = useState(true)


    //Sessions Time

        //Time default
    const [time_start, setTime_start] = useState(new Date());
    const [time_end, setTime_end] = useState(new Date());
        //Show Time Picker
    const [showTimePicker_start, setShowTimePicker_start] = useState(false);
    const [showTimePicker_end, setShowTimePicker_end] = useState(false);
        //Time Selected
    const [selectedTime_start,setSelectedTime_start] = useState(moment(new Date()).format('HH:mm').toString());
    const [selectedTime_end,setSelectedTime_end] = useState(moment(new Date()).format('HH:mm').toString());

    //Session ID 
    const [sessionID,setSessionID] = useState("")
    //Session name
    const [sessionName,setSessionName] = useState("")
    //Session Desc
    const [sessionDesc,setSessionDesc] = useState("")

    // Duplicate Day
    const [isMon, setIsMon] = useState(false);
    const [isTue, setIsTue] = useState(false);
    const [isWed, setIsWed] = useState(false);
    const [isThu, setIsThu] = useState(false);
    const [isFri, setIsFri] = useState(false);
    const [isSat, setIsSat] = useState(false);
    const [isSun, setIsSun] = useState(false);

    const [teacherIDState,setTeacherIDState] = useState(null)
    // retrive user data
    const _retrieveUserData = async () => {
        // const  teacherID = await AsyncStorage.getItem('uniqueIDTeacher');
        const  teacherID = await AsyncStorage.getItem('name');
        setTeacherIDState(teacherID)
  
    }

    useEffect(() => {
        _retrieveUserData()
    },[])

    

    //Change Session Time Start
    const onChange_TimeStart = (event, selectedTime) => {
        setShowTimePicker_start(false)
        // const currentTime = selectedTime || time_start;
        setSelectedTime_start(moment(selectedTime).format('HH:mm').toString())
    
    
  };
    //Change Session Time End
    const onChange_TimeEnd = (event, selectedTime) => {
        setShowTimePicker_end(false)
        // const currentTime = selectedTime || time_end;
        setSelectedTime_end(moment(selectedTime).format('HH:mm').toString())


    };

    //Change session duplicate date period
        //Date start
    const onChange_DateStart = (event, selectedTime) => {
        setShowDatePicker_start(false)
        // const currentTime = selectedTime || time_end;
        setSelectedDateStart(moment(selectedTime).format('YYYY-MM-DD').toString())
        


    };
        //Date end
    const onChange_DateEnd = (event, selectedTime) => {
        setShowDatePicker_end(false)
        // const currentTime = selectedTime || time_end;
        setSelectedDateEnd(moment(selectedTime).format('YYYY-MM-DD').toString())
        


    };

 // Set Show Picker
    const _showTimepicker_start = () => {
        setShowTimePicker_start(true);
        
    };

    const _showTimepicker_end = () => {
        setShowTimePicker_end(true);
        
    };

    const _showDatePicker_start = () => {
        setShowDatePicker_start(true)
    }

    const _showDatePicker_end = () => {
        setShowDatePicker_end(true)
    }

    const _onChangeSessionIDText = (text) => {
        console.log(text);
        // setSessionID(text)
    }

    const _addSessionAPI = async () => {
       
        await fetch(myEndpointURL+'/addSession', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            classID : sessionID,
            className : sessionName,
            desc : sessionDesc,
            semester : selectedTermValue,
            teacherID : teacherIDState,
            startDate : selectedDateStart,
            endDate : selectedDateEnd,
            startTime : selectedTime_start,
            endTime : selectedTime_end,
            isLocationSet : isLocationSelected,
            isSeatmapSet : isSeatmapCreate,
            isAutoSelectMACSet : false,
            macAddrList : [],
            dupDay : [isSun,isMon,isTue,isWed,isThu,isFri,isSat]
        })
        })
        .then((response) => response.json())
        .then((data) => {
            
            console.log(data);
            
        })
        .catch((error) => {
        console.error(error);
        });
    }


    useEffect(() =>{

        if(!isLocationSelected){
            setSeatmapCreate(false)
        }else{
            setSeatmapCreate(true)
        }

    },[isLocationSelected])





    

    

    

    

    const DupDayComponent = () => {
        return(
        <View style={{padding:10,borderRadius:20,backgroundColor:'#e6e6fa',elevation:2}} >
            <View style={{flexDirection:'row'}} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isMon} onValueChange={setIsMon} />
                    <Text>จันทร์</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isTue} onValueChange={setIsTue} />
                    <Text>อังคาร</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isWed} onValueChange={setIsWed}/>
                    <Text>พุธ</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isThu} onValueChange={setIsThu} />
                    <Text>พฤหัสบดี</Text>
                </View>
            </View>
          <View style={{flexDirection:'row',justifyContent:'center'}} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isFri} onValueChange={setIsFri} />
                    <Text>ศุกร์</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isSat} onValueChange={setIsSat} />
                    <Text>เสาร์</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <CheckBox value={isSun} onValueChange={setIsSun}/>
                    <Text>อาทิตย์</Text>
                </View>
            </View>
        </View>
        )
    }

    

    return(
        <>
        
        {/* <KeyboardAvoidingView 
            behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex : 1}}
        > */}
                
                <SafeAreaView style={{flex:1}}>
                
                <ScrollView style={{backgroundColor:'white',margin:14,padding:0,borderRadius:20,elevation:2,paddingBottom:20}}>
                <View style={{alignItems:'center',marginTop:40}}>
                <View style={{flexDirection:'column',justifyContent:'space-between'}} >
                <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#9E76B4',paddingLeft:15,borderRadius:20,elevation:2}}>
                    <Text style={{fontSize:20,color:'white'}}>ภาคการศึกษา</Text>
                     <Picker
                        selectedValue={selectedTermValue}
                        style={{ height: 39, width: 130,color:'white'}}
                        onValueChange={(itemValue, itemIndex) => {setSelectedTermValue(itemValue)}}
                    >
                        <Picker.Item label="1/2563" value="1/2563"  />
                        <Picker.Item label="2/2563" value="2/2563" />
                        <Picker.Item label="1/2562" value="1/2562"  />
                        <Picker.Item label="2/2562" value="2/2562" />
                    </Picker>
                </View>
                </View>

                

                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:5}}>
                        <View style={styles.date}>
                            <Text style={styles.title}>วันที่เริ่ม</Text>
                            
                            <TouchableOpacity onPress={_showDatePicker_start}  style={styles.picker}>
                                <Text style={{color:'white'}}>
                                    {selectedDateStart.split('-')[2]+'/'+selectedDateStart.split('-')[1]+'/'+selectedDateStart.split('-')[0]}
                                </Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View style={styles.date}>
                            <Text style={styles.title}>วันที่สิ้นสุด</Text>
                            <TouchableOpacity onPress={_showDatePicker_end}  style={styles.picker}>
                                <Text style={{color:'white'}}>
                                    {selectedDateEnd.split('-')[2]+'/'+selectedDateEnd.split('-')[1]+'/'+selectedDateEnd.split('-')[0]}
                                    </Text>
                            </TouchableOpacity>
                        </View>

                        
                </View>
                <View style={{alignItems:'center',marginTop:5}}>
                    <View>
                        <Text style={styles.title}>รหัสวิชา</Text>
                        <TextInput placeholder='รหัสวิชาของคุณ' onChangeText={text => setSessionID(text)} />
                    </View>
                    <View>
                        <Text style={styles.title}>ชื่อวิชา</Text>
                        <TextInput placeholder='ชื่อวิชาของคุณ' onChangeText={text => setSessionName(text)}/>
                    </View>
                    <View>
                        <Text style={styles.title}>คำอธิบาย</Text>
                        <TextInput placeholder='คำอธิบายห้องเรียนหรือสถานที่' onChangeText={text => setSessionDesc(text)}/>
                    </View>
                </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:5}}>
                        <View>
                            <Text style={styles.title}>เริ่มเวลา</Text>
                            
                            <TouchableOpacity onPress={_showTimepicker_start}  style={styles.picker}>
                                <Text style={{color:'white'}}>{selectedTime_start}</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <View>
                            <Text style={styles.title}>สิ้นสุดเวลา</Text>
                            <TouchableOpacity onPress={_showTimepicker_end}  style={styles.picker}>
                                <Text style={{color:'white'}}>{selectedTime_end}</Text>
                            </TouchableOpacity>
                        </View>

                        
                    </View>
                    
                    <View style={{alignItems:'center',marginTop:5}}>
                        <Text style={styles.title}>ทำซํ้าวัน</Text>
                        <DupDayComponent/>
                    </View>
                    <View style={{flexDirection:'row',alignSelf:'center',marginTop:5}}>
                        <View style={{flexDirection:'row',alignSelf:'center',marginTop:10}}>
                            <CheckBox value={isLocationSelected} onValueChange={setLocationSelection}/>
                            <Text>ระบุสถานที่</Text>
                        </View> 
                        {
                            isLocationSelected ? 
                        <View style={{flexDirection:'row',alignSelf:'center',marginTop:10,marginLeft:15}}>
                            <CheckBox value={isSeatmapCreate} onValueChange={setSeatmapCreate}/>
                            <Text>สร้างแผนผังที่นั่ง</Text>
                        </View> 
                        :
                        <></>
                        }   
                    </View>

                    <View style={{alignItems:'center'}}>
                        { isLocationSelected ?
                        <TouchableOpacity onPress={() => navigation.navigate('TeacherSettingLocation',
                            
                                {
                                    classID : sessionID,
                                    className : sessionName,
                                    desc : sessionDesc,
                                    semester : selectedTermValue,
                                    teacherID : teacherIDState,
                                    startDate : selectedDateStart,
                                    endDate : selectedDateEnd,
                                    startTime : selectedTime_start,
                                    endTime : selectedTime_end,
                                    isLocationSet : isLocationSelected,
                                    isSeatmapSet : isSeatmapCreate,
                                    dupDay : [isSun,isMon,isTue,isWed,isThu,isFri,isSat]
                                }
                            
                        )} style={{backgroundColor:'#9E76B4',padding:10,marginTop:20,elevation:2,borderRadius:30}}>
                            <Text style={{fontSize:20,color:'white'}}>ดำเนินการต่อ</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={async () => {
                            await _addSessionAPI()
                            navigation.navigate('TeacherHome')
                        }} 
                        style={{backgroundColor:'#9E76B4',padding:10,marginTop:20,elevation:2,borderRadius:30}}>
                            <Text style={{fontSize:20,color:'white'}}>สร้างห้อง</Text>
                        </TouchableOpacity>
                        }
                    </View>
                    
                    
                
                    
                </ScrollView>
                

                {showTimePicker_start && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={time_start}
                             mode='time'
                            is24Hour={true}
                            display="default"
                             onChange={onChange_TimeStart}
                        />
                    )}

                    {showTimePicker_end && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={time_end}
                             mode='time'
                            is24Hour={true}
                            display="default"
                             onChange={onChange_TimeEnd}
                        />
                    )}

                    {showDatePicker_start && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date_start}
                             mode='date'
                            display="default"
                             onChange={onChange_DateStart}
                        />
                    )}

                    {showDatePicker_end && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date_end}
                             mode='date'
                            display="default"
                             onChange={onChange_DateEnd}
                        />
                    )}
                
                
                
                </SafeAreaView>
                {/* </KeyboardAvoidingView> */}
        </>
            
        
        
        
        

    );

}



const styles = StyleSheet.create({
    title:{
        fontSize:15
    },
    picker:{
        backgroundColor:'#9E76B4',
        borderRadius:20,
        padding:7,
        elevation:2,
        alignItems:'center'
    },
    date: {
        alignItems:'center'
    }
  });

export default TeacherSessionCreate