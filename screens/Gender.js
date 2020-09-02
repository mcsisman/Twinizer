import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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
      pickerTextColor: "gray",
      splashOver : false,
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: global.themeColor,
      opacity: 0.4,
      disabled: true,
      femaleText: global.themeColor,
      maleText: global.themeColor,
      maleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      gender: "",
      country: "Country",
      selectedValue: "Select a Country"
    }
    var selectedValue = "Select"
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
    this.setState({maleBG: global.themeColor, maleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)" ,
    femaleText: global.themeColor, disabled: true,  buttonOpacity: global.themeColor, gender: "Male", opacity: 0.4})
  }
  else { // MALE IS SELECTED, COUNTRY IS SELECTED
    this.setState({maleBG: global.themeColor, maleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
    femaleText: global.themeColor, disabled: false, buttonOpacity: global.themeColor, gender: "Male", opacity: 1})
  }
  global.globalGender = "Male";
}
femaleSelected(){ // FEMALE IS SELECTED, COUNTRY IS NOT SELECTED
  if (global.globalCountry == null || global.globalCountry == ""){
    this.setState({femaleBG: global.themeColor, femaleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", maleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
     maleText: global.themeColor, disabled: true, buttonOpacity: global.themeColor, gender: "Female", opacity: 0.4})
  }
  else { // FEMALE IS SELECTED, COUNTRY IS ELECTED
    this.setState({femaleBG: global.themeColor, femaleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", maleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
    maleText: global.themeColor, disabled: false, buttonOpacity: global.themeColor, gender: "Female", opacity: 1})
  }
  global.globalGender = "Female";
}

valueChange(value){
  this.setState({selectedValue: value.label})
  if(value == null || global.globalGender == ""){ // IF COUNTRY OR GENDER IS NOT SELECTED, DISABLE THE NEXT BUTTON
    this.setState({country: "Country", color: 'rgba(0,0,0,0.4)', disabled: true, buttonOpacity: global.themeColor, opacity: 0.4})
  }
  else{ // IF BOTH COUNTRY AND GENDER IS SELECTED, ENABLE THE NEXT BUTTON
    this.setState({country: value.label, color: global.themeColor, buttonOpacity: global.themeColor, disabled: false, opacity: 1})
  }
  console.log("VALUEEEEEEEEE:", this.state.selectedValue)
  console.log("KEYYYYYYYYYY:", value.key)
  global.globalCountry = value.label;
}

  render(){

    return(

      <View
      style={{width: this.width, height: this.height, top: 0, flex:1, flexDirection: 'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {global.langCompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>
      <OvalButton
      opacity = {1}
      width = {this.width*3/10}
      bottom = {(this.height*50)/100}
      right = {this.width*(1.5/10)}
      borderColor = {global.themeColor}
      title = {global.langMale}
      backgroundColor = {this.state.maleBG}
      textColor = {this.state.maleText}
      onPress = { ()=> this.maleSelected()}/>

      <OvalButton
      opacity = {1}
      width = {this.width*3/10}
      bottom = {(this.height*50)/100}
      right = {this.width*(5.5/10)}
      borderColor = {global.themeColor}
      title = {global.langFemale}
      backgroundColor = {this.state.femaleBG}
      textColor = {this.state.femaleText}
      onPress = { ()=> this.femaleSelected()}/>

      <TextBox
      text = {global.langSelectGender}/>

      <CountryPicker
      borderBottomColor = {global.themeColor}
      width = {this.width*(60/100)}
      height = {this.width*(12/100)}
      right = {this.width*(20/100)}
      bottom = {this.height*(3.5/10)}
      onValueChange = {(value) => this.valueChange(value)}
      items = {countries.newGenderItems}
      label = {global.langCountry}
      textColor = {this.state.pickerTextColor}
      selectedValue = {this.state.selectedValue}/>


      <PageDots
      pageNo = {1}/>

      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      bottom = {(this.height*12)/100}
      right = {this.width*(3.5/10)}
      title = {global.langNext}
      textColor = {this.state.buttonOpacity}
      opacity = {this.state.opacity}
      onPress = { ()=> this.writeGenderToDatabase()}
      disabled = {this.state.disabled}
      borderColor = {this.state.buttonOpacity}/>

      </View>

        );
  }
}
