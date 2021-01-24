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
import language from '../Utils/Languages/lang.json'


if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var lang = language[global.lang]
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
    var lang = language[global.lang]
    Alert.alert(
    '',
    lang.LogoutSure ,
    [
      {
        text: lang.NO,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: lang.YES, onPress: async () => await this.onPressLogoutOk()},
    ],
    {cancelable: true},
  );
  }

  async onPressLogoutOk(){
    var lang = language[global.lang]
    try{
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
        })
      });
      this.props.navigation.dispatch(StackActions.popToTop());
      Alert.alert('',lang.LogOutSuccess);
    } catch(error) {
      console.log(error)
      Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
    }
  }
  render(){
    var lang = language[global.lang]
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)" ,width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Settings"}
      isFilterVisible = {this.state.showFilter}
      title = {lang.Settings}>
      </CustomHeader>

      <ScrollView
      style = {{height: this.height-this.width/7 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> navigate("Profile")}
      text = {lang.EditProfile}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> navigate("FavoriteUsers")}
      noBottomBorder = {true}
      text = {lang.FavoriteUsers}/>
      <SettingsButton
      onPress = {()=> navigate("BlockedUsers")}
      text = {lang.BlockedUsers}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> this.props.navigation.navigate("ThemeSettings", {update: this.updateState})}
      text = {lang.ThemeSettings}/>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> this.props.navigation.navigate("About", {update: this.updateState})}
      text = {lang.About}/>
      <View
      style = {{height: this.width/9}}/>
      <LogoutButton
      text = {lang.LogOut}
      onPress = {()=>this.onPressLogout()}/>
      <View
      style = {{height: this.width/9}}/>

      </ScrollView>

    </View>

        );
  }}
