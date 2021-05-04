import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
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
   Platform,
   Keyboard,
   Animated,
   Easing
  } from 'react-native';
import MainScreen from '../Main/Main';
import ForgotPasswordScreen from './ForgotPassword';
import NewAccountScreen from './NewAccount';
import UserInfoScreen from '../ProfileSteps/UserInfo';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import language from '../Utils/Languages/lang.json'
import themes from '../../source/Settings/Themes';


if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

global.messagesFirstTime = true
var keyboardHeight;

export default class LoginScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : true,
      isim : "",
      sifre : "",
      keyboardOpen: false,
      tryagain: 0,
      loginDisabled: false,
      loadingOpacity: 0
    }
    this.spinValue = new Animated.Value(0)
    this.height = Math.round(Dimensions.get('screen').height);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.navBarHeight = this.height - this.windowHeight
  }

static navigationOptions = {
    header: null,
};
componentDidMount(){
  this.keyboardDidShowListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
  this.keyboardDidHideListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
};
componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
_keyboardDidShow = (e) => {
  const { height, screenX, screenY, width } = e.endCoordinates
  keyboardHeight = height
  if(global.keyboardHeight == null || global.keyboardHeight == undefined){

    global.keyboardHeight = keyboardHeight
    EncryptedStorage.setItem('keyboardHeight', (global.keyboardHeight).toString())
    this.setState({keyboardOpen: true})
  }
};
_keyboardDidHide = () => {
  this.setState({keyboardOpen: false})
};
spinAnimation(){
  console.log("SPIN ANIMATION")
  this.spinValue = new Animated.Value(0)
  // First set up animation
  Animated.loop(
  Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )).start()
}
async setTheme(user){
  // Theme color
  if(user){
    var themeColor = await EncryptedStorage.getItem(auth().currentUser.uid + 'theme')
    if(themeColor == null || themeColor == undefined){
      themeColor = "Original"
    }
    global.themeColor = themes.getTheme(themeColor)
    global.themeForImages = themes.getThemeForImages(themeColor)
    var mode = await EncryptedStorage.getItem(auth().currentUser.uid + 'mode')
    if(mode == null || mode == undefined){
      mode = "false"
    }
    if(mode == "true"){
      global.isDarkMode = true
    }
    else{
      global.isDarkMode = false
    }
    global.darkModeColors = ["rgba(21,32,43,1)", "rgba(25,39,52,1)", "rgba(37,51,65,1)", "rgba(255,255,255,1)"]
  }
  else{
    global.themeColor =  themes.getTheme("Original")
    global.themeForImages = themes.getThemeForImages("Original")
    global.isDarkMode = false
  }

}

