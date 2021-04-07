import React,{useEffect, useState} from 'react'
import { Button, View,Text,Image,StyleSheet } from 'react-native'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';




const InClassRoom = ({route,navigation}) => {
    const classUqID = route.params.uqID
    const teacherID = route.params.teacherID 
    const circleSize = 40
    const arrowSize = 40
    const date = route.params.date
    useEffect(() => {
        console.log(classUqID + ' ' +teacherID+ ' '+ date);

    })

    return(
        <>
                
                <ScrollView style={{flex:1}}>
                <View style={{marginTop:25,flex:1}} >
                    <Text style={{alignSelf:'center',fontSize:20}} >เมนู</Text>
                
                    <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                        
                        <TouchableOpacity style={styles.QR} onPress={() => navigation.navigate('ScanQR',{uqID:classUqID,teacherID:teacherID,date:date})}>
                            <Image source={require('../../assets/vectors/qr-code_scan.png')} style={{width:50,height:50}} />
                            <Text style={{marginTop:10}}>สแกน QR</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.QR} onPress={() => navigation.navigate('MyQR',{sessionID:route.params.sessionID,sessionTitle:route.params.sessionTitle})}>
                            <Image source={require('../../assets/vectors/qr-code.png')} style={{width:50,height:50}} />
                            <Text style={{marginTop:10}}>QR ของฉัน</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>

                {/* <View>
                    <Text style={{alignSelf:'center',fontSize:25}} >Session Report</Text>
                    <View style={{alignSelf:'center',marginTop:15}}>
                        <TouchableOpacity style={styles.QR} onPress={() => navigation.navigate('SessionReport',{sessionID:route.params.sessionID,sessionTitle:route.params.sessionTitle})}>
                            <Image source={require('../../assets/vectors/report.png')} style={{width:50,height:50}} />
                            <Text style={{marginTop:10}}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{backgroundColor:'#9E76B4',flex:2,margin:30,borderRadius:25,paddingBottom:20}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{color:'white',fontSize:19,marginTop:15,textDecorationLine: 'underline',fontWeight: 'bold'}}>การสร้างแผนผังที่นั่ง</Text>
                        <Text style={{color:'white',fontSize:15,fontStyle:'italic'}}>- สำหรับผู้สแกน -</Text>
                        <View>
                        <Text style={{color:'white'}}>1.หากมีคนด้านหน้าให้สแกนด้านหน้า</Text>
                        <Text style={{color:'white'}}>2.หากไม่มีคนด้านหน้าให้สแกนด้านขวา</Text>
                        <Text style={{color:'white'}}>3.นอกเหนือจากนั้นไม่ต้องสแกน</Text>
                        </View>
                        <Text style={{color:'white',fontSize:15,fontStyle:'italic'}}>- สำหรับผู้ถูกสแกน -</Text>
                        <Text style={{color:'white'}}>ให้กดปุ่ม QR ของฉันเพื่อถูกสแกน</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-evenly',padding:18,marginBottom:-19}}>
                        <Icon name="circle" size={circleSize} color='white'/>
                        <Icon name="arrow-right" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        <Icon name="arrow-right" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                        <View>
                        <Icon name="arrow-up" size={arrowSize} color='white'/>
                        <Icon name="circle" size={circleSize} color='white'/>
                        </View>
                    </View >
                    
                    
                </View>
                </ScrollView>

        </>
            
        
        
        
        

    );

}


const styles = StyleSheet.create({
    QR:{
        backgroundColor:'white',
        padding:40,elevation:2,
        borderRadius:20,
        alignItems:'center',
        width:170,
        height:170
    },
    report:{
        backgroundColor:'white',
        padding:50,elevation:2,
        borderRadius:20,
        alignItems:'center'
    }
  });

export default InClassRoom