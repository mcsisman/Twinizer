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
import language from '../Utils/Languages/lang.json'

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
    this.props.navigation.setParams({ otherParam: lang.ForgotPassword })
  }
componentDidMount(){
};
static navigationOptions = {
    header: null,
};
  check(){
    var lang = language[global.lang]
    const {navigate} = this.props.navigation;
    if(this.state.email == "" || this.state.email == null || this.state.email == undefined){
      Alert.alert(lang.PlsTryAgain, lang.EmailNotRegistered)
    }
    else{
      auth().sendPasswordResetEmail(this.state.email)
        .then(function (user) {
          Alert.alert("", lang.PlsCheckEmail)
        }).catch(error => {
          Alert.alert(lang.PlsTryAgain, lang.EmailNotRegistered)
        })
    }

  }
  render(){
    var lang = language[global.lang]
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
      title = {lang.ForgotPassword}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', flex:1}}>
      <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder= {lang.Email}
        style={{color: global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)', paddingLeft: 0, paddingBottom: this.width/50, fontSize: 17*(this.width/360), position: 'absolute', width: this.width*(7/10), bottom: (this.height*45)/100, right: this.width*(1.5/10),
        backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
        onChangeText={(text) => this.setState({email: text})}>
      </TextInput>


      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      opacity = {1}
      bottom = {(this.height*25)/100}
      title = {lang.SendEmail}
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
