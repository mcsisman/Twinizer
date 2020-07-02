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
export default class ChatterInfo extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   onBackdropPress: PropTypes.func,
   username: PropTypes.string,
   bio: PropTypes.string,
   onPressCancel: PropTypes.func,
   imgSource: PropTypes.string,
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
        animationIn = "zoomInDown"
        animationOut = "zoomOutDown"
        animationInTiming = {750}
        animationOutTiming = {750}
        isVisible={this.props.isVisible}
        >
        <View style={{
          borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
          backgroundColor: 'rgba(188,192,204,1)', width: this.width*(8/10), flexDirection: 'column', paddingTop: 0, paddingBottom: 0}}>

          <View style={{justifyContent: 'center', alignItems: 'center',width: this.width*(8/10), height: this.width*(8/10)*(1/6),
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

        <View style={{width: this.width*(9/10), height: this.width*(8/10)*(7/6)}}>
        <Image
        source={{uri: this.props.imgSource}}
        style={{ width: this.width*(8/10), height: this.width*(8/10)*(7/6)}}/>
        </View>

        <View style={{borderBottomLeftRadius: 12, borderBottomRightRadius: 12, paddingTop: 5, paddingBottom: 5, paddingLeft:10, paddingRight: 10}}>
        <Text style={{ textAlign: 'left', color: 'black', fontSize: (this.width*(1/25))}}>
        Country: Turkey
        </Text>
        <Text style={{ textAlign: 'left', color: 'black', fontSize: (this.width*(1/25))}}>
        Gender: Male
        </Text>
        <Text style={{ textAlign: 'left', color: 'black', fontSize: (this.width*(1/25))}}>
        Bio: {this.props.bio}
        </Text>
        </View>

        </View>
      </Modal>
    )
  }
}

export * from './ChatterInfo';
