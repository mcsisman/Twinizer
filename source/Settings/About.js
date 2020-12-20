import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import {navigate, route} from './RootNavigation'
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

import licences from './Licences';
import LibraryLicencesScreen from './LibraryLicences';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import SettingsButton from '../Components/Settings/Common/SettingsButton'


if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

export default class AboutScreen extends Component<{}>{
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
    console.log("ABOUT COMPONENT DID MOUNT")
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

  goLicences(){
    global.licences = licences.licences
    this.props.navigation.navigate("LibraryLicences")
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)" ,width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"About"}
      isFilterVisible = {this.state.showFilter}
      onPress = {()=> this.props.navigation.navigate("Settings")}
      title = "About Twinizer">
      </CustomHeader>

      <ScrollView
      style = {{height: this.height-this.width/7 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> console.log("privacy")}
      text = {"Privacy Policy"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> console.log("Terms")}
      text = {"Terms of Use"}/>

      <View
      style = {{height: this.width/9}}/>
      <SettingsButton
      onPress = {()=> this.goLicences()}
      text = {"Licences"}/>

      </ScrollView>

    </View>

        );
  }}
