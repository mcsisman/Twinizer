import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
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
import BioScreen from './Bio';
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
var uploadDone1 = false;
var uploadDone2 = false;
var uploadDone3 = false;
var uploadDone4 = false;
var loadingDone = false;
export default class ImageUploadScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      Name: "",
      photo1: null,
      photo2: null,
      photo3: null,
      photo4: null,
      profilePhoto: "",
      opacity: 0.4,
      disabled: true,
      isim : auth().currentUser.displayName,
      color: 'rgba(0,0,0,0.4)',
      borderOpacity1: 1,
      disabled1: true,
      opacity1: 0.4,
      str1: "",
      borderOpacity2: 1,
      disabled2: true,
      opacity2: 0.4,
      str2: "",
      borderOpacity3: 1,
      disabled3: true,
      opacity3: 0.4,
      str3: "",
      borderOpacity4: 1,
      disabled4: true,
      opacity4: 0.4,
      str4: "",
      selectedPhoto: null,
      isVisible2: true,
      loadingOpacity: 0
    };
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.props.navigation.setParams({ otherParam: global.langCompleteYourProfile})
    this.spinValue = new Animated.Value(0)
  }
  componentDidMount(){
    uploadDone1 = false;
    uploadDone2 = false;
    uploadDone3 = false;
    uploadDone4 = false;
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
uploadPhoto = async (uri1, uri2, uri3, uri4) => {
    this.setState({loadingOpacity: 1})
    this.spinAnimation()
    var metadata = {
      contentType: 'image/jpeg',
    };
    var storageRef =  storage().ref();

      const response1 = await fetch(uri1);
      const blob1 = await response1.blob();
      var ref1 = storageRef.child("Photos/" + auth().currentUser.uid + this.state.str1);
      await ref1.put(blob1).then(async snapshot => {
        uploadDone1 = true;
        const response2 = await fetch(uri2);
        const blob2 = await response2.blob();
        var ref2 = storageRef.child("Photos/" + auth().currentUser.uid + this.state.str2);
        await ref2.put(blob2).then(async snapshot => {
          uploadDone2 = true;
          const response3 = await fetch(uri3);
          const blob3 = await response3.blob();
          var ref3 = storageRef.child("Photos/" + auth().currentUser.uid + this.state.str3);
          await ref3.put(blob3).then(async snapshot => {
            uploadDone3 = true;
            const response4 = await fetch(uri4);
            const blob4 = await response4.blob();
            var ref4 = storageRef.child("Photos/" + auth().currentUser.uid + this.state.str4);
            await ref4.put(blob4).then(async snapshot => {
              uploadDone4 = true;
            }).catch(function(error) {
              Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
            });;;
          }).catch(function(error) {
            Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
          });;;
        }).catch(function(error) {
          Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
        });;;
      }).catch(function(error) {
        Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
      });;;
      this.spinValue = new Animated.Value(0)
      this.setState({loadingOpacity: 0})
    if(uploadDone1 && uploadDone2 && uploadDone3 && uploadDone4){
      const {navigate} = this.props.navigation;
      global.welcomeOpacity = 1;

      navigate("Bio")
    }
  }
library = (selectedPhoto) =>{
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      console.log(image);

      if(selectedPhoto == 1){
        this.setState({
          photo1: {uri: image.path},
          str1: '/2.jpg',
          profilePhoto1: image.path,
          borderOpacity1: 0,
          disabled1: false,
          opacity1: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 2){
        this.setState({
          photo2: {uri: image.path},
          str2: '/3.jpg',
          profilePhoto2: image.path,
          borderOpacity2: 0,
          disabled2: false,
          opacity2: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 3){
        this.setState({
          photo3: {uri: image.path},
          str3: '/4.jpg',
          profilePhoto3: image.path,
          borderOpacity3: 0,
          disabled3: false,
          opacity3: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 4){
        this.setState({
          photo4: {uri: image.path},
          str4: '/5.jpg',
          profilePhoto4: image.path,
          borderOpacity4: 0,
          disabled4: false,
          opacity4: 0,
          isVisible1: false
        });
      }

      if(!this.state.disabled1 && !this.state.disabled2 && !this.state.disabled3 && !this.state.disabled4){
        this.setState({
          opacity: 1,
          disabled: false,
        });
      }

    });
  };
camera = (selectedPhoto) => {
    ImagePicker.openCamera({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      console.log(image);

      if(selectedPhoto == 1){
        this.setState({
          photo1: {uri: image.path},
          str1: '/2.jpg',
          profilePhoto1: image.path,
          borderOpacity1: 0,
          disabled1: false,
          opacity1: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 2){
        this.setState({
          photo2: {uri: image.path},
          str2: '/3.jpg',
          profilePhoto2: image.path,
          borderOpacity2: 0,
          disabled2: false,
          opacity2: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 3){
        this.setState({
          photo3: {uri: image.path},
          str3: '/4.jpg',
          profilePhoto3: image.path,
          borderOpacity3: 0,
          disabled3: false,
          opacity3: 0,
          isVisible1: false
        });
      }
      else if(selectedPhoto == 4){
        this.setState({
          photo4: {uri: image.path},
          str4: '/5.jpg',
          profilePhoto4: image.path,
          borderOpacity4: 0,
          disabled4: false,
          opacity4: 0,
          isVisible1: false
        });
      }

      if(!this.state.disabled1 && !this.state.disabled2 && !this.state.disabled3 && !this.state.disabled4){
        this.setState({
          opacity: 1,
          disabled: false,
        });
      }
  });
  };

  render() {
    const { photo } = this.state;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <View style={{width: this.width, height: this.height, top: 0, flex:1, flexDirection:'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {global.langCompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <ImageUploader
      width = {this.width*(2.5/10)}
      bottom = {(this.height*56)/100}
      right = {this.width*(5.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity1}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 1}) }
      textOpacity = {this.state.opacity1}
      fontSize = {12.5}
      photo = {this.state.photo1}/>

      <ImageUploader
      width = {this.width*(2.5/10)}
      bottom = {(this.height*56)/100}
      right = {this.width*(2/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity2}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 2}) }
      textOpacity = {this.state.opacity2}
      fontSize = {12.5}
      photo = {this.state.photo2}/>

      <ImageUploader
      width = {this.width*(2.5/10)}
      bottom = {(this.height*36)/100}
      right = {this.width*(5.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity3}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 3}) }
      textOpacity = {this.state.opacity3}
      fontSize = {12.5}
      photo = {this.state.photo3}/>

      <ImageUploader
      width = {this.width*(2.5/10)}
      bottom = {(this.height*36)/100}
      right = {this.width*(2/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity4}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 4}) }
      textOpacity = {this.state.opacity4}
      fontSize = {12.5}
      photo = {this.state.photo4}/>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', bottom: this.height*12/100 + headerHeight + getStatusBarHeight()-this.width*(1/10), left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>

      <TextBox
      text = {global.langImageUploadScreen}/>

      <PageDots
      pageNo = {3}/>

      <OvalButton
      backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
      width = {this.width*3/10}
      bottom = {(this.height*12)/100}
      right = {this.width*(3.5/10)}
      title = {global.langNext}
      opacity = {this.state.opacity}
      textColor = {global.themeColor}
      onPress = { ()=> this.uploadPhoto(this.state.profilePhoto1,this.state.profilePhoto2,this.state.profilePhoto3,this.state.profilePhoto4 ) }
      disabled = {this.state.disabled}
      borderColor = {global.themeColor}/>

      <ImageUploadModal
      isVisible = {this.state.isVisible1}
      txtUploadPhoto = {global.langUploadPhoto}
      txtCancel = {global.langCancel}
      txtTakePhoto = {global.langTakePhoto}
      txtOpenLibrary = {global.langLibrary}
      onPressCancel = {()=>this.setState({ isVisible1: false}) }
      onPressCamera = {()=> this.camera(this.state.selectedPhoto)}
      onPressLibrary = {()=> this.library(this.state.selectedPhoto)}/>

      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {global.langImageAlert}
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
