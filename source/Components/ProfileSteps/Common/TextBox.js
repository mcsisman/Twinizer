import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
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
} from 'react-native';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class TextBox extends Component {
  static propTypes = {
    text: PropTypes.string,
  };
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return (
      <Text
        style={{
          fontFamily: global.fontFam,
          color: global.isDarkMode ? global.darkModeColors[3] : 'rgba(0,0,0,1)',
          fontSize: 20 * (this.width / 360),
        }}>
        {this.props.text}
      </Text>
    );
  }
}

export * from './TextBox';
