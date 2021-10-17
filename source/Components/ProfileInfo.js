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
export default class ProfileInfo extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number,
    right: PropTypes.number,
    username: PropTypes.string,
    gender: PropTypes.string,
    country: PropTypes.string,
  };
  static defaultProps = {};
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: this.props.width,
          height: this.props.height,
          top: this.props.top,
          right: this.props.right,
        }}>
        <View
          style={{
            width: (this.props.width * 9) / 10,
            height: this.props.width * (9 / 10) * (7 / 6),
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View
            style={{
              paddingTop: 7,
              paddingBottom: 7,
              width: (this.props.width * 9) / 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                fontSize: (17 * this.width) / 360,
              }}>
              {this.props.username}
            </Text>
          </View>
          <View
            style={{
              paddingTop: 7,
              paddingBottom: 7,
              width: (this.props.width * 9) / 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                fontSize: (17 * this.width) / 360,
              }}>
              {this.props.country}
            </Text>
          </View>
          <View
            style={{
              paddingTop: 7,
              paddingBottom: 7,
              width: (this.props.width * 9) / 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                fontSize: (17 * this.width) / 360,
              }}>
              {this.props.gender}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export * from './ProfileInfo';
