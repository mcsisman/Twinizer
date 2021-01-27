import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
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
var keyboardHeight;
var keyboardYcord;

export default class NewAccountScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      reRender: true,
      fontWeight: "normal",
      usernameColor: "black",
      splashOver : false,
      isim : "",
      sifre : "",
      sifre2:"",
      email:"",
      gender: "",
      verificationSended: false
    }
    var lang = language[global.lang]
    this.props.navigation.setParams({ otherParam: lang.SignUp })
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight
    this.height = Math.round(Dimensions.get('screen').height);
    global.globalUsername = "";
    this.width = Math.round(Dimensions.get('screen').width);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navBarHeight = this.height - this.windowHeight

  }
  componentDidMount(){
    var lang = language[global.lang]
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log("subscribe")
      this.setState({reRender: !this.state.reRender})
    })
  };
  static navigationOptions = {
      header: null,
  };
  _keyboardDidShow = (e) => {
    const { height, screenX, screenY, width } = e.endCoordinates
    keyboardHeight = height
    if(global.keyboardHeight == null || global.keyboardHeight == undefined){

      global.keyboardHeight = keyboardHeight
      console.log("global:", global.keyboardHeight)
      AsyncStorage.setItem('keyboardHeight', (global.keyboardHeight).toString())
      this.setState({reRender: !this.state.reRender, keyboardOpen: true})
    }
  };
  _keyboardDidHide = () => {
    this.setState({keyboardOpen: false})
    console.log("keyboard kapandı")
  };
