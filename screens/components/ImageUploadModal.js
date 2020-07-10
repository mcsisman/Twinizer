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
      borderBottomLeftRadius: 4, borderTopRightRadius:4,
      borderTopLeftRadius: 4, borderBottomRightRadius: 4,
      backgroundColor: 'white',
      width: screenWidth*(6/10),
      height: screenWidth*(2.5/10),
      flexDirection: 'column',
      }}>

      <View
      style = {{alignItems: 'center', borderTopLeftRadius: 4, borderTopRightRadius: 4, height: screenWidth*(1/10), width: screenWidth*(6/10),
      justifyContent: 'center', }}>
      <View
      style={{ paddingTop: 0, paddingBottom: 4, paddingLeft: 15, paddingRight: 15, borderBottomWidth: 1, borderBottomColor: 'gray'}}>
      <Text style={{color: 'black', fontSize: this.props.fontSize*(80/100)*(screenWidth/360)}}>
      {this.props.txtUploadPhoto}
      </Text>
      </View>
      <TouchableOpacity
      activeOpacity = {0.4}
      style={{opacity: 0.4, width: screenWidth*(1/10) , height: screenWidth*(1/10), right: 0, position:'absolute', top:0}}
       onPress={this.props.onPressCancel}>
       <Image source={{uri: 'cross'}}
         style={{width: '45%', height: '45%', right:'27.5%', bottom: '27.5%', position: 'absolute' }}
       />
      </TouchableOpacity>
      </View>

      <View
      style={{ flexDirection: 'row', left: 0, width: screenWidth*(6/10), height:screenWidth*(2/10), flex:1, justifyContent: 'center'}}>

      <View
      style={{flex:1, width: screenWidth*(3/10), height:screenWidth*(1.5/10), flex:1, justifyContent: 'center', alignItems:'center'}}>

      <ImgModalOvalButton
      title = {'LIBRARY'}
      textColor = {'rgba(241,51,18,1)'}
      onPress = {this.props.onPressLibrary}
      borderColor = {'rgba(241,51,18,1)'}
      borderRadius = {32}
      textFontSize = {this.props.fontSize}
      borderWidth = {1.5}/>

      </View>

      <View
      style={{flex:1, width: screenWidth*(3/10), height:screenWidth*(1.5/10), flex:1, justifyContent: 'center', alignItems:'center'}}>

      <ImgModalOvalButton
      title = {'CAMERA'}
      textColor = {'rgba(241,51,18,1)'}
      onPress = {this.props.onPressCamera}
      borderColor = {'rgba(241,51,18,1)'}
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
