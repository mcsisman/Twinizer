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
  StatusBar,
  Animated
} from 'react-native';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class SwipeableBigImg extends Component {


  static propTypes = {
   imgSource: PropTypes.string,
   width: PropTypes.string,
   height: PropTypes.string,
   top: PropTypes.string,
   right: PropTypes.number,
   onPress: PropTypes.func,
   backgroundOpacity: PropTypes.number
 }

  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Animated.View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)',
       width: this.props.width, height: this.props.height, top: this.props.top, right: this.props.right , borderBottomLeftRadius: 16, borderTopRightRadius: 16,
       borderTopLeftRadius: 16, borderBottomRightRadius: 16}}>
       <TouchableOpacity
       activeOpacity = {1}
       style = {{width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
       borderTopLeftRadius: 16, borderBottomRightRadius: 16, flex:1, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}
       onPress={this.props.onPress}>

       <Image source={{uri: this.props.imgSource}}
         style={{  width: '100%', height: '100%', position: 'absolute', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />

       <View
         style={{  width: '100%', height: '100%', position: 'absolute', backgroundColor: "black", opacity: this.props.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       </TouchableOpacity>
      </Animated.View>
    )
  }
}

export * from './SwipeableBigImg';
