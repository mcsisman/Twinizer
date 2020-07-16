import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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
   Platform
  } from 'react-native';
import SplashScreen from './Splash';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import OvalButton from './components/OvalButton'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

export default class ForgotPasswordScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      email: ""
    }
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.props.navigation.setParams({ otherParam: global.langForgotPassword })
  }
componentDidMount(){
};
static navigationOptions = {
    header: null,
};
  check(){
    const {navigate} = this.props.navigation;
    firebase.auth().sendPasswordResetEmail(this.state.email)
      .then(function (user) {
        navigate('Splash')
        Alert.alert("", global.langPlsCheckEmail)
      }).catch(error => {
        Alert.alert(global.langPlsTryAgain, global.langEmailNotRegistered)
      })
  }
  render(){
    const {navigate} = this.props.navigation;
    return(
      <KeyboardAvoidingView behavior="padding"
      keyboardVerticalOffset = {-(this.height*20)/100}
      enabled
      style={{flex:1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)'}}>

      <ModifiedStatusBar/>
      <CustomHeader
      title = {global.langForgotPassword}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', flex:1}}>
      <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder= {global.langEmail}
        style={{color: global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)', fontSize: 18*(this.width/360), fontFamily: "Candara", position: 'absolute', width: this.width*(7/10), height: (this.height*8)/100, flex:1, bottom: (this.height*45)/100, right: this.width*(1.5/10),
        backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
        onChangeText={(text) => this.setState({email: text})}>
      </TextInput>


      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      opacity = {1}
      bottom = {(this.height*25)/100}
      title = {global.langSendEmail}
      textColor = {global.themeColor}
      onPress = { ()=> this.check()}
      borderColor = {global.themeColor}
      borderRadius = {32}/>

      </View>
      </KeyboardAvoidingView>
        );
  }
}
