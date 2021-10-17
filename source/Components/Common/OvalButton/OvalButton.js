import React, {Component} from 'react';
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

var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class OvalButton extends Component {
  static propTypes = {
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    onPress: PropTypes.func,
    textColor: PropTypes.string,
    textFontSize: PropTypes.number,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    borderRadius: PropTypes.number,
    opacity: PropTypes.number,
  };
  static defaultProps = {
    borderColor: global.themeColor,
    backgroundColor: 'white',
    textColor: global.themeColor,
    textFontSize: 20 * (screenWidth / 360),
    height: screenWidth * (1.2 / 10),
    title: 'TITLE',
    disabled: false,
    borderRadius: 24,
    position: 'absolute',
  };
  render() {
    return (
      <TouchableOpacity
        activeOpacity={this.props.opacity}
        style={{
          opacity: this.props.opacity,
          justifyContent: 'center',
          alignItems: 'center',
          position: this.props.position,
          backgroundColor: this.props.backgroundColor,
          paddingLeft: 15,
          paddingRight: 15,
          width: this.props.width,
          height: this.props.height,
          bottom: this.props.bottom,
          right: this.props.right,
          borderBottomLeftRadius: this.props.borderRadius,
          borderTopRightRadius: this.props.borderRadius,
          borderTopLeftRadius: this.props.borderRadius,
          borderBottomRightRadius: this.props.borderRadius,
          borderColor: this.props.borderColor,
          borderWidth: 2,
        }}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        <Text
          style={{
            fontFamily: global.fontFam,
            color: this.props.textColor,
            fontSize: this.props.textFontSize,
          }}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export * from './OvalButton';
