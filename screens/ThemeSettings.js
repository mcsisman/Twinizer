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
import ProfileScreen from './Profile';
import CustomHeader from './components/CustomHeader'
import BottomBar from './components/BottomBar'
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
  apply(){

  }
  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Theme Settings"}
      onPress = {()=> this.props.navigation.goBack()}
      isFilterVisible = {false}
      title = "Theme Settings">
      </CustomHeader>

      <View
      style = {{height: this.height - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, alignItems:"center"}}>

      <View style = {{ borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.7)', height: this.width/7, width: this.width, alignItems: "center", justifyContent: "center"}}>

      <Text style = {{fontSize: 20*this.width/360, color: "rgba(100,100,100,1)",}}>
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
      style={{ bottom: this.width*30/100, position:"absolute", borderTopWidth:1, borderBottomWidth:1, borderColor: 'rgba(128,128,128,0.3)', backgroundColor: "white",
      flexDirection: "row", justifyContent: 'center', width: this.width, height: this.width/8}}
      onPress={this.props.onPress}>
      <View
      style={{justifyContent: 'center', position: 'absolute', width: this.width*7/8, height: this.width/8, bottom: 0, left: 0}}>
      <Text
        style = {{color: 'rgba(88,88,88,1)', fontSize: 18*this.width/360, left: this.width/20, position: "absolute" }}>
        Enable Dark Mode
      </Text>
      </View>

      <View
      style={{justifyContent: 'center', alignItems: "center", position: 'absolute', width: this.width/10, height: this.width/10, bottom: this.width/80, right: this.width/80}}>
      <Image source={{uri: 'tick'}}
      style={{ opacity: 0.5, width: "60%", height: "60%"}}/>
      </View>
      </TouchableOpacity>


      <OvalButton
      bottom = {this.width*10/100}
      title = "Apply"
      textColor = {'rgba(241,51,18,1)'}
      onPress = { ()=> this.apply()}
      borderColor = {'rgba(241,51,18,1)'}/>
      </View>

    </View>

        );
  }}
