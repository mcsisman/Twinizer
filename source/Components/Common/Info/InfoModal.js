import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
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
export default class InfoModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   alertFontSize: PropTypes.number,
   gotItFontSize: PropTypes.number,
   txtAlert: PropTypes.string,
   txtGotIt: PropTypes.string,
   onPressClose: PropTypes.func,
   animationInTiming: PropTypes.number,
   animationOutTiming: PropTypes.number,
   animationIn: PropTypes.string,
   backdropOpacity: PropTypes.number,

 }
 static defaultProps = {
   gotItFontSize: 15,
   alertFontSize: 15,
   animationInTiming: 500,
   animationOutTiming: 500,
   animationIn: "zoomInUp",
   animationOut: "zoomOutUp",
   backdropOpacity: 0.4,
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var backgroundColor = global.themeColor
    var commaIndex;
    for( i = backgroundColor.length -1; i >= 0; i--){
      if(backgroundColor[i] == ","){
        commaIndex = i
        break
      }
      backgroundColor
    }
    backgroundColor = backgroundColor.substring(0, commaIndex + 1)
    var opacityStr = (0.2).toString() + ")"
    backgroundColor = backgroundColor + opacityStr

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
      width: screenWidth*(6.5/10),
      paddingTop: 10,
      paddingBottom: 15,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <View style={{paddingTop: 10, paddingBottom: 10, width: screenWidth*(5.5/10), flex:1}}>

      <Text style={{ color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)" ,fontSize: this.props.alertFontSize*(screenWidth/360)}}>
      {this.props.txtAlert}
      </Text>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center', flex:1, width: screenWidth*(5.5/10)}}>
      <TouchableOpacity
      activeOpacity = {1}
      style={{ borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
      justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom:5}}
      onPress={this.props.onPressClose}>

      <Text style={{color: global.themeColor ,fontSize: this.props.gotItFontSize*(screenWidth/360)}}>
      {this.props.txtGotIt}
      </Text>
      </TouchableOpacity>
      </View>

      </View>
      </Modal>
    )
  }
}

export * from './InfoModal';
