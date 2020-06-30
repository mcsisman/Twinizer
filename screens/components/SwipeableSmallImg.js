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
export default class SwipeableSmallImg extends Component {


  static propTypes = {
   imgSource: PropTypes.string,
   right: PropTypes.number,
   backgroundOpacity: PropTypes.number
 }

  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)', opacity: 1,
       width: this.width*2/10, height: this.width*(2/10)*(7/6), top: this.width*7/40, right: this.props.right, borderBottomLeftRadius: 8, borderTopRightRadius: 8,
       borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
       <Image source={{uri: this.props.imgSource}}
         style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       <View
         style={{  width: '100%', height: '100%', backgroundColor: "black",  position: 'absolute', opacity: this.props.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
      </View>
    )
  }
}

export * from './SwipeableSmallImg';
