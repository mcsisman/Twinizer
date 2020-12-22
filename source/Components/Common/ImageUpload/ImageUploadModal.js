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
export default class ImageUploadModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   fontSize: PropTypes.number,
   txtUploadPhoto: PropTypes.string,
   txtCancel: PropTypes.string,
   txtTakePhoto: PropTypes.string,
   txtOpenLibrary: PropTypes.string,
   onPressCancel: PropTypes.func,
   onPressCamera: PropTypes.func,
   onPressLibrary: PropTypes.func,
   animationInTiming: PropTypes.number,
   animationOutTiming: PropTypes.number,
   animationIn: PropTypes.string,
   backdropOpacity: PropTypes.number,
   bottom: PropTypes.number

 }
 static defaultProps = {
   fontSize: 17,
   animationInTiming: 350,
   animationOutTiming: 350,
   animationIn: "bounce",
   backdropOpacity: 0.4,
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Modal /*RESİM MODALI*/
      style = {{alignItems: 'center'}}
      backdropOpacity = {this.props.backdropOpacity}
      onBackdropPress = {this.props.onPressCancel}
      coverScreen = {false}
      deviceHeight = {screenHeight}
      deviceWidth = {screenWidth}
      animationIn = {this.props.animationIn}
      animationInTiming = {this.props.animationInTiming}
      animationOutTiming = {this.props.animationOutTiming}
      isVisible = {this.props.isVisible}>

      <View style={{
      borderBottomLeftRadius: 4, borderTopRightRadius:4, borderColor: "rgba(0,0,0,4)",
      borderTopLeftRadius: 4, borderBottomRightRadius: 4,
      backgroundColor: global.isDarkMode ? global.darkModeColors[0] : "rgba(255,255,255,1)",

      height: screenWidth*(2.5/10),
      flexDirection: 'column',
      bottom: this.props.bottom
      }}>

      <View
      style = {{alignItems: 'center', borderTopLeftRadius: 4, borderTopRightRadius: 4, height: screenWidth*(1/10),
      justifyContent: 'center', }}>
      <View
      style={{ paddingTop: 0, paddingBottom: 4, paddingLeft: 15, paddingRight: 15, borderBottomWidth: 1, borderBottomColor: global.isDarkMode ? global.darkModeColors[3] : "rgba(128,128,128,1)"}}>
      <Text style={{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)", fontSize: this.props.fontSize*(80/100)*(screenWidth/360)}}>
      {this.props.txtUploadPhoto}
      </Text>
      </View>
      <TouchableOpacity
      activeOpacity = {1}
      style={{opacity: 1, width: screenWidth*(1/10) , height: screenWidth*(1/10), right: 0, position:'absolute', top:0}}
       onPress={this.props.onPressCancel}>
       <Image source={{uri: global.isDarkMode ? "crosswhite" : "cross"}}
         style={{width: '45%', height: '45%', right:'27.5%', bottom: '27.5%', position: 'absolute' }}
       />
      </TouchableOpacity>
      </View>

      <View
      style={{width:"80%",flexDirection: 'row', left: 0, height:screenWidth*(1.5/10), justifyContent:"center", }}>

      <View
      style={{width: "50%",height:screenWidth*(1.5/10),justifyContent: 'center', alignItems:'center',}}>

      <ImgModalOvalButton
      title = {'LIBRARY'}
      textColor = {global.themeColor}
      onPress = {this.props.onPressLibrary}
      borderColor = {global.themeColor}
      borderRadius = {32}
      textFontSize = {this.props.fontSize}
      borderWidth = {1.5}/>

      </View>

      <View
      style={{width: "50%",height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center',}}>

      <ImgModalOvalButton
      title = {'CAMERA'}
      textColor = {global.themeColor}
      onPress = {this.props.onPressCamera}
      borderColor = {global.themeColor}
      borderRadius = {32}
      textFontSize = {this.props.fontSize}
      borderWidth = {1.5}/>

      </View>

      </View>

      </View>
      </Modal>
    )
  }
}

export * from './ImageUploadModal';
