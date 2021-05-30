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
import language from '../../../Utils/Languages/lang.json';
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class ImageUploader extends Component {
  static propTypes = {
    width: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.string,
    borderRadius: PropTypes.number,
    borderOpacity: PropTypes.number,
    onPress: PropTypes.func,
    textOpacity: PropTypes.number,
    fontSize: PropTypes.number,
    photo: PropTypes.object,
    position: PropTypes.string,
    widthleft: PropTypes.string,
  };
  static defaultProps = {
    position: 'absolute',
  };
  render() {
    var lang = language[global.lang];
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: this.props.position,
          backgroundColor: 'rgba(241,51,18,0)',
          width: this.props.width,
          height: this.props.width * (7 / 6),
          bottom: this.props.bottom,
          right: this.props.right,
          left: this.props.left,
          borderBottomLeftRadius: this.props.borderRadius,
          borderTopRightRadius: this.props.borderRadius,
          borderTopLeftRadius: this.props.borderRadius,
          borderBottomRightRadius: this.props.borderRadius,
          borderOpacity: this.props.borderOpacity,
          borderColor:
            this.props.borderOpacity == 1 ? global.themeColor : 'rgba(0,0,0,0)',
          borderWidth: 2,
        }}
        onPress={this.props.onPress}>
        <Image
          source={this.props.photo}
          style={{
            width: '100%',
            height: '100%',
            borderBottomLeftRadius: this.props.borderRadius,
            borderTopRightRadius: this.props.borderRadius,
            borderTopLeftRadius: this.props.borderRadius,
            borderBottomRightRadius: this.props.borderRadius,
          }}
        />
        <Text
          style={{
            color: global.themeColor,
            bottom: '60%',
            opacity: this.props.textOpacity,
            position: 'absolute',
            textAlign: 'center',
            fontSize: this.props.fontSize * (screenWidth / 360),
          }}>
          {lang.TapHere}
        </Text>
        <Image
          source={{uri: 'camera' + global.themeForImages}}
          style={{
            bottom: '30%',
            width: this.props.width * (25 / 100),
            height: this.props.width * (25 / 100) * 0.87,
            position: 'absolute',
            opacity: this.props.textOpacity,
            flex: 1,
          }}
        />
      </TouchableOpacity>
    );
  }
}

export * from './ImageUploader';
