import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, StackActions, CommonActions, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import DateTimePicker from '@react-native-community/datetimepicker'
import auth from '@react-native-firebase/auth';
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
   Platform} from 'react-native';

import ProfileUploadScreen from './ProfileUpload';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import OvalButton from '../Components/Common/OvalButton/OvalButton'
import CustomPicker from '../Components/Common/Pickers/CustomPicker'
import PageDots from '../Components/ProfileSteps/Common/PageDots'
import TextBox from '../Components/ProfileSteps/Common/TextBox'
import language from '../Utils/Languages/lang.json'


import countries from '../Utils/Countries';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}


export default class UserInfoScreen extends Component<{}>{
  constructor(props){
    var lang = language[global.lang]
    super(props);
    this.state = {
      showDatePicker: false,
      dateTextColor: "gray",
      pickerTextColor: "gray",
      splashOver : false,
      color: 'rgba(0,0,0,0.4)',
      date:new Date(),
      buttonOpacity: global.themeColor,
      opacity: 0.4,
      disabled: true,
      femaleText: global.themeColor,
      maleText: global.themeColor,
      maleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      gender: "",
      country: "Country",
      selectedValue: lang.SelectYourCountry
    }
    var selectedValue = "Select"
    this.countries = countries.countries
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.globalGender = "";
    global.globalBirthday = "";
    global.globalCountry = "";
    this.props.navigation.setParams({ otherParam: lang.CompleteYourProfile })
  }
componentDidMount(){
};
static navigationOptions = {
    header: null,
};

maleSelected(){

  if (global.globalCountry == null || global.globalCountry == "" || global.globalBirthday == null || global.globalBirthday == ""){ // MALE IS SELECTED, COUNTRY IS NOT SELECTED
    this.setState({showDatePicker: true, maleBG: global.themeColor, maleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)" ,
    femaleText: global.themeColor, disabled: true,  buttonOpacity: global.themeColor, gender: "Male", opacity: 0.4})
  }
  else { // MALE IS SELECTED, COUNTRY IS SELECTED
    this.setState({showDatePicker: true, maleBG: global.themeColor, maleText: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", femaleBG: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
    femaleText: global.themeColor, disabled: false, buttonOpacity: global.themeColor, gender: "Male", opacity: 1})
  }
  global.globalGender = "Male";
}
femaleSelected(){ // FEMALE IS SELECTED, COUNTRY IS NOT SELECTED
  if (global.globalCountry == null || global.globalCountry == "" || global.globalBirthday == null || global.globalBirthday == ""){
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
  if(value == null || global.globalGender == "" || global.globalBirthday == null || global.globalBirthday == ""){ // IF COUNTRY OR GENDER IS NOT SELECTED, DISABLE THE NEXT BUTTON
    this.setState({country: "Country", color: 'rgba(0,0,0,0.4)', disabled: true, buttonOpacity: global.themeColor, opacity: 0.4})
  }
  else{ // IF BOTH COUNTRY AND GENDER IS SELECTED, ENABLE THE NEXT BUTTON
    this.setState({country: value.label, color: global.themeColor, buttonOpacity: global.themeColor, disabled: false, opacity: 1})
  }
  console.log("VALUEEEEEEEEE:", this.state.selectedValue)
  console.log("KEYYYYYYYYYY:", value.key)
  global.globalCountry = value.label;
}

async goBack(){
  var lang = language[global.lang]
  await auth().signOut().then(function() {
    console.log("LOGOUT SUCCESSFUL")
  }).catch(error => {
    Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
  });
  this.props.navigation.dispatch(StackActions.popToTop());
}

  render(){
    var lang = language[global.lang]
    var s = lang.SelectYourBirthday
    const { date } = this.state.date;
    var todayYear = new Date().getFullYear() - 18;
    var todayMonth = new Date().getMonth() + 1
    var today = new Date().getDate()
    if(today.length = 1){
      today = "0" + today
    }
    if(todayMonth.length = 1){
      todayMonth = "0" + todayMonth
    }
    var maxDate = todayYear + "-" + todayMonth + "-" + today
    console.log("y:", todayYear)
    console.log("m:", todayMonth)
    console.log("d:", today)
    console.log( "date:", maxDate)

    return(

      <View
      style={{width: this.width, height: this.height, top: 0, flex:1, flexDirection: 'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {lang.CompleteYourProfile}
      onPress = {async ()=> await this.goBack()}/>

      <View
      style={{width: this.width, height: this.height-getStatusBarHeight() - headerHeight, bottom: 0,flexDirection: 'column', alignItems: 'center', }}>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', flex:1, alignItems: 'center',}}>

      <View
      style={{width: this.width, height: "50%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      <TextBox
      text = {lang.PleaseEnterYourInformation}/>
      </View>

      <View
      style={{width: this.width, height: "50%", flexDirection: 'row', flex:1, alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: "50%", height: "100%",  flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      <OvalButton
      opacity = {1}
      width = {this.width*3/10}
      borderColor = {global.themeColor}
      title = {lang.Male}
      backgroundColor = {this.state.maleBG}
      textColor = {this.state.maleText}
      onPress = { ()=> this.maleSelected()}/>
      </View>

      <View
      style={{width: "50%", height: "100%",  flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      <OvalButton
      opacity = {1}
      borderColor = {global.themeColor}
      title = {lang.Female}
      backgroundColor = {this.state.femaleBG}
      textColor = {this.state.femaleText}
      onPress = { ()=> this.femaleSelected()}/>
      </View>
      </View>

      </View>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', flex:1, alignItems: 'center',}}>
      <View
      style={{width: this.width, height: "50%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      <CustomPicker
      borderBottomColor = {global.themeColor}
      width = {this.width*(60/100)}
      height = {this.width*(12/100)}
      onValueChange = {(value) => this.valueChange(value)}
      items = {countries.newGenderItems}
      label = {lang.Country}
      textColor = {this.state.pickerTextColor}
      selectedValue = {this.state.selectedValue}/>
      </View>
      <View
      style={{backgroundColor:"red", width: this.width, height: "50%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent:"center"}}>
      {this.state.showDatePicker &&(
        <DateTimePicker
          style={{borderBottomWidth: 2, borderBottomColor: global.themeColor, activeOpacity: 1, width: this.width*(60/100), height: this.width*(12/100), alignItems: "center",}}
          value={this.state.date}
          display = "spinner"
          showIcon={true}
          placeholder = {lang.SelectYourBirthday}
          format="MM-DD-YYYY"
          minimumDate= {new Date("1921-01-01")}
          maximumDate={new Date(maxDate)}
          disabled={false}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            placeholderText:{
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 20*(this.width/360),
              color:this.state.dateTextColor,
              paddingBottom: 0,
            },
            dateText:{
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 20*(this.width/360),
              color:this.state.dateTextColor,
              paddingBottom: 0,
            },
            dateIcon: {
              width: 0,
              height: 0,
              marginLeft: 0,
              paddingBottom: 0,
            },
            dateInput: {
              justifyContent: 'center',
              alignItems: 'flex-start',
              borderWidth: 0,
            }
          }}
          onChange={(event, date) => {
            if(event.type == "set"){
              if(date == null || global.globalGender == "" || global.globalGender == null || global.globalCountry == null || global.globalCountry == ""){
                this.setState({showDatePicker: false, disabled: true, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 0.4})
              }
              else{
                this.setState({showDatePicker: false, disabled: false, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 1})
              }
              global.globalBirthday = date
            }
            else{
              this.setState({showDatePicker: false})
            }

          }}
        />
      )}

      </View>
      </View>


      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      </View>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>
      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      title = {lang.Next}
      textColor = {this.state.buttonOpacity}
      opacity = {this.state.opacity}
      onPress = { ()=> this.props.navigation.navigate("ProfileUpload")}
      disabled = {this.state.disabled}
      borderColor = {this.state.buttonOpacity}/>

      </View>

      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', flex:1, alignItems: 'center', justifyContent: "center"}}>

      <PageDots
      pageNo = {1}/>
      </View>

      </View>
      </View>


      </View>

        );
  }
}
