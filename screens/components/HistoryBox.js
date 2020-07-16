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
import SearchButton from './SearchButton'
import HistoryCircle from './HistoryCircle'
export default class HistoryBox extends Component {
  constructor(props) {
    super(props);
    leftAnim = new Animated.Value(-this.width*(3/16))

  }
  componentDidMount(){
    leftAnim = new Animated.Value(-this.width*(3/16))
  }
  static navigationOptions = {
      header: null,
  };
   static propTypes = {
     color: PropTypes.string,
     onPress: PropTypes.func,
     disabled: PropTypes.bool,
     editPressed: PropTypes.bool,
     cancelPressed: PropTypes.bool,
     trashOnPress: PropTypes.func,
     photoSource: PropTypes.string,
     searchDate: PropTypes.string,
     onPressSearch: PropTypes.func,
     isSelected: PropTypes.bool

  }

  render(){
    var theColor;
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    leftAnim = new Animated.Value(-this.width*(3/16))

    if(this.props.editPressed){
      leftAnim = new Animated.Value(0)
      Animated.timing(leftAnim, {
        duration: 152200,
        toValue: -this.width*(3/16),
        easing: Easing.linear,
        useNativeDriver: true,
      })

    }
    if(this.props.cancelPressed){
      leftAnim = new Animated.Value(-this.width*(3/16))
      Animated.timing(leftAnim, {
        duration: 152200,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    }

    return(
      <Animated.View
        style = {{borderBottomWidth: 1, borderBottomColor: "rgba(181,181,181,0.7)", left: leftAnim ,alignItems: 'center', paddingTop: 5, paddingBottom: 5, width: this.width + this.width*(3/16),
        backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", flexDirection: "row", flex: 1}}>

        <TouchableOpacity
        activeOpacity = {1}
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width*(3/16), height: this.height/5}}
        onPress = {this.props.trashOnPress}>
          <Image
          style={{width: this.width*(3/16)*(4/10), height: this.width*(3/16)*(4/10)*(328/302)}}
          source = {{uri: this.props.color}}>
          </Image>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity = {1}
          style = {{ alignItems: "center", flex: 1, flexDirection: "row",  paddingTop: 5, paddingBottom: 5, width: this.width + this.width*(3/16)}}
          onPress = {this.props.onPress}
          disabled = {this.props.disabled}>

        <View
        style={{justifyContent: "center", alignItems:"center", width: this.width/3, borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
        <Image
        style={{width: this.width/4, height: this.width/4*(7/6), borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderTopLeftRadius: 8, borderBottomRightRadius: 8}}
        source = {{uri: this.props.photoSource}}>
        </Image>
        </View>

        <View
        style = {{justifyContent: 'center', width: this.width/3, alignItems: 'center'}}>
        <Text
        style = {{textAlign: "center", fontSize: 18, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        {this.props.searchDate}
        </Text>
        </View>

        <View
        style = {{position: "absolute", right: 0, justifyContent: 'center', width: this.width*(3/16),alignItems: 'center'}}>
        <HistoryCircle
        width = {this.width/16}
        height = {this.width/16}
        right = {"50%"}
        isSelected = {this.props.isSelected}/>
        </View>

        </TouchableOpacity>
      </Animated.View>
    )
  }
}

export * from './HistoryBox';
