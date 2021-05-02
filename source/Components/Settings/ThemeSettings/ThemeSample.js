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
export default class ThemeSample extends Component {


  static propTypes = {
   bottom: PropTypes.number,
   right: PropTypes.number,
   borderRadius: PropTypes.number,
   borderOpacity: PropTypes.string,
   onPress: PropTypes.func,
   textOpacity: PropTypes.string,
   whichTheme: PropTypes.string,
   color: PropTypes.string,
   selected: PropTypes.bool,
   disabled: PropTypes.bool
 }
 static defaultProps = {
   borderBottomWidth: 0,
   borderTopWidth: 0,
   borderRightWidth: 0,
   borderLeftWidth: 0,
   borderBottomLeftRadius: 0,
   borderTopRightRadius: 0,
   borderBottomRightRadius: 0,
   borderTopLeftRadius: 0,
 }


  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var backgroundColor;
    if(this.props.selected){
      backgroundColor = global.isDarkMode ? global.darkModeColors[2] : "rgba(144,144,144,1)"
    }
    else{
      backgroundColor = null
    }
    return(
      <TouchableOpacity
      activeOpacity = {1}
      style={{backgroundColor: backgroundColor, justifyContent: 'flex-start', alignItems: 'center', position: 'absolute',
       width: 0.35*this.width, height: 0.35*this.width, bottom: this.props.bottom, right: this.props.right, borderBottomWidth: this.props.borderBottomWidth,
       borderTopWidth: this.props.borderTopWidth, borderRightWidth: this.props.borderRightWidth, borderLeftWidth: this.props.borderLeftWidth, borderTopRightRadius: this.props.borderTopRightRadius,
       borderTopLeftRadius: this.props.borderTopLeftRadius, borderBottomRightRadius: this.props.borderBottomRightRadius, borderBottomLeftRadius: this.props.borderBottomLeftRadius, borderColor: "gray" }}
       onPress={this.props.onPress}>

       <Text
       style = {{marginTop: 5, color:this.props.selected ? "white" : "rgba(133,133,133,1)", fontSize: 18*this.width/360}}>
       {this.props.whichTheme}
       </Text>

       <View
       style = {{backgroundColor: this.props.color, position:"absolute", bottom: this.width*0.1, width: this.width*0.15, height: this.width*0.15, borderRadius: 11 }}/>
      </TouchableOpacity>
    )
  }
}

export * from './ThemeSample';
