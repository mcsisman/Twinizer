import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from "firebase";
import themes from './Themes';
import {navigate, route} from './RootNavigation'

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
import SettingsScreen from './Settings';
import HistoryScreen from './History';
import ProfileScreen from './Profile';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'
import LogoutButton from './components/LogoutButton'
import ThemeSample from './components/ThemeSample'
import OvalButton from './components/OvalButton'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

export default class ThemeSettingsScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {

    }
  }
  async componentDidMount(){
    console.log("THEME SETTINGS COMPONENT DID MOUNT")
    await this.getSelectedTheme()
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log("subscribe")
      this.setState({reRender: "ok"})
    })

  }
  static navigationOptions = {
      header: null,
  };
  onPress(selectedIndex){
    this.setState({
      selected1: selectedIndex == 1 ? true : false,
      selected2: selectedIndex == 2 ? true : false,
      selected3: selectedIndex == 3 ? true : false,
      selected4: selectedIndex == 4 ? true : false,
    })
  }
  async getSelectedTheme(){
    var themeColor = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'theme')
    var mode = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'mode')

    if(themeColor == null || themeColor == undefined){
      themeColor = "Original"
    }
    if(mode == null || mode == undefined){
      mode = "true"
    }
    if(mode == "true"){
      mode = true
    }
    else{
      mode = false
    }
    if(themeColor == "Original"){
      this.setState({ selected1: true, selected2: false, selected3: false, selected4: false, tickVisible: mode})
    }
    if(themeColor == "Blue"){
      this.setState({ selected1: false, selected2: false, selected3: true, selected4: false, tickVisible: mode})
    }
    if(themeColor == "Green"){
      this.setState({ selected1: false, selected2: false, selected3: false, selected4: true, tickVisible: mode})
    }
    if(themeColor == "Yellow"){
      this.setState({ selected1: false, selected2: true, selected3: false, selected4: false, tickVisible: mode})
    }

  }
  apply(){
    var mode;
    var themeColor;
    if(this.state.tickVisible){
      global.isDarkMode = true
      mode = "true"
    }
    else{
      global.isDarkMode = false
      mode = "false"
    }
    if(this.state.selected1){
      themeColor = "Original"
    }
    if(this.state.selected2){
      themeColor = "Yellow"
    }
    if(this.state.selected3){
      themeColor = "Blue"
    }
    if(this.state.selected4){
      themeColor = "Green"
    }

    global.themeColor = themes.getTheme(themeColor)
    global.themeForImages = themes.getThemeForImages(themeColor)
    this.setState({reRender: "ok"})
    this.props.route.params.update()
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'theme', themeColor)
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'mode', mode)
  }
  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)",}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Theme Settings"}
      onPress = {()=> this.props.navigation.navigate("Settings")}
      isFilterVisible = {false}
      title = "Theme Settings">
      </CustomHeader>

      <View
      style = {{height: this.height - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, alignItems:"center"}}>

      <View style = {{ borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.7)', height: this.width/7, width: this.width, alignItems: "center", justifyContent: "center"}}>

      <Text style = {{fontSize: 20*this.width/360, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(100,100,100,1)",}}>
      Themes
      </Text>
      </View>

      <View
      style = {{height: this.width/14}}/>

      <View style = {{ height: this.width*0.8, width: this.width*8/10, alignItems: "flex-start", justifyContent: "center"}}>

      <ThemeSample
      selected = {this.state.selected1}
      disabled = {this.state.selected1 ? true: false}
      onPress = {()=> this.onPress(1)}
      borderRightWidth = {0.5}
      borderBottomWidth = {0.5}
      borderTopLeftRadius = {24}
      color = {"rgba(241,51,18,1)"}
      whichTheme = {"Original"}
      bottom = {this.width*0.4}
      right = {this.width*0.4}/>

      <ThemeSample
      selected = {this.state.selected2}
      disabled = {this.state.selected2 ? true: false}
      onPress = {()=> this.onPress(2)}
      borderLeftWidth = {0.5}
      borderTopWidth = {0.5}
      borderBottomRightRadius = {24}
      color = {"rgba(228,186,51,1)"}
      whichTheme = {"Yellow"}
      bottom = {0}
      right = {0}/>

      <ThemeSample
      selected = {this.state.selected3}
      disabled = {this.state.selected3 ? true: false}
      onPress = {()=> this.onPress(3)}
      borderLeftWidth = {0.5}
      borderBottomWidth = {0.5}
      borderTopRightRadius = {24}
      color = {"rgba(77,120,204,1)"}
      whichTheme = {"Blue"}
      bottom = {this.width*0.4}
      right = {0}/>


      <ThemeSample
      selected = {this.state.selected4}
      disabled = {this.state.selected4 ? true: false}
      onPress = {()=> this.onPress(4)}
      borderTopWidth = {0.5}
      borderRightWidth = {0.5}
      borderBottomLeftRadius = {24}
      color = {"rgba(115,201,144,1)"}
      whichTheme = {"Green"}
      bottom = {0}
      right = {this.width*0.4}/>
      </View>

      <TouchableOpacity
      activeOpacity = {1}
      onPress = {()=>  this.setState({tickVisible: this.state.tickVisible ? false : true})}
      style={{ bottom: this.width*30/100, position:"absolute", borderTopWidth:1, borderBottomWidth:1, borderColor: 'rgba(128,128,128,0.3)', backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)",
      flexDirection: "row", justifyContent: 'center', width: this.width, height: this.width/8}}>
      <View
      style={{justifyContent: 'center', position: 'absolute', width: this.width*7/8, height: this.width/8, bottom: 0, left: 0}}>
      <Text
        style = {{color: global.isDarkMode ? global.darkModeColors[3] : 'rgba(88,88,88,1)', fontSize: 18*this.width/360, left: this.width/20, position: "absolute" }}>
        Enable Dark Mode
      </Text>
      </View>

      <View
      style={{opacity: this.state.tickVisible ? 1 : 0, justifyContent: 'center', alignItems: "flex-start", position: 'absolute', width: this.width/10, height: this.width/10, bottom: this.width/80, right: this.width/80}}>
      <Image source={{uri: 'tick' + global.themeForImages}}
      style={{  width: "60%", height: "60%"}}/>
      </View>
      </TouchableOpacity>


      <OvalButton
      opacity = {1}
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}
      bottom = {this.width*10/100}
      title = "Apply"
      textColor = {global.themeColor}
      onPress = { ()=> this.apply()}
      borderColor = {global.themeColor}/>
      </View>

    </View>

        );
  }}
