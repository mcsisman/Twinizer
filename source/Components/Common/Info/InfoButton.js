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
export default class InfoButton extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   bottom: PropTypes.number,
   right: PropTypes.number,
   opacity: PropTypes.number,
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <TouchableOpacity
      activeOpacity = {1}
      style={{ opacity: this.props.opacity, alignItems:'center', justifyContent: 'center', position: 'absolute', width: this.width*(0.8/10), height: this.width*(0.8/10),
      bottom: this.props.bottom, right: this.props.right, borderBottomLeftRadius: 65, borderTopRightRadius: 65, borderTopLeftRadius: 65, borderBottomRightRadius: 65}}
      onPress={this.props.onPress}>
      <Image source={{uri: 'question'}}
      style={{opacity: this.props.opacity, width: '100%', height: '100%',  position: 'absolute', flex:1 }}/>
      </TouchableOpacity>
    )
  }
}

export * from './InfoButton';
