import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, StackActions, CommonActions, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import DateTimePicker from '@react-native-community/datetimepicker'
import auth from '@react-native-firebase/auth';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
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

import DatePickerIOSModal from '../Components/ProfileSteps/UserInfo/DatePickerIOSModal'
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
      iosDatePickerVisible: false,
      showDatePicker: false,
      dateTextColor: "gray",
      pickerTextColor: "gray",
      splashOver : false,
      color: 'rgba(0,0,0,0.4)',
      dateSet: false,
      date: new Date(),
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
getStringFromDateObject(date){
  var lang = language[global.lang]
  if(!this.state.dateSet){
    return lang.SelectYourBirthday
  }

  let month = date.getMonth();
  let day = date.getDate();
  let year = date.getFullYear();
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  let monthWritten =lang[months[month]];
  console.log("AY:", monthWritten)
  if(global.lang == "langTR"){
    return day + " " + monthWritten + " " + year
  }
  else{
    return monthWritten + " " + day + ", " + year
  }

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

      <SafeAreaView
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
      style={{width: this.width, height: this.width*(12/100), flexDirection: 'column',  flex:1, alignItems: 'center', justifyContent:"center"}}>
      <TouchableOpacity
      activeOpacity = {1}
      style = {{height: "50%", width: this.width*(60/100), borderBottomColor: global.themeColor, borderBottomWidth: 2, alignItems: 'flex-start', justifyContent:"center" }}
      onPress = {()=> this.setState({showDatePicker: true, iosDatePickerVisible: Platform.OS == "ios" ? true : false})}>
      <Text
      style = {{fontSize: 18*(this.width/360), color: this.state.dateSet ? global.themeColor: "gray" }}>
      {this.getStringFromDateObject(this.state.date)}
      </Text>
      </TouchableOpacity>


      </View>
      </View>

      {this.state.showDatePicker && Platform.OS === "Android" &&(
        <DateTimePicker
        style = {{ width: 300, opacity: 1, height: 300, marginTop: 50}}
          value={this.state.date}
          display = "spinner"
          minimumDate= {new Date("1921-01-01")}
          maximumDate={new Date(maxDate)}
          onChange={(event, date) => {
            if(event.type == "set"){
              if(date == null || global.globalGender == "" || global.globalGender == null || global.globalCountry == null || global.globalCountry == ""){
                this.setState({dateSet: true, showDatePicker: false, disabled: true, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 0.4})
              }
              else{
                this.setState({dateSet: true, showDatePicker: false, disabled: false, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 1})
              }
              global.globalBirthday = date
            }
            else{
              this.setState({showDatePicker: false})
            }

          }}
        />
      )}

      <DatePickerIOSModal
      maxDate={maxDate}
      isVisible = {this.state.searchOnIsVisible}
      onPressClose = {()=>this.setState({iosDatePickerVisible:false})}/>

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


      </SafeAreaView>

        );
  }
}
