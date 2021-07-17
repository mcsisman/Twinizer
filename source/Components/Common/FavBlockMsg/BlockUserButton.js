import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {getStatusBarHeight} from 'react-native-status-bar-height';
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
export default class BlockUserButton extends Component {
  static propTypes = {
    borderWidth: PropTypes.number,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    opacity: PropTypes.number,
    image: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    isSelected: PropTypes.bool,
    borderBottomRightRadius: PropTypes.number,
    borderTopRightRadius: PropTypes.number,
  };
  static defaultProps = {
    borderWidth: 0.7,
    width: screenWidth / 6,
    height: screenWidth / 10,
    image: 'block',
    isSelected: false,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
  };
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return (
      <TouchableOpacity // SEND MESSAGE BUTONU
        activeOpacity={1}
        style={{
          flex: 1,
          opacity: this.props.opacity,
          justifyContent: 'center',
          backgroundColor: this.props.isSelected
            ? 'rgba(15,15,15,15)'
            : 'rgba(0,0,0,0)',
          alignItems: 'center',
          width: this.props.width,
          height: this.props.height,
          borderBottomRightRadius: this.props.borderBottomRightRadius,
          borderTopRightRadius: this.props.borderTopRightRadius,
        }}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        <Image
          source={{uri: this.props.image}}
          style={{
            height: (this.width / 10) * (6.5 / 10),
            width: (this.width / 10) * (6.5 / 10),
          }}
        />
      </TouchableOpacity>
    );
  }
}

export * from './BlockUserButton';
