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
   onPressPlus: PropTypes.func,
   onPressSend: PropTypes.func
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
      bottom = this.props.keyboardHeight + this.navbarHeight;
    }
    else{
      bottom = 0
    }
    return(
      <View
      style={{width: this.width, height: this.width/5, justifyContent: "center", bottom: bottom, position:"absolute", alignItems:"center"}}>

      <View
      style={{ width: this.width, left: 0, height: this.width/10, bottom: "25%",
      position: "absolute", justifyContent:"flex-start", alignItems:"flex-end", flexDirection: "row"}}>

      <View
      style={{ left: this.width *0.25/10, width: this.width*0.87/10, height: this.width*0.87/10, justifyContent:"flex-end", alignItems: "flex-end"}}>
      <TouchableOpacity
      onPress = {this.props.onPressPlus}
      activeOpacity = {1}
      style={{borderTopLeftRadius:555, borderTopRightRadius: 555, borderBottomLeftRadius: 555, borderBottomRightRadius: 555,
         backgroundColor:"rgba(255,255,255,0.8)", justifyContent:"center", alignItems: "center", width: "100%", height: "100%"}}>

      <Image source={{uri: "circleplus" + global.themeForImages}}
        style={{width: "100%", height: "100%"}}
      />

      </TouchableOpacity>
      </View>

      <View
        style={{ backgroundColor:"white", width: this.width*6.5/10, borderTopLeftRadius: 24, position:"absolute", right: this.width*2.125/10,
        borderTopRightRadius: 24, borderBottomLeftRadius: 24, paddingTop: 0, paddingBottom: 0, borderBottomRightRadius: 24, }}>
      <TextInput
        style={{height: this.width*0.87/10,paddingLeft: 10, paddingRight: 10,  fontSize: 15*(this.width/360) , paddingTop: 3.5, paddingBottom: 3.5}}

        placeholderTextColor='rgba(0,0,0,0.5)'
        placeholder= {"Type your message"}
        onChangeText={this.props.onChangeText}>
      </TextInput>
      </View>

      <View
      style={{width: this.width*2/10, height: "100%", justifyContent:"flex-end", alignItems: "center",  right: 0, position: "absolute" }}>
      <TouchableOpacity
      activeOpacity = {1}
      onPress = {this.props.onPressSend}
      style={{paddingLeft: 12, paddingRight: 12, borderBottomRightRadius: 36, borderBottomLeftRadius:36, height: "87%",
        borderTopLeftRadius:36, borderTopRightRadius:36, justifyContent:"center", alignItems: "center", backgroundColor: global.themeColor,
        borderColor: global.themeColor, borderWidth: 1}}>
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
