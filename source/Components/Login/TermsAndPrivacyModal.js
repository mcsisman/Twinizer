import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import ImgModalOvalButton from '../Common/ImageUpload/ImgModalOvalButton'
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
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
export default class TermsAndPrivacyModal extends Component {


  static propTypes = {
   txtCancel: PropTypes.string,
   txtOk: PropTypes.string,
   txtTerms: PropTypes.string,
   txtPrivacy: PropTypes.string,
   onPressClose: PropTypes.func,
   onPressOk: PropTypes.func,
   onPressTerms: PropTypes.func,
   onPressPrivacy: PropTypes.func,
   selected: PropTypes.string,
   isVisible: PropTypes.bool,
   txt: PropTypes.string,
   alertFontSize: PropTypes.number,
   okFontSize: PropTypes.number,
   animationInTiming: PropTypes.number,
   animationOutTiming: PropTypes.number,
   animationIn: PropTypes.string,
   animationOut: PropTypes.string,
   backdropOpacity: PropTypes.number,
 }
 static defaultProps = {
   okFontSize: 15,
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
      borderBottomLeftRadius: 8, borderTopRightRadius: 8, borderColor: "rgba(0,0,0,4)",
      borderTopLeftRadius: 8, borderBottomRightRadius: 8,
      backgroundColor: global.isDarkMode ? global.darkModeColors[0] : "rgba(255,255,255,1)",
      width: screenWidth*(8/10),
      paddingTop: 10,
      paddingBottom: 0,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <View
      style={{ flexDirection: 'row', width: screenWidth*(8/10), height:screenWidth*(1/10), justifyContent: 'center',
      paddingLeft: 15, paddingRight: 15}}>
      <View
      style={{ width: screenWidth*(4/10), height:screenWidth*(1/10), justifyContent: 'center', alignItems:'center',
      borderBottomWidth:2, borderBottomColor: this.props.selected === "Terms" ? global.themeColor:"white"}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {this.props.txtTerms}
      textColor = {global.themeColor}
      onPress = {this.props.onPressTerms}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.okFontSize}
      borderWidth = {0}/>
      </View>

      <View
      style={{ width: screenWidth*(4/10), height:screenWidth*(1/10), justifyContent: 'center', alignItems:'center',
      borderBottomWidth:2, borderBottomColor: this.props.selected === "Privacy" ? global.themeColor:"white"}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {this.props.txtPrivacy}
      textColor = {global.themeColor}
      onPress = {this.props.onPressPrivacy}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.okFontSize}
      borderWidth = {0}/>
      </View>
      </View>

      <ScrollView
      style = {{height: screenHeight*(5/10), width: screenWidth*(8/10), flex: 1, flexDirection: 'column'}}>
      <View
      style = {{height: screenWidth/25}}/>
      <Text
        style = {{paddingLeft: 10, paddingRight: 10, paddingTop: 3, fontSize: 15, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        {this.props.txt}
      </Text>
      </ScrollView>

      <View
      style={{ flexDirection: 'row', width: screenWidth*(8/10), height:screenWidth*(1.5/10), justifyContent: 'center',
      paddingLeft: 15, paddingRight: 15}}>
      <View
      style={{ width: screenWidth*(4/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {this.props.txtCancel}
      textColor = {global.themeColor}
      onPress = {this.props.onPressClose}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.okFontSize}
      borderWidth = {0}/>
      </View>

      <View
      style={{ width: screenWidth*(4/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {this.props.txtOk}
      textColor = {global.themeColor}
      onPress = {this.props.onPressOk}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {this.props.okFontSize}
      borderWidth = {0}/>
      </View>
      </View>

      </View>
      </Modal>
    )
  }
}

export * from './TermsAndPrivacyModal';
