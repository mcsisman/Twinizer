import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
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
   Keyboard
  } from 'react-native';
import MainScreen from '../Main/Main';
import ForgotPasswordScreen from './ForgotPassword';
import NewAccountScreen from './NewAccount';
import UserInfoScreen from '../ProfileSteps/UserInfo';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import language from '../Utils/Languages/lang.json'


if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

global.messagesFirstTime = true
var keyboardHeight;
var keyboardYcord;

export default class LoginScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : true,
      isim : "",
      sifre : "",
      keyboardOpen: false,
      tryagain: 0
    }
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

_keyboardDidShow = (e) => {
  const { height, screenX, screenY, width } = e.endCoordinates
  keyboardYcord = screenY
  keyboardHeight = height

  console.log("keyboard açıldı")
  this.setState({keyboardOpen: true})
};
_keyboardDidHide = () => {
  console.log("keyboard kapandı")
  this.setState({keyboardOpen: false})
};

Login = (email, password) => {
  var lang = language[global.lang]
    const {navigate} = this.props.navigation;
          auth()
           .signInWithEmailAndPassword(email, password)
           .then(async () => {
             if(auth().currentUser.emailVerified){
               var storageRef = storage().ref("Embeddings/" + auth().currentUser.uid + ".pickle")
               console.log("STORAGE REF: ", storageRef)
               await storageRef.getDownloadURL().then(data =>{
                 console.log("EMBEDDING VAR: ", auth().currentUser.uid)
                 console.log("DATA: ", data)
                 navigate('Tabs', { screen: 'Main' })
                 //navigate("UserInfo")
               }).catch(function(error) {
                 console.log("EMBEDDING YOK: ", auth().currentUser.uid)
                 navigate("UserInfo")
               });
             user = auth().currentUser
             }
             else{
               Alert.alert("", lang.EmailNotVerified )
             }
        }).catch(error => {
          Alert.alert(lang.PlsTryAgain, lang.WrongEmailPassword)
      })

  };
  check(){
    this.Login(this.state.isim, this.state.sifre)
  }

  render(){

    const {navigate} = this.props.navigation;
    var lang = language[global.lang]
    var keyboardAvoidingHeight = keyboardHeight + this.navBarHeight;
    if( keyboardHeight + this.navBarHeight > this.height/2){
      keyboardAvoidingHeight = this.height/2
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
        console.log("KEYBOARD:", this.state.keyboardOpen)
        return(

          <TouchableOpacity
          activeOpacity = {1}
          style={{flex:1, alignItems: 'center',width: "100%", height: "100%",bottom: this.state.keyboardOpen ? keyboardAvoidingHeight: 0 }}
           onPress={()=> Keyboard.dismiss() }>
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: "100%", height: "100%", flex:1, flexDirection: "column", alignItems: 'center', }}>

          <View style = {{ opacity: this.state.keyboardOpen ? 0 : 1, width: "100%", height: "50%", alignItems: "center", justifyContent: "center"}}>
          <View style = {{ position: "absolute", width: "100%", height: this.width*(5.8/10) + this.height*(0.1/10),
          flexDirection: "column", flex:1, alignItems: "center"}}>
          <Image source={{uri: 'logo2'}}
            style={{ width: this.width*(5/10), height:this.width*(5/10) }}
          />
          <Image source={{uri: 'slogan'}}
            style={{ width: this.width*(0.8/10)*(1243/203), height:this.width*(0.8/10) }}
          />
          </View>
          </View>

          <View style = {{  width:"100%", height: "50%", alignItems: "center",  flex:1, flexDirection: "column"}}>
          <View style = {{  width:"100%", height: "50%", alignItems: "center", justifyContent: "center",  flexDirection: "column"}}>

          <View style = {{ width:"100%", height: "33%", alignItems: "center", justifyContent: "center"}}>
          <TextInput
          placeholderTextColor="rgba(255,255,255,0.7)"
          placeholder={lang.Email}
          keyboardType= "email-address"

          style={{paddingLeft: 0, paddingBottom: 0, fontSize: 17*(this.width/360), width: this.width*(6/10), height: "100%", flex:1,
           borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
           onChangeText={(text) => this.setState({isim: text})}>
          </TextInput>
          </View>

          <View style = {{ width:"100%", height: "33%", alignItems: "center", justifyContent: "center"}}>
          <TextInput
          placeholderTextColor="rgba(255,255,255,0.7)"
          placeholder={lang.Password}
          secureTextEntry

          style={{paddingLeft: 0, paddingBottom: 0, fontSize: 17*(this.width/360), width: this.width*(6/10), height: "100%", flex:1,
           backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
           onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>
        </View>

        <View style = {{ width:"100%", height: "34%", alignItems: "center", justifyContent: "center"}}>
        <TouchableOpacity
        activeOpacity = {1}
        style={{justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
          paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1}}
        onPress={()=>this.check() }>
        <Text style={{textAlign: 'center', color: 'white', fontSize: 17*(this.width/360)}}>
          {lang.Login}
        </Text>
        </TouchableOpacity>
        </View>


        </View>
        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
         width: this.width*(48/100), height: (this.height*6)/100, flex:1, bottom: 0, right: this.width*(2/100)}}
         onPress={()=>navigate("NewAccount") }>
        <Text style={{
          textAlign: 'right',
          color: 'white',
          fontSize: 18*(this.width/360)
          }}>
          {lang.SignUp}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
         width: this.width*(48/100), height: (this.height*6)/100, flex:1, bottom: 0, left: this.width*(2/100)}}
         onPress={()=> navigate( "ForgotPassword") }>
        <Text style={{textAlign: 'left', color: 'white',   fontSize: 18*(this.width/360)}}>
          {lang.ForgotPassword}
        </Text>
        </TouchableOpacity>

        </View>

        </ImageBackground>
        </TouchableOpacity>
        );
      }
  }
}
