import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, StackActions, CommonActions, navigation } from '@react-navigation/native';
import {navigate, route} from './RootNavigation'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal'
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


import ProfileScreen from './Profile';
import AboutScreen from './About';
import ThemeSettingsScreen from './ThemeSettings';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import SettingsButton from '../Components/Settings/Common/SettingsButton'
import LogoutButton from '../Components/Settings/Common/LogoutButton'



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
      reRender: "o"
    }
  }
  static navigationOptions = {
      header: null,
  };
  componentDidMount(){
    console.log("SETTINGS COMPONENT DID MOUNT")
    this._subscribe = this.props.navigation.addListener('focus', () => {
      console.log("subscribe")
      global.fromChat = false
      this.setState({reRender: "ok"})
    })
  }
  updateState = () =>{
    console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: "ok"})
    return "TESTTTT"
  }
  async onPressLogout(){
    Alert.alert(
    '',
    "Are you sure you want to logout?" ,
    [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: async () => await this.onPressLogoutOk()},
    ],
    {cancelable: true},
  );
  }

  async onPressLogoutOk(){
    OneSignal.clearOneSignalNotifications();

    AsyncStorage.removeItem(auth().currentUser.uid + 'userGender')
    AsyncStorage.removeItem(auth().currentUser.uid + 'userCountry')
    AsyncStorage.removeItem(auth().currentUser.uid + 'userName')
    AsyncStorage.removeItem(auth().currentUser.uid + 'userBio')
    AsyncStorage.removeItem(auth().currentUser.uid + 'userPhotoCount')
    AsyncStorage.removeItem(auth().currentUser.uid + 'playerId')
    await database().ref('/PlayerIds/').update({
      [auth().currentUser.uid]: "x"
    });
    var randO = Math.random()
    await database().ref('/Users/'+auth().currentUser.uid + '/i').update({
      o: randO
    }).then( async () => {
      console.log("o güncellendi")
      await auth().signOut().then(function() {
        console.log("LOGOUT SUCCESSFUL")
        //navigate("Splash")
      })
    });
    this.props.navigation.dispatch(StackActions.popToTop());
  }
  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)" ,width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Settings"}
      isFilterVisible = {this.state.showFilter}
      title = "Settings">
      </CustomHeader>

      <ScrollView
      style = {{height: this.height-this.width/7 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> navigate("Profile")}
      text = {"Edit Profile"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> navigate("FavoriteUsers")}
      text = {"Favorite Users"}/>
      <SettingsButton
      onPress = {()=> navigate("BlockedUsers")}
      text = {"Blocked Users"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> this.props.navigation.navigate("ThemeSettings", {update: this.updateState})}
      text = {"Theme Settings"}/>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> this.props.navigation.navigate("About", {update: this.updateState})}
      text = {"About"}/>
      <View
      style = {{height: this.width/9}}/>
      <LogoutButton
      onPress = {()=>this.onPressLogout()}/>

      </ScrollView>

    </View>

        );
  }}
