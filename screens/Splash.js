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
import MainScreen from './Main';
import ForgotPasswordScreen from './ForgotPassword';
import NewAccountScreen from './NewAccount';
import GenderScreen from './Gender';
import ModifiedStatusBar from './components/ModifiedStatusBar'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

global.messagesFirstTime = true
var keyboardHeight;
var keyboardYcord;

export default class SplashScreen extends Component<{}>{
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
    this.width = Math.round(Dimensions.get('screen').width);
  }

static navigationOptions = {
    header: null,
};
componentDidMount(){
};

_keyboardDidShow = (e) => {
  const { height, screenX, screenY, width } = e.endCoordinates
  keyboardYcord = screenY
  keyboardHeight = height
  this.setState({keyboardOpen: true})
};
_keyboardDidHide = () => {
  this.setState({keyboardOpen: false})
};

Login = (email, password) => {
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
               }).catch(function(error) {
                 console.log("EMBEDDING YOK: ", auth().currentUser.uid)
                 navigate("Gender")
               });
             user = auth().currentUser
             }
             else{
               Alert.alert("", global.langEmailNotVerified )
             }
        }).catch(error => {
          Alert.alert(global.langPlsTryAgain, global.langWrongEmailPassword)
      })

  };
  check(){
    this.Login(this.state.isim, this.state.sifre)
  }

  render(){
    const {navigate} = this.props.navigation;
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
          <KeyboardAvoidingView behavior="padding"
            keyboardVerticalOffset={this.state.keyboardOpen && Platform.OS === 'android' ? -(this.height*12)/100 : -3*getStatusBarHeight()}
          style={{width: this.width, height: this.height, flex:1, backgroundColor: 'rgba(255,255,255, 0)'}}>
          <TouchableOpacity
          activeOpacity = {1}
          style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
           onPress={()=> Keyboard.dismiss() }>
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: this.width, height: this.height, flex:1, alignItems: 'center'}}>

          <Image source={{uri: 'twinizer'}}
            style={{ width: this.width*(7/10), height:this.width*(17.5/100), position: 'absolute', bottom: this.height*(6/10), left: this.width*(15/100) }}
          />

            <TextInput
            placeholderTextColor="rgba(255,255,255,0.7)"
            placeholder={global.langEmail}
            keyboardType= "email-address"

            style={{fontSize: 16*(this.width/360), fontFamily: "Candara",position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*40)/100, right: this.width*(2/10),
             backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
             onChangeText={(text) => this.setState({isim: text})}>
          </TextInput>
          <TextInput
          placeholderTextColor="rgba(255,255,255,0.7)"
          placeholder={global.langPassword}
          secureTextEntry

          style={{fontSize: 16*(this.width/360), fontFamily: "Candara",position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*33)/100, right: this.width*(2/10),
           backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
           onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>

        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
         width: this.width*(2/10), height: (this.height*6)/100, flex:1, bottom: 0, right: this.width*(2/100)}}
         onPress={()=>navigate("NewAccount") }>
        <Text style={{
          fontFamily: "Candara",
          textAlign: 'center',
          color: 'white',
          fontSize: 18*(this.width/360)
          }}>
          {global.langSignUp}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        activeOpacity = {1}
        style={{position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
         width: this.width*(4/10), height: (this.height*6)/100, flex:1, bottom: 0, left: this.width*(2/100)}}
         onPress={()=> navigate( "ForgotPassword") }>
        <Text style={{textAlign: 'center', color: 'white', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>
          {global.langForgotPassword}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        activeOpacity = {1}
        style={{justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
          paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1, bottom: (this.height*25)/100}}
         onPress={()=>this.check() }>
         <Text style={{textAlign: 'center', color: 'white', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>

          {global.langLogin}
        </Text>
        </TouchableOpacity>

        </ImageBackground>
        </TouchableOpacity>
        </KeyboardAvoidingView>
        );
      }
  }
}
