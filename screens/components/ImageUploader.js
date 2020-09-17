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
export default class ImageUploader extends Component {


  static propTypes = {
   width: PropTypes.number,
   bottom: PropTypes.number,
   right: PropTypes.number,
   borderRadius: PropTypes.number,
   borderOpacity: PropTypes.number,
   onPress: PropTypes.func,
   textOpacity: PropTypes.number,
   fontSize: PropTypes.number,
   photo: PropTypes.object
 }

  render(){

    return(

      <TouchableOpacity
      activeOpacity = {1}
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(241,51,18,0)',
       width: this.props.width, height: this.props.width*(7/6), bottom: this.props.bottom, right: this.props.right, borderBottomLeftRadius: this.props.borderRadius, borderTopRightRadius: this.props.borderRadius,
       borderTopLeftRadius: this.props.borderRadius, borderBottomRightRadius: this.props.borderRadius, borderOpacity: this.props.borderOpacity,
       borderColor: this.props.borderOpacity == 1 ? global.themeColor : "rgba(0,0,0,0)", borderWidth: 2}}

       onPress={this.props.onPress}>
       <Image source={this.props.photo}
         style={{ opacity: this.props.textOpacity === 1 ? 0:1, width: '100%', height: '100%', borderBottomLeftRadius: this.props.borderRadius, borderTopRightRadius: this.props.borderRadius,
         borderTopLeftRadius: this.props.borderRadius, borderBottomRightRadius: this.props.borderRadius }}
       />
       <Text style={{color: global.themeColor, bottom: '60%', opacity: this.props.textOpacity, position: 'absolute', textAlign: 'center', fontSize: this.props.fontSize*(screenWidth/360)}}>
         {global.langTapHere}
       </Text>
       <Image source={{uri: 'camera' + global.themeForImages}}
         style={{bottom: '30%', width: this.props.width*(23/100), height: this.props.width*(23/100),  position: 'absolute',  opacity: this.props.textOpacity, flex:1 }}
       />
      </TouchableOpacity>
    )
  }
}

export * from './ImageUploader';
