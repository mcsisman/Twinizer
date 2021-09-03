import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
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

export default class ModifiedStatusBar extends Component {
  static propTypes = {
    color: PropTypes.string,
    isChatImageSender: PropTypes.bool,
  };
  static defaultProps = {
    isChatImageSender: false,
  };
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }

    /*return (
      <View // Statusbar background
        style={{
          top: 0,
          position: 'absolute',
          width: this.width,
          height: getStatusBarHeight(),
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'white',
        }}>
        <StatusBar
          barStyle={
            global.isDarkMode || this.props.isChatImageSender
              ? 'light-content'
              : 'dark-content'
          }
        />
      </View>
    );*/
    return (
      <StatusBar
        barStyle={
          global.isDarkMode || this.props.isChatImageSender
            ? 'light-content'
            : 'dark-content'
        }
      />
    );
  }
}

export * from './ModifiedStatusBar';
