import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar
} from 'react-native';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class DatePickerIOSModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: new Date(),
    }
  }

  static propTypes = {
    maxDate: PropTypes.string,
    isVisible: PropTypes.bool,
    onPressClose: PropTypes.func,
 }
 static defaultProps = {
 }

 getInfo(dateSet){

 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);


    return(

      <Modal /*BİLGİLENDİRME MODALI*/
      style = {{alignItems: 'center'}}
      onBackdropPress = {this.props.onPressClose}
      backdropOpacity = {0.4}
      coverScreen = {false}
      deviceHeight = {screenHeight}
      deviceWidth = {screenWidth}
      animationIn = "zoomInUp"
      animationOut = "zoomOutUp"
      animationInTiming = {500}
      animationOutTiming = {500}
      isVisible={this.props.isVisible}>
      <View style={{
      borderRadius: 8, borderWidth: 0.3, borderColor: "rgba(0,0,0,4)",
      backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      width: screenWidth*(7.5/10),
      paddingTop: 10,
      paddingBottom: 15,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <DateTimePicker
      style = {{ width: 300, opacity: 1, height: 300, marginTop: 50}}
        value={this.state.date}
        display = "spinner"
        minimumDate= {new Date("1921-01-01")}
        maximumDate={new Date(this.props.maxDate)}
        onChange={(event, date) => {
          if(event.type == "set"){
            /*/if(date == null || global.globalGender == "" || global.globalGender == null || global.globalCountry == null || global.globalCountry == ""){
              this.setState({dateSet: true, showDatePicker: false, disabled: true, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 0.4})
            }
            else{
              this.setState({dateSet: true, showDatePicker: false, disabled: false, dateTextColor: global.themeColor, date: date, buttonOpacity: global.themeColor, opacity: 1})
            }
            global.globalBirthday = date*/
          }
          else{
            console.log("SET DEĞİLLL")
          }

        }}
      />

      </View>
      </Modal>
    )
  }
}

export * from './DatePickerIOSModal';
