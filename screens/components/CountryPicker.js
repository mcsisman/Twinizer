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
   label: PropTypes.string
 }
 static defaultProps = {
   width: screenWidth*(60/100),
   height: screenWidth*(12/100),
   right: screenWidth*(20/100),
   bottom: screenHeight*(3.5/10)
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View style = {{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)',  width:this.props.width , height: this.props.height, position: 'absolute',
      right: this.props.right, bottom: this.props.bottom, borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2 }}>
      <RNPickerSelect
        placeholder={{
          label: this.props.label,
          value: null,
          color: 'white',
        }}
          placeholderTextColor='rgba(0,0,0,0.4)'
          onValueChange={this.props.onValueChange}
          items={this.props.items}
        />
      </View>
    )
  }
}

export * from './CountryPicker';
