import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'

import * as firebase from "firebase";
import {Image,
   Text,
   View,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ImageBackground,
   KeyboardAvoidingView,
   TextInput,
   Alert,
   Button,
   StatusBar,
   Platform,
   Animated,
   Easing
  } from 'react-native';
import ImageUploadScreen from './ImageUpload';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import OvalButton from './components/OvalButton'
import PageDots from './components/PageDots'
import TextBox from './components/TextBox'
import ImageUploader from './components/ImageUploader'
import ImageUploadModal from './components/ImageUploadModal'
import InfoModal from './components/InfoModal'
import InfoButton from './components/InfoButton'
if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var uploadDone = false;
export default class ProfileUploadScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      Name: "",
      photo: null,
      profilePhoto: "",
      str: "",
      isim : firebase.auth().currentUser.displayName,
      color: 'rgba(0,0,0,0.4)',
      borderOpacity: global.themeColor,
      opacity: 0.4,
      disabled: true,
      btnOpacity: 0.4,
      isVisible1: false,
      isVisible2: true,
      loadingOpacity: 0
    };
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.props.navigation.setParams({ otherParam: global.langCompleteYourProfile })
    this.spinValue = new Animated.Value(0)
  }
  componentDidMount(){
    uploadDone = false;
  };

  static navigationOptions = {
      header: null,
  };
  spinAnimation(){
    console.log("SPIN ANIMATION")
    this.spinValue = new Animated.Value(0)
    // First set up animation
    Animated.loop(
    Animated.timing(
        this.spinValue,
        {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )).start()
  }
uploadPhoto = async (uri) => {
    this.setState({loadingOpacity: 1})
    this.spinAnimation()
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var metadata = {
      contentType: 'image/jpeg',
    };
      console.log(uploadDone)
      const response = await fetch(uri);
      const blob = await response.blob();
      var ref1 = storageRef.child("Photos/" + firebase.auth().currentUser.uid + this.state.str);
      await ref1.put(blob).then(function(snapshot) {uploadDone = true}).catch(function(error) {
        Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
      });;

      this.spinValue = new Animated.Value(0)
      this.setState({loadingOpacity: 0})
    if (uploadDone){

      RNFS.copyFile(this.state.profilePhoto, RNFS.DocumentDirectoryPath + firebase.auth().currentUser.uid + "profile.jpg");

      const {navigate} = this.props.navigation;
      navigate("ImageUpload")
    }
}
library = () =>{
  ImagePicker.openPicker({
    width: 600,
    height: 700,
    cropping: true
  }).then(image => {
    console.log(image);
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 'rgba(66,66,255,0)',
      str: '/1.jpg',
      opacity: 0,
      isVisible1: false,
      disabled: false,
      btnOpacity: 1,
      profilePhoto: image.path
    });
  });
};
camera = () => {
  ImagePicker.openCamera({
    width: 600,
    height: 700,
    cropping: true
  }).then(image => {
    console.log(image);
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 'rgba(66,66,255,0)',
      str: '/1.jpg',
      opacity: 0,
      isVisible1: false,
      disabled: false,
      btnOpacity: 1,
      profilePhoto: image.path
    });

});
};

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const { photo } = this.state;
    return (
      <View style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex:1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {global.langCompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <ImageUploader
      width = {this.width*(5/10)}
      bottom = {(this.height*36)/100}
      right = {this.width*(2.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity}
      onPress = {()=>this.setState({ isVisible1: true})}
      textOpacity = {this.state.opacity}
      fontSize = {20}
      photo = {this.state.photo}/>

      <TextBox
      text = {global.langProfileScreen}/>

      <PageDots
      pageNo = {2}/>

      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      bottom = {(this.height*12)/100}
      right = {this.width*(3.5/10)}
      title = {global.langNext}
      opacity = {this.state.btnOpacity}
      textColor = {global.themeColor}
      onPress = { ()=> this.uploadPhoto(this.state.profilePhoto)}
      disabled = {this.state.disabled}
      borderColor = {global.themeColor}/>

      <ImageUploadModal
      isVisible = {this.state.isVisible1}
      txtUploadPhoto = {global.langUploadPhoto}
      txtCancel = {global.langCancel}
      txtTakePhoto = {global.langTakePhoto}
      txtOpenLibrary = {global.langLibrary}
      onPressCancel = {()=>this.setState({ isVisible1: false}) }
      onPressCamera = {this.camera}
      onPressLibrary = {this.library}/>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', bottom: this.height*12/100 + headerHeight + getStatusBarHeight()-this.width*(1/10), left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>

      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {global.langProfileAlert}
      txtGotIt = {global.langGotIt}
      onPressClose = {()=>this.setState({isVisible2:false}) }/>

      <InfoButton
      onPress = {()=> this.setState({isVisible2: true})}
      bottom = {(this.height*12)/100 + headerHeight + getStatusBarHeight()}
      right = {this.width*(4.6/10)}/>

      </View>
    );
  }
}
