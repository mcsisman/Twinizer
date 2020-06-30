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
export default class SendMsgButton extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   disabled: PropTypes.bool,
   opacity: PropTypes.number
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <TouchableOpacity // SEND MESSAGE BUTONU
        activeOpacity = {1}
        style={{ opacity: this.props.opacity, justifyContent: 'center', position: 'absolute', alignItems: 'center', width: this.width*(5/10), height: this.width*(1/13)*(7/6),
        top: this.width*(5/10)*(7/6) + (this.height)*(20/100) + getStatusBarHeight(), right: this.width*(2.5/10), borderBottomLeftRadius: 16,
        borderTopRightRadius: 16, borderTopLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: 'rgba(77,120,204,1)'}}
        onPress={this.props.onPress}
        disabled = {this.props.disabled}>

        <Image source={{uri: "sendmessage"}}
          style={{ height: this.width*(1/13)*(7/6)*(6/10), width: this.width*(1/13)*(7/6)*(6/10)*2.62 }}
        />

      </TouchableOpacity>
    )
  }
}

export * from './SendMsgButton';
