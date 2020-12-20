import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";

import PropTypes from 'prop-types';
import {
  View,
  Platform,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
  ImageBackground,
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
export default class AuthenticationModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   onBackdropPress: PropTypes.func,
   onPressCancel: PropTypes.func,
   onPressEnter: PropTypes.func
 }
 static defaultProps = {
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
          <ImageBackground source={{uri: "flare"}}
            style={{ alignItems: "center", borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
              width: this.width*(8/10), height: this.width*(12/10)}}>

              <TouchableOpacity
              activeOpacity = {1}
              style={{width: this.width*(8/10), height: this.width*(12/10), flex:1, alignItems: 'center',}}
               onPress={()=> Keyboard.dismiss() }>
              <View
              style = {{position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*55)/100,
               backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)'}}>
              <Text
              style = {{fontSize: 18*(this.width/360), color: 'white'}}>
              Verify your email and password to delete your account.
              </Text>
              </View>

                <TextInput
                placeholderTextColor="rgba(255,255,255,0.7)"
                placeholder={global.langEmail}
                keyboardType= "email-address"

                style={{fontSize: 16*(this.width/360),  position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*30)/100,
                 backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
                 onChangeText={(text) => global.deleteAuthEmail = text}>
              </TextInput>
              <TextInput
              placeholderTextColor="rgba(255,255,255,0.7)"
              placeholder={global.langPassword}
              secureTextEntry

              style={{fontSize: 16*(this.width/360),  position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*23)/100,
               backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
               onChangeText={(text) => global.deleteAuthPassWord = text}>
            </TextInput>

            <TouchableOpacity
            activeOpacity = {1}
            style={{justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(255,255,255, 0)',
              paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1, bottom: (this.height*15)/100}}
             onPress={()=>this.props.onPressEnter}>
             <Text style={{textAlign: 'center', color: 'white',   fontSize: 18*(this.width/360)}}>
             Enter
            </Text>
            </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
            style={{width: this.width*(2/15), height: this.width*(2/15), right: 0, position:'absolute', top:0}}
             onPress={this.props.onPressCancel}>
             <Image source={{uri: 'cross' + global.themeForImages}}
               style={{width: '40%', height: '40%', right:'30%', bottom: '30%', position: 'absolute' }}
             />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    )
  }
}

export * from './AuthenticationModal';
