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
      photo1: "",
      photo2: "",
      photo3: "",
      photo4: "",
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
    var lang = language[global.lang]
    this.props.navigation.setParams({ otherParam: lang.CompleteYourProfile})
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
  this.setState({disabled: true})
  var lang = language[global.lang]
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
              var lang = language[global.lang]
              this.setState({disabled: false})
              Alert.alert(lang.Error, lang.CouldntUploadImg)
            });
          }).catch(function(error) {
            var lang = language[global.lang]
            this.setState({disabled: false})
            Alert.alert(lang.Error, lang.CouldntUploadImg )
          });
        }).catch(function(error) {
          var lang = language[global.lang]
          this.setState({disabled: false})
          Alert.alert(lang.Error, lang.CouldntUploadImg )
        });
      }).catch(function(error) {
        var lang = language[global.lang]
        this.setState({disabled: false})
        Alert.alert(lang.Error, lang.CouldntUploadImg )
      });
      this.spinValue = new Animated.Value(0)
      this.setState({loadingOpacity: 0, disabled: false})
    if(uploadDone1 && uploadDone2 && uploadDone3 && uploadDone4){
      const {navigate} = this.props.navigation;
      global.welcomeOpacity = 1;
      navigate("Bio")
    }
  }
library = (selectedPhoto) =>{
  this.setState({
    isVisible1: false
  });
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      console.log(image);

      if(selectedPhoto == 1){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo1: {uri: image.path},
            str1: '/2.jpg',
            profilePhoto1: image.path,
            borderOpacity1: 0,
            disabled1: false,
            opacity1: 0,
          });
        }

      }
      else if(selectedPhoto == 2){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo2: {uri: image.path},
            str2: '/3.jpg',
            profilePhoto2: image.path,
            borderOpacity2: 0,
            disabled2: false,
            opacity2: 0,
          });
        }

      }
      else if(selectedPhoto == 3){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo3: {uri: image.path},
            str3: '/4.jpg',
            profilePhoto3: image.path,
            borderOpacity3: 0,
            disabled3: false,
            opacity3: 0,
          });
        }

      }
      else if(selectedPhoto == 4){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo4: {uri: image.path},
            str4: '/5.jpg',
            profilePhoto4: image.path,
            borderOpacity4: 0,
            disabled4: false,
            opacity4: 0,
          });
        }

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
  this.setState({
    isVisible1: false
  });
    ImagePicker.openCamera({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      console.log(image);

      if(selectedPhoto == 1){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo1: {uri: image.path},
            str1: '/2.jpg',
            profilePhoto1: image.path,
            borderOpacity1: 0,
            disabled1: false,
            opacity1: 0,
          });
        }

      }
      else if(selectedPhoto == 2){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo2: {uri: image.path},
            str2: '/3.jpg',
            profilePhoto2: image.path,
            borderOpacity2: 0,
            disabled2: false,
            opacity2: 0,
          });
        }

      }
      else if(selectedPhoto == 3){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo3: {uri: image.path},
            str3: '/4.jpg',
            profilePhoto3: image.path,
            borderOpacity3: 0,
            disabled3: false,
            opacity3: 0,
          });
        }

      }
      else if(selectedPhoto == 4){
        var lang = language[global.lang]
        if(image.size > global.imageSizeLimit){
          Alert.alert(lang.Warning, lang.ImageSizeExceeded);
        }
        else{
          this.setState({
            photo4: {uri: image.path},
            str4: '/5.jpg',
            profilePhoto4: image.path,
            borderOpacity4: 0,
            disabled4: false,
            opacity4: 0,
          });
        }

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
    var lang = language[global.lang]
    const { photo } = this.state;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    return (
      <View style={{width: this.width, height: this.height, top: 0, flex:1, flexDirection:'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>

      <ModifiedStatusBar/>

      <CustomHeader
      title = {lang.CompleteYourProfile}
      onPress = {()=> this.props.navigation.goBack()}/>

      <View
      style={{width: this.width, height: this.height-getStatusBarHeight() - headerHeight, bottom: 0,flexDirection: 'column', alignItems: 'center', }}>

      <View
      style={{width: this.width, height: "16.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <TextBox
      text = {lang.PleaseUploadFourPhotos}/>
      </View>

      <View
      style={{width: this.width, height: "49.5%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: this.width, height: "50%", flexDirection: 'row', alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: "50%", height: "100%", alignItems: 'center', justifyContent: "center"}}>
      <ImageUploader
      right = {"15%"}
      width = {this.width*(2.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity1}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 1}) }
      textOpacity = {this.state.opacity1}
      fontSize = {12.5}
      photo = {this.state.photo1}/>
      </View>

      <View
      style={{width: "50%", height: "100%",  alignItems: 'center', justifyContent: "center"}}>
      <ImageUploader
      left = {"15%"}
      width = {this.width*(2.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity2}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 2}) }
      textOpacity = {this.state.opacity2}
      fontSize = {12.5}
      photo = {this.state.photo2}/>
      </View>

      </View>

      <View
      style={{width: this.width, height: "50%", flexDirection: 'row', alignItems: 'center', justifyContent: "center"}}>
      <View
      style={{width: "50%", height: "100%", alignItems: 'center', justifyContent: "center"}}>
      <ImageUploader
      right = {"15%"}
      width = {this.width*(2.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity3}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 3}) }
      textOpacity = {this.state.opacity3}
      fontSize = {12.5}
      photo = {this.state.photo3}/>
      </View>

      <View
      style={{width: "50%", height: "100%",  alignItems: 'center', justifyContent: "center"}}>
      <ImageUploader
      left = {"15%"}
      width = {this.width*(2.5/10)}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity4}
      onPress={()=> this.setState({isVisible1: true, selectedPhoto: 4}) }
      textOpacity = {this.state.opacity4}
      fontSize = {12.5}
      photo = {this.state.photo4}/>
      </View>
      </View>

      </View>

      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <View
      style={{width: this.width, height: "33%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>

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
      opacity = {this.state.opacity}
      textColor = {global.themeColor}
      onPress = { ()=> this.uploadPhoto(this.state.profilePhoto1,this.state.profilePhoto2,this.state.profilePhoto3,this.state.profilePhoto4 ) }
      disabled = {this.state.disabled}
      borderColor = {global.themeColor}/>
      </View>

      <View
      style={{width: this.width, height: "34%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
      <PageDots
      pageNo = {3}/>
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
      onPressCamera = {()=> this.camera(this.state.selectedPhoto)}
      onPressLibrary = {()=> this.library(this.state.selectedPhoto)}/>

      <InfoModal
      isVisible = {this.state.isVisible2}
      txtAlert = {(lang.ImageUploadInfo).replace("-1-", "\n")}
      txtGotIt = {lang.GotIt}
      onPressClose = {()=>this.setState({isVisible2:false}) }/>


      </View>
    );
  }
}
