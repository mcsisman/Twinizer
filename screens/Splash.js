import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
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
   Platform
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


export default class SplashScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : true,
      isim : "",
      sifre : "",
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

Login = (email, password) => {
    const {navigate} = this.props.navigation;
    try {
        firebase.auth().onAuthStateChanged(function(user) {
        try {
          firebase
           .auth()
           .signInWithEmailAndPassword(email, password)
           .then(res => {
             if(firebase.auth().currentUser.emailVerified){
               var docRef = firebase.firestore().collection(firebase.auth().currentUser.email).doc("Information");
               docRef.get().then(function(doc) {
                 if (doc.exists && doc.data()["country"] != null) {
                   navigate("Main")
                 } else {
                   navigate("Gender")
                 }
               }).catch(function(error) {
                 console.log("Error getting document:", error);
               });

             user = firebase.auth().currentUser

             }
             else{
               Alert.alert("", global.langEmailNotVerified )
             }
        })
        .catch(error => {
          Alert.alert(global.langPlsTryAgain, global.langWrongEmailPassword)
      })
      } catch (error) {

        }
    });
  } catch (error) {
    alert(error.toString(error));
    }
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
          <KeyboardAvoidingView behavior="padding" enabled
          style={{width: this.width, height: this.height, flex:1, backgroundColor: 'rgba(255,255,255, 0)'}}>
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}>

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
        style={{position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
         width: this.width*(4/10), height: (this.height*6)/100, flex:1, bottom: 0, left: this.width*(2/100)}}
         onPress={()=> navigate( "ForgotPassword") }>
        <Text style={{textAlign: 'center', color: 'white', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>
          {global.langForgotPassword}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
          paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1, bottom: (this.height*25)/100}}
         onPress={()=>this.check() }>
         <Text style={{textAlign: 'center', color: 'white', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>

          {global.langLogin}
        </Text>
        </TouchableOpacity>

        </ImageBackground>
        </KeyboardAvoidingView>
        );
      }
  }
}
