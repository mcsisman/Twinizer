import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';

export default class MessageSwitchButton extends Component {

  render(){

    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    this.msgBoxHeight = this.height/6
    this.avatarSize = this.msgBoxHeight*3/5
    return(

      <TouchableOpacity
      activeOpacity = {1}
      style={this.props.style}
      onPress={this.props.onPress}
      disabled = {this.props.disabled}>
      <Image source={{uri: this.props.imageSource}}
        style={{width: '50%', height:'50%'}}
      />
      </TouchableOpacity>
    )
  }
}

export * from './MessageSwitchButton';
