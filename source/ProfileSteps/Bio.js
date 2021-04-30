import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Modal from "react-native-modal";
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
   StatusBar,
   Platform,
   Animated,
   Easing,
   Keyboard
  } from 'react-native';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import OvalButton from '../Components/Common/OvalButton/OvalButton'
import InfoModal from '../Components/Common/Info/InfoModal'
import InfoButton from '../Components/Common/Info/InfoButton'
import PageDots from '../Components/ProfileSteps/Common/PageDots'
import TextBox from '../Components/ProfileSteps/Common/TextBox'
import MultilineTextInput from '../Components/ProfileSteps/Bio/MultilineTextInput'
import language from '../Utils/Languages/lang.json'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var writeDone = false;
var updateDone = false;
var listenerStarted = false;
//var {navigate} = null;
export default class CountryScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      email: "",
      country: "Country",
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: global.themeColor,
      disabled: false,
      isVisible2: true,
      bioLimit: 0,
      loadingOpacity: 0
    }
      global.globalBio = "";
      this.height = Math.round(Dimensions.get('screen').height);
      this.width = Math.round(Dimensions.get('screen').width);
      var lang = language[global.lang]
      this.props.navigation.setParams({ otherParam: lang.CompleteYourProfile})
      this.spinValue = new Animated.Value(0)
  }
componentDidMount(){
  //navigate = this.props.navigation;
};
static navigationOptions = {
    header: null,
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

navigateToMain(){
  const {navigate} = this.props.navigation;
  navigate("MyTabs")
}
checkIfBioValid(text){
  var regex = /^[A-Za-z0-9. ]+$/
  if(regex.test(text)){
    return true
  }
  else{
    return false
  }
}
async writeCountryToDatabase(){
  console.log("CHECK")
  var lang = language[global.lang]
  if(!this.checkIfBioValid(global.globalBio)){
    Alert.alert(lang.Warning, lang.InvalidBio)
  }
  else{
    this.setState({loadingOpacity: 1, disabled: true})
    this.spinAnimation()
    try{
      if((global.globalBio).length < 101){
        if(global.globalBio == ""){
          global.globalBio = " ";
        }
        console.log(writeDone)
        const funcdone_Ref = firestore().collection(auth().currentUser.uid).doc('Funcdone');
        await funcdone_Ref.set({
          key: 0
        }).then(()=>{
          console.log("funcdone was initialized")
        })
        await database().ref('Users/' + auth().currentUser.uid + "/i").update({
          g: global.globalGender,
          c: global.globalCountry,
          b: global.globalBio,
          d: global.globalBirthday,
          p: 0
        }).then(async function() {
            var randFloat = Math.random()
            const updateRef = firestore().collection('Functions').doc('Model');
            await updateRef.set({
              name: auth().currentUser.uid + "_" + randFloat.toString()
            }).then(function() {

              EncryptedStorage.setItem(auth().currentUser.uid + 'userGender', global.globalGender)
              EncryptedStorage.setItem(auth().currentUser.uid + 'userBirthday', global.globalBirthday)
              EncryptedStorage.setItem(auth().currentUser.uid + 'userCountry', global.globalCountry)
              EncryptedStorage.setItem(auth().currentUser.uid + 'userBio', global.globalBio)
              EncryptedStorage.setItem(auth().currentUser.uid + 'userPhotoCount', JSON.stringify(0))
              console.log("bilgiler locale kaydedildi:", auth().currentUser.uid)
            })
        });
        var result_ref = firestore().collection(auth().currentUser.uid).doc('ModelResult').onSnapshot(async (doc) =>{
          console.log("listenerStarted: ", listenerStarted)
          var lang = language[global.lang]
          if(listenerStarted){
            var dict = doc.data()
            console.log("dict: ", dict)
            if(dict["result"] < 0){
              this.setState({disabled: false})
              Alert.alert(lang.Error, lang.CheckPhotos )
              updateDone = false;
            }
            else{
              updateDone = true;
            }
            if (updateDone){
              this.setState({loadingOpacity: 0})
              this.spinValue = new Animated.Value(0)
              const {navigate} = this.props.navigation;
              navigate("Tabs")
            }
            else {
              this.setState({disabled: false})
              Alert.alert(lang.SomethingWentWrong, lang.CreateAccountFailed)
            }
          }
          listenerStarted = true
        })
      }
      else {
        this.setState({disabled: false})
        Alert.alert(lang.Error, lang.CharLengthExceeded)
      }
    } catch (error) {
      this.setState({disabled: false})
      Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
    }
  }
}

valueChange(value){
  if(this.state.bioLimit <= 100){
    global.globalBio = value;
    this.setState({bioLimit: value.length});
  }
}

  render(){
    var lang = language[global.lang]
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    return(
      <View
      style={{flex:1, flexDirection: 'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <TouchableOpacity
      activeOpacity = {1}
      style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
       onPress={()=> Keyboard.dismiss() }>


      <ModifiedStatusBar/>

      <CustomHeader
      title = {lang.CompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
      style={{width: this.width, height: this.height-getStatusBarHeight() - headerHeight, bottom: 0,flexDirection: 'column', alignItems: 'center', }}>

      <View
      style={{width: this.width, height: "16.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <TextBox
      text = {lang.EnterYourBioHere}/>
      </View>

      <View
      style={{width: this.width, height: "49.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "flex-start"}}>

      <MultilineTextInput
      onChangeText = {(text) => this.valueChange(text)}
      characterNo = {this.state.bioLimit}/>
      </View>

      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>

      <InfoButton
      onPress = {()=> this.setState({isVisible2: true})}
      opacity = {this.state.loadingOpacity == 1 ? 0 : 1}/>


      </View>
      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <OvalButton
      opacity = {1}
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      title = {lang.Done}
      textColor = {this.state.buttonOpacity}
      onPress = { ()=> this.writeCountryToDatabase()}
      disabled = {this.state.disabled}
      borderColor = {this.state.buttonOpacity}/>
      </View>
      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <PageDots
      pageNo = {4}/>
      </View>

      </View>
      </View>

      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {lang.BioInfo}
      txtGotIt = {lang.GotIt}
      onPressClose = {()=>this.setState({isVisible2:false}) }/>

      </TouchableOpacity>
    </View>

        );
  }
}
