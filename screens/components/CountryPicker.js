import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import ModalSelector from 'react-native-modal-selector'
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
   placeHolder: PropTypes.string,
   backgroundColor: PropTypes.string,
   selectedValue: PropTypes.string
 }
 static defaultProps = {
   selectedValue: "Select Something",
   borderBottomWidth: 2,
   borderBottomColor: global.themeColor,
   placeHolder: true,
   backgroundColor: 'rgba(0,0,0,0)'
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    if(this.props.placeHolder){
      return(
        <View style = {{paddingLeft: 5, opacity: this.props.opacity, justifyContent: 'center', backgroundColor: this.props.backgroundColor,  width:this.props.width ,
        height: this.props.height, position: 'absolute', right: this.props.right, bottom: this.props.bottom, borderBottomColor: this.props.borderBottomColor, borderColor: this.props.borderColor,
        borderBottomWidth: this.props.borderBottomWidth, borderTopWidth: this.props.borderWidth, borderRightWidth: this.props.borderWidth, borderLeftWidth: this.props.borderWidth }}>
        <ModalSelector
        touchableActiveOpacity = {1}
        disabled = {this.props.disabled}
        onChange = {this.props.onValueChange}
        data = {this.props.items}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}>

        <TextInput
        style={{ height: 40, fontSize: 18, color: this.props.selectedValue == "Select a Country" ||  this.props.selectedValue == "Select a Gender" ? "gray" : global.themeColor }}
        editable={false}
        placeholderTextColor={"black"}
        value = {this.props.selectedValue} />
        </ModalSelector>
        </View>
      )
    }
    else{
      return(
        <View style = {{paddingLeft: 5, opacity: this.props.opacity, justifyContent: 'center', backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)",  width:this.props.width ,
        height: this.props.height, right: this.props.right, bottom: this.props.bottom, borderBottomColor: this.props.borderBottomColor, borderColor: this.props.borderColor,
        borderBottomWidth: this.props.borderBottomWidth, borderTopWidth: this.props.borderWidth, borderRightWidth: this.props.borderWidth, borderLeftWidth: this.props.borderWidth }}>
        <ModalSelector
        touchableActiveOpacity = {1}
        disabled = {this.props.disabled}
        onChange = {this.props.onValueChange}
        data = {this.props.items}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}>

        <TextInput
        style={{ height: 40, fontSize: 14*(this.width/360), color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
        editable={false}
        placeholderTextColor={"black"}
        value = {this.props.selectedValue} />
        </ModalSelector>
        </View>
      )
    }

  }
}

export * from './CountryPicker';
