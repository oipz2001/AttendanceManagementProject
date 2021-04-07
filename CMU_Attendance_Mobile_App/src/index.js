
import React,{useState} from 'react'
import { View, Text,Button,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherHome from './screens/teachers/Home'
import TeacherSessionCreate from './screens/teachers/SessionCreate'
import TeacherSessionStat from './screens/teachers/SessionStat'
import Login from './screens/Login'
import StudentHome from './screens/students/Home'
import StudentFaceCheckIn from './screens/students/faceCheckInCamera'
import Seatmap from './screens/students/Seatmap'
import ScanQR from './screens/students/ScanQR'
import MyQR from './screens/students/MyQR'
import StudentReport from './screens/students/SessionReport'
import SettingLocation from './screens/teachers/settingLoc'
import TeacherSeatmap from './screens/teachers/Seatmap'
import Icon from 'react-native-vector-icons/FontAwesome';
import MyProfile from './screens/Profile'
import CameraAddFaceList from './screens/students/CameraAddFaceList'
import SessionEdit from './screens/teachers/SessionEdit'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const NavigatorScreens = () =>{
  const [user,setUser] = useState(null)

const _hearderProfile = ({...props}) => {
    return(
      <TouchableOpacity {...props}  style={{flexDirection:'row',marginRight:10,justifyContent:'space-around',padding:5}}>
        <Icon name="user-circle" size={30} color="black" />
      </TouchableOpacity>
      
    )
  }

  // const forFade = ({ current }) => ({
  //   cardStyle: {
  //     opacity: current.progress,
  //   },
  // });


  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerTitleAlign:'center'}}   >

        <Stack.Screen name="Login" component={Login} options={{headerTitle:'',headerShown: false}} /> 
        {/* <Stack.Screen name="TeacherHome" component={TeacherHome} options={{headerTitle:'My Sessions',headerRight:_hearderProfile}} /> */}
        {/* <Stack.Screen name="TeacherHome" component={TeacherHome} options={({ navigation, route }) => ({headerRight: () => <Button title="ss" onPress={() => navigation.navigate('MyProfile')} />,})} /> */}
        {/* <Stack.Screen name="TeacherHome" component={TeacherHome} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'ห้องเช็คชื่อ',headerLeft: null})} /> */}
        <Stack.Screen name="TeacherHome" component={TeacherHome} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'ห้องเช็คชื่อ'})} />
        <Stack.Screen name="TeacherCreateRoom" component={TeacherSessionCreate} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'การสร้างห้องเช็คชื่อ'})} />
        <Stack.Screen name="TeacherSettingLocation" component={SettingLocation} options={{headerTitle:'การระบุสถานที่'}} />
        <Stack.Screen name="RoomStat" component={TeacherSessionStat} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'สถิติการเข้าห้อง'})}/>
        <Stack.Screen name="TeacherSeatmap" component={TeacherSeatmap} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'แผนผังที่นั่ง'})}/>
        <Stack.Screen name="TeacherSessionEdit" component={SessionEdit} options={{headerTitle:'แก้ไขรายละเอียด'}} />

        <Stack.Screen name="StudentAddFaceList" component={CameraAddFaceList} options={{headerTitle:'สร้างการระบุตัวตน'}}/>
        {/* <Stack.Screen name="StudentHome" component={StudentHome} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'ห้องเช็คชื่อ',headerLeft: null})}/> */}
        <Stack.Screen name="StudentHome" component={StudentHome} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'ห้องเช็คชื่อ'})}/>
        <Stack.Screen name="StudentFaceCheckIn" component={StudentFaceCheckIn} options={{headerTitle:'การระบุตัวตน'}} />
        <Stack.Screen name="Seatmap" component={Seatmap} options={({navigation,route}) => ({headerTitle:route.params.sessionTitle,headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'การสร้างแผนผังที่นั่ง'})}/>
        <Stack.Screen name="ScanQR" component={ScanQR} options={{headerTitle:'สแกน QR Code'}} />
        <Stack.Screen name="MyQR" component={MyQR} options={{headerTitle:'QR ของฉัน'}}/>
        <Stack.Screen name="SessionReport" component={StudentReport} options={({ navigation, route }) => ({headerRight: () => <_hearderProfile onPress={() => navigation.navigate('Profile')}/>,headerTitle:'การสรุปผล'})}/>

        <Stack.Screen name="Profile" component={MyProfile} options={{headerTitle:'โปรไฟล์'}} />
        
      </Stack.Navigator>
    </NavigationContainer>
    
  )

}

export default NavigatorScreens

// import * as React from 'react';
// import { Button, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// function DetailsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Details!</Text>
//     </View>
//   );
// }

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Icon name="home" size={30} color="black" />
//       <Text>Home screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

// function SettingsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

// const HomeStack = createStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator>
//       <HomeStack.Screen name="Home" component={HomeScreen} />
//       <HomeStack.Screen name="Details" component={DetailsScreen} />
//     </HomeStack.Navigator>
//   );
// }

// const SettingsStack = createStackNavigator();

// function SettingsStackScreen() {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen name="Settings" component={SettingsScreen} />
//       <SettingsStack.Screen name="Details" component={DetailsScreen} />
//     </SettingsStack.Navigator>
//   );
// }

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeStackScreen} />
//         <Tab.Screen name="Settings" component={SettingsStackScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }