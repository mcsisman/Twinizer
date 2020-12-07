import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
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

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
var image;
var images = [];
export default class ImageViewerModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   images: PropTypes.string,
   onCancel: PropTypes.func
 }
 static defaultProps = {
   isVisible: false
 }
  render(){
    var image = {url:this.props.images};
    images = [image]
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Modal /*BÜYÜTÜLMÜŞ FOTOĞRAF MODALI*/
        style = {{alignItems: 'center', justifyContent: 'center'}}
        coverScreen = {false}
        transparent={true}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        hideModalContentWhileAnimating = {true}
        isVisible={this.props.isVisible}
        >
        <View
        style={{width: this.width, height: this.height, right: 0, top: 0, backgroundColor:"rgba(255,255,255,0.3)", borderColor: "rgba(0,0,0,4)",}}>
          <ImageViewer
          renderIndicator={() => null}
          enableSwipeDown = {true}
          onSwipeDown = {this.props.onCancel}
          onCancel = {this.props.onCancel}
          imageUrls={images}/>
          <TouchableOpacity
          style={{width: this.width*(2/15), height: this.width*(2/15), right: 0, position:'absolute', top:getStatusBarHeight()}}
           onPress={this.props.onCancel}>
           <Image source={{uri: 'cross' + global.themeForImages}}
             style={{width: '40%', height: '40%', right:'30%', bottom: '30%', position: 'absolute' }}
           />
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

export * from './PhotoPopUpModal';
