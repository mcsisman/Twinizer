import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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
   StatusBar,
   Platform
  } from 'react-native';
import ProfileUploadScreen from './ProfileUpload';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import OvalButton from './components/OvalButton'
import PageDots from './components/PageDots'
import TextBox from './components/TextBox'
import CountryPicker from './components/CountryPicker'
import countries from './Countries';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}


export default class GenderScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: 'rgba(241,51,18,0.4)',
      disabled: true,
      femaleText: 'rgba(241,51,18,1)',
      maleText: 'rgba(241,51,18,1)',
      maleBG: "white",
      femaleBG: "white",
      gender: "",
      country: "Country"
    }
    this.countries = countries.countries
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.globalGender = "";
    global.globalCountry = "";
    this.props.navigation.setParams({ otherParam: global.langCompleteYourProfile })
  }
componentDidMount(){
};
static navigationOptions = {
    header: null,
};
writeGenderToDatabase(){
    this.props.navigation.navigate("ProfileUpload")
}


maleSelected(){

  if (global.globalCountry == null || global.globalCountry == ""){ // MALE IS SELECTED, COUNTRY IS NOT SELECTED
    this.setState({maleBG: 'rgba(241,51,18,1)', maleText: "white", femaleBG: "white", femaleText: 'rgba(241,51,18,1)', disabled: true,  buttonOpacity: 'rgba(241,51,18,0.4)', gender: "Male"})
  }
  else { // MALE IS SELECTED, COUNTRY IS SELECTED
    this.setState({maleBG: 'rgba(241,51,18,1)', maleText: "white", femaleBG: "white", femaleText: 'rgba(241,51,18,1)', disabled: false, buttonOpacity: 'rgba(241,51,18,1)', gender: "Male"})
  }
  global.globalGender = "Male";
}
femaleSelected(){ // FEMALE IS SELECTED, COUNTRY IS NOT SELECTED
  if (global.globalCountry == null || global.globalCountry == ""){
    this.setState({femaleBG: 'rgba(241,51,18,1)', femaleText: "white", maleBG: "white", maleText: 'rgba(241,51,18,1)', disabled: true, buttonOpacity: 'rgba(241,51,18,0.4)', gender: "Female"})
  }
  else { // FEMALE IS SELECTED, COUNTRY IS ELECTED
    this.setState({femaleBG: 'rgba(241,51,18,1)', femaleText: "white", maleBG: "white", maleText: 'rgba(241,51,18,1)', disabled: false, buttonOpacity: 'rgba(241,51,18,1)', gender: "Female"})
  }
  global.globalGender = "Female";
}

valueChange(value){
  if(value == null || global.globalGender == ""){ // IF COUNTRY OR GENDER IS NOT SELECTED, DISABLE THE NEXT BUTTON
    this.setState({country: "Country", color: 'rgba(0,0,0,0.4)', disabled: true, buttonOpacity: 'rgba(241,51,18,0.4)'})
  }
  else{ // IF BOTH COUNTRY AND GENDER IS SELECTED, ENABLE THE NEXT BUTTON
    this.setState({country: value, color: 'rgba(241,51,18,1)', buttonOpacity: 'rgba(241,51,18,1)', disabled: false})
  }
  global.globalCountry = value;
}

  render(){

    return(

      <View
      style={{width: this.width, height: this.height, top: 0, flex:1, flexDirection: 'column', alignItems: 'center',}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {global.langCompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>
      <OvalButton
      width = {this.width*3/10}
      bottom = {(this.height*50)/100}
      right = {this.width*(1.5/10)}
      title = {global.langMale}
      backgroundColor = {this.state.maleBG}
      textColor = {this.state.maleText}
      onPress = { ()=> this.maleSelected()}/>

      <OvalButton
      width = {this.width*3/10}
      bottom = {(this.height*50)/100}
      right = {this.width*(5.5/10)}
      title = {global.langFemale}
      backgroundColor = {this.state.femaleBG}
      textColor = {this.state.femaleText}
      onPress = { ()=> this.femaleSelected()}/>

      <TextBox
      text = {global.langSelectGender}/>

      <CountryPicker
      width = {this.width*(60/100)}
      height = {this.width*(12/100)}
      right = {this.width*(20/100)}
      bottom = {this.height*(3.5/10)}
      onValueChange = {(value) => this.valueChange(value)}
      items = {countries.genderItems}
      label = {global.langCountry}/>

      <PageDots
      pageNo = {1}/>

      <OvalButton
      width = {this.width*3/10}
      bottom = {(this.height*12)/100}
      right = {this.width*(3.5/10)}
      title = {global.langNext}
      textColor = {this.state.buttonOpacity}
      onPress = { ()=> this.writeGenderToDatabase()}
      disabled = {this.state.disabled}
      borderColor = {this.state.buttonOpacity}/>

      </View>

        );
  }
}
