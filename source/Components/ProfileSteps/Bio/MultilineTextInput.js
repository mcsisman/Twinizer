import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
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
export default class MultilineTextInput extends Component {


  static propTypes = {
   onChangeText: PropTypes.func,
   characterLimit: PropTypes.string,
   characterNo: PropTypes.number


 }
 static defaultProps = {
   characterLimit: '100'
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View
        style={{flexDirection: 'column', position: 'absolute', width: this.width*(7/10), alignItems: 'center'}}>
      <TextInput
        blurOnSubmit = {true}
        multiline = {true}
        maxLength = {100}
        placeholderTextColor = {global.isDarkMode ? "rgba(255,255,255,0.4)": "rgba(0,0,0,0.4)"}
        placeholder= {"Hello World!"}
        style={{ paddingLeft: 0, paddingBottom: 0, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)", fontSize: 18*(this.width/360), width: this.width*(9/10), flex:1, borderColor: global.themeColor, borderBottomWidth: 2}}
        onChangeText={this.props.onChangeText}>
      </TextInput>

      <View
      style = {{paddingTop: 7, width: this.width*(7/10), flex:1, justifyContent: 'center', alignItems: 'flex-end' }}>
      <Text style={{color: global.themeColor, fontSize: 18*(this.width/360), opacity: 0.4}}>
      {this.props.characterNo + "/" + this.props.characterLimit}
      </Text>
      </View>

      </View>
    )
  }
}

export * from './MultilineTextInput';
