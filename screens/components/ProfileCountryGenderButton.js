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
export default class ProfileCountryGenderButton extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   bottom: PropTypes.number,
   text: PropTypes.string,
   disabled: PropTypes.bool
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <TouchableOpacity
      activeOpacity = {1}
      disabled = {this.props.disabled}
      onPress = {this.props.onPress}
      style={{opacity: this.props.opacity, backgroundColor:"white", borderWidth: 0.4, borderColor:"gray", width: this.width/2*(8/10),
      height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center"}}>

      <Text
      numberOfLines={1}
      style={{paddingLeft: 12, paddingRight: 12, fontSize: 16*(this.width/360)}}>
      {this.props.text}
      </Text>

      </TouchableOpacity>
    )
  }
}

export * from './ProfileCountryGenderButton';