writeUserData(userId, name, email, imageUrl) {
  database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
    SignUp = (email, password) => {
      var lang = language[global.lang]
      const {navigate} = this.props.navigation;
      auth().createUserWithEmailAndPassword(this.state.email, this.state.sifre).then(() => {
        console.log(database().ref('/Users/' + auth().currentUser.uid + "/i"))
        database().ref('/Users/' + auth().currentUser.uid + "/i").set({
          u: this.state.isim,
        }).catch(error => {
          console.log("Can't update database")
        });
        AsyncStorage.setItem(auth().currentUser.uid + 'userName', this.state.isim)
        auth().currentUser.sendEmailVerification().catch(error => {
          Alert.alert(lang.PlsTryAgain, lang.SendEmailFailed)
        });
        navigate('Login')
        Alert.alert('',lang.VerificationSent);
      }).catch(error => {
        console.log("Create account error: ", error.message)
        if(error.message == '[auth/invalid-email] The email address is badly formatted.'){
            Alert.alert(lang.PlsTryAgain,lang.InvalidEmail);
        }
        else{
            Alert.alert(lang.PlsTryAgain,lang.EmailAlready);
        }
      });
  };
  check(){
    var lang = language[global.lang]
    if(this.state.sifre == this.state.sifre2 ){
      if(this.state.isim == ""  ){
        if(this.state.email == ""){
          Alert.alert('',lang.PlsEnterEmailUsername);
        }
        else{
          Alert.alert('',lang.PlsEnterUsername);
        }
      }
      else if(!this.checkIfUsernameValid(this.state.isim)){
        Alert.alert("", lang.InvalidUsername)
      }
      else if(this.state.email == ""){
        Alert.alert('',lang.PlsEnterEmail);
      }
      else if (this.state.sifre.length < 6 && this.state.sifre2.length < 6 ) {
        Alert.alert('',lang.PasswordCharacter);
      }
      else {
        this.SignUp(this.state.email, this.state.password)
      }
    }
    else{
        Alert.alert('',lang.PasswordMatch);
    }
  }
  onUsernameTextChange(text){

    this.setState({isim: text})
    if(this.checkIfUsernameValid(text)){
      this.setState({usernameColor: "black", fontWeight: "normal"})
    }
    else{
      this.setState({usernameColor: "red", fontWeight: "bold"})
    }
  }
  checkIfUsernameValid(text){
    var regex = /^[A-Za-z0-9. ]+$/
    if(regex.test(text) &&  text.length >= 3){
      return true
    }
    else{
      return false
    }
  }
  render(){
    var lang = language[global.lang]
    var keyboardAvoidingHeight;
    if(global.keyboardHeight == null || global.keyboardHeight == undefined){
      keyboardAvoidingHeight = 0;
    }
    else{
      keyboardAvoidingHeight = global.keyboardHeight + this.navBarHeight;
    }
    console.log("avoid:", keyboardAvoidingHeight)
    const {navigate} = this.props.navigation;
      return(

        <TouchableOpacity
        activeOpacity = {1}
        style={{width: this.width, height: this.height, flex:1, alignItems: 'center',bottom: this.state.keyboardOpen && global.keyboardHeight != null && global.keyboardHeight != undefined ? keyboardAvoidingHeight - ((this.height - getStatusBarHeight() - headerHeight)-this.height/2)/2 + this.width/50: 0}}
         onPress={()=> {
           Keyboard.dismiss()
           this.setState({keyboardOpen: false})} }>

        <ModifiedStatusBar/>

        <CustomHeader
        title = {lang.SignUp}
        onPress = {()=> this.props.navigation.goBack()}/>

        <View
        style={{backgroundColor: "rgba(255,255,255,1)", width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', justifyContent: "center", flex:1}}>
        <View
        style={{width: this.width, height: this.height/2, alignItems: 'center',}}>
        <View
        style={{width: this.width, height: "16%", alignItems: 'center', justifyContent: "center"}}>
        <TextInput
        onFocus = {()=> this.setState({keyboardOpen: true})}
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder= {lang.Email}
        keyboardType= "email-address"
        //returnKeyType="Next"
        style={{ paddingLeft: 0, fontSize: 17*(this.width/360), paddingBottom: this.width/50, position: 'absolute', width: this.width*(6/10),
         backgroundColor: 'rgba(255,255,255,0.2)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({email: text})}>
        </TextInput>
        </View>
        <View
        style={{width: this.width, height: "16%", alignItems: 'center', justifyContent: "center"}}>
        <TextInput
        onFocus = {()=> this.setState({keyboardOpen: true})}
        maxLength = {15}
        value = {this.state.isim}
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={lang.Username}
        //returnKeyType="Next"
        style={{color: this.state.usernameColor, fontWeight: this.state.fontWeight, paddingLeft: 0, fontSize: 17*(this.width/360), paddingBottom: this.width/50, position: 'absolute', width: this.width*(6/10),
         backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.onUsernameTextChange(text)}>
        </TextInput>
        </View>
        <View
        style={{width: this.width, height: "16%", alignItems: 'center', justifyContent: "center"}}>
        <TextInput
        onFocus = {()=> this.setState({keyboardOpen: true})}
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={lang.Password}
        secureTextEntry
        //returnKeyType="Next"
        style={{paddingLeft: 0, fontSize: 17*(this.width/360), paddingBottom: this.width/50, position: 'absolute', width: this.width*(6/10),
        backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>
        </View>
        <View
        style={{width: this.width, height: "16%", alignItems: 'center', justifyContent: "center"}}>
        <TextInput
        onFocus = {()=> this.setState({keyboardOpen: true})}
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={lang.ConfirmPassword}
        secureTextEntry
        //returnKeyType="Next"
        style={{paddingLeft: 0, fontSize: 17*(this.width/360), paddingBottom: this.width/50,position: 'absolute', width: this.width*(6/10),
         backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre2: text})}>
        </TextInput>
        </View>
        <View
        style={{width: this.width, height: "36%", alignItems: 'center', justifyContent: "center"}}>
        <OvalButton
        opacity = {1}
        backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
        title = {lang.Create}
        textColor = {global.themeColor}
        onPress = { ()=> this.check()}
        borderColor = {global.themeColor}/>
        </View>


        </View>
        </View>
        </TouchableOpacity>

      );
  }
}
