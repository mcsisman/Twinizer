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
export default class ProfileBioButton extends Component {


  static propTypes = {
   onChangeText: PropTypes.func,
   characterLimit: PropTypes.string,
   characterNo: PropTypes.number,
   onFocus: PropTypes.func,
   defaultText: PropTypes.defaultText,
   opacity: PropTypes.number
 }
 static defaultProps = {
   characterLimit: '100'
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View
        style={{ opacity: this.props.opacity, top: "52%", position:"absolute", borderColor:"gray", borderWidth: 0.4, backgroundColor:"white", flexDirection: 'column', alignItems: 'center'}}>
      <TextInput
        onFocus = {this.props.onFocus}
        defaultValue = {this.props.defaultText}
        multiline = {true}
        maxLength = {100}
        style={{paddingLeft: 10, fontSize: 16*(this.width/360), width: this.width*(7/10), }}
        onChangeText={this.props.onChangeText}>
      </TextInput>

      <View
      style = {{paddingBottom: 7, width: this.width*(7/10), justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 }}>
      <Text style={{fontSize: 15*(this.width/360), opacity: 0.7, color: "red"}}>
      {this.props.characterNo + "/" + this.props.characterLimit}
      </Text>
      </View>

      </View>
    )
  }
}

export * from './ProfileBioButton';
