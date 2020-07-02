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
export default class FavoriteUserButton extends Component {


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
        style={{ opacity: this.props.opacity, justifyContent: 'center', alignItems: 'center', width: this.width/6, height: this.width/10, borderRightWidth: 0.7, borderColor: "white"}}
        onPress={this.props.onPress}
        disabled = {this.props.disabled}>

        <Image source={{uri: "stargreen"}}
          style={{ height: this.width/10*(7/10), width: this.width/10*(7/10) }}
        />

      </TouchableOpacity>
    )
  }
}

export * from './FavoriteUserButton';
