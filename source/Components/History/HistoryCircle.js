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
export default class HistoryCircle extends Component {


  static propTypes = {
   width:PropTypes.number,
   height:PropTypes.number,
   bottom:PropTypes.number,
   right:PropTypes.string,
   isSelected: PropTypes.bool

 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var innerOpacity = 0;
    if(this.props.isSelected){
      innerOpacity = 1
    }
    else{
      innerOpacity = 0
    }

    return(
      <View style={{borderColor: global.themeColor, borderWidth: 3, position: 'absolute', width: this.props.width, height: this.props.height, borderBottomLeftRadius: 500, borderTopRightRadius: 500,
      borderTopLeftRadius: 500, borderBottomRightRadius: 500, flex:1, bottom: this.props.bottom, right: this.props.right}}>

      <View style={{position: 'absolute', width: '75%', height: "75%", bottom: '12.5%', right: '12.5%', backgroundColor: global.themeColor,
      borderBottomLeftRadius: 500, borderTopRightRadius: 500, borderTopLeftRadius: 500, borderBottomRightRadius: 500, opacity: innerOpacity }}>
      </View>

      </View>
    )
  }
}

export * from './HistoryCircle';
