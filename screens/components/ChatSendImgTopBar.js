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
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class ChatSendImgTopBar extends Component {


  static propTypes = {
    onPressCross: PropTypes.func,
    onPressTrash: PropTypes.func
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navbarHeight = this.height - this.windowHeight

    return(
      <View
      style={{width: this.width, height: this.width/10, justifyContent: "center", top: getStatusBarHeight()*2.2, position:"absolute", alignItems:"center"}}>

      <TouchableOpacity
      activeOpacity = {1}
      onPress = {this.props.onPressCross}
      style={{width: this.width/10, height: this.width/10, justifyContent: "center", left: this.width/20, position:"absolute", alignItems:"center"}}>
      <Image
      style = {{width: "50%", height: "50%"}}
      source = {{uri: "crosswhite"}}/>
      </TouchableOpacity>

      <TouchableOpacity
      activeOpacity = {1}
      onPress = {this.props.onPressTrash}
      style={{width: this.width/10, height: this.width/10, justifyContent: "center", right: this.width/20, position:"absolute", alignItems:"center"}}>
      <Image
      style = {{width: this.width/17*(302/328), height: this.width/17}}
      source = {{uri: "trashwhite"}}/>
      </TouchableOpacity>

      </View>
    )
  }
}

export * from './ChatSendImgTopBar';
