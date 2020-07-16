import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import countries from '../Countries';
import CountryPicker from './CountryPicker'
import { getStatusBarHeight } from 'react-native-status-bar-height';
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

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class FilterModal extends Component {


  static propTypes = {
   opacity: PropTypes.number,
   isVisible: PropTypes.bool,
   onBackdropPress: PropTypes.func,
   onValueChangeCountry: PropTypes.func,
   onValueChangeGender: PropTypes.func,
   placeHolder1: PropTypes.string,
   placeHolder2: PropTypes.string,
   onPressSearch: PropTypes.func,
   textSearch: PropTypes.string,
   searchDisabled: PropTypes.bool,
   textFilters: PropTypes.string,

 }
 static defaultProps = {
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Modal /*SEARCH MODALI*/
        style = {{alignItems: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        onBackdropPress = {this.props.onBackdropPress}
        animationIn = "slideInUp"
        animationOut = "slideOutDown"
        animationInTiming = {500}
        animationOutTiming = {500}
        isVisible={this.props.isVisible}
        >
        <View style={{
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
          width: this.width,
          height: this.height*(22/100),
          justifyContent: 'center',
          alignItems: 'center',
          position:'absolute',
          bottom: -getStatusBarHeight()}}>

          <Text style={{height: this.width*(1/10), width: this.width*(6/10), textAlign: 'center', color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)",
          fontSize: 14*(this.width/360), top: '7%', position: 'absolute'}}>
            {this.props.textFilters}
          </Text>

          <CountryPicker
          borderBottomColor = {global.themeColor}
          onValueChange = {this.props.onValueChangeCountry}
          items = {countries.mainItems}
          label = {this.props.placeHolder1}
          bottom = {this.height*10/100}
          right = {this.width*(2.5/100)}
          height = {this.height*(5/100)}
          width = {this.width*(45/100)}/>

          <CountryPicker
          borderBottomColor = {global.themeColor}
          onValueChange = {this.props.onValueChangeGender}
          items = {[{label: global.langAllGenders, color: 'red', value: global.langAllGenders},
                      {label: global.langFilterMale, color: 'black', value: global.langFilterMale},
                      {label: global.langFilterFemale, color: 'black', value: global.langFilterFemale}]}
          label = {this.props.placeHolder2}
          bottom = {this.height*10/100}
          right = {this.width*(52.5/100)}
          height = {this.height*(5/100)}
          width = {this.width*(45/100)}/>

          <TouchableOpacity
          activeOpacity = {1}
          style={{ opacity: this.props.opacity, justifyContent: 'center', position: 'absolute', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
           width: this.width*(2.5/10), height: this.width*(8/100),   bottom: this.height*(2/100), right: this.width*(3.75/10), borderBottomLeftRadius: 24, borderTopRightRadius: 24,
           borderTopLeftRadius: 24, borderBottomRightRadius: 24, borderColor: global.themeColor, borderWidth: 1.5}}
           disabled={this.props.searchDisabled}
           onPress={this.props.onPressSearch}>

          <Text style={{textAlign: 'center', color: global.themeColor, fontSize: 17*(this.width/360)}}>
            {this.props.textSearch}
          </Text>
          </TouchableOpacity>

        </View>
      </Modal>
    )
  }
}

export * from './FilterModal';