Login = (email, password) => {
  var lang = language[global.lang]
    const {navigate} = this.props.navigation;
          auth()
           .signInWithEmailAndPassword(email, password)
           .then(async () => {
             if(auth().currentUser.emailVerified){
               var storageRef = storage().ref("Embeddings/" + auth().currentUser.uid + ".pickle")
               console.log("STORAGE REF: ", storageRef)
               await storageRef.getDownloadURL().then(async data =>{
                 console.log("EMBEDDING VAR: ", auth().currentUser.uid)
                 console.log("DATA: ", data)
                 await this.setTheme(true)
                 this.setState({loadingOpacity: 0})
                 //navigate('Tabs', { screen: 'Main' })
                 navigate("UserInfo")
               }).catch(error => {
                 console.log("EMBEDDING YOK: ", auth().currentUser.uid)
                 this.setTheme(false)
                 this.setState({loadingOpacity: 0})
                 navigate("UserInfo")
               });
             user = auth().currentUser
             }
             else{
               this.setState({loadingOpacity: 0})
               Alert.alert("", lang.EmailNotVerified )
             }
             this.setState({loginDisabled: false})
        }).catch(error => {
          console.log("error2:", error)
          Alert.alert(lang.PlsTryAgain, lang.WrongEmailPassword)
          this.setState({loginDisabled: false, loadingOpacity: 0})
      })

  };
  check(){
    console.log("CHECK")
    if(this.state.isim != "" && this.state.sifre != ""){
      this.spinAnimation()
      this.setState({loginDisabled: true, loadingOpacity: 1})
      this.Login(this.state.isim, this.state.sifre)
    }
  }

  render(){
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    var fontFam;
    if(Platform.OS == "android"){
      fontFam = ""
    }
    const {navigate} = this.props.navigation;
    var lang = language[global.lang]
    var keyboardAvoidingHeight;
    if(global.keyboardHeight == null || global.keyboardHeight == undefined){
      keyboardAvoidingHeight = 0
    }
    else{
      keyboardAvoidingHeight = global.keyboardHeight + this.navBarHeight;
    }


      if(!this.state.splashOver){
        return(
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: this.width, height: this.height, flex:1}}>
        </ImageBackground>
        );
      }
      else{
        return(

          <TouchableOpacity
          activeOpacity = {1}
          style={{position: "absolute", alignItems: 'center',width: this.width, height: this.height,bottom: this.state.keyboardOpen && global.keyboardHeight != null && global.keyboardHeight != undefined ? keyboardAvoidingHeight: 0 }}
           onPress={()=> {
             Keyboard.dismiss()
             this.setState({keyboardOpen: false})} }>
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: this.width, height: this.height, flexDirection: "column", alignItems: 'center', }}>

          <View style = {{ opacity: this.state.keyboardOpen && global.keyboardHeight != null && global.keyboardHeight !=undefined ? 0 : 1, width: "100%", height: this.height/2, alignItems: "center", justifyContent: "center"}}>
          <View style = {{ position: "absolute", width: "100%", height: this.width*(5.8/10) + this.height*(0.1/10),
          flexDirection: "column", flex:1, alignItems: "center"}}>
          <Image source={{uri: 'logo2'}}
            style={{ width: this.width*(5/10), height:this.width*(5/10) }}
          />
          <Image source={{uri: 'twinizerlogin'}}
            style={{ width: this.width*(0.8/10)*(782/159), height:this.width*(0.8/10) }}
          />
          </View>
          </View>

          <View style = {{  width:"100%", height: this.height/2, alignItems: "center",  flex:1, flexDirection: "column"}}>
          <View style = {{  width:"100%", height: this.height/4, alignItems: "center", justifyContent: "center",  flexDirection: "column"}}>

          <View style = {{ width:"100%", height: "33%", alignItems: "center", justifyContent: "center"}}>
          <TextInput
          placeholderTextColor="rgba(255,255,255,0.7)"
          placeholder={lang.Email}
          keyboardType= "email-address"
          onFocus = {()=>{this.setState({keyboardOpen: true})}}
          style={{ fontFamily: fontFam, paddingLeft: 0, paddingBottom:this.width/50, fontSize: 17*(this.width/360), width: this.width*(6/10),
           borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
           onChangeText={(text) => this.setState({isim: text})}>
          </TextInput>
          </View>

          <View style = {{width:"100%", height: "33%", alignItems: "center", justifyContent: "center"}}>
          <TextInput
          placeholderTextColor="rgba(255,255,255,0.7)"
          placeholder={lang.Password}
          secureTextEntry
          onFocus = {()=>{this.setState({keyboardOpen: true})}}
          style={{fontFamily: fontFam, paddingLeft: 0, paddingBottom: this.width/50, fontSize: 17*(this.width/360), width: this.width*(6/10),
           backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
           onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>
        </View>

        <View style = {{width:"100%", height: "34%", alignItems: "center", justifyContent: "center"}}>
        <TouchableOpacity
        disabled = {this.state.loginDisabled}
        activeOpacity = {1}
        style={{justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
          paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1}}
        onPress={()=>this.check() }>
        <Text style={{fontFamily: fontFam, textAlign: 'center', color: 'white', fontSize: 17*(this.width/360)}}>
          {lang.Login}
        </Text>
        </TouchableOpacity>
        </View>
        </View>
        <Animated.Image source={{uri: 'loadingwhite'}}
          style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15),  opacity: this.state.loadingOpacity}}
        />

        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute',
         padding:this.width/50, bottom: this.width/35, right: this.width*(2/100)}}
         onPress={()=>navigate("NewAccount") }>
        <Text style={{
          fontFamily: fontFam,
          textAlign: 'right',
          color: 'white',
          fontSize: 18*(this.width/360)
          }}>
          {lang.SignUp}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute',
         padding:this.width/50, bottom: this.width/35, left: this.width*(2/100)}}
         onPress={()=> navigate( "ForgotPassword") }>
        <Text style={{fontFamily: fontFam, textAlign: 'left', color: 'white', fontSize: 18*(this.width/360)}}>
          {lang.ForgotPassword}
        </Text>
        </TouchableOpacity>

        </View>

        </ImageBackground>
        <Image
        source={{uri: 'flare'}}
        style={{transform: [{ rotate: '180deg'}] ,position:"absolute", bottom: -this.height, width: this.width, height: this.height, flexDirection: "column", alignItems: 'center', }}/>
        </TouchableOpacity>
        );
      }
  }
}
