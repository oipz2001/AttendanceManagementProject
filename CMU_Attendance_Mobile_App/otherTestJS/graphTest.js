
import React, { Component } from 'react';
import { SafeAreaView ,Text,View} from 'react-native';
import { WebView } from 'react-native-webview';



const Web = () => {
    return(
        <WebView source={{ uri: 'https://reactnative.dev/' }} />
        
    )
}





export default  Web


