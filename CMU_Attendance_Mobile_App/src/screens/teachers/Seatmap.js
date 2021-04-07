import React,{useEffect, useState} from 'react'
import { Button, View,Text,StyleSheet,FlatList,StatusBar,TouchableOpacity,Image,Modal,ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView } from 'react-native-gesture-handler';

const TeacherSeatmap = ({route}) => {
    const uqID = route.params.uqID
    const selectedDate = route.params.selectedDate

    const [showSeatmapModal,setShowSeatmapModal] = useState(false)
    const [modalData,setModalData] = useState('')

    const [teacherIDState,setTeacherIDState] = useState('')

    const [seatmapGraphArray,setSeatmapGraphArray] = useState([])

    const [studentPhotoURL,setStudentPhotoURL] = useState('')
    const [isSeatmapFound,setIsSeatmapFound] = useState(null)


    
        useEffect(() => {
        if(uqID != null && teacherIDState != null){
            console.log(uqID,teacherIDState,selectedDate);
          const subscriber = firestore()
            .collection('Classroom')
            .doc(teacherIDState)
            .collection('sessions')
            .doc(uqID)
            .onSnapshot(documentSnapshot => {
                if(documentSnapshot.data() != undefined)
                {
                    let myGraphsList = documentSnapshot.data().seatmap[selectedDate].graphs
                    var seatmapGraphsList = get2DArrayGraphs(myGraphsList)
                   
                    
                    if(seatmapGraphsList.length != 0){
                        seatmapGraphsList.sort(function mySort(a,b){
                            return -(a.sumMax - b.sumMax)
                        })
                        seatmapGraphsList.forEach((element,idx) => {
                            const graphKey = Object.keys(element)[0]
                            element[`graph${idx}`] = element[graphKey]
                            if(graphKey != `graph${idx}`){
                            delete element[graphKey]
                            }
                        });
                        console.log(seatmapGraphsList);
                        setSeatmapGraphArray(seatmapGraphsList)

                        setIsSeatmapFound(true)
                    }
                    else{
                        setIsSeatmapFound(false)
                    }
                    
                }
                else
                {
                    console.log('No seat map found');
                }
            });
          // Stop listening for updates when no longer required
          return () => subscriber();
        }
        }, [uqID,teacherIDState]);
    

    
    const _pressSeatmap = async (k,i,j) =>{
        const studentID = seatmapGraphArray[k][`graph${k}`][i][j]
        // const url = await storage().ref(studentID).getDownloadURL();
        const url = await storage().ref(studentID).getDownloadURL()
        .then(
            function onResolve(foundURL) {
                setStudentPhotoURL(foundURL)
            }, 
            function onReject(error){ 
                const url_notFound = "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
                setStudentPhotoURL(url_notFound)
            });

        const studentRef = firestore().collection('Students').doc(studentID).get()
        const studentData = (await studentRef).data()
        const studentUqID = studentData.uqID
        console.log(studentUqID);
        setModalData({
            studentID:studentID,
            studentUqID:studentUqID
        })
        setShowSeatmapModal(!showSeatmapModal)
    }

    useEffect(() => {
        _retrieveUserData()
    },[])

    

    const _retrieveUserData = async () => {
        // const  teacherID = await AsyncStorage.getItem('uniqueIDTeacher');
        const  teacherID = await AsyncStorage.getItem('name');
        setTeacherIDState(teacherID)
  
      }
  

        // <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',flex:1}}>
      
    const get2DArrayGraphs = (graphs) => {

        var myGraphs = []
        for(let i=0;i<graphs.length;i++){
            var seatmapEachArr = graphs[i][`arr${i}`]
            var delX = 0
            var delY = 0
            seatmapEachArr.forEach(coodinate => {
                let absX = Math.abs(coodinate.x)
                let absY = Math.abs(coodinate.y)
                if(absX > delX){
                    delX = absX
                }
                if(absY > delY){
                    delY = absY
                }


            });


                var arr = []
                let rowSize = (delY * 2)+1
                let columnSize = (delX * 2)+1
                var num =  delY
                for(let i=0;i<rowSize;i++){
                    let myArr = []
                    for(let j=0;j<columnSize;j++){
                        let coo_X = j-delX
                        let coo_Y = i+num
                        let matchObj = seatmapEachArr.find((x => x.x == coo_X && x.y == coo_Y ))
                        if(matchObj != undefined){
                            myArr.push(matchObj.node)
                        }else{
                            myArr.push(' ')
                        }
                        
                    }
                    num-=2
                    arr.push(myArr)
                    
                }
                let maxDif = 0
                if(delX > delY ){
                    maxDif = delX
                }else{
                    maxDif = delY
                }
                myGraphs.push({[`graph${i}`] : arr , sumMax : maxDif  }) 
        

        }

        return myGraphs
    }

    
    
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        
        {
            isSeatmapFound == null ?
            <ActivityIndicator size={50} color="#9E76B4" />
        :
            isSeatmapFound == true ?
            (<ScrollView showsVerticalScrollIndicator={false}>
            
             
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSeatmapModal}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',flex:1,marginLeft:20,marginRight:20,marginTop:220,borderRadius:20,elevation:8,marginBottom:190}}>
                    
                    <View style={{flex:5,justifyContent:'space-evenly',alignItems:'center',elevation:2}}>
                        <Image
                        style={{width:200,height:200}}
                        source={{
                        uri: studentPhotoURL
                        }}
                        />
                        <View>
                            
                        <Text>รหัสนักศึกษา: {modalData.studentUqID}</Text> 
                        <Text>ชื่อ: {modalData.studentID}</Text> 
                        </View>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <TouchableOpacity  
                        style={{backgroundColor:'#9E76B4',paddingHorizontal:20,paddingVertical:6,borderRadius:20,elevation:2,marginTop:-25}}
                        onPress={() => setShowSeatmapModal(!showSeatmapModal)}>
                            <Text style={{color:'white'}}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                    

                </View>
            </Modal>
           
            {
                seatmapGraphArray.map((seatmapArray,k) => (
            <View style={{backgroundColor:'white',elevation:1,borderRadius:25,padding:40,justifyContent:'space-between',alignItems:'center',marginBottom:15,marginTop:15,width:360}} key={k}>
                <View style={{marginBottom:30}}>
                <Text style={{fontSize:17,fontWeight:'bold'}}>แผนผังที่ {k+1}</Text>
                </View>
                {seatmapArray[`graph${k}`].map((row,i) => (
                    <View style={{flexDirection:'row',justifyContent:'space-between'}} key={i}>
                        {row.map((column,j) => {
                            return (column[0] != ' ') ? 
                            <TouchableOpacity key={j} onPress={() => _pressSeatmap(k,i,j)} style={seatmapButten(seatmapArray.sumMax,'green')}>
                                <Text style={{color:'white'}}>{column.split(" ")[0][0]+column.split(" ")[1][0]}</Text>
                            </TouchableOpacity> 
                            :

                            <TouchableOpacity key={j} style={seatmapButten(seatmapArray.sumMax,'#9E76B4')}>
                                <Text style={{color:'white'}}>{column[0]}</Text>
                            </TouchableOpacity> 

                        }
                            
                            
                        )}
                    </View> 
                ))}
            
           

            
                
            </View>
                ))
        }
        </ScrollView>)
        :
            <View style={{backgroundColor:'white',padding:80,borderRadius:20,elevation:2,backgroundColor:'#9E76B4'}}>
                <Text style={{fontSize:18,color:'white'}}>ไม่พบแผนผังที่นั่ง</Text>
            </View>
        }
        

        </View>
           
            
           
        
    )

}

const seatmapButten = (sumMax,color) => {

    if(sumMax == 0){
        sumMax = 1
    }
    else if(sumMax == 1){
        sumMax = 2
    }
    
    return {
        backgroundColor:color,
        width:110/sumMax,
        height:110/sumMax,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        elevation:1,
        margin:5
    }
      
}


const styles = StyleSheet.create({
    presentNode : {
        backgroundColor:'green',
        width:35,
        height:35,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        elevation:10,
        margin:5
    },
    emptyNode : {
        backgroundColor:'#9E76B4',
        width:35,
        height:35,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        elevation:10,
        margin:5
    }
})



export default TeacherSeatmap