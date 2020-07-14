import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import ImgModalOvalButton from './ImgModalOvalButton'
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
export default class FavBlockModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   alertFontSize: PropTypes.number,
   addFontSize: PropTypes.number,
   txtAlert: PropTypes.string,
   onPressClose: PropTypes.func,
   onPressAdd: PropTypes.func,
   animationInTiming: PropTypes.number,
   animationOutTiming: PropTypes.number,
   animationIn: PropTypes.string,
   animationOut: PropTypes.string,
   backdropOpacity: PropTypes.number,
 }
 static defaultProps = {
   addFontSize: 15,
   alertFontSize: 15,
   animationInTiming: 500,
   animationOutTiming: 500,
   animationIn: "zoomInUp",
   animationOut: "zoomOutUp",
   backdropOpacity: 0.4,
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Modal /*BİLGİLENDİRME MODALI*/
      style = {{alignItems: 'center'}}
      onBackdropPress = {this.props.onPressClose}
      backdropOpacity = {0.4}
      coverScreen = {false}
      deviceHeight = {screenHeight}
      deviceWidth = {screenWidth}
      animationIn = "zoomInUp"
      animationOut = "zoomOutUp"
      animationInTiming = {500}
      animationOutTiming = {500}
      isVisible={this.props.isVisible}>
      <View style={{
      borderBottomLeftRadius: 8, borderTopRightRadius: 8,
      borderTopLeftRadius: 8, borderBottomRightRadius: 8,
      backgroundColor: 'white',
      width: screenWidth*(6.5/10),
      paddingTop: 10,
      paddingBottom: 0,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <View style={{paddingTop: 10, paddingBottom: 10, width: screenWidth*(6/10), flex:1}}>

      <Text style={{ color: 'black' ,fontFamily: "Candara", fontSize: this.props.alertFontSize*(screenWidth/360)}}>
      {this.props.txtAlert}
      </Text>
      </View>

      <View
      style={{ flexDirection: 'row', width: screenWidth*(6/10), height:screenWidth*(1.5/10), justifyContent: 'center',
      paddingLeft: 15, paddingRight: 15}}>

      <View
      style={{flex:1, width: screenWidth*(3/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      title = {'Cancel'}
      textColor = {'rgba(241,51,18,1)'}
      onPress = {this.props.onPressClose}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.addFontSize}
      borderWidth = {0}/>
      </View>

      <View
      style={{flex:1, width: screenWidth*(3/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      title = {'ADD'}
      textColor = {'rgba(241,51,18,1)'}
      onPress = {this.props.onPressAdd}
      borderColor = {'rgba(241,51,18,1)'}
      borderRadius = {32}
      textFontSize = {this.props.addFontSize}
      borderWidth = {1.5}/>
      </View>

      </View>

      </View>
      </Modal>
    )
  }
}

export * from './FavBlockModal';
