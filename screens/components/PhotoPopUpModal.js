import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
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
export default class PhotoPopUpModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   onBackdropPress: PropTypes.func,
   username: PropTypes.string,
   bio: PropTypes.string,
   onPressCancel: PropTypes.func,
   imgSource: PropTypes.string,
   onPressSendMsg: PropTypes.func

 }
 static defaultProps = {
   gotItFontSize: 15,
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
      <Modal /*BÜYÜTÜLMÜŞ FOTOĞRAF MODALI*/
        style = {{alignItems: 'center', justifyContent: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        hideModalContentWhileAnimating = {true}
        onBackdropPress = {this.props.onBackdropPress}
        animationIn = "flipInY"
        animationOut = "flipOutY"
        animationInTiming = {750}
        animationOutTiming = {750}
        isVisible={this.props.isVisible}
        >
        <View style={{
          borderBottomLeftRadius: 12, borderTopRightRadius: 12,
          borderTopLeftRadius: 12, borderBottomRightRadius: 12,
          backgroundColor: 'white',
          width: this.width*(8/10),
          flexDirection: 'column',
          paddingTop: 0,
          paddingBottom: 0
          }}>

          <View style={{backgroundColor: global.themeColor,justifyContent: 'center',
          alignItems: 'center',width: this.width*(8/10), height: this.width*(8/10)*(1/6),
          borderTopLeftRadius: 12, borderTopRightRadius: 12}}>

          <Text style={{ textAlign: 'center', color: "white" ,fontFamily: "Candara", fontSize: (this.width*(1/18))}}>
            {this.props.username}
          </Text>
          <TouchableOpacity
          style={{width: this.width*(2/15), height: this.width*(2/15), right: 0, position:'absolute', top:0}}
           onPress={this.props.onPressCancel}>
           <Image source={{uri: 'crosswhite'}}
             style={{width: '40%', height: '40%', right:'30%', bottom: '30%', position: 'absolute' }}
           />
          </TouchableOpacity>

          </View>

          <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft:10, paddingRight: 10, backgroundColor: global.themeColor}}>
          <Text style={{ textAlign: 'left', color: 'white', fontSize: (this.width*(1/25))}}>
            {this.props.bio}
          </Text>
          </View>

          <View style={{width: this.width*(9/10), height: this.width*(8/10)*(7/6)}}>
          <Image source={{uri: this.props.imgSource}}
            style={{ width: this.width*(8/10), height: this.width*(8/10)*(7/6)}}
          />
          </View>

          <TouchableOpacity
            activeOpacity = {1}
            style={{justifyContent: 'center', alignItems: 'center', width: this.width*(8/10), height: this.width*(8/10)*(1/6),
            borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: global.themeColor}}
            onPress={this.props.onPressSendMsg}>

            <Image source={{uri: "sendmessage"}}
              style={{ height: this.width*(8/10)*(1/6)*(5/10), width: this.width*(8/10)*(1/6)*(5/10)*2.62 }}
            />

          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

export * from './PhotoPopUpModal';
