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
 static defaultProps = {
   color: 'rgba(188,192,204,0.5)'
 }
  render(){

    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(

      <View style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'white', width: this.width, height:getStatusBarHeight()}}>
      <StatusBar
      translucent
      barStyle = {global.isDarkMode ? "light-content" : "dark-content"}
      backgroundColor="transparent" />
      <View style={{width: this.width, height:getStatusBarHeight(), backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'white' }}>
      </View>
      </View>
    )
  }
}

export * from './ModifiedStatusBar';
