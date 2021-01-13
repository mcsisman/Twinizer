import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import ImgModalOvalButton from '../../Common/ImageUpload/ImgModalOvalButton'
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
import language from '../../../Utils/Languages/lang.json'
if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
var lang = language[global.lang]
export default class FavBlockedUsersButtonModal extends Component {


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
   txtButton: PropTypes.string
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
    var lang = language[global.lang]
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
      borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderColor: "rgba(0,0,0,4)",
      borderTopLeftRadius: 8, borderBottomRightRadius: 8,
      backgroundColor: global.isDarkMode ? global.darkModeColors[0] : "rgba(255,255,255,1)",
      width: screenWidth*(6.5/10),
      paddingTop: 10,
      paddingBottom: 0,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <View style={{paddingTop: 10, paddingBottom: 10, width: screenWidth*(6/10), flex:1}}>

      <Text style={{ marginLeft: 2, marginRight: 2, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)", fontSize: this.props.alertFontSize*(screenWidth/360)}}>
      {this.props.txtAlert}
      </Text>
      </View>

      <View

      style={{ flexDirection: 'row', width: screenWidth*(6/10), height:screenWidth*(1.5/10), justifyContent: 'center',
      paddingLeft: 15, paddingRight: 15}}>

      <View
      style={{ width: screenWidth*(3/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {lang.NO}
      textColor = {global.themeColor}
      onPress = {this.props.onPressClose}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.addFontSize}
      borderWidth = {0}/>
      </View>

      <View
      style={{width: screenWidth*(3/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {this.props.txtButton}
      textColor = {global.themeColor}
      onPress = {this.props.onPressAdd}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.addFontSize}
      borderWidth = {0}/>
      </View>

      </View>

      </View>
      </Modal>
    )
  }
}

export * from './FavBlockedUsersButtonModal';
