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
        style={{flexDirection: 'column', position: 'absolute', bottom: this.height/2.1, right: this.width*(1.5/10), width: this.width*(7/10), alignItems: 'center'}}>
      <TextInput
        multiline = {true}
        maxLength = {100}
        placeholderTextColor='rgba(0,0,0,0.4)'
        placeholder= {"Hello World!"}
        style={{fontSize: 18*(this.width/360), width: this.width*(7/10),flex:1, borderColor: 'rgba(241,51,18,1)', borderBottomWidth: 2}}
        onChangeText={this.props.onChangeText}>
      </TextInput>

      <View
      style = {{paddingTop: 7, width: this.width*(7/10), flex:1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize: 18*(this.width/360), opacity: 0.4}}>
      {this.props.characterNo + "/" + this.props.characterLimit}
      </Text>
      </View>

      </View>
    )
  }
}

export * from './MultilineTextInput';
