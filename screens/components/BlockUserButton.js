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
export default class BlockUserButton extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   disabled: PropTypes.bool,
   opacity: PropTypes.number,
   image: PropTypes.string,
   width: PropTypes.number,
   height: PropTypes.number,
   isSelected: PropTypes.bool
 }
 static defaultProps = {
   width: screenWidth/6,
   height: screenWidth/10,
   image: "block",
   isSelected: false
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <TouchableOpacity // SEND MESSAGE BUTONU
        activeOpacity = {1}
        style={{ opacity: this.props.opacity, justifyContent: 'center', backgroundColor: this.props.isSelected ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        alignItems: 'center', width: this.props.width, height: this.props.height,
        borderBottomRightRadius: 16, borderTopRightRadius: 16}}
        onPress={this.props.onPress}
        disabled = {this.props.disabled}>

        <Image source={{uri: this.props.image}}
          style={{ height: this.width/10*(7/10), width: this.width/10*(7/10) }}
        />

      </TouchableOpacity>
    )
  }
}

export * from './BlockUserButton';
