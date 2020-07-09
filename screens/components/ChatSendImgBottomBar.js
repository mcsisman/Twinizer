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
export default class ChatSendImgBottomBar extends Component {


  static propTypes = {
   onChangeText: PropTypes.func,
   keyboardOpen: PropTypes.bool,
   keyboardHeight: PropTypes.number,
   keyboardYcord: PropTypes.number,
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navbarHeight = this.height - this.windowHeight
    var bottom = 0;
    if(this.props.keyboardOpen){
      console.log("navbar: ", this.navbarHeight)
      bottom = this.props.keyboardHeight + this.navbarHeight;
    }
    else{
      console.log("ELSE")
      bottom = 0
    }
    console.log("BOTTOM: ", bottom)
    return(
      <View
      style={{backgroundColor: "black", width: this.width, height: this.height/8, justifyContent: "center", bottom: bottom, position:"absolute", alignItems:"center"}}>

      <View
      style={{width: this.width*9.5/10, left: this.width/20, paddingTop: 5, paddingBottom: 5, bottom: "25%",
      position: "absolute", justifyContent:"center", alignItems:"flex-start", flexDirection: "row"}}>

      <View
        style={{backgroundColor: "white", width: this.width*7/10, borderTopLeftRadius: 24,
        borderTopRightRadius: 24, borderBottomLeftRadius: 24, paddingTop: 0, paddingBottom: 0, borderBottomRightRadius: 24,}}>
      <TextInput
        style={{paddingLeft: 10, paddingRight: 10,  fontSize: 15*(this.width/360) , paddingTop: 3.5, paddingBottom: 3.5}}
        multiline = {true}
        maxLength = {100}
        placeholderTextColor='rgba(0,0,0,0.5)'
        placeholder= {"Type your message ."}
        onChangeText={this.props.onChangeText}>
      </TextInput>
      </View>

      <View
      style={{width: this.width*2.5/10, height: "100%", justifyContent:"center", alignItems: "center"}}>
      <TouchableOpacity
      activeOpacity = {1}
      style={{paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5, borderBottomRightRadius: 36, borderBottomLeftRadius:36,
        borderTopLeftRadius:36, borderTopRightRadius:36, justifyContent:"center", alignItems: "center", backgroundColor: "rgba(241,51,18,1)",
        borderColor: "rgba(241,51,18,1)", borderWidth: 1}}>
      <Text
      style = {{fontSize: 15*(this.width/360), fontWeight: "bold",  color: "white"}}>
      Send
      </Text>
      </TouchableOpacity>
      </View>

      </View>

      </View>
    )
  }
}

export * from './ChatSendImgBottomBar';
