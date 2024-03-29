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
  Animated,
  Easing,
} from 'react-native';
import language from '../../../../Utils/Languages/lang.json';

var leftAnim = new Animated.Value(-this.width * (3 / 16));
export default class MessageBox extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    senderName: PropTypes.string,
    lastMsg: PropTypes.string,
    lastMsgTime: PropTypes.string,
    avatarSource: PropTypes.string,
    onPress: PropTypes.func,
    trashOnPress: PropTypes.func,
    isSeen: PropTypes.number,
    editPressed: PropTypes.bool,
    cancelPressed: PropTypes.bool,
    left: PropTypes.object,
    isPhoto: PropTypes.bool,
  };

  render() {
    var lang = language[global.lang];
    var theColor;
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    var messageText;
    if (this.props.isPhoto && this.props.lastMsg == ' ') {
      messageText = 'Photo';
    } else {
      messageText = this.props.lastMsg;
    }
    this.msgBoxHeight = this.width / 4;
    this.avatarSize = (this.msgBoxHeight * 3) / 5;
    return (
      <Animated.View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(181,181,181,0.7)',
          left: this.props.left,
          alignItems: 'center',
          height: this.msgBoxHeight,
          width: this.width + this.width * (3 / 16),
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(255,255,255,1)',
          flexDirection: 'row',
          flex: 1,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: this.width * (3 / 16),
            height: this.msgBoxHeight,
          }}
          onPress={this.props.trashOnPress}>
          <Image
            style={{
              width: this.width * (3 / 16) * (4 / 10),
              height: this.width * (3 / 16) * (4 / 10) * (328 / 302),
            }}
            source={{uri: this.props.color}}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            flexDirection: 'row',
            height: this.msgBoxHeight,
            width: this.width + this.width * (3 / 16),
          }}
          onPress={this.props.onPress}
          disabled={this.props.disabled}>
          <View
            style={{
              height: this.msgBoxHeight,
              width: this.width * (2.5 / 10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                width: this.width * (1.6 / 10),
                height: this.width * (1.6 / 10) * (7 / 6),
                borderBottomLeftRadius: 13,
                borderTopRightRadius: 13,
                borderTopLeftRadius: 13,
                borderBottomRightRadius: 13,
              }}
              source={{uri: this.props.avatarSource}}></Image>
          </View>

          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              height: this.msgBoxHeight,
              width: (this.width * 45) / 80,
            }}>
            <View
              style={{
                height: (this.msgBoxHeight * 2) / 6,
                justifyContent: 'center',
                width: (this.width * 45) / 80,
              }}>
              <Text
                style={{
                  fontFamily: global.fontFam,
                  fontSize: (18 * this.width) / 360,
                  color: global.isDarkMode ? 'white' : 'rgba(0,0,0,1)',
                }}>
                {this.props.senderName}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                height: this.msgBoxHeight / 2,
                width: (this.width * 45) / 80,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  height: this.msgBoxHeight / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: this.props.isPhoto ? (this.width * 9) / 80 : 0,
                }}>
                <Image
                  style={{
                    left: 0,
                    position: 'absolute',
                    opacity: this.props.isPhoto ? 1 : 0,
                    width: (this.width * 11) / 180,
                    height: (this.width * 11 * 0.87) / 180,
                  }}
                  source={{uri: 'camera' + global.themeForImages}}
                />
              </View>

              <Text
                numberOfLines={2}
                style={{
                  fontFamily: global.fontFam,
                  fontStyle:
                    messageText == lang.NoMessage ? 'italic' : 'normal',
                  fontSize: (16 * this.width) / 360,
                  color: global.isDarkMode
                    ? 'rgba(200,200,200,1)'
                    : 'rgba(128,128,128,1)',
                  width: this.props.isPhoto
                    ? (this.width * 36) / 80
                    : (this.width * 45) / 80,
                }}>
                {messageText}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: this.width * (3 / 16),
              height: this.msgBoxHeight,
            }}>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={{
                fontFamily: global.fontFam,
                marginRight: 5,
                fontSize: (14 * this.width) / 360,
                top: (this.width * 2) / 100,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(128,128,128,1)',
                position: 'absolute',
              }}>
              {this.props.lastMsgTime}
            </Text>
            <View
              style={{
                backgroundColor: global.themeColor,
                borderTopLeftRadius: 555,
                borderBottomLeftRadius: 555,
                borderTopRightRadius: 555,
                borderBottomRightRadius: 555,
                width: this.width * (1 / 28),
                height: this.width * (1 / 28),
                opacity: this.props.isSeen,
              }}></View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export * from './MessageBox';
