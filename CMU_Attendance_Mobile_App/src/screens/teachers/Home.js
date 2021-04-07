import React,{useEffect, useState} from 'react'
import { Button, View,Text,StyleSheet,FlatList,StatusBar,TouchableOpacity,Image,Modal,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Calendar from '../../components/CalendarPicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage'
import wifi from 'react-native-android-wifi';
import CalendarPicker from 'react-native-calendar-picker';
import firestore from '@react-native-firebase/firestore';
const URL = require('../../config/endpointConfig')

const myEndpointURL =  URL.myEndpointTeacher

const defaultEndpoint = URL.endpointDefault
const moment = require('moment')



const TeacherHome = ({ navigation }) => {
    const [selectedId, setSelectedId] = useState(null);
    // DD-MM-YYYY
    // YYYY-MM-DD
    const [selectedDate,setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD').toString())


    const [localTime,setLocalTime] = useState(moment(new Date()).format('HH:mm').toString())

    const [sessionsData,setSessionsData] = useState([])
    const [teacherIDState,setTeacherIDState] = useState(null)

    const [wifiList,setWifiList] = useState([])

    const [isInprogressModalShow,setIsInprogressModalShow] = useState(false)

    const [cancelSelectedData,setCancelSelectedData] = useState(false)
    const [isCancelModalShow,setIsCancelModalShow] = useState(false)
    const [isCancelAllModalShow,setIsCancelAllModalShow] =useState(false)

    const [selectedChangeLocData,setSelectedChangeLocData] = useState('')
    const [isChangeLocModalShow,setIsChangeLocModalShow] = useState(false)

    const [isDupDateSet,setIsDupDateSet] = useState(false)

    const _retrieveUserData = async () => {
      // const  teacherID = await AsyncStorage.getItem('uniqueIDTeacher');
      const  teacherID = await AsyncStorage.getItem('name');
      setTeacherIDState(teacherID)

    }

    useEffect(() => {
      _retrieveUserData()

      
    },[])

    useEffect(() => {
      const subscriber = firestore()
        .collection('Classroom')
        .doc(teacherIDState)
        .collection('sessions')
        .onSnapshot(teacherClassroom => {
          
          let myClassDataList = []
          teacherClassroom.forEach(data => {
            
            const regisDateList = data.data().registeredDay
            if(regisDateList.includes(selectedDate))
            {
              // console.log(teacherClassroom);
              let myClassObject = {}
              const classData =  data.data()
              // get class detail

              const classUqID = data.id
              const className = classData.name
              const classID = classData.id
              const classDesc = classData.desc
              const classStartTime = classData.startTime
              const classEndTime = classData.endTime
              const classSemester = classData.semester
              const isClassLocSet = classData.isLocationSet
              const isClassStudentAdded = classData.isStudentAdded
              const isClassSeatmapSet = classData.isSeatmapSet

              let classDupDate = classData.duplicatedDay
              const classStartDate = classData.startDate
              const classEndDate = classData.endDate
              
             
              
             

              // get class status
              let classStatus = 0
              if(!isClassStudentAdded)
              {
                classStatus = -99

                myClassObject = {
                  currentDate: selectedDate,
                  desc: classDesc,
                  endTime: classEndTime,
                  id: classID,
                  isLocationSet: isClassLocSet,
                  isSeatmapSet: isClassSeatmapSet,
                  isStudentAdded: isClassStudentAdded,
                  name: className,
                  semester: classSemester, 
                  sessionStatus: classStatus,
                  startTime: classStartTime, 
                  uqID: classUqID,
                  peroidDate : `${moment(classStartDate).format('DD/MM/YYYY')} ถึง ${moment(classEndDate).format('DD/MM/YYYY')}`,
                  dupDate : classDupDate,
                  startDate : classStartDate,
                  endDate : classEndDate
                }

              }else
              {
                classStatus = classData.classStatus[selectedDate]

                // count student stat
                const classStudentList = classData.statistics[selectedDate]
                const totalClassStudent = classStudentList.length
                var absent = classStudentList.filter(x => x.isChecked == false).length
                var present = totalClassStudent - absent

                myClassObject = {
                  currentDate: selectedDate,
                  desc: classDesc,
                  endTime: classEndTime,
                  id: classID,
                  isLocationSet: isClassLocSet,
                  isSeatmapSet: isClassSeatmapSet,
                  isStudentAdded: isClassStudentAdded,
                  name: className,
                  semester: classSemester, 
                  sessionStatus: classStatus,
                  startTime: classStartTime, 
                  uqID: classUqID,
                  checkedStudent: present,
                  uncheckedStudent : absent,
                  totalStudent : totalClassStudent,
                  peroidDate : `${moment(classStartDate).format('DD/MM/YYYY')} ถึง ${moment(classEndDate).format('DD/MM/YYYY')}`,
                  dupDate : classDupDate,
                  startDate : classStartDate,
                  endDate : classEndDate
                  

                }
              }

              if(classStatus == -99){
                myClassObject.sessionStatusString = 'I'
              }else if(classStatus == -1){
                myClassObject.sessionStatusString = 'W'
              }else if(classStatus == 0){
                myClassObject.sessionStatusString = 'O'
              }else if(classStatus == 1){
                myClassObject.sessionStatusString = 'C'
              }
              
              myClassDataList.push(myClassObject)
            }
          });
          
          var order = { "I": 1, "O": 2, "W": 3, "C": 4, default: Infinity };
          myClassDataList.sort(function (a, b) {
          return (order[a.sessionStatusString] || order.default) - (order[b.sessionStatusString] || order.default);
        })
        console.log(myClassDataList);
          setSessionsData(myClassDataList)

        });
        
      
      return () => subscriber();
    }, [teacherIDState,selectedDate]);




    useEffect(() =>{
      const interval =  setInterval(async () => {
        setLocalTime(moment(new Date()).format('HH:mm').toString())
            
      }, 1000);

      

      // const funcFetchSession = async () => {
      // var localTime = moment(new Date()).format('HH:mm').toString()
      //  var localDate = moment(new Date()).format('YYYY-MM-DD').toString()
      //   await _fetchSessionsAPI(selectedDate,localTime,localDate)
      // };

      // funcFetchSession()
        
  
      return () => clearInterval(interval);
    },[localTime])



    // useFocusEffect(
    //   React.useCallback(() => {
    //     // Do something when the screen is focused
        
    //    var localTime = moment(new Date()).format('HH:mm').toString()
    //    var localDate = moment(new Date()).format('YYYY-MM-DD').toString()
    //    console.log("Home is focused");

    //     if(teacherIDState !=  null)
    //       _fetchSessionsAPI(selectedDate,localTime,localDate)

        

  
    //     return () => {
    //       console.log("Home is unfocused");
    //     };
    //   }, [teacherIDState,selectedDate])
    // );


    


    const _fetchSessionsAPI = async (selectDate,currentTime,currentDate) => {
      var teacherID = teacherIDState
      var date  = selectDate

      console.log(date);
      console.log(currentDate);

      await fetch(myEndpointURL+'/getSession?date='+date+'&teacherID='+teacherID+'&clientCurrentTime='+currentTime+'&clientCurrentDate='+currentDate)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // setSessionsData(data)
        })
        .catch((error) => {
            console.error(error);
        });

      
      
    }

    const _addStudentTestAPI = async (classUqID) => {
      var uqID = classUqID
      var teacherID = teacherIDState
      var studentList = [ 
        {id: 590610671, name: "SINGKHON KHONGTHAM"},
        {id: 590610677, name: "ATHITAKARN MUANGKEING"},
        {id: 590610679, name: "AMONWAN LAPINSEE"},
        {id: 600610715, name: "GANICKNAN NANJARUWONG"},
        {id: 600610717, name: "KRIT UPANUN"},
        {id: 600610718, name: "KAWIN UPRA"},
        {id: 600610719, name: "KAVISARA SAKBURANAPHET"},
        {id: 600610720, name: "KANTACHART LOHAJOTI"},
        {id: 600610721, name: "KITTIPONG NAKTIA"},
        {id: 600610722, name: "KRAIWIT KEYEN"},
        {id: 600610723, name: "KANAPONG SRIANAN"},
        {id: 600610724, name: "JIRAWAT WONGWICHAI"},
        {id: 600610725, name: "CHANATIP ATCHARIYABANCHA"},
        {id: 600610726, name: "CHAYUTPONG PROMLEE"},
        {id: 600610727, name: "CHAWIT WANTHONG"},
        {id: 600610728, name: "CHUNYARAT THONGYAEM"},
        {id: 600610729, name: "NATCHAPON LEELAPIROMKUL"},
        {id: 600610731, name: "DARAN YOTRAYAP"},
        {id: 600610732, name: "DIDPATH MALANGPOO"},
        {id: 600610733, name: "DULLAYATHIT PHITTAYAPANJARAT"},
        {id: 600610734, name: "THIPAPORN THAMONGKHON"},
        {id: 600610735, name: "THANAKRIT TONMANEE"},
        {id: 600610736, name: "THANAKRIT TATSAMAKORN"},
        {id: 600610737, name: "THANAPHON THANUSAN"},
        {id: 600610738, name: "THANAWONG SANEEWONG NA AYUTTHAYA"},
        {id: 600610739, name: "TANANPORN YANA"},
        {id: 600610740, name: "THUT CHAYASATIT"},
        {id: 600610741, name: "TANCHAPAS CHANTARANIMI"},
        {id: 600610742, name: "TEERAPAT RATTANAPIKUL"},
        {id: 600610743, name: "NONTAWAT UDPROM"},
        {id: 600610744, name: "NORATAP MUAGUDOM"},
        {id: 600610745, name: "NANTHAPHOP NANCHAI"},
        {id: 600610746, name: "NANTHASAK SAMADSINWANICH"},
        {id: 600610747, name: "NIRUSH SRIJAIMOON"},
        {id: 600610748, name: "PATHOMPORN PANKAEW"},
        {id: 600610749, name: "PARINYA SEETAWAN"},
        {id: 600610750, name: "PARINYAKORN TEJASAO"},
        {id: 600610751, name: "PAWARIS SUEA-AEIM"},
        {id: 600610752, name: "PANNAWIT PANWONG"},
        {id: 600610753, name: "PONGSATHON JAIKAEW"},
        {id: 600610754, name: "PONGPUK KASEMSEE NA AYUTAYA"},
        {id: 600610755, name: "PACHARA BUNMALERT"},
        {id: 600610756, name: "PACHARAPHON CHOMTHAN"},
        {id: 600610757, name: "PHATCHARAPHON PHROMJOM"},
        {id: 600610758, name: "PHATCHARAPHON UNURA"},
        {id: 600610759, name: "PHANTHAKAN TOONWICHAI"},
        {id: 600610760, name: "PEERAPAS SAKOLWASAN"},
        {id: 600610761, name: "PEERAWICH DINPRAPA"},
        {id: 600610762, name: "PATTIYA APIRATMONTREE"},
        {id: 600610763, name: "PANUPONG RUKSA"},
        {id: 600610764, name: "PHANUPONG INCHAN"},
        {id: 600610765, name: "PHUMTHAI KAEWKAMKRUEA"},
        {id: 600610767, name: "RADIT KAMAI"},
        {id: 600610768, name: "RAVICHA HASHIMOTO"},
        {id: 600610769, name: "RAKPONG THORHUN"},
        {id: 600610770, name: "RAKSAMON KUMPAPHAN"},
        {id: 600610771, name: "LYDIA WIMOO"},
        {id: 600610772, name: "VACHIRA SUKKAPAT"},
        {id: 600610773, name: "WASUTAN KITIJERAPAT"},
        {id: 600610775, name: "WITCHAYA CHAIWAN"},
        {id: 600610776, name: "SARATCHUN BOTAEN"},
        {id: 600610777, name: "SARUN SUESUWAN"},
        {id: 600610778, name: "SASIRAT MANEEJIAN"},
        {id: 600610780, name: "SIRI SIRIKANJANAKUL"},
        {id: 600610781, name: "SIVAKORN WONGPONKANAN"},
        {id: 600610782, name: "SUPHAKORN HOMNAN"},
        {id: 600610783, name: "SUPADET BORISUTTHANARAK"},
        {id: 600610784, name: "SUPAKON KHONGKRAJANG"},
        {id: 600610785, name: "SUPAGORN PHADUNGPHAN"},
        {id: 600610786, name: "SIRIN RATTANARUANG-AMPHAI"},
        {id: 600610789, name: "SUPAWADEE KHAMNUENGSITHI"},
        {id: 600610790, name: "SURIYA TECHALUE"},
        {id: 600610791, name: "ATICHAT CHANTHA"},
        {id: 600610793, name: "ANUCHA PINSAIMOON"},
        {id: 600610794, name: "APISAK VANITCHAKOOL"},
        {id: 600610795, name: "APISARA TUNGPENNUNG"},
        {id: 600610796, name: "APHISIT KHAMNOI"},
        {id: 600610797, name: "ANNOP KRASAESIN"},
        {id: 600610798, name: "ATTAKORN TANAME"},
        {id: 600610801, name: "ARNAN BOONROD"},
        {id: 600610802, name: "APASSARA RUEANGMUEANG"},
        {id: 600610804, name: "EKAWIT JAIDEE"}
      ]
      
      console.log(uqID);
      await fetch(defaultEndpoint+'/webApp/addNewStudents', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uqID: uqID,
          teacherID:teacherID,
          studentList:studentList

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

    const _cancelSession = async (date,uqClassID) => {
      console.log(date);
      console.log(uqClassID);
      var teacherID = teacherIDState

      // console.log(teacherID);


        await fetch(myEndpointURL+'/cancelSession', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uqID:uqClassID,
            date:date,
            teacherID:teacherID
        })
        })
        .then((response) => response.json())
        .then((data) => {
            
            console.log(data);
        })
        .catch((error) => {
        console.error(error);
        });

    };

    const _cancelSessionAll = async (teacherID,uqClassID) => {
      console.log(teacherID,uqClassID);


        await fetch(defaultEndpoint+'/webApp/removeClassAllDate', {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uqID:uqClassID,
            teacherID:teacherID
        })
        })
        .then((response) => response.json())
        .then((data) => {
            
            console.log(data);
        })
        .catch((error) => {
        console.error(error);
        });

    };


    const updateWifiLocAPI = async (uqID,teacherID) => {
      setIsInprogressModalShow(true)
      await wifi.reScanAndLoadWifiList(
        async wifis =>{
          var tempWifis = JSON.parse(wifis)
          var wifisArr = []
          for(var i=0;i<tempWifis.length;i++){
            wifisArr.push(tempWifis[i].BSSID)
          }
          
              // setWifiList(wifisArr);
              if(wifisArr.length != 0){
                await fetch(myEndpointURL+'/updateClassLoc', {
                  method: 'POST',
                  headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    uqID: uqID,
                    teacherID:teacherID,
                    wifiList: wifisArr
          
                  })
                  })
                  .then((response) => response.json())
                  .then((data) => {
                      
                      console.log(data);
                      setIsInprogressModalShow(false)
                  })
                  .catch((error) => {
                  console.error(error);
                  });
            }
        },
        async error =>
          console.error(error) ||
          wifi.loadWifiList(
            async wifis =>{
              var tempWifis = JSON.parse(wifis)
              var wifisArr = []
              for(var i=0;i<tempWifis.length;i++){
                wifisArr.push(tempWifis[i].BSSID)
              }
              // setWifiList(wifisArr);
              if(wifisArr.length != 0){
                  await fetch(myEndpointURL+'/updateClassLoc', {
                    method: 'POST',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      uqID: uqID,
                      teacherID:teacherID,
                      wifiList: wifisArr
            
                    })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        
                        console.log(data);
                        setIsInprogressModalShow(false)
                    })
                    .catch((error) => {
                    console.error(error);
                    });
              }
            },
            error => console.error(error)
          )
      );
      
      
     
  }

  const checkAllStudent = async (teacherID,uqID,date) => {
    console.log(teacherID,uqID,date);
    await fetch(defaultEndpoint+'/webApp/checkAllStudent', {
      method: 'POST',
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uqID: uqID,
        teacherID:teacherID,
        date : date

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


    

    const renderItem = ({ item }) => {
        const Item = ({ item, onPress, style }) => (
            
           
           
              
              
        
            <View   style={[styles.item, style]}>
              <View style={statusButtStyle(item.sessionStatus)} >
                            
                            {
                              item.sessionStatus == -1 ? 
                              <Text style={styles.statusText} >รอเปิดทำการเช็คชื่อ</Text>
                              :
                              (item.sessionStatus == 0 ? 
                  
                              <Text style={styles.statusText}>เปิดทำการเช็คชื่อ</Text>
                              : 
                              (item.sessionStatus == 1 ? 
                              <Text style={styles.statusText}>ปิดทำการเช็คชื่อ</Text> 
                              :
                              <Text style={styles.statusText}>รอการเพิ่มรายชื่อนักศึกษา</Text> 
                              )
                              ) 

                            }
                            
              </View>
              <View>
                    <View >
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <View>
                            <Text style={styles.title}>ชื่อวิชา: {item.name}</Text>
                            <Text style={styles.title}>รหัสวิชา: {item.id == "" ? "" : item.id }</Text>
                          </View>
                          
                        </View>
                    </View>
                    <View>
                      <Text style={styles.descrption}>ภาคการศึกษา: {item.semester} </Text>
                      <Text style={styles.descrption}>ระยะเวลา: {item.peroidDate} </Text>
                      <Text style={styles.descrption}>ทำซํ้าทุกวัน: </Text>
                      {
                        DupDay(item.dupDate)
                        
                      }
                      <Text style={styles.descrption}>เวลาเช็คชื่อ: {item.startTime} - {item.endTime} </Text>
                      <Text style={styles.descrption}>วันที่: {item.currentDate.split('-')[2] +'/'+ item.currentDate.split('-')[1] +'/'+ item.currentDate.split('-')[0] } </Text>
                      <Text style={styles.descrption}>คำอธิบาย: {item.desc == "" ? "(ไม่ได้ระบุไว้)" : item.desc} </Text>
                      <Text style={styles.descrption}>รูปแบบการเช็คชื่อ: {item.isLocationSet ? 'ระบุสถานที่' : 'ออนไลน์'} </Text>
                    </View>
                    {
                     item.isStudentAdded ?
                    <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-around'}}>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                              <Icon name="users" size={23} />
                              <Text style={styles.statText} >  {item.totalStudent}</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                              <Icon name="check" size={30} color='green'/>
                              <Text style={styles.statText}>  {item.checkedStudent}</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                              <Icon name="times" size={30} color='red'/>
                              <Text style={styles.statText}>  {item.uncheckedStudent}</Text>
                          </View>
                      </View>
                      :
                      <></>
                    }
                    
              </View>
              
              <View style={{flexDirection:'row',marginTop:15,justifyContent:'space-evenly'}}>  
              {
                item.isStudentAdded ?
               
                    
                      
                      
                        <View style={{backgroundColor:'#9E76B4',width:95,height:75,elevation:2,borderRadius:20,alignSelf:'center',justifyContent:'center'}}>
                          <TouchableOpacity onPress={() => { navigation.navigate('RoomStat',
                          {
                            uqID:item.uqID,
                            selectedDate:selectedDate,
                            classID : item.id,
                            className : item.name
                            })
                          }} 
                          >
                            <View style={{flexDirection:'column',alignItems:'center'}}>
                              <Icon name="pie-chart" size={40} color="white" /> 
                              <Text style={{color:'white',fontSize:10}}>สถิติ</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                    
                    
                   //</View>
                  
                :
                <></>



              }

              { item.isSeatmapSet ?
                        <View style={{backgroundColor:'#9E76B4',width:95,height:75,elevation:2,borderRadius:20,alignSelf:'center',justifyContent:'center'}}>
                          <TouchableOpacity onPress={() => navigation.navigate('TeacherSeatmap',{uqID:item.uqID,selectedDate:selectedDate})} >
                            <View style={{flexDirection:'column',alignItems:'center'}}>
                              <Icon name="users" size={33} color="white" />
                              <Text style={{color:'white',fontSize:10,bottom:-3}}>แผนผังที่นั่ง</Text>
                            </View>
                          </TouchableOpacity>
                      </View>
                      :
                      <></>
              }

            {
              item.isLocationSet ?
              <View style={{backgroundColor:'#9E76B4',width:95,height:75,elevation:2,borderRadius:20,justifyContent:'center'}}>
                <TouchableOpacity onPress={async () => {
                  setIsChangeLocModalShow(true)
                  setSelectedChangeLocData(
                    {
                      uqID : item.uqID,
                      teacherID : teacherIDState,
                      className : item.name,
                      classID : item.id,
                      date : item.currentDate
                    }
                  )
                    // await updateWifiLocAPI(item.uqID,teacherIDState)
                }}  >
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Icon name="map-marker" size={40} color="white" /> 
                    <Text style={{color:'white',fontSize:10}}>อัปเดตสถานที่</Text>      
                  </View>
                </TouchableOpacity>
               
            </View>
            :
            <></>
            }
            </View>   
            
            <View style={{flexDirection:'row',marginTop:15,justifyContent:'space-evenly'}}>
            { !item.isStudentAdded ?
            <View >
                <TouchableOpacity style={{backgroundColor:'#9E76B4',width:95,height:75,elevation:2,borderRadius:25,alignSelf:'center',justifyContent:'center'}}
                onPress={async () => {
                  navigation.navigate('TeacherSessionEdit',{
                    editSemester : item.semester,
                    editStartDate : item.startDate,
                    editEndDate : item.endDate,
                    editClassID : item.id,
                    editClassName : item.name,
                    editClassDesc : item.desc,
                    editClassStartTime : item.startTime,
                    editClassEndTime : item.endTime,
                    editClassDupDate : item.dupDate,
                    isLocationSet : item.isLocationSet,
                    isSeatmapSet : item.isSeatmapSet,
                    uqID : item.uqID,
                    teacherID : teacherIDState
                  })

                  // currentDate: selectedDate,
                  // desc: classDesc,
                  // endTime: classEndTime,
                  // id: classID,
                  // isLocationSet: isClassLocSet,
                  // isSeatmapSet: isClassSeatmapSet,
                  // isStudentAdded: isClassStudentAdded,
                  // name: className,
                  // semester: classSemester, 
                  // sessionStatus: classStatus,
                  // startTime: classStartTime, 
                  // uqID: classUqID,
                  // checkedStudent: present,
                  // uncheckedStudent : absent,
                  // totalStudent : totalClassStudent,
                  // peroidDate : `${moment(classStartDate).format('DD/MM/YYYY')} ถึง ${moment(classEndDate).format('DD/MM/YYYY')}`,
                  // dupDate : classDupDate,
                  // startDate : classStartDate,
                  // endDate : classEndDate
                  // setIsCancelModalShow(true)
                  // setCancelSelectedData({
                  //   uqID : item.uqID,
                  //   date : item.currentDate,
                  //   classID : item.id,
                  //   className : item.name
                  // })
                  // await _cancelSession(item.currentDate,item.uqID)
                  // await _fetchSessionsAPI(item.currentDate,localTime,localDate)
                  }} >
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                  <Icon name="cog" size={37} color="white" /> 
                  <Text style={{color:'white',fontSize:10}}>แก้ไข</Text>
                  </View>
                </TouchableOpacity>
              </View>
              :
              <></>
            }
              
              <View>
                <TouchableOpacity style={{backgroundColor:'red',width:95,height:75,elevation:2,borderRadius:25,alignSelf:'center',justifyContent:'center'}}
                //backgroundColor:'orangered'
                onPress={async () => {
                  setIsCancelModalShow(true)
                  setCancelSelectedData({
                    uqID : item.uqID,
                    date : item.currentDate,
                    classID : item.id,
                    className : item.name
                  })
                  // await _cancelSession(item.currentDate,item.uqID)
                  // await _fetchSessionsAPI(item.currentDate,localTime,localDate)
                  }} >
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                  <Icon name="minus-circle" size={37} color="white" /> 
                  <Text style={{color:'white',fontSize:10}}>ยกเลิก</Text>
                  </View>
                </TouchableOpacity>
              </View>
             
              

          

            <View >
                <TouchableOpacity style={{backgroundColor:'black',width:95,height:75,elevation:2,borderRadius:25,alignSelf:'center',justifyContent:'center'}}
                //backgroundColor:'#333'
                onPress={async () => {
                  setIsCancelAllModalShow(true)
                  setCancelSelectedData({
                    uqID : item.uqID,
                    date : item.currentDate,
                    classID : item.id,
                    className : item.name
                  })
                  
                  }} >
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                      <Icon name="trash" size={37} color="white" /> 
                      <Text style={{color:'white',fontSize:10}}>ลบห้องเช็คชื่อ</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
              
            
            {/* {!item.isStudentAdded ? 
            <View>
                <TouchableOpacity style={{backgroundColor:'green',padding:15,elevation:5,borderRadius:25,alignSelf:'center',marginTop:15}}
                onPress={async () => {
                  var localTime = moment(new Date()).format('HH:mm').toString()
                  var localDate = moment(new Date()).format('YYYY-MM-DD').toString()
                   await _addStudentTestAPI(item.uqID)
                  // await _fetchSessionsAPI(item.currentDate,localTime,localDate)
                  }} >
                      <Text style={{color:'white'}}>Test Add Students</Text>
                </TouchableOpacity>
            </View>
            :
            <></>
            }

            {item.isStudentAdded ? 
            <View>
                <TouchableOpacity style={{backgroundColor:'green',padding:15,elevation:5,borderRadius:25,alignSelf:'center',marginTop:15}}
                onPress={async () => {
                   await  checkAllStudent(teacherIDState,item.uqID,selectedDate)
                  }} >
                      <Text style={{color:'white'}}>Check all student</Text>
                </TouchableOpacity>
            </View>
            :
            <></>
            } */}
            
            
            </View>


            
            
            
                
          );
        return (
          <Item
            item={item}
            onPress={() => {
              setSelectedId(item.id)
              
            }}
            style={{ backgroundColor:'white' }}
          />
        
         
          
        );
      };

      const DupDay = (dupDate) => {
        let dupDayColor = ['','','','','','','']

        let isDupColor = 'green'

        if(dupDate[0]) dupDayColor[6] = isDupColor
        else dupDayColor[6] = '#a9a9a9'

        if(dupDate[1]) dupDayColor[0] = isDupColor
        else dupDayColor[0] = '#a9a9a9'

        if(dupDate[2]) dupDayColor[1] = isDupColor
        else dupDayColor[1] = '#a9a9a9'

        if(dupDate[3]) dupDayColor[2] = isDupColor
        else dupDayColor[2] = '#a9a9a9'

        if(dupDate[4]) dupDayColor[3] = isDupColor
        else dupDayColor[3] = '#a9a9a9'

        if(dupDate[5]) dupDayColor[4] = isDupColor
        else dupDayColor[4] = '#a9a9a9'

        if(dupDate[6]) dupDayColor[5] = isDupColor
        else dupDayColor[5] = '#a9a9a9'
        
        return (
          <View   style={{flexDirection:'row',marginVertical:5,alignSelf:'center'}}>
            <View style={{backgroundColor:dupDayColor[0],paddingHorizontal:15,borderTopLeftRadius:10,borderBottomLeftRadius:10,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>จ</Text></View>
            <View style={{backgroundColor:dupDayColor[1],paddingHorizontal:15,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>อ</Text></View>
            <View style={{backgroundColor:dupDayColor[2],paddingHorizontal:15,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>พ</Text></View>
            <View style={{backgroundColor:dupDayColor[3],paddingHorizontal:11,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>พฤ</Text></View>
            <View style={{backgroundColor:dupDayColor[4],paddingHorizontal:15,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>ศ</Text></View>
            <View style={{backgroundColor:dupDayColor[5],paddingHorizontal:15,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>ส</Text></View>
            <View style={{backgroundColor:dupDayColor[6],paddingHorizontal:15,borderTopRightRadius:10,borderBottomEndRadius:10,borderColor:'white',borderWidth:0.5}}><Text style={{color:'white'}}>อา</Text></View>
          </View> 
        )
      }


        const HeaderFlatlistComponent = ()=>{
          var myDateSplit = selectedDate.split("-")
          const myDate = myDateSplit[2]+'/'+myDateSplit[1]+'/'+myDateSplit[0]
          return(
            < >
                
                <View style={{backgroundColor:'white',elevation:2,margin:15,borderRadius:20,padding:15}}>
                    <CalendarPicker
                    width={360}
                    height={360}
                    selectedDayColor="#9E76B4"
                    // todayBackgroundColor="#7fff00"
                    onDateChange={async date => {
                      var localTime = moment(new Date()).format('HH:mm').toString()
                      var localDate = moment(new Date()).format('YYYY-MM-DD').toString()
                      var selectDate = moment(date).format('YYYY-MM-DD').toString()
                      console.log(selectDate);
                      setSelectedDate(selectDate)
                      // await _fetchSessionsAPI(selectDate,localTime,localDate)
                      }}
                    
                    
                  />
              </View>

               
                

                <View style={{alignItems:'center',marginBottom:8}}>     
                 <TouchableOpacity  style={{alignItems:'center',backgroundColor:'white',padding:15,borderRadius:20,elevation:2}} onPress={() => navigation.navigate('TeacherCreateRoom')}>
                
                    <Icon name="plus-circle" size={50}/>
                    <Text >เพิ่มห้องเช็คชื่อ</Text>
                 </TouchableOpacity>
                 </View>
                 <View style={{alignItems:'center',backgroundColor:'#9E76B4',marginHorizontal:16,padding:10,elevation:2,borderRadius:10,marginBottom:5}}>
                 <Text style={{color:'white'}}>วันที่ {myDate} เวลา {localTime}</Text> 

                 {
                   sessionsData.length == 0  ? 
                   <Text style={{color:'white'}}>(ไม่พบรายวิชาเช็คชื่อในวันนี้)</Text>
                   :
                   <></>
                 }
                 </View>      
                      
               
            </>
          )
      }
      

    return(
        <>
            <SafeAreaView style={{flex:1}}>
              
              
                <FlatList
                    data={sessionsData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.uqID}
                    extraData={selectedId}
                    style={{marginTop:10}}
                    ListHeaderComponent={HeaderFlatlistComponent()}
                />
                
                <Modal
                animationType="fade"
                transparent={true}
                visible={isInprogressModalShow}
                // visible={true}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
              >
                <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:2,marginBottom:190}}>
                    <View style={{marginTop:50,alignItems:'center'}}>
                      <Icon name="map-marker" size={70} color="#9E76B4" /> 
                      <Text style={{fontSize:16}}>กำลังอัปเดตสถานที่</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                      <ActivityIndicator size={50} color="#9E76B4" />
                    </View>
                </View>
              </Modal>

              <Modal
                      animationType="fade"
                      transparent={true}
                      visible={isCancelModalShow}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      }}
                  >
                    
                      <View style={{backgroundColor:'white',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:2,marginBottom:190}}>
                          <View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
                             <Icon name="exclamation-circle" size={100} color='red'/>
                          </View>
                          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text  >คุณแน่ใจหรือไม่ว่าต้องการยกเลิก?</Text>
                            <Text  >ชื่อวิชา: {cancelSelectedData.className}</Text>
                            <Text  >รหัสวิชา: {cancelSelectedData.classID}</Text>
                            <Text  >ในวันที่: {moment( cancelSelectedData.date).format('DD/MM/YYYY')}</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-evenly',marginBottom:20}}>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={async () => {
                              console.log(cancelSelectedData);
                              await _cancelSession(cancelSelectedData.date,cancelSelectedData.uqID)
                              setIsCancelModalShow(false)
                            }}
                            >
                              <Text style={{color:'white'}}>ตกลง</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={() => setIsCancelModalShow(false)}
                            >
                              <Text style={{color:'white'}}>ยกเลิก</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                    
                </Modal>

                <Modal
                      animationType="fade"
                      transparent={true}
                      visible={isCancelAllModalShow}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      }}
                  >
                    
                      <View style={{backgroundColor:'white',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:2,marginBottom:190}}>
                          <View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
                             <Icon name="exclamation-circle" size={100} color='red'/>
                          </View>
                          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text  >คุณแน่ใจหรือไม่ว่าต้องการลบห้องเช็คชื่อ?</Text>
                            <Text  >ชื่อวิชา: {cancelSelectedData.className}</Text>
                            <Text  >รหัสวิชา: {cancelSelectedData.classID}</Text>
                            {/* <Text  >วันที่: {cancelSelectedData.date}</Text> */}
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-evenly',marginBottom:20}}>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={async () => {
                              console.log(cancelSelectedData);
                              await _cancelSessionAll(teacherIDState,cancelSelectedData.uqID)
                              setIsCancelAllModalShow(false)
                            }}
                            >
                              <Text style={{color:'white'}}>ตกลง</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={() => setIsCancelAllModalShow(false)}
                            >
                              <Text style={{color:'white'}}>ยกเลิก</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                    
                </Modal>

                <Modal
                      animationType="fade"
                      transparent={true}
                      visible={isChangeLocModalShow}
                      onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      }}
                  >
                    
                      <View style={{backgroundColor:'white',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:2,marginBottom:190}}>
                          <View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
                             <Icon name="exclamation-circle" size={100} color='red'/>
                          </View>
                          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text  >คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนสถานที่?</Text>
                            <Text  >ชื่อวิชา: {selectedChangeLocData.className}</Text>
                            <Text  >รหัสวิชา: {selectedChangeLocData.classID}</Text>
                          </View>
                          <View style={{flexDirection:'row',justifyContent:'space-evenly',marginBottom:20}}>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={async () => {
                              console.log(selectedChangeLocData);
                              await updateWifiLocAPI(selectedChangeLocData.uqID,selectedChangeLocData.teacherID)
                              setIsChangeLocModalShow(false)
                            }}
                            >
                              <Text style={{color:'white'}}>ตกลง</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={{marginBottom:30,backgroundColor:"#9E76B4",padding:8,elevation:2,borderRadius:20,width:80,alignItems:'center'}} 
                            onPress={() => setIsChangeLocModalShow(false)}
                            >
                              <Text style={{color:'white'}}>ยกเลิก</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                    
                </Modal>


               
             
            </SafeAreaView>
        </>
     );

}


const statusButtStyle = (classStatus) => {
  let background = ''
  if(classStatus == -1){
    background = 'orange'
  }
  else if(classStatus == 0)
  {
    background = 'green'
  }
  else if(classStatus == 1)
  {
    background = '#9E76B4'
  }
  else
  {
    background = 'red'
  }
  
  return(
    {
      backgroundColor:background,
      alignSelf:'baseline',
      borderRadius:10,
      padding:10,
      alignSelf:'center',
      marginBottom:10
    }
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius:20,
      elevation:2,
    },
    title: {
      fontSize: 19,
    },
    descrption:{
        fontSize:10
    },
    addStudentWarningButton : {
      backgroundColor:'yellow',
      padding:10,
      borderRadius:10,
      borderColor:'red',
      borderWidth:3
    },
    statText: {
      fontSize:15
    },
    statusText: {
      color:'white'
    }
  });

export default TeacherHome