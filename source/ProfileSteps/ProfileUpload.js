import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
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

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import OvalButton from '../Components/Common/OvalButton/OvalButton'
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal'
import ImageUploader from '../Components/Common/ImageUpload/ImageUploader'
import InfoModal from '../Components/Common/Info/InfoModal'
import InfoButton from '../Components/Common/Info/InfoButton'
import PageDots from '../Components/ProfileSteps/Common/PageDots'
import TextBox from '../Components/ProfileSteps/Common/TextBox'
import language from '../Utils/Languages/lang.json'

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
      photo: "",
      profilePhoto: "",
      str: "",
      isim : auth().currentUser.displayName,
      color: 'rgba(0,0,0,0.4)',
      borderOpacity: 1,
      opacity: 0.4,
      disabled: true,
      btnOpacity: 0.4,
      isVisible1: false,
      isVisible2: true,
      loadingOpacity: 0
    };
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var lang = language[global.lang]
    this.props.navigation.setParams({ otherParam: lang.CompleteYourProfile })
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
  var lang = language[global.lang]
    this.setState({loadingOpacity: 1})
    this.spinAnimation()
    var storageRef =  storage().ref();
    var metadata = {
      contentType: 'image/jpeg',
    };
      console.log(uploadDone)
      const response = await fetch(uri);
      const blob = await response.blob();
      var ref1 = storageRef.child("Photos/" + auth().currentUser.uid + this.state.str);
      await ref1.put(blob).then(function(snapshot) {uploadDone = true}).catch(function(error) {
        Alert.alert(lang.Error, lang.CouldntUploadImg )
      });
      this.spinValue = new Animated.Value(0)
      this.setState({loadingOpacity: 0})
    if (uploadDone){
      RNFS.copyFile(this.state.profilePhoto, RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "profile.jpg");
      console.log("LOCALE KAYDEDİLDİ:", RNFS.DocumentDirectoryPath + auth().currentUser.uid + "profile.jpg")
      const {navigate} = this.props.navigation;
      navigate("ImageUpload")
    }
}
library = () =>{
  this.setState({
    isVisible1: false,
  })
  ImagePicker.openPicker({
    width: 600,
    height: 700,
    cropping: true
  }).then(image => {
    console.log(image);
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 0,
      str: '/1.jpg',
      opacity: 0,
      disabled: false,
      btnOpacity: 1,
      profilePhoto: image.path
    });
  });
};
camera = () => {
  this.setState({
    isVisible1: false,
  })
  ImagePicker.openCamera({
    width: 600,
    height: 700,
    cropping: true
  }).then(image => {
    console.log(image);
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 0,
      str: '/1.jpg',
      opacity: 0,
      disabled: false,
      btnOpacity: 1,
      profilePhoto: image.path
    });

});
};

  render() {
    var lang = language[global.lang]
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const { photo } = this.state;
    return (
      <View style={{width: this.width, height: this.height, top: 0, alignItems: 'center',flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {lang.CompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
      style={{width: this.width, height: this.height-getStatusBarHeight() - headerHeight, bottom: 0,flexDirection: 'column', alignItems: 'center', }}>

      <View
      style={{width: this.width, height: "16.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <TextBox
      text = {lang.PleaseUploadAProfilePhoto}/>
      </View>

      <View
      style={{width: this.width, height: "49.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <ImageUploader
      width = {this.width*(5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity}
      onPress = {()=>this.setState({ isVisible1: true})}
      textOpacity = {this.state.opacity}
      fontSize = {20}
      photo = {this.state.photo}/>

      </View>
      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute',  left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>

      <InfoButton
      onPress = {()=> this.setState({isVisible2: true})}
      opacity = {this.state.loadingOpacity == 1 ? 0 : 1}/>


      </View>
      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      title = {lang.Next}
      opacity = {this.state.btnOpacity}
      textColor = {global.themeColor}
      onPress = { ()=> this.uploadPhoto(this.state.profilePhoto)}
      disabled = {this.state.disabled}
      borderColor = {global.themeColor}/>
      </View>
      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <PageDots
      pageNo = {2}/>
      </View>

      </View>
      </View>

      <ImageUploadModal
      isVisible = {this.state.isVisible1}
      txtUploadPhoto = {lang.UploadAPhoto}
      txtCancel = {lang.Cancel}
      txtTakePhoto = {lang.Camera}
      txtOpenLibrary = {lang.Library}
      onPressCancel = {()=>this.setState({ isVisible1: false}) }
      onPressCamera = {this.camera}
      onPressLibrary = {this.library}/>




      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {lang.ProfileUploadInfo}
      txtGotIt = {lang.GotIt}
      onPressClose = {()=>this.setState({isVisible2:false}) }/>



      </View>
    );
  }
}
