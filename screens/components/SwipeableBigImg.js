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
var opacity = 0;
export default class SwipeableBigImg extends Component {


  static propTypes = {
   isFavorite: PropTypes.bool,
   imgSource: PropTypes.string,
   width: PropTypes.object,
   height: PropTypes.object,
   top: PropTypes.object,
   right: PropTypes.number,
   onPress: PropTypes.func,
   backgroundOpacity: PropTypes.number
 }

  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Animated.View
      style={{ position: 'absolute', backgroundColor: 'rgba(244,92,66,0)',
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
       <View // SEND MESSAGE BUTONU
         style={{opacity: this.props.isFavorite, justifyContent: 'center', alignItems: 'center', width: '24%', height: '16%', backgroundColor: "rgba(128,128,128,0.5)",
         borderTopLeftRadius: 16,borderBottomRightRadius: 16}}
         onPress={this.props.onPress}
         disabled = {this.props.disabled}>

         <Image source={{uri: "star"}}
           style={{ height: '50%', width: '40%' }}
         />

       </View>
      </Animated.View>
    )
  }
}

export * from './SwipeableBigImg';
