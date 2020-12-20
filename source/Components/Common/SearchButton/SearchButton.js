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
export default class SearchButton extends Component {


  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onPress: PropTypes.func,
    bottom: PropTypes.number,
    right: PropTypes.number,
    disabled: PropTypes.bool,
    opacity: PropTypes.number
 }
 static defaultProps = {
   width: screenWidth/10,
   height: screenWidth/10
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    var backgroundColor = global.themeColor
    var commaIndex;
    for( i = backgroundColor.length -1; i >= 0; i--){
      if(backgroundColor[i] == ","){
        commaIndex = i
        break
      }
      backgroundColor
    }
    backgroundColor = backgroundColor.substring(0, commaIndex + 1)
    var opacityStr = (this.props.opacity).toString() + ")"
    backgroundColor = backgroundColor + opacityStr

    return(
      <TouchableOpacity
      activeOpacity = {this.props.opacity}
      style={{ flex: 1, alignItems:'center', justifyContent: 'center', position: 'absolute', backgroundColor: backgroundColor,
       width: this.props.width, height: this.props.height, bottom: this.props.bottom, right: this.props.right, borderBottomLeftRadius: 65, borderTopRightRadius: 65,
       borderTopLeftRadius: 65, borderBottomRightRadius: 65}}
       disabled = {this.props.disabled}
       onPress={this.props.onPress}>
       <Image source={{uri: 'search'}}
       style={{opacity: 1, width: '50%', height: '50%',  position: 'absolute', flex:1 }}/>
      </TouchableOpacity>
    )
  }
}

export * from './SearchButton';
