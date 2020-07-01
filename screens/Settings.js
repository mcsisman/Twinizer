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
   Platform,
   ScrollView
  } from 'react-native';

import MessagesScreen from './Messages';
import MainScreen from './Main';
import HistoryScreen from './History';
import CustomHeader from './components/CustomHeader'
import BottomBar from './components/BottomBar'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}


export default class SettingsScreen extends Component<{}>{
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
      whichScreen = {"Settings"}
      isFilterVisible = {this.state.showFilter}
      title = "Settings">
      </CustomHeader>

      <ScrollView
      style = {{height: this.height-this.width/7 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      text = {"Edit Profile"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      text = {"Favorite Users"}/>
      <SettingsButton
      text = {"Blocked Users"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      text = {"Theme Settings"}/>
      <SettingsButton
      text = {"Message Settings"}/>


      </ScrollView>


      <BottomBar
        whichScreen = {"Settings"}
        msgOnPress = {()=> navigate("Messages")}
        homeOnPress = {()=> navigate("Main")}
        historyOnPress = {()=> navigate("History")}/>
    </View>

        );
  }}
