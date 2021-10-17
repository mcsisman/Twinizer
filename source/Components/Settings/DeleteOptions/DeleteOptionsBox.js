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
  Alert,
} from 'react-native';
import HistoryCircle from '../../History/HistoryCircle';
export default class DeleteOptionsBox extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    onPress: PropTypes.func,
    isSelected: PropTypes.bool,
    text: PropTypes.string,
  };

  render() {
    var theColor;
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    return (
      <View
        style={{
          left: 0,
          alignItems: 'center',
          paddingTop: 5,
          paddingBottom: 5,
          width: this.width,
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
            flex: 1,
            flexDirection: 'row',
            paddingTop: 7,
            paddingBottom: 7,
            width: this.width,
          }}
          onPress={this.props.onPress}>
          <View
            style={{
              justifyContent: 'center',
              width: this.width * (3 / 16),
              alignItems: 'center',
            }}>
            <HistoryCircle
              width={this.width / 16}
              height={this.width / 16}
              right={'50%'}
              isSelected={this.props.isSelected}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              width: this.width - this.width * (3 / 16),
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                fontSize: 18,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {this.props.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export * from './DeleteOptionsBox';
