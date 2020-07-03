import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import RNPickerSelect from 'react-native-picker-select';
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
export default class CountryPicker extends Component {


  static propTypes = {
   width: PropTypes.number,
   height: PropTypes.number,
   bottom: PropTypes.number,
   right: PropTypes.number,
   onValueChange: PropTypes.func,
   items: PropTypes.array,
   label: PropTypes.string,
   value: PropTypes.string,
   disabled: PropTypes.bool,
   opacity: PropTypes.number,
   onOpen: PropTypes.func,
   borderWidth: PropTypes.number,
   borderBottomWidth: PropTypes.number,
   placeHolder: PropTypes.bool,
   backgroundColor: PropTypes.string
 }
 static defaultProps = {
   borderBottomWidth: 2,
   borderBottomColor: 'rgba(241,51,18,1)',
   placeHolder: true,
   backgroundColor: 'rgba(0,0,0,0)'
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    console.log("PLACEHOLDER:", this.props.placeHolder)
    if(this.props.placeHolder){
      return(
        <View style = {{paddingLeft: 5, opacity: this.props.opacity, justifyContent: 'center', backgroundColor: this.props.backgroundColor,  width:this.props.width ,
        height: this.props.height, position: 'absolute', right: this.props.right, bottom: this.props.bottom, borderBottomColor: this.props.borderBottomColor, borderColor: this.props.borderColor,
        borderBottomWidth: this.props.borderBottomWidth, borderTopWidth: this.props.borderWidth, borderRightWidth: this.props.borderWidth, borderLeftWidth: this.props.borderWidth }}>
        <RNPickerSelect
        placeholder={{
            label: this.props.label,
            value: null,
            color: 'white',
          }}
        placeholderTextColor='rgba(0,0,0,0.4)'
        fontSize = {18}
        disabled = {this.props.disabled}
        opacity = {this.props.opacity}
        onOpen = {this.props.onOpen}
        onValueChange = {this.props.onValueChange}
        items = {this.props.items}  />
        </View>
      )
    }
    else{
      return(
        <View style = {{paddingLeft: 5, opacity: this.props.opacity, justifyContent: 'center', backgroundColor: 'white',  width:this.props.width ,
        height: this.props.height, right: this.props.right, bottom: this.props.bottom, borderBottomColor: this.props.borderBottomColor, borderColor: this.props.borderColor,
        borderBottomWidth: this.props.borderBottomWidth, borderTopWidth: this.props.borderWidth, borderRightWidth: this.props.borderWidth, borderLeftWidth: this.props.borderWidth }}>
        <RNPickerSelect
        fontSize = {18}
        value = {this.props.value}
        disabled = {this.props.disabled}
        opacity = {this.props.opacity}
        onOpen = {this.props.onOpen}
        onValueChange = {this.props.onValueChange}
        items = {this.props.items}  />
        </View>
      )
    }

  }
}

export * from './CountryPicker';
