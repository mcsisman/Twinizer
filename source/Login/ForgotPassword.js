import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import auth from '@react-native-firebase/auth';
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
   Platform,
   Keyboard
  } from 'react-native';
import LoginScreen from './Login';
import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import OvalButton from '../Components/Common/OvalButton/OvalButton'

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
    auth().sendPasswordResetEmail(this.state.email)
      .then(function (user) {
        navigate('Login')
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

      <TouchableOpacity
      activeOpacity = {1}
      style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
       onPress={()=> Keyboard.dismiss() }>

      <ModifiedStatusBar/>
      <CustomHeader
      title = {global.langForgotPassword}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', flex:1}}>
      <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder= {global.langEmail}
        style={{color: global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)', fontSize: 18*(this.width/360), position: 'absolute', width: this.width*(7/10), height: (this.height*8)/100, flex:1, bottom: (this.height*45)/100, right: this.width*(1.5/10),
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
      </TouchableOpacity>
      </KeyboardAvoidingView>
        );
  }
}
