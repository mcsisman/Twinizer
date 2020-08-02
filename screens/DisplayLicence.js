import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import RNFS from 'react-native-fs'
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
import licences from './Licences';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'
import LogoutButton from './components/LogoutButton'
import ThemeSettingsScreen from './ThemeSettings';
import LibraryLicencesScreen from './LibraryLicences';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

export default class DisplayLicenceScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      reRender: "o",
      text: ""
    }
  }
  static navigationOptions = {
      header: null,
  };
  componentDidMount(){
    console.log("ABOUT COMPONENT DID MOUNT")
    this._subscribe = this.props.navigation.addListener('focus', () => {
      console.log("subscribe")
      this.setState({text: licences.licence})
      this.setState({reRender: "ok"})
    })
  }
  updateState = () =>{
    console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: "ok"})
    return "TESTTTT"
  }

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)" ,width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"DisplayLicence"}
      isFilterVisible = {this.state.showFilter}
      onPress = {()=> this.props.navigation.navigate("LibraryLicences")}
      title = {"Licence"}>
      </CustomHeader>

      <ScrollView
      style = {{height: this.height-this.width/7 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: this.width/25}}/>

      <View
      style = {{ alignItems: "center", height: this.width/12}}>
      <Text
        style = {{fontSize: 15, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        {global.selectedLicence.replace('_','/')}
      </Text>
      </View>

      <Text
        style = {{fontSize: 15, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        {this.state.text}
      </Text>

      </ScrollView>

    </View>

        );
  }}
