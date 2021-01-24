import React, { Component } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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

export default class ModifiedStatusBar extends Component {

  static propTypes = {
   color: PropTypes.string,
 }

  render(){

    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    console.log("IS DARK MODE NE:", global.isDarkMode)
    StatusBar.setBarStyle("dark-content")
    return(

      <View style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'white', width: this.width, height:getStatusBarHeight()}}>
      <StatusBar
      translucent
      barStyle = {this.props.color}
      backgroundColor="transparent" />
      <View style={{width: this.width, height:getStatusBarHeight(), backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'white' }}>
      </View>
      </View>
    )
  }
}

export * from './ModifiedStatusBar';
