import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import * as firebase from "firebase";
import Modal from "react-native-modal";
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
   Platform
  } from 'react-native';
import MainScreen from './Main';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import OvalButton from './components/OvalButton'
import PageDots from './components/PageDots'
import TextBox from './components/TextBox'
import InfoModal from './components/InfoModal'
import InfoButton from './components/InfoButton'
import MultilineTextInput from './components/MultilineTextInput'
if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var writeDone = false;
var updateDone = false;
export default class CountryScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      email: "",
      country: "Country",
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: 'rgba(241,51,18,1)',
      disabled: false,
      isVisible2: true,
      bioLimit: 0
    }
      global.globalBio = "";
      this.height = Math.round(Dimensions.get('screen').height);
      this.width = Math.round(Dimensions.get('screen').width);
      this.props.navigation.setParams({ otherParam: global.langCompleteYourProfile})
  }
componentDidMount(){
};
static navigationOptions = {
    header: null,
};

async writeCountryToDatabase(){
  if((global.globalBio).length < 101){
    if(global.globalBio == ""){
      global.globalBio = " ";
    }
    for (let i = 0; i < 5 && !writeDone; i++){
      console.log(writeDone)
      const updateRef = firebase.firestore().collection(firebase.auth().currentUser.email).doc("Information")
      await updateRef.set({
        gender: global.globalGender,
        country: global.globalCountry,
        bio: global.globalBio,
        startedBoolean: false
      }, { merge: true }).then(function() {
          writeDone = true;
      });
    }
    for (let i = 0; i < 5 && !updateDone && writeDone; i++){
      console.log(updateDone)
      const updateRef = firebase.firestore().collection('Users').doc('User1');
      await updateRef.set({
        name: firebase.auth().currentUser.email
      }).then(function() {
          updateDone = true;
      })
    }
    if (writeDone && updateDone){
      const {navigate} = this.props.navigation;
      navigate("Main")
    }
    else {
      Alert.alert("Upload Failed", "Creating account is failed. Try Again.." )
    }
  }
  else {
    Alert.alert("Fail", "You exceeded the character limit." )
  }
}

valueChange(value){
  if(this.state.bioLimit <= 100){
    global.globalBio = value;
    this.setState({bioLimit: value.length});
  }
}

  render(){
    return(
      <View
      style={{flex:1, flexDirection: 'column', alignItems: 'center'}}>
      <ModifiedStatusBar/>

      <CustomHeader
      title = {global.langCompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <MultilineTextInput
      onChangeText = {(text) => this.valueChange(text)}
      characterNo = {this.state.bioLimit}/>

      <PageDots
      pageNo = {4}/>

      <OvalButton
      width = {this.width*3/10}
      bottom = {(this.height*12)/100}
      right = {this.width*(3.5/10)}
      title = {global.langDone}
      textColor = {this.state.buttonOpacity}
      onPress = { ()=> this.writeCountryToDatabase()}
      disabled = {this.state.disabled}
      borderColor = {this.state.buttonOpacity}/>

      <TextBox
      text = {"Enter your bio here."}/>

      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {global.langProfileAlert}
      txtGotIt = {global.langGotIt}
      onPressClose = {()=>this.setState({isVisible2:false}) }/>

      <InfoButton
      onPress = {()=> this.setState({isVisible2: true})}
      bottom = {(this.height*16)/100 + headerHeight + getStatusBarHeight()}
      right = {this.width*(4.6/10)}/>

    </View>

        );
  }
}
