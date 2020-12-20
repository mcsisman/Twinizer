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
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log("subscribe")
      this.setState({reRender: "ok"})
    })
  };
  static navigationOptions = {
      header: null,
  };

writeUserData(userId, name, email, imageUrl) {
  database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}
    SignUp = (email, password) => {
      const {navigate} = this.props.navigation;
    try {
              auth()
               .createUserWithEmailAndPassword(this.state.email, this.state.sifre)
               .then(() => {
                 console.log(auth().currentUser.uid)
                      console.log(database().ref('/Users/' + auth().currentUser.uid + "/i"))
                      database().ref('/Users/' + auth().currentUser.uid + "/i").set({
                      u: this.state.isim,
                    });
                    AsyncStorage.setItem(auth().currentUser.uid + 'userName', this.state.isim)
                    auth().currentUser.sendEmailVerification();
                    navigate('Login')
                    Alert.alert('',global.langVerificationSent);
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
        style={{flex:1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1]: 'rgba(255,255,255,1)'}}>

        <TouchableOpacity
        activeOpacity = {1}
        style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
         onPress={()=> Keyboard.dismiss() }>

        <ModifiedStatusBar/>

        <CustomHeader
        title = {global.langSignUp}
        onPress = {()=> this.props.navigation.goBack()}/>

        <View
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1]: 'rgba(255,255,255,1)', width: this.width, height: this.height - getStatusBarHeight() - headerHeight, alignItems: 'center', flex:1}}>
        <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder= {global.langEmail}
        keyboardType= "email-address"
        //returnKeyType="Next"
        style={{ position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*47)/100, right: this.width*(2/10),
         backgroundColor: global.isDarkMode ?'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({email: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={global.langUsername}
        //returnKeyType="Next"
        style={{ position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*40)/100, right: this.width*(2/10),
         backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({isim: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={global.langPassword}
        secureTextEntry
        //returnKeyType="Next"
        style={{ position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*33)/100, left: this.width*(2/10),
        backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre: text})}>
        </TextInput>
        <TextInput
        placeholderTextColor={global.isDarkMode ? global.darkModeColors[3]: 'rgba(0,0,0,0.4)'}
        placeholder={global.langConfirmPassword}
        secureTextEntry
        //returnKeyType="Next"
        style={{position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*26)/100, left: this.width*(2/10),
         backgroundColor: global.isDarkMode ? 'rgba(255,255,255,0)': 'rgba(255,255,255,0.2)',  borderColor: 'rgba(241,51,18,0)', borderBottomColor: global.themeColor, borderBottomWidth: 2}}
         onChangeText={(text) => this.setState({sifre2: text})}>
        </TextInput>


        <OvalButton
        opacity = {1}
        backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
        bottom = {(this.height*13)/100}
        title = {global.langCreate}
        textColor = {global.themeColor}
        onPress = { ()=> this.check()}
        borderColor = {global.themeColor}/>

        </View>
        </TouchableOpacity>
        </KeyboardAvoidingView>

      );
  }
}
