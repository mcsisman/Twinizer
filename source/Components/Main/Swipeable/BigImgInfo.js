import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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
  StatusBar,
  Animated
} from 'react-native';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class BigImgInfo extends Component {


  static propTypes = {
   opacity: PropTypes.number,
   username: PropTypes.string,
   country: PropTypes.string
 }

  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View style={{opacity: this.props.opacity , flexDirection: 'column',
      width: this.width, height: this.width/6, left: 0}}>

      <View style={{alignItems: 'center', width: this.width, height: "50%", justifyContent: 'center'}}>
      <Text style={{ color: global.isDarkMode ? "white":"black", fontSize: 22*(this.width/360)}}
      adjustsFontSizeToFit = {true}
      numberOfLines = {1}>
        {this.props.username}
        </Text>
      </View>

      <View style={{alignItems: 'center', width: this.width, height: "50%", justifyContent: 'center'}}>
      <Text style={{ color: global.isDarkMode ? "white":"black", fontSize: 18*(this.width/360)}}
      adjustsFontSizeToFit = {true}
      numberOfLines = {1}>
        {this.props.country}
        </Text>
      </View>

      </View>
    )
  }
}

export * from './BigImgInfo';
