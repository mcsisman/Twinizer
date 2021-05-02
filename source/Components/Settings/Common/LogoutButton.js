import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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
export default class LogoutButton extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   top: PropTypes.string,
   text: PropTypes.string,
   position: PropTypes.string
 }
 static defaultProps = {
   text: "Log Out",
   position: "relative"
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <TouchableOpacity
      activeOpacity = {1}
      style={{ top: this.props.top, position: this.props.position, borderTopWidth:1, borderBottomWidth:1, borderColor: global.isDarkMode ? global.darkModeColors[0] : 'rgba(128,128,128,0.3)',
      backgroundColor: global.isDarkMode ?  global.darkModeColors[2] : 'rgba(255,255,255,1)', justifyContent: 'center', width: this.width, height: this.width/8}}
      onPress={this.props.onPress}>
      <Text
        style = {{color: global.themeColor, fontSize: 18*this.width/360, textAlign: "center" }}>
        {this.props.text}
      </Text>
      </TouchableOpacity>
    )
  }
}

export * from './LogoutButton';
