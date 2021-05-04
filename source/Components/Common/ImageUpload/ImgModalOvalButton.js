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
  Image,
  StatusBar
} from 'react-native';

var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class ImgModalOvalButton extends Component {


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
   paddingTop: PropTypes.number,
   paddingBottom: PropTypes.number,
   borderWidth: PropTypes.number,
   activeOpacity: PropTypes.number
 }
 static defaultProps = {
   borderColor: global.themeColor,
   backgroundColor: 'white',
   textColor: global.themeColor,
   textFontSize: 20*(screenWidth/360),
   title: "TITLE",
   disabled: false,
   borderRadius: 24,
   paddingTop: 5,
   paddingBottom: 5,
   borderWidth: 2,
   activeOpacity: 1,
 }
  render(){



    this.msgBoxHeight = this.height/6
    this.avatarSize = this.msgBoxHeight*3/5
    return(

      <TouchableOpacity
      activeOpacity = {this.props.activeOpacity}
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: "rgba(255,255,255,0)", paddingLeft: 15, paddingRight: 15,
      paddingTop: this.props.paddingTop, paddingBottom: this.props.paddingBottom, bottom: this.props.bottom, right: this.props.right, borderBottomLeftRadius: this.props.borderRadius, borderTopRightRadius: this.props.borderRadius,
      borderTopLeftRadius: this.props.borderRadius, borderBottomRightRadius: this.props.borderRadius, borderColor: this.props.borderColor, borderWidth: this.props.borderWidth}}
      onPress={this.props.onPress }
      disabled = {this.props.disabled}>
      <Text style={{color: this.props.textColor, fontSize: this.props.textFontSize}}
      adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {this.props.title}
      </Text>
      </TouchableOpacity>
    )
  }
}

export * from './ImgModalOvalButton';
