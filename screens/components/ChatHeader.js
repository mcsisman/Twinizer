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
export default class ChatHeader extends Component {


  static propTypes = {
   onPressBack: PropTypes.func,
   onPressInfo: PropTypes.func,
   onPressCamera: PropTypes.func,
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <View
      style = {{ position: 'absolute', backgroundColor: 'white', height: headerHeight,
      width: this.width, top: getStatusBarHeight(), right: 0, borderBottomWidth: 2, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>

      <TouchableOpacity
      activeOpacity = {0.3}
      onPress = {this.props.onPressBack}
      style={{position: 'absolute', left: this.width/25, width: this.width*(1/10), height: this.width*(1/10), top: (headerHeight - this.width*(1/10))/2, justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'white', borderTopLeftRadius: 64,borderTopRightRadius: 64,borderBottomLeftRadius: 64, borderBottomRightRadius: 64}}>
      <Image
      style={{position: 'absolute', width: '60%', height: '60%',
      borderBottomLeftRadius: 64, borderTopRightRadius: 64, borderTopLeftRadius: 64, borderBottomRightRadius: 64}}
      source={{uri: 'backarrowred'}}>
      </Image>
      </TouchableOpacity>

      <TouchableOpacity
      activeOpacity = {0.8}
      style={{position: 'absolute', left: this.width*2/10, position:"absolute", width: this.width*5.5/10, height: this.width*(1/10)*(7/6), justifyContent: 'center', alignItems: 'center', }}
      onPress = {this.props.onPressInfo}>

      <View
      style={{right: 0, position:"absolute", width: this.width*(4/10), height: this.width*(1/10)*(7/6), justifyContent: 'center', }}>
      <Text style = {{ fontSize: 22, position:"absolute"}}
      numberOfLines={1}>
      {global.receiverUsername}
      </Text>
      </View>
      <Image
      style={{position: 'absolute', width: this.width*(1/10), height: this.width*(1/10)*(7/6), left: 0,
      borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}
      source={{uri: global.receiverPhoto}}>
      </Image>
      </TouchableOpacity>

      <TouchableOpacity
      activeOpacity = {0.8}
      style={{position: 'absolute', width: this.width*2/10, right:0, position:"absolute", height: this.width*(1/10)*(7/6), justifyContent: 'center', alignItems: 'center', }}
      onPress = {this.props.onPressCamera}>
      <View
      style={{borderColor: "rgba(241,51,18,1)", borderWidth: 2, width: this.width*(1/10)*(7/6), height: this.width*(1/10)*(7/6),
      justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 555, borderTopRightRadius: 555, borderTopLeftRadius: 555, borderBottomRightRadius: 555}}>
      <Image
      style={{width: "60%", height: "60%"}}
      source={{uri: "camerared"}}>
      </Image>
      </View>
      </TouchableOpacity>


      </View>
    )
  }
}

export * from './ChatHeader';
