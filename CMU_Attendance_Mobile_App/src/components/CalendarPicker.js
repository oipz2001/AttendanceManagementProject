import React,{useState} from 'react'
import { View,Text,Button,TouchableHighlight,SafeAreaView } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';




const CalendarPicker = ({...props}) => {

    return(
        
        <SafeAreaView>
            <View>
                <Calendar {...props}  />
            </View>
        
        </SafeAreaView>
        
        // <CalendarList/>
        
        

    );

}

export default CalendarPicker