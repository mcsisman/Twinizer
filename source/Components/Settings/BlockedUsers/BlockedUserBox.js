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
  Animated,
} from 'react-native';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class BlockedUserBox extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    bottom: PropTypes.number,
    text: PropTypes.string,
    photoSource: PropTypes.string,
    trashOnPress: PropTypes.func,
    trashImage: PropTypes.string,
    left: PropTypes.object,
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
    editPressed: PropTypes.bool,
    cancelPressed: PropTypes.bool,
  };
  static defaultProps = {};
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return (
      <Animated.View
        style={{
          left: this.props.left,
          borderBottomWidth: 1,
          borderBottomColor: global.isDarkMode
            ? 'rgba(181,181,181,0.4)'
            : 'rgba(128,128,128,0.3)',
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(255,255,255,1)',
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'center',
          width: (this.width * 18) / 16,
          height: this.width / 7,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: this.width * (2 / 16),
            height: this.width / 7,
          }}
          onPress={this.props.trashOnPress}>
          <Image
            style={{
              width: this.width * (3 / 16) * (3.25 / 10),
              height: this.width * (3 / 16) * (3.25 / 10) * (328 / 302),
            }}
            source={{uri: this.props.trashImage}}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.props.disabled}
          activeOpacity={1}
          style={{
            flex: 1,
            flexDirection: 'row',
            height: this.width / 7,
            width: this.width + this.width * (3 / 16),
          }}
          onPress={this.props.onPress}>
          <View
            style={{
              justifyContent: 'center',
              width: (this.width * 6) / 8,
              height: this.width / 7,
              bottom: 0,
              left: 0,
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(88,88,88,1)',
                fontSize: (18 * this.width) / 360,
                left: this.width / 20,
                position: 'absolute',
              }}>
              {this.props.text}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              width: this.width / 8,
              height: this.width / 7,
              bottom: 0,
              right: 0,
            }}>
            <Image
              source={{uri: 'settingsarrow' + global.themeForImages}}
              style={{
                opacity: 0.5,
                width: (this.width / 8) * (4 / 10) * (61 / 110),
                height: (this.width / 8) * (4 / 10),
              }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export * from './BlockedUserBox';
