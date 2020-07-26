import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import {navigate, route} from './RootNavigation'
import * as firebase from "firebase";
import AsyncStorage from '@react-native-community/async-storage';

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
import ProfileScreen from './Profile';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'
import LogoutButton from './components/LogoutButton'
import ThemeSettingsScreen from './ThemeSettings';

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
      this.setState({reRender: "ok"})
    })
  }
  updateState = () =>{
    console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: "ok"})
    return "TESTTTT"
  }
  onPressLogout(){
    Alert.alert(
    '',
    "Are you sure you want to logout?" ,
    [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => this.onPressLogoutOk()},
    ],
    {cancelable: true},
  );
  }
  onPressLogoutOk(){
    AsyncStorage.removeItem(firebase.auth().currentUser.uid + 'userGender')
    AsyncStorage.removeItem(firebase.auth().currentUser.uid + 'userCountry')
    AsyncStorage.removeItem(firebase.auth().currentUser.uid + 'userName')
    AsyncStorage.removeItem(firebase.auth().currentUser.uid + 'userBio')
    AsyncStorage.removeItem(firebase.auth().currentUser.uid + 'userPhotoCount')
    firebase.auth().signOut().then(function() {
      console.log("LOGOUT SUCCESSFUL")
      navigate("Splash")
    })
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
      <SettingsButton
      text = {"Message Settings"}/>

      <View
      style = {{height: this.width/9}}/>
      <View
      style = {{height: this.width/9}}/>
      <LogoutButton
      onPress = {()=>this.onPressLogout()}/>

      </ScrollView>

    </View>

        );
  }}
