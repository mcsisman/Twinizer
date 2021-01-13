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
  Animated,
  Easing,
  Alert
} from 'react-native';

var leftAnim = new Animated.Value(-this.width*(3/16))

import HistoryCircle from './HistoryCircle'
export default class HistoryBox extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
      header: null,
  };
   static propTypes = {
     color: PropTypes.string,
     onPress: PropTypes.func,
     disabled: PropTypes.bool,
     trashOnPress: PropTypes.func,
     photoSource: PropTypes.string,
     searchDate: PropTypes.string,
     onPressSearch: PropTypes.func,
     isSelected: PropTypes.bool,
     left: PropTypes.object

  }

  render(){
    var theColor;
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    return(
      <Animated.View
        style = {{borderBottomWidth: 1, borderBottomColor: "rgba(181,181,181,0.7)", left: this.props.left ,alignItems: 'center', height: this.width/3, width: this.width + this.width*(3/16),
        backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)", flexDirection: "row", flex: 1}}>

        <TouchableOpacity
        activeOpacity = {1}
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width*(3/16), height: "100%"}}
        onPress = {this.props.trashOnPress}>
          <Image
          style={{width: this.width*(3/16)*(4/10), height: this.width*(3/16)*(4/10)*(328/302)}}
          source = {{uri: this.props.color}}>
          </Image>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity = {1}
          style = {{alignItems: "center", flex: 1, flexDirection: "row",  height: "100%", width: this.width + this.width*(3/16)}}
          onPress = {this.props.onPress}
          disabled = {this.props.disabled}>
        <View
        style={{height: "100%",justifyContent: "center", alignItems:"center", width: this.width/3,}}>
        <Image
        style={{width: this.width/4.5, height: this.width/4.5*(7/6), borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}
        source = {{uri: this.props.photoSource}}>
        </Image>
        </View>

        <View
        style = {{justifyContent: 'center', width: this.width/3, alignItems: 'center'}}>
        <Text
        style = {{textAlign: "center", fontSize: 18*this.width/360, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        {this.props.searchDate}
        </Text>
        </View>

        <View
        style = {{height: "100%",position: "absolute", right: 0, justifyContent: 'center', width: this.width*(3/16),alignItems: 'center'}}>
        <HistoryCircle
        width = {this.width/16}
        height = {this.width/16}
        isSelected = {this.props.isSelected}/>
        </View>

        </TouchableOpacity>
      </Animated.View>
    )
  }
}

export * from './HistoryBox';
