import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import * as firebase from "firebase";
import CustomHeader from './components/CustomHeader'
import AsyncStorage from '@react-native-community/async-storage';
import {Image,
   Text,
   View,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   Button,
   ImageBackground,
   KeyboardAvoidingView,
   TextInput,
   Picker,
   Alert,
   StatusBar,
   Platform
  } from 'react-native';
import SplashScreen from './Splash';
import MessagesScreen from './Messages';
import ModifiedStatusBar from './components/ModifiedStatusBar'
import OvalButton from './components/OvalButton'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}


export default class NewAccountScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      isim : "",
      sifre : "",
      sifre2:"",
      email:"",
      gender: "",
      verificationSended: false
    }
    this.props.navigation.setParams({ otherParam: global.langSignUp })
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight
    this.height = Math.round(Dimensions.get('screen').height);
    global.globalUsername = "";
    this.width = Math.round(Dimensions.get('screen').width);

  }
  componentDidMount(){

  };
  static navigationOptions = {
      header: null,
  };

writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
    SignUp = (email, password) => {
      const {navigate} = this.props.navigation;
    try {
           firebase
               .auth()
               .createUserWithEmailAndPassword(this.state.email, this.state.sifre)
               .then(user => {
                      var database = firebase.database();
                      firebase.database().ref('Users/' + firebase.auth().currentUser.uid + "/i").set({
                      u: this.state.isim,
                    });
                    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userName', this.state.isim)
                      firebase.auth().onAuthStateChanged(function(user) {
                        user.sendEmailVerification();
                        navigate('Splash')
                        Alert.alert('',global.langVerificationSent);
                      });
                })
                .catch(error => {
                  if(error.message == 'The email is badly formatted.'){
                    Alert.alert(global.langPlsTryAgain,global.langInvalidEmail);
                  }
                  else{
                    Alert.alert(global.langPlsTryAgain,global.langEmailAlready);
                  }

                });

} catch (error) {
      alert(error);
    }
  };
  check(){
    if(this.state.sifre == this.state.sifre2 ){
      if(this.state.isim == ""  ){
        if(this.state.email == ""){
          Alert.alert('',global.langPlsEnterEmailUsername);
        }
        else{
          Alert.alert('',global.langPlsEnterUsername);
        }
      }
      else if(this.state.email == ""){
        Alert.alert('',global.langPlsEnterEmail);
      }
      else if (this.state.sifre.length < 6 && this.state.sifre2.length < 6 ) {
        Alert.alert('',global.langPasswordCharacter);
      }
      else {
        this.SignUp(this.state.email, this.state.password)
      }
    }
    else{
        Alert.alert('',global.langPasswordMatch);
    }
  }
  render(){
    const {navigate} = this.props.navigation;
      return(



        <KeyboardAvoidingView behavior= "padding"
        enabled
        keyboardVerticalOffset = {-(this.height*12)/100}
        style={{flex:1, flexDirection: 'column', backgroundColor: 'white'}}>
        <ModifiedStatusBar/>

        <CustomHeader
        title = {global.langSignUp}
        onPress = {()=> this.props.navigation.goBack()}/>

        <View
        style={{backgroundColor: "white", width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', flex:1}}>
        <TextInput
        placeholderTextColor='rgba(0,0,0,0.4)'
        placeholder= {global.langEmail}
        keyboardType= "email-address"
        //returnKeyType="Next"
        style={{fontFamily: "Candara", position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*47)/100, right: this.width*(2/10),
         backgroundColor: 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({email: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor='rgba(0,0,0,0.4)'
        placeholder={global.langUsername}
        //returnKeyType="Next"
        style={{fontFamily: "Candara", position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*40)/100, right: this.width*(2/10),
         backgroundColor: 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({isim: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor='rgba(0,0,0,0.4)'
        placeholder={global.langPassword}
        secureTextEntry
        //returnKeyType="Next"
        style={{fontFamily: "Candara", position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*33)/100, left: this.width*(2/10),
        backgroundColor: 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor='rgba(0,0,0,0.4)'
        placeholder={global.langConfirmPassword}
        secureTextEntry
        //returnKeyType="Next"
        style={{fontFamily: "Candara", position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*26)/100, left: this.width*(2/10),
         backgroundColor: 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre2: text})}>
        </TextInput>


        <OvalButton
        bottom = {(this.height*13)/100}
        title = {global.langCreate}
        textColor = {'rgba(241,51,18,1)'}
        onPress = { ()=> this.check()}
        borderColor = {'rgba(241,51,18,1)'}/>

        </View>

        </KeyboardAvoidingView>

      );
  }
}
