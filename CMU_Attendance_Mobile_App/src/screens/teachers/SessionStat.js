import React,{useEffect, useState} from 'react'
import { Button, View,Text,Dimensions,FlatList,TouchableOpacity,StyleSheet,StatusBar,Image,ActivityIndicator,Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import AsyncStorage from '@react-native-community/async-storage'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
  const URL = require('../../config/endpointConfig')
  const myEndpointURL =  URL.myEndpointTeacher


  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
const TeacherSessionStat = ({route}) => {
    const classUqID = route.params.uqID
    const classSelectedDate = route.params.selectedDate
    const [selectedId, setSelectedId] = useState(null);
    const [teacherIDState,setTeacherIDState] = useState(null)
    const [classStatData,setClassStatData] = useState({})
    const [studentStatList,setStudentStatList] = useState([])
    const [isShowStProfile,setIsShowStProfile] = useState(false)
    const [selectedStudent,setSelectedStudent] = useState(null)

    const [modalData,setModalData] = useState({})

    const [chartData,setChartData] = useState(
      [
        {
          name: "เช็คชื่อแล้ว",
          population: 0,
          color: "green",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        },
        {
          name: "ยังไม่ได้เช็คชื่อ",
          population: 0,
          color: "#F00",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        }
      ]
    );

    useEffect(() => {
      if(teacherIDState != null && classUqID != undefined && classSelectedDate != undefined){
        const subscriber = firestore()
          .collection('Classroom')
          .doc(teacherIDState)
          .collection('sessions')
          .doc(classUqID)
          .onSnapshot(documentSnapshot => {
            const classStudentList = documentSnapshot.data().statistics[classSelectedDate]
            const className = documentSnapshot.data().name
            const classID = documentSnapshot.data().id
            let totalStudent = classStudentList.length
            let absent = classStudentList.filter(x => x.isChecked == false).length
            let present = totalStudent - absent

            setClassStatData({
              classId : classID ,
              className : className
            })

            setStudentStatList(classStudentList)
            setChartData([
              {
                name: "เช็คชื่อแล้ว",
                population: present,
                color: "green",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              },
              {
                name: "ยังไม่ได้เช็คชื่อ",
                population: absent,
                color: "#F00",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              }
            ])
              
          });
        // Stop listening for updates when no longer required
        return () => subscriber();
      }
      
      }, [teacherIDState,classUqID]);

      useEffect(() => {

        const retrieveStudent = async (selectedStudent) => {
          
          const student = await firestore().collection('Students').doc(selectedStudent).get();
          const studentData = student.data()
          console.log(studentData.fullName);
          const name = studentData.fullName
          const uqID = studentData.uqID
          let mail = studentData.mail
          if(mail == undefined){
            mail = '(ไม่ได้ระบุ)'
          }

          storage().ref(selectedStudent).getDownloadURL().then(
          function onResolve(foundURL) {
            setModalData({
              studentUqID : uqID,
              studentName : name,
              studentMail : mail,
              studentImage : foundURL
            })
            setIsShowStProfile(true)
          }, 
          function onReject(error){ 
              const url_notFound = "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
              setModalData({
                studentUqID : uqID,
                studentName : name,
                studentMail : mail,
                studentImage : url_notFound
              })
              setIsShowStProfile(true)
          });
          
        }

        if(selectedStudent != null){
          retrieveStudent(selectedStudent)
          
        }

        
      },[selectedStudent])
      

    

  //   useEffect(() => {
      
  //     if(teacherIDState != null){
  //     console.log(classUqID,classSelectedDate,teacherIDState);
  //     classStatAPI(classUqID,classSelectedDate,teacherIDState)
  //   }

  // },[teacherIDState])

  useEffect(() => {
    _retrieveUserData()
  },[])

  const _retrieveUserData = async () => {
    // const  teacherID = await AsyncStorage.getItem('uniqueIDTeacher');
    const  teacherID = await AsyncStorage.getItem('name');
    setTeacherIDState(teacherID)

  }

  const classStatAPI = async (uqID,selectedDate,teacherID) => {

    await fetch(myEndpointURL+'/getClassStat?uqID='+uqID+'&selectedDate='+selectedDate+'&teacherID='+teacherID)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setClassStatData(data)
            setStudentStatList(data.statistics)

            var myStatChartData = chartData
            myStatChartData[0].population = data.present
            myStatChartData[1].population = data.absent

            setChartData(myStatChartData)

        })
        .catch((error) => {
            console.error(error);
        });
  }
  
 


  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#c0c0c0" : "#fffafa";
    return (
      <Item
        item={item}
        onPress={() => {
            console.log(item.id);
            setSelectedId(item.id)
           
        }}
      />
    );
  };

  
    
    
      
      
      const Item = ({ item, onPress, style }) => {
        // let studentImage = ''

        

        // storage().ref(item.studentID).getDownloadURL().then(
        //   function onResolve(foundURL) {
        //     // studentImage = foundURL
        //     // console.log(foundURL);
        //     console.log(foundURL);
        //   }, 
        //   function onReject(error){ 
        //       const url_notFound = "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
        //       // studentImage = url_notFound
        //       console.log(url_notFound);
        //   });
        
      
        return(
        <TouchableOpacity onPress={() => {
          setSelectedStudent( item.studentName)
          }} 
          style={[styles.item, style]}>
          <View >
              <View style={{alignItems:'center'}}>
                {/* <Image
                          style={{width:100,height:100,marginVertical:15}}
                          source={{
                          uri: "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
                          }}
                /> */}
                <Text style={styles.id}>{item.studentUqID}</Text>
                <Text style={styles.name}>{item.studentName}</Text>
              </View>
              <View style={{flexDirection:'row',marginTop:7,justifyContent:'center'}}>
                {item.isChecked ?
                <View style={{flexDirection:'row'}}>
                <Image source={require('../../assets/vectors/check.png')} style={{width:25,height:25,marginRight:7}} />
                <Text>เช็คชื่อแล้วเมื่อ {item.timestamp}</Text>
                </View>
                :
                <View style={{flexDirection:'row'}}>  
                  <Image source={require('../../assets/vectors/close.png')} style={{width:20,height:20,marginRight:7}} />
                  <Text>ยังไม่ได้เช็คชื่อ</Text>
                </View>
                }

                
                
              </View>
          </View>
        </TouchableOpacity>
        
        )
      };

    const ListHeaderComponent = () => {
      const myDate = classSelectedDate.split('-')[2]+'/'+classSelectedDate.split('-')[1]+'/'+classSelectedDate.split('-')[0]
        return(
            <View style={{alignItems:'center',marginTop:15,}}>
              
                <View style={{backgroundColor:'white',alignItems:'center',padding:20,justifyContent:'center',elevation:2,borderRadius:10,width:370,backgroundColor:'#9E76B4'}}>
                  <Text style={{fontSize:20,color:'white'}}>กราฟแสดงสถิติการเข้าห้อง</Text>
                  <Text style={styles.classDetailText}>รหัสวิชา: {classStatData.classId}</Text>
                  <Text style={styles.classDetailText}>ชื่อวิชา: {classStatData.className}</Text>
                  <Text style={styles.classDetailText}>วันเวลา: {myDate}</Text>
                </View>
               <PieChart
                    data={chartData}
                    width={370}
                    height={250}
                    chartConfig={chartConfig}
                    accessor="population"
                    paddingLeft="15"
                    style={{ borderRadius:20,elevation:2,backgroundColor:"white",padding:5,marginTop:10}}
                    absolute={true}
                />
            

            <View style={{backgroundColor:'white',alignSelf:'center',padding:10,justifyContent:'center',elevation:2,borderRadius:10,marginTop:10,backgroundColor:'#9E76B4'}}>
                <Text style={{fontSize:20,color:'white'}}>รายชื่อนักศึกษา</Text>
            </View>
            
            </View>
        )
    }

      
      
     
    return(
        <>
        
                
                <SafeAreaView style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:10}}>
                  <View style={{width:400}}>
                    <FlatList
                      data={studentStatList}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.studentID}
                      extraData={selectedId}
                      ListHeaderComponent={ListHeaderComponent()}
                    />
                  </View>
                
                <Modal
                animationType="fade"
                transparent={true}
                visible={isShowStProfile}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:8,marginBottom:190}}>
                    {/* <View style={{flex:1,justifyContent:'center'}}>
                        <TouchableOpacity  onPress={() => setIsShowStProfile(!isShowStProfile)}>
                            <Image source={require('../../assets/vectors/close.png')} style={{width:30,height:30}} />
                        </TouchableOpacity>
                    </View>
                     */}
                    <View style={{flex:4,justifyContent:'space-evenly',alignItems:'center',marginTop:40}}>
                        <Image
                        style={{width:200,height:200}}
                        source={{
                        uri: modalData.studentImage
                        }}
                        />
                        <View style={{marginTop:10}}>
                          <Text>รหัสนักศึกษา: {modalData.studentUqID}</Text> 
                          <Text>ชื่อ: {modalData.studentName}</Text> 
                          <Text>อีเมลล์: {modalData.studentMail}</Text> 
                        </View>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <TouchableOpacity  
                        style={{backgroundColor:'#9E76B4',paddingHorizontal:20,paddingVertical:6,borderRadius:20,elevation:2}}
                        onPress={() => setIsShowStProfile(!isShowStProfile)}>
                            <Text style={{color:'white'}}>ปิด</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
                
                

                
                </SafeAreaView>

        </>
            
        
        
        
        

    );

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
      backgroundColor:'white'
    },
    name: {
      fontSize: 17,
    },
    id:{
      fontSize: 19 
    },
    classDetailText:{
      fontSize: 18,
      color:'white'
    }
  });

export default TeacherSessionStat