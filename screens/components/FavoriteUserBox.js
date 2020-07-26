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
export default class FavoriteUserBox extends Component {


  static propTypes = {
   onPress: PropTypes.func,
   bottom: PropTypes.number,
   text: PropTypes.string,
   photoSource: PropTypes.string,
   left: PropTypes.object,
   isSelected: PropTypes.bool,
   disabled: PropTypes.bool,
   editPressed: PropTypes.bool,
   cancelPressed: PropTypes.bool,
 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Animated.View
        style = {{left: this.props.left, borderTopWidth:1, borderBottomWidth:1, borderColor: global.isDarkMode ? global.darkModeColors[2] : 'rgba(128,128,128,0.3)' ,
        backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)", flexDirection: "row", flex:1, justifyContent: 'center',
        width: this.width*18/16, paddingTop: 5, paddingBottom: 5}}>

      <TouchableOpacity
      activeOpacity = {1}
      style = {{alignItems: 'center', justifyContent: 'center', width: this.width*(2/16), height: this.width/8}}
      onPress = {this.props.trashOnPress}>
        <Image
        style={{width: this.width*(3/16)*(4/10), height: this.width*(3/16)*(4/10)*(328/302)}}
        source = {{uri: "trashgray"}}>
        </Image>
      </TouchableOpacity>

      <TouchableOpacity
      activeOpacity = {1}
      style={{flex: 1, flexDirection: "row", paddingTop: 5, paddingBottom: 5, width: this.width + this.width*(3/16)}}
      onPress={this.props.onPress}>

      <View
      style={{justifyContent: "center", alignItems:"center", width: this.width/3, borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
      <Image
      style={{width: this.width*2/8, height: this.width/4*(7/6), borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}
      source = {{uri: this.props.photoSource}}>
      </Image>
      </View>

      <View
      style={{justifyContent: 'center', width: this.width*5/8, height: this.width/4*(7/6), bottom: 0, left: 0}}>
      <Text
        style = {{color: global.isDarkMode ? global.darkModeColors[3] : 'rgba(88,88,88,1)', fontSize: 18*this.width/360, left: this.width/20, position: "absolute" }}>
        {this.props.text}
      </Text>
      </View>

      <View
      style={{justifyContent: 'center', alignItems: "center", position: 'absolute', width: this.width/8, height: this.width/4*(7/6), bottom: 0, right: 0}}>
      <Image source={{uri: 'settingsarrow' + global.themeForImages}}
      style={{opacity: 0.5, width: this.width/8*(4/10)*(61/110), height: this.width/8*(4/10)}}/>
      </View>
      </TouchableOpacity>

      <View
      style = {{width: this.width/8, height: this.width/8, left: 0, position:"absolute", backgroundColor:"blue"}}/>
      </Animated.View>
    )
  }
}

export * from './FavoriteUserButton';
