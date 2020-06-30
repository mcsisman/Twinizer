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
export default class PageDots extends Component {


  static propTypes = {
   pageNo: PropTypes.number,

 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var colorArray = ['rgba(241,51,18,0)','rgba(241,51,18,0)','rgba(241,51,18,0)','rgba(241,51,18,0)']
    for( i = 0; i < this.props.pageNo; i++){
      colorArray[i] = 'rgba(241,51,18,1)'
    }
    return(
      <View style={{position: 'absolute', width: this.width, height: this.width*(4/100), flex:1, bottom: (this.height*5)/100, right: 0}}>

      <View style={{position: 'absolute', width: this.width*(4/100), height: this.width*(4/100), flex:1, bottom: 0, right: this.width*(66/100),
       backgroundColor: colorArray[0],  borderColor: 'rgba(241,51,18,1)', borderBottomLeftRadius: this.width*(10/100), borderTopRightRadius: this.width*(10/100),
       borderTopLeftRadius: this.width*(10/100), borderBottomRightRadius: this.width*(10/100) }}>
      </View>
      <View style={{position: 'absolute', width: this.width*(4/100), height: this.width*(4/100), flex:1, bottom: 0, right: this.width*(54/100),
       backgroundColor: colorArray[1],  borderColor: 'rgba(241,51,18,1)', borderBottomLeftRadius: this.width*(10/100), borderTopRightRadius: this.width*(10/100),
       borderTopLeftRadius: this.width*(10/100), borderBottomRightRadius: this.width*(10/100), borderWidth: 2 }}>
      </View>
      <View style={{position: 'absolute', width: this.width*(4/100), height: this.width*(4/100), flex:1, bottom: 0, right: this.width*(42/100),
       backgroundColor: colorArray[2],  borderColor: 'rgba(241,51,18,1)', borderBottomLeftRadius: this.width*(10/100), borderTopRightRadius: this.width*(10/100),
       borderTopLeftRadius: this.width*(10/100), borderBottomRightRadius: this.width*(10/100), borderWidth: 2 }}>
      </View>
      <View style={{position: 'absolute', width: this.width*(4/100), height: this.width*(4/100), flex:1, bottom: 0, right: this.width*(30/100),
       backgroundColor: colorArray[3],  borderColor: 'rgba(241,51,18,1)', borderBottomLeftRadius: this.width*(10/100), borderTopRightRadius: this.width*(10/100),
       borderTopLeftRadius: this.width*(10/100), borderBottomRightRadius: this.width*(10/100), borderWidth: 2 }}>
      </View>

      </View>
    )
  }
}

export * from './PageDots';
