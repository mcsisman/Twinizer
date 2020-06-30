import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import * as firebase from "firebase";

import {Image,
   Text,
   View,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ImageBackground,
   KeyboardAvoidingView,
   TextInput,
   Alert,
   StatusBar,
   Easing,
   Button,
   Animated,
   Platform
  } from 'react-native';

import MessagesScreen from './Messages';
import MainScreen from './Main';
import HistoryScreen from './History';
import CustomHeader from './components/CustomHeader'
import BottomBar from './components/BottomBar'
import ModifiedStatusBar from './components/ModifiedStatusBar'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var ourBlue = 'rgba(77,120,204,1)'

export default class ProfileScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
    }
  }
  static navigationOptions = {
      header: null,
  };
  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Profile"}
      isFilterVisible = {this.state.showFilter}
      title = {global.globalUsername}>
      </CustomHeader>



      <BottomBar
        whichScreen = {"Profile"}
        msgOnPress = {()=> navigate("Messages")}
        homeOnPress = {()=> navigate("Main")}
        historyOnPress = {()=> navigate("History")}/>
    </View>

        );
  }}
