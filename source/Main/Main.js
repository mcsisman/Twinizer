import React, { Component, useEffect, useState } from 'react';
import RNFS from 'react-native-fs'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import OneSignal from 'react-native-onesignal'
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import Swipeable from 'react-native-swipeable';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import  { AdEventType, admob, InterstitialAd, RewardedAd, BannerAd, TestIds, MaxAdContentRating } from '@react-native-firebase/admob';
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
   StatusBar,
   Easing,
   Button,
   Animated,
   Platform
  } from 'react-native';
import ChatScreen from '../Messaging/Chat';

import countries from '../Utils/Countries';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import ImageViewerModal from '../Components/Common/ImageViewer/ImageViewerModal'
import SendMsgButton from '../Components/Common/FavBlockMsg/SendMsgButton'
import BlockUserButton from '../Components/Common/FavBlockMsg/BlockUserButton'
import FavoriteUserButton from '../Components/Common/FavBlockMsg/FavoriteUserButton'
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal'
import ImageUploader from '../Components/Common/ImageUpload/ImageUploader'
import SearchButton from '../Components/Common/SearchButton/SearchButton'
import InfoModal from '../Components/Common/Info/InfoModal'

import FavBlockModal from '../Components/Main/FavBlock/FavBlockModal'
import FilterModal from '../Components/Main/Filter/FilterModal'
import PhotoPopUpModal from '../Components/Main/Swipeable/PhotoPopUpModal'
import BigImgInfo from '../Components/Main/Swipeable/BigImgInfo'
import SwipeableSmallImg from '../Components/Main/Swipeable/SwipeableSmallImg'
import SwipeableBigImg from '../Components/Main/Swipeable/SwipeableBigImg'
import language from '../Utils/Languages/lang.json'
if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}



var lang = language[global.lang]
var distanceArray = [];
var usernameArray = [];
var emailArray = [];
var genderArray = [];
var countryArray = [];
var photoArray = {};
var mainDistanceArray = [];
var mainUsernameArray = [];
var mainEmailArray = [];
var mainGenderArray = [];
var mainCountryArray = [];
var mainPhotoArray = {};
var dict = {};
var bioDict = {};
var usersDict = {};
var hepsi = true;
var flagIs20 = false;
var currentUserGender;
var currentUserCountry;
var playerId;
var currentUserUsername;
var currentUserBio;
var resultCounter;
var funcnumval = 0;
var isFav = false;
var isBlock = false;
var addingToWhichList = "";
var listToAdd = ""
var favoriteUsers = []
var blockedUsers = []
var favoriteUsersSet = new Set();
var blockedUsersSet = new Set();
var favShowThisDialog = "true"
var blockShowThisDialog = "true"
const adUnitId = Platform.OS === 'android' ? "ca-app-pub-5851216250959661/2799313720" : "ca-app-pub-5851216250959661/4802482925";
//const adUnitId = Platform.OS === 'android' ? "ca-app-pub-5851216250959661/2799313720" : "ca-app-pub-5851216250959661/4802482925";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default class MainScreen extends Component<{}>{
constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.activationDistanceLeft = this.width*(2.5/10)
    global.deactivationDistanceLeft = this.width*(2.5/10)
    global.activationDistanceRight = this.width*(2.5/10)
    global.deactivationDistanceRight = this.width*(2.5/10)
    var lang = language[global.lang]
    this.state = {
      showAd: false,
      imageViewerVisible: false,
      favTickVisible: false,
      blockTickVisible: false,
      showFilter: false,
      photoPath: "",
      splashOver : false,
      email: "",
      color: 'rgba(0,0,0,0.4)',
      btnOpacity: 0.4,
      borderOpacity: 1,
      disabled: true,
      opacity: 0.4,
      searchOnIsVisible: false,
      notifIsVisible: false,
      isVisible1: false,
      isVisible2: false,
      addToFavVisible: false,
      addToFavVisibleUpper: false,
      addToBlockVisible: false,
      addToBlockVisibleUpper:false,
      country: null,
      gender: null,
      disabledSearch: true,
      filterButtonOpacity: 0.4,
      placeHolder1: lang.Country,
      placeHolder2: lang.Gender,
      imagePath: null,
      backgroundOpacity: 0.2,
      swipeableDisabled: true,
      swipeableContentRight: global.width*((-1+2490)/10),
      uri0: null,
      uri1: null,
      uri2: null,
      uri3: null,
      uri4: null,
      uri5: null,
      uri2_username: "",
      uri2_country: "",
      uri2_gender: "",
      uri2_bio: "",
      swipeable: -global.width,
      openProfileIsVisible: false,
      messageButtonOpacity: 0,
      messageButtonDisabled: true,
      loadingOpacity: 0,
      photo: ""
    }
    global.swipeCount= 0,
    this.activationCount= 0,
    this.deactivate= null,
    this.complete= false,
    this.releasedAfterRightD2= false,
    this.releasedAfterLeftD2= false,
    this.rightActionCount= 0,
    this.leftActionCount= 0,
    this.probabilityDoneCheck = false;
    this.downloadURL = "";
    this.url = "",
    this.countries = countries.countries
    this.welcome = {uri: 'welcome'}
    global.globalGender = "";
    this.photoRes = 7/6
    this.inSearchDone = false

    this.emptyWidthAnimation = new Animated.Value(global.width*(1.5/10))
    this.widthAnimation = new Animated.Value(global.width*(5/10))
    this.heightAnimation = new Animated.Value(global.width*(5/10)*(7/6))
    this.spinValue = new Animated.Value(0)
    this.spinValueY = new Animated.Value(0);
    this.spinValueZ = new Animated.Value(0);
    var test = "xxx"
    isFav = false;
    isBlock = false;
  }

async componentDidMount(){

  this.logoAnimation()

    interstitial.onAdEvent(type => {
      if(type === AdEventType.ERROR){
        console.log("error geldi tekrar load et")
        interstitial.load();
      }
    if (type === AdEventType.LOADED) {
      console.log("ad loaded")

    }
    if (type === AdEventType.CLOSED) {
      interstitial.load();
    }
  });
    interstitial.load();

  //console.log("rwar:", lang.SignUp)
    favShowThisDialog = await EncryptedStorage.getItem(auth().currentUser.uid + 'favShowThisDialog')
    blockShowThisDialog = await EncryptedStorage.getItem(auth().currentUser.uid + 'blockShowThisDialog')
    global.fromMessages = false
    var localMessages = []
    var arr = []
    //this.addToFavoriteUsers("k209WPn6gmfHP3f2PphxyXeb84p1")
    await this.getBlockedUsers()
    await this.getFavoriteUsers()
    //this.addToFavoriteUsers("k209WPn6gmfHP3f2PphxyXeb84p1")
    //this.addToFavoriteUsers("rfd2z5DtyCgkdliwRa7Uv6aQQ5i1")
    //this.addToFavoriteUsers("JtfxB5eiDvSzOM4dbhgGeU7PXVC2")
    //this.addToBlockedUsers("rfd2z5DtyCgkdliwRa7Uv6aQQ5i1")
    //this.addToBlockedUsers("JtfxB5eiDvSzOM4dbhgGeU7PXVC2")
    this._subscribe = this.props.navigation.addListener('focus', async () => {



      this.setState({reRender: "ok"})
      global.fromChat = false
      if(global.removedFromFavList){
        await this.getFavoriteUsers()
        global.removedFromFavList = false
      }
      if(global.removedFromBlockedList){
        await this.getBlockedUsers()
        global.removedFromBlockedList = false
      }
      if(global.fromHistorySearch){
        await this.setSearchPhotoFromHistory(global.historyPhotoUri)
      }
      if(this.state.uri2_username != "" && this.state.uri2_username != null && this.state.uri2_username != undefined){
        this.checkUri2FavOrBlocked()
      }
    })
    // WHOLE ONESIGNAL THINGS
    OneSignal.setLogLevel(6, 0);
    OneSignal.init("7af3b2d1-d4fe-418d-a096-4f57f2c384c8", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
    OneSignal.inFocusDisplaying(2);
    OneSignal.getPermissionSubscriptionState((status) => {
      console.log(status);
      global.playerId = status.userId;
      console.log(global.playerId);
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', await this.onIds);
    global.swipeCount = 0
    // this.checkIfAlreadySearching()
    this.welcome = {uri: 'twinizermain'}
  }

static navigationOptions = {
    header: null,
}
updateState = () =>{
  console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
  this.setState({reRender: "ok"})
  return "TESTTTT"
}

onReceived(notification) {
    console.log("Notification received: ", notification);
  }

onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    //const {navigate} = this.props.navigation;
    //navigate("Messages")
}
logoAnimation(){
  Animated.loop(Animated.sequence([
   Animated.timing(
    this.spinValueY,
    {
     toValue: 1,
     duration: 800,
     easing: Easing.linear,
     useNativeDriver: true
     }
   ),
   Animated.timing(
    this.spinValueZ,
    {
     toValue: 1,
     duration: 800,
     easing: Easing.linear,
     useNativeDriver: true
    }
   ),
   Animated.timing(
    this.spinValueY,
    {
     toValue: 0,
     duration: 800,
     easing: Easing.linear,
     useNativeDriver: true
    }
  ),
  Animated.timing(
   this.spinValueZ,
   {
    toValue: 0,
    duration: 800,
    easing: Easing.linear,
    useNativeDriver: true
   }
  )
  ]

  )).start();
}
async onIds(device) {
    // Check playerId from local and change if it is changed
    playerId = await EncryptedStorage.getItem(auth().currentUser.uid + 'playerId')
    var lang = language[global.lang]
    global.playerId = device["userId"]
    console.log("playerId from storage: ", playerId)
    console.log("playerId from onesignal", global.playerId)
    if(playerId != global.playerId){
      var randO = Math.random()
      database().ref('/Users/'+auth().currentUser.uid + '/i').update({
        o: randO
      }).catch(error => {
        var lang = language[global.lang]
        console.log("HATA2")
        Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
      });
      database().ref('/PlayerIds/').update({
        [auth().currentUser.uid]: global.playerId
      }).catch(error => {
        console.log("HATA3")
        Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
      });
      EncryptedStorage.setItem(auth().currentUser.uid + 'playerId', global.playerId)
    }
    console.log('Device info: ', device);
}

async checkIfAlreadySearching(){
  var listener23 = database().ref('Users/' + auth().currentUser.uid +"/s/sb");
  await listener23.once('value').then(async snapshot => {
    if(snapshot.val() == "t"){
      this.checkFunction();
      this.setState({searchOnIsVisible: true});
    }
  })
}

checkUri2FavOrBlocked(){
  if (favoriteUsers != null && favoriteUsers.length != 0 && favoriteUsersSet.has(emailArray[global.swipeCount])){
    isFav = true
  }
  else{
    isFav = false
    if (blockedUsers != null && blockedUsers.length != 0 && blockedUsersSet.has(emailArray[global.swipeCount])){
      isBlock = true
    }
    else{
      isBlock = false
    }
  }
  this.setState({reRender: "okeyyy"})
}
async getFavoriteUsers(){
  await EncryptedStorage.getItem(auth().currentUser.uid + 'favoriteUsers')
    .then(req => {
      if(req){
        return JSON.parse(req)
      }
      else{
        return []
      }
    })
    .then(json => {
      console.log("FAVORITE USERS: ", json)
      favoriteUsers = json
      favoriteUsersSet = new Set(favoriteUsers)
    })
}
async getBlockedUsers(){
  await EncryptedStorage.getItem(auth().currentUser.uid + 'blockedUsers')
    .then(req => {
      if(req){
         return JSON.parse(req)
      }
      else{
        return []
      }
    })
    .then(json => {
      console.log("BLOCKED USERS: ", json)
      blockedUsers = json
      blockedUsersSet = new Set(blockedUsers)
    })
}

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
async setSearchPhotoFromHistory(uri){
  this.setState({photoPath: uri,
  photo: {uri: uri},
  borderOpacity: 0,
  opacity: 0,
  isVisible1: false,
  disabled: false,
  btnOpacity: 1,})
  console.log("URI: ", uri)
  global.fromHistorySearch = false
}
swipeStart(){
  this.setState({showAd: false})
  if(!this.state.swipeableDisabled){
    this.widthAnimation.setValue(global.width*(5/10))
    this.emptyWidthAnimation.setValue(global.width*(1.5/10))
    this.heightAnimation.setValue(global.width*(5/10)*(7/6))
    Animated.parallel([
        Animated.timing(this.widthAnimation, {
          duration: 200,
          toValue: global.width*(2/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.heightAnimation, {
          duration: 200,
          toValue: global.width*(2/10)*(7/6),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.emptyWidthAnimation, {
          duration: 200,
          toValue: global.width*(3/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
    this.setState({
  messageButtonDisabled: true,
  messageButtonOpacity: 0})
  }
}
swipeRelease(){

  //this.checkUri2FavOrBlocked()
  if(!this.state.swipeableDisabled){
    if(!this.complete || this.activationCount == 0){
      if(!this.releasedAfterRightD2 || !this.releasedAfterLeftD2){

        console.log("OnSwipeRelease")
        global.flag1 = true; //Left A1
        global.flag2 = false;  //Left A2
        global.flag3 = false; //Left D1
        global.flag4 = false; //Left D2
        global.flag5 = true; //Right A1
        global.flag6 = false; //Right A2
        global.flag7 = false; //Right D1
        global.flag8 = false; //Right D2
        this.setState({
          messageButtonDisabled: false,
          messageButtonOpacity: 1
          })

          this.widthAnimation.setValue(global.width*(2/10))
          this.emptyWidthAnimation.setValue(global.width*(3/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          Animated.parallel([
              Animated.timing(this.widthAnimation, {
                duration: 300,
                toValue: global.width*(5/10),
                easing: Easing.elastic(0.5),
                useNativeDriver: false
              }
            ),
              Animated.timing(this.heightAnimation, {
                duration: 300,
                toValue: global.width*(5/10)*(7/6),
                easing: Easing.elastic(0.5),
                useNativeDriver: false
              }
            ),
              Animated.timing(this.emptyWidthAnimation, {
                duration: 300,
                toValue: global.width*(1.5/10),
                easing: Easing.elastic(0.5),
                useNativeDriver: false
            }
          )

          ]).start()
          console.log(this.state.uri2);
          this.setState({showAd: true})
        }
    }
  }
}
// ACTIVATE - DEACTIVATE FUNCTIONS
leftActionActivate(){
  console.log("left activate1")
  this.activationCount = this.activationCount + 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.leftActionCount = this.leftActionCount + 1
  this.deactivate = false
  this.complete = true
  global.swipeCount = global.swipeCount - 1
}
leftActionActivate2(){
  this.activationCount = this.activationCount + 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.leftActionCount = this.leftActionCount + 1
  this.deactivate = false
  this.complete = true
  global.swipeCount = global.swipeCount - 1
  console.log("left activate2")
}
rightActionActivate(){
  this.activationCount = this.activationCount + 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.rightActionCount = this.rightActionCount + 1
  this.deactivate = false
  this.complete = true
  global.swipeCount = global.swipeCount + 1
  console.log("right activate1")
}
rightActionActivate2(){
  this.activationCount = this.activationCount + 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.rightActionCount = this.rightActionCount + 1
  this.deactivate = false
  this.complete = true
  global.swipeCount = global.swipeCount + 1
  console.log("right activate2")
}
leftActionDeactivate(){
  this.activationCount = this.activationCount - 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.leftActionCount = this.leftActionCount - 1
  this.deactivate = true
  global.swipeCount = global.swipeCount + 1
  console.log("left deactivate1")
}
leftActionDeactivate2(){
  this.activationCount = this.activationCount - 1
  this.releasedAfterLeftD2 = true
  this.releasedAfterRightD2 = false
  this.leftActionCount = this.leftActionCount - 1
  this.deactivate = true
  global.swipeCount = global.swipeCount + 1
  console.log("left deactivate2")
}
rightActionDeactivate(){
  this.activationCount = this.activationCount - 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = false
  this.rightActionCount = this.rightActionCount - 1
  this.deactivate = true
  global.swipeCount = global.swipeCount - 1
  console.log("right deactivate1")
}
rightActionDeactivate2(){
  this.activationCount = this.activationCount - 1
  this.releasedAfterLeftD2 = false
  this.releasedAfterRightD2 = true
  this.rightActionCount = this.rightActionCount - 1
  this.deactivate = true
  global.swipeCount = global.swipeCount - 1
  console.log("right deactivate2")
}

leftActionComplete(){
  global.flag1 = true; //Left A1
  global.flag2 = false;  //Left A2
  global.flag3 = false; //Left D1
  global.flag4 = false; //Left D2
  global.flag5 = true; //Right A1
  global.flag6 = false; //Right A2
  global.flag7 = false; //Right D1
  global.flag8 = false; //Right D2
  global.leftD2beforeA1 = 0;
  this.widthAnimation.setValue(global.width*(2/10))
  this.emptyWidthAnimation.setValue(global.width*(3/10))
  this.heightAnimation.setValue(global.width*(2/10)*(7/6))
  Animated.parallel([
      Animated.timing(this.widthAnimation, {
        duration: 200,
        toValue: global.width*(5/10),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
      }
    ),
      Animated.timing(this.heightAnimation, {
        duration: 200,
        toValue: global.width*(5/10)*(7/6),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
      }
    ),
      Animated.timing(this.emptyWidthAnimation, {
        duration: 200,
        toValue: global.width*(1.5/10),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
    }
  )

  ]).start()
  this.setState({showAd: true})
  console.log("Swipe Count:", global.swipeCount)
  if(this.leftActionCount == 2){
    this.activationCount = 0
    this.complete = false
    this.leftActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    swipeableContentRight: this.state.swipeableContentRight + this.width*(10/10),
    uri5: this.state.uri3,
    uri4: this.state.uri2,
    uri3: this.state.uri1,
    uri2: this.state.uri0,
    uri1: photoArray[emailArray[global.swipeCount - 1]],
    uri0: photoArray[emailArray[global.swipeCount - 2]],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country: countryArray[global.swipeCount],
    uri2_gender: genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  global.deactivationDistanceLeft = global.deactivationDistanceLeft + this.width*(5/10)
  global.activationDistanceRight = global.activationDistanceRight - this.width*(10/10)
  global.deactivationDistanceRight = global.deactivationDistanceRight - this.width*(10/10)
  console.log("LeftActionCompleted çift")
  console.log(this.state.uri2_bio);
  console.log(this.state.uri2);
  }
    else{
      this.activationCount = 0
      this.complete = false
      this.leftActionCount = 0
      this.releasedAfterLeftD2 = false
      this.releasedAfterRightD2 = false
      this.setState({
      swipeableContentRight: this.state.swipeableContentRight + this.width*(5/10),
      uri5: this.state.uri4,
      uri4: this.state.uri3,
      uri3: this.state.uri2,
      uri2: this.state.uri1,
      uri1: this.state.uri0,
      uri0: photoArray[emailArray[global.swipeCount - 2]],
      uri2_username: usernameArray[global.swipeCount],
      uri2_country:countryArray[global.swipeCount],
      uri2_gender:genderArray[global.swipeCount],
      uri2_bio: bioDict[emailArray[global.swipeCount]],
      messageButtonDisabled: false,
      messageButtonOpacity: 1
      })
      global.deactivationDistanceLeft = global.deactivationDistanceLeft + this.width*(5/10)
      global.activationDistanceRight = global.activationDistanceRight - this.width*(5/10)
      global.deactivationDistanceRight = global.deactivationDistanceRight - this.width*(5/10)
      console.log("LeftActionCompleted tek")
      console.log(this.state.uri2_bio);
      console.log(this.state.uri2);
    }
    this.checkUri2FavOrBlocked()
}
async rightActionComplete(){
  global.flag1 = true; //Left A1
  global.flag2 = false;  //Left A2
  global.flag3 = false; //Left D1
  global.flag4 = false; //Left D2
  global.flag5 = true; //Right A1
  global.flag6 = false; //Right A2
  global.flag7 = false; //Right D1
  global.flag8 = false; //Right D2
  console.log("Swipe Count:", global.swipeCount)
  global.rightD2beforeA1 = 0;
  this.widthAnimation.setValue(global.width*(2/10))
  this.emptyWidthAnimation.setValue(global.width*(3/10))
  this.heightAnimation.setValue(global.width*(2/10)*(7/6))
  Animated.parallel([
      Animated.timing(this.widthAnimation, {
        duration: 200,
        toValue: global.width*(5/10),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
      }
    ),
      Animated.timing(this.heightAnimation, {
        duration: 200,
        toValue: global.width*(5/10)*(7/6),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
      }
    ),
      Animated.timing(this.emptyWidthAnimation, {
        duration: 200,
        toValue: global.width*(1.5/10),
        easing: Easing.elastic(0.5),
        useNativeDriver: false
    }
  )

  ]).start()
  this.setState({showAd: true})
  if(this.rightActionCount == 2){
    this.activationCount = 0
    this.complete = false
    this.rightActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    swipeableContentRight: this.state.swipeableContentRight - this.width*(10/10),
    uri0: this.state.uri2,
    uri1: this.state.uri3,
    uri2: this.state.uri4,
    uri3: photoArray[emailArray[global.swipeCount + 1]],
    uri4: photoArray[emailArray[global.swipeCount + 2]],
    uri5: photoArray[emailArray[global.swipeCount + 3]],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:countryArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  if (global.swipeCount+9 < emailArray.length){
    console.log("İKİLİ SAĞA KAYMANIN İLKİ: ", global.swipeCount+9, emailArray[global.swipeCount+9])
    this.getImageURL(global.swipeCount+9)
    //this.downloadImages(global.swipeCount+9)
  }
  if (global.swipeCount+10 < emailArray.length){
    console.log("İKİLİ SAĞA KAYMANIN İKİNCİSİ: ", global.swipeCount+10, emailArray[global.swipeCount+10])
    this.getImageURL(global.swipeCount+10)
    //this.downloadImages(global.swipeCount+10)
  }
  global.deactivationDistanceRight = global.deactivationDistanceRight + this.width*(5/10)
  global.activationDistanceLeft = global.activationDistanceLeft - this.width*(10/10)
  global.deactivationDistanceLeft = global.deactivationDistanceLeft - this.width*(10/10)
  console.log("RightActionCompleted çift")
  console.log(this.state.uri2_bio);
  }
  else{
    this.activationCount = 0
    this.complete = false
    this.rightActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    swipeableContentRight: this.state.swipeableContentRight - this.width*(5/10),
    uri0: this.state.uri1,
    uri1: this.state.uri2,
    uri2: this.state.uri3,
    uri3: this.state.uri4,
    uri4: photoArray[emailArray[global.swipeCount + 2]],
    uri5: photoArray[emailArray[global.swipeCount + 3]],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:countryArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  if (global.swipeCount+10 < emailArray.length){
    console.log("İKİLİ SAĞA KAYMANIN İLKİ: ", global.swipeCount+10, emailArray[global.swipeCount+10])
    this.getImageURL(global.swipeCount+10)
    //this.downloadImages(global.swipeCount+9)
  }
  global.deactivationDistanceRight = global.deactivationDistanceRight + this.width*(5/10)
  global.activationDistanceLeft = global.activationDistanceLeft - this.width*(5/10)
  global.deactivationDistanceLeft = global.deactivationDistanceLeft - this.width*(5/10)
  console.log("RightActionCompleted tek")
  console.log(this.state.uri2_bio);
  }
  this.checkUri2FavOrBlocked()
}
leftActionIncomplete(){
  if(this.releasedAfterLeftD2){
    global.flag1 = true; //Left A1
    global.flag2 = false;  //Left A2
    global.flag3 = false; //Left D1
    global.flag4 = false; //Left D2
    global.flag5 = true; //Right A1
    global.flag6 = false; //Right A2
    global.flag7 = false; //Right D1
    global.flag8 = false; //Right D2
    this.widthAnimation.setValue(global.width*(2/10))
    this.emptyWidthAnimation.setValue(global.width*(3/10))
    this.heightAnimation.setValue(global.width*(2/10)*(7/6))
    Animated.parallel([
        Animated.timing(this.widthAnimation, {
          duration: 200,
          toValue: global.width*(5/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.heightAnimation, {
          duration: 200,
          toValue: global.width*(5/10)*(7/6),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.emptyWidthAnimation, {
          duration: 200,
          toValue:  global.width*(1.5/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
  this.setState({showAd: true})
    this.activationCount = 0
    this.complete = false
    this.leftActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    swipeableContentRight: this.state.swipeableContentRight + this.width*(5/10),
    uri5: this.state.uri4,
    uri4: this.state.uri3,
    uri3: this.state.uri2,
    uri2: this.state.uri1,
    uri1: this.state.uri0,
    uri0: photoArray[emailArray[global.swipeCount - 2]],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:genderArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  }),
  global.deactivationDistanceLeft = global.deactivationDistanceLeft + this.width*(5/10)
  global.activationDistanceRight = global.activationDistanceRight - this.width*(5/10)
  global.deactivationDistanceRight = global.deactivationDistanceRight - this.width*(5/10)
  console.log("LeftActionIncomplete")
  console.log(this.state.uri2_bio);
  }
  this.checkUri2FavOrBlocked()
}
rightActionIncomplete(){
  if(this.releasedAfterRightD2 ){
    global.flag1 = true; //Left A1
    global.flag2 = false;  //Left A2
    global.flag3 = false; //Left D1
    global.flag4 = false; //Left D2
    global.flag5 = true; //Right A1
    global.flag6 = false; //Right A2
    global.flag7 = false; //Right D1
    global.flag8 = false; //Right D2
    this.widthAnimation.setValue(global.width*(2/10))
    this.emptyWidthAnimation.setValue(global.width*(3/10))
    this.heightAnimation.setValue(global.width*(2/10)*(7/6))
    Animated.parallel([
        Animated.timing(this.widthAnimation, {
          duration: 200,
          toValue: global.width*(5/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.heightAnimation, {
          duration: 200,
          toValue: global.width*(5/10)*(7/6),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
        }
      ),
        Animated.timing(this.emptyWidthAnimation, {
          duration: 200,
          toValue: global.width*(1.5/10),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
  this.setState({showAd: true})
    this.activationCount = 0
    this.complete = false
    this.rightActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    swipeableContentRight: this.state.swipeableContentRight - this.width*(5/10),
    uri0: this.state.uri1,
    uri1: this.state.uri2,
    uri2: this.state.uri3,
    uri3: this.state.uri4,
    uri4: photoArray[emailArray[global.swipeCount - 2]],
    uri5: photoArray[emailArray[global.swipeCount - 3]],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:countryArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  }),
  global.deactivationDistanceRight = global.deactivationDistanceRight + this.width*(5/10)
  global.activationDistanceLeft = global.activationDistanceLeft - this.width*(5/10)
  global.deactivationDistanceLeft = global.deactivationDistanceLeft - this.width*(5/10)
  console.log("RightActionIncomplete")
  console.log(this.state.uri2_bio);
  }
  this.checkUri2FavOrBlocked()
}

async sendFirstMessage(){
  //global.receiverMail = emailArray[global.swipeCount]
  //global.receiverGender = genderArray[global.swipeCount]
  //global.receiverCountry = countryArray[global.swipeCount]
  //global.receiverUsername = usernameArray[global.swipeCount]
  console.log("sendfirst start")
  global.msgFromMain = true
  global.receiverUid = "p9UY4QQtEnRTWBYDfgG4pyHiyZg2"
  global.receiverMail = "cemil.sisman@ug.bilkent.edu.tr"
  global.receiverGender = "Male"
  global.receiverCountry = "Australia"
  global.receiverUsername = "cemil ug"
  //global.firstMessage = true
  //global.playerIdArray[global.receiverUid] = await EncryptedStorage.getItem(global.receiverUid + "playerId")
  console.log("global.playerIdArray: ", global.playerIdArray)
  //var tempo = await EncryptedStorage.getItem(global.receiverUid + "o")
  //var realtimeo = 0;
  console.log("sendfirst before database once")
  console.log("sendfirst before if")
  if(!global.playerIdArray[global.receiverUid]){
    database().ref('/PlayerIds/'+global.receiverUid).on('child_changed', snap => {
      console.log("PLAYER ID READ EDIYO")
      global.playerIdArray[global.receiverUid] = snap.val()
    })
  }
  console.log("sendfirst end")
  this.props.navigation.navigate("Chat")
}

addToFavButtonClicked(fromWhere){
  if (isFav){
    var index = favoriteUsers.indexOf(emailArray[global.swipeCount])
    favoriteUsers.splice(index,1)
    EncryptedStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    favoriteUsersSet.delete(emailArray[global.swipeCount])
    isFav = false
    this.setState({addToFavVisible:false, addToFavVisibleUpper: false,})
  }
  else{
    if(favShowThisDialog == "true" || favShowThisDialog == null){
      if(fromWhere == "onMain"){
        this.setState({addToFavVisible:true})
      }
      else{
        this.setState({addToFavVisibleUpper: true})
      }
    }
    else{
      this.favModalButtonClicked(emailArray[global.swipeCount])
      this.setState({addToFavVisible:false, addToFavVisibleUpper: false})
    }
  }
}
addToBlockButtonClicked(fromWhere){
  if (isBlock){
    var index = blockedUsers.indexOf(emailArray[global.swipeCount])
    blockedUsers.splice(index,1)
    EncryptedStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
    blockedUsersSet.delete(emailArray[global.swipeCount])
    isBlock = false
    this.setState({addToBlockVisible:false, addToBlockVisibleUpper:false})
  }
  else{
    if(blockShowThisDialog == "true" || blockShowThisDialog == null){
      if(fromWhere == "onMain"){
        this.setState({addToBlockVisible:true})
      }
      else{
        this.setState({addToBlockVisibleUpper:true})

      }

    }
    else{
      this.blockModalButtonClicked(emailArray[global.swipeCount])
      this.setState({addToBlockVisible:false, addToBlockVisibleUpper:false})
    }
  }
}

favModalButtonClicked(uid){
  if(this.state.favTickVisible){
    favShowThisDialog = "false"
    EncryptedStorage.setItem(auth().currentUser.uid + 'favShowThisDialog', favShowThisDialog)
  }
  this.addToFavoriteUsers(uid)
  isBlock = false
  isFav = true
  this.setState({favTickVisible: false, addToFavVisible:false, addToFavVisibleUpper: false})
}
blockModalButtonClicked(uid){
  if(this.state.blockTickVisible){
    blockShowThisDialog = "false"
    EncryptedStorage.setItem(auth().currentUser.uid + 'blockShowThisDialog', blockShowThisDialog)
  }
  this.addToBlockedUsers(uid)
  isBlock = true
  isFav = false
  this.setState({blockTickVisible: false,addToBlockVisible:false, addToBlockVisibleUpper:false})
}

addToFavoriteUsers(uid){
  console.log("favoriteUsers: ", favoriteUsers)
  if (favoriteUsers == null){
    if (blockedUsersSet.has(uid)){
      var index = blockedUsers.indexOf(uid)
      blockedUsers.splice(index,1)
      EncryptedStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
      blockedUsersSet.delete(uid)
    }
    favoriteUsers.push(uid)
    favoriteUsersSet.add(uid)
    EncryptedStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
  }
  else if (favoriteUsers.length == 0 || !favoriteUsersSet.has(uid)) {
    if (favoriteUsers.length <= 15){
      if (blockedUsersSet.has(uid)){
        var index = blockedUsers.indexOf(uid)
        blockedUsers.splice(index,1)
        EncryptedStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
        blockedUsersSet.delete(uid)
      }
      favoriteUsers.push(uid)
      favoriteUsersSet.add(uid)
      EncryptedStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    }
  }
}
addToBlockedUsers(uid){
  if (blockedUsers == null || blockedUsers.length == 0 || !blockedUsersSet.has(uid)){
    if (favoriteUsersSet.has(uid)){
      var index = favoriteUsers.indexOf(uid)
      favoriteUsers.splice(index,1)
      EncryptedStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    }
    blockedUsers.push(uid)
    blockedUsersSet.add(uid)
    EncryptedStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
  }
}

noLeft(){
  if(global.swipeCount == 0){
    return false
  }
  else{
    return <Text></Text>
  }

}
noRight(){
  if(this.state.swipeableDisabled || global.swipeCount -5 == usernameArray.length){ // this.state.swipeableDisabled
    return false
  }
  else{
    return <Text></Text>
  }

}

valueChangeCountry(value){
  this.setState({country: value, placeHolder1: value})
  if(this.state.gender != null && value != null ){
    this.setState({ disabledSearch: false, filterButtonOpacity: 1})
  }
}
valueChangeGender(value){
  this.setState({placeHolder2: value})
  if(value == "Erkek"){
    value = "Male"
    this.setState({gender: "Male"})
  }
  if(value == "Kadın"){
    value = "Female"
    this.setState({gender: "Female"})
  }
  if( value == "Tüm Cinsiyetler"){
    value == "All Genders"
    this.setState({gender: "All Genders"})
  }
  this.setState({gender: value})
  if(this.state.country != null && value != null ){
    this.setState({disabledSearch: false, filterButtonOpacity: 1})
  }
}

async createEmailDistanceArrays(gender, country, fn){
  console.log("fn: ", fn)
  var lang = language[global.lang]
  if (fn == "searchDone"){
    console.log("searchDone")
    try{
      bioDict_ref = firestore().collection(auth().currentUser.uid).doc("Bios")
      bioDict_ref.get().then(doc => {
        if (doc.exists) {
          bioDict = doc.data();
        }
      });
      usersDict_ref = firestore().collection(auth().currentUser.uid).doc("Users")
      await usersDict_ref.get().then(doc => {
        if (doc.exists) {
          usersDict = doc.data();
        }
      });
      var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
      });
      // Sort the array based on the second element
      items.sort(function(first, second) {
        return first[1] - second[1];
      });
      var length = Object.keys(dict).length;
      console.log(length);
      var itemsIndex = 0;
      for(let i = 0; i < length; i++){
       if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(items[i][0]) == false){
         if(i % 6 == 0 && i != 0){
           emailArray.push("ground")
           countryArray.push("")
           genderArray.push("ground")
           usernameArray.push(lang.Advertisement)
           distanceArray.push("ground");
           itemsIndex++;
         }
         else{
           countryArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[1]);
           genderArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[0]);
           emailArray.push(items[i-itemsIndex][0]);
           usernameArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[2]);
           distanceArray.push(items[i-itemsIndex][1]);
           mainCountryArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[1]);
           mainGenderArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[0]);
           mainEmailArray.push(items[i-itemsIndex][0]);
           mainUsernameArray.push(((usersDict[items[i-itemsIndex][0]]).split("_"))[2]);
           mainDistanceArray.push(items[i-itemsIndex][1]);
         }

       }
      }
      console.log(items);
      console.log(emailArray);
      console.log(distanceArray);
      //console.log(distanceArray);
    } catch(error) {
      var lang = language[global.lang]
      console.log(error)
      console.log("HATA4")
      Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
    }
  }
  else if (fn == "filterDone with all") {
    console.log("filterDone with all")
    var itemsIndex = 0;
    for (let i = 0; i < mainEmailArray.length; i++){
      if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
        if(i % 6 == 0 && i != 0){
          emailArray.push("ground")
          countryArray.push("")
          genderArray.push("ground")
          usernameArray.push(lang.Advertisement)
          distanceArray.push("ground");
          itemsIndex++;
        }
        else{
          emailArray.push(mainEmailArray[i-itemsIndex]);
          usernameArray.push(mainUsernameArray[i-itemsIndex]);
          countryArray.push(mainCountryArray[i-itemsIndex]);
          genderArray.push(mainGenderArray[i-itemsIndex]);
          distanceArray.push(mainDistanceArray[i-itemsIndex]);
          if (mainEmailArray[i-itemsIndex] in mainPhotoArray){
            console.log("mainEmailArray[i-itemsIndex] in mainPhotoArray: ", mainEmailArray[i-itemsIndex] in mainPhotoArray, mainEmailArray[i-itemsIndex])
            photoArray[mainEmailArray[i-itemsIndex]] = mainPhotoArray[mainEmailArray[i-itemsIndex]]
          }
        }
      }
    }
  }
  else if (fn == "filterDone with all genders") {
    console.log("filterDone with all genders")
    var itemsIndex = 0;
    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainCountryArray[i] == country){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          if(i % 6 == 0 && i != 0){
            emailArray.push("ground")
            countryArray.push("")
            genderArray.push("ground")
            usernameArray.push(lang.Advertisement)
            distanceArray.push("ground");
            itemsIndex++;
          }
          else{
            emailArray.push(mainEmailArray[i-itemsIndex]);
            usernameArray.push(mainUsernameArray[i-itemsIndex]);
            countryArray.push(mainCountryArray[i-itemsIndex]);
            genderArray.push(mainGenderArray[i-itemsIndex]);
            distanceArray.push(mainDistanceArray[i-itemsIndex]);
            if (mainEmailArray[i-itemsIndex] in mainPhotoArray){
              console.log("mainEmailArray[i-itemsIndex] in mainPhotoArray: ", mainEmailArray[i-itemsIndex] in mainPhotoArray, mainEmailArray[i-itemsIndex])
              photoArray[mainEmailArray[i-itemsIndex]] = mainPhotoArray[mainEmailArray[i-itemsIndex]]
            }
          }
        }
      }
    }
  }
  else if (fn == "filterDone with all countries") {
    console.log("filterDone with all countries")
    var itemsIndex = 0;
    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainGenderArray[i] == gender){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          if(i % 6 == 0 && i != 0){
            emailArray.push("ground")
            countryArray.push("")
            genderArray.push("ground")
            usernameArray.push(lang.Advertisement)
            distanceArray.push("ground");
            itemsIndex++;
          }
          else{
            emailArray.push(mainEmailArray[i-itemsIndex]);
            usernameArray.push(mainUsernameArray[i-itemsIndex]);
            countryArray.push(mainCountryArray[i-itemsIndex]);
            genderArray.push(mainGenderArray[i-itemsIndex]);
            distanceArray.push(mainDistanceArray[i-itemsIndex]);
            if (mainEmailArray[i-itemsIndex] in mainPhotoArray){
              console.log("mainEmailArray[i-itemsIndex] in mainPhotoArray: ", mainEmailArray[i-itemsIndex] in mainPhotoArray, mainEmailArray[i-itemsIndex])
              photoArray[mainEmailArray[i-itemsIndex]] = mainPhotoArray[mainEmailArray[i-itemsIndex]]
              console.log("photoArray.length for = ", i, Object.keys(photoArray).length)
            }
          }
        }
      }
    }
  }
  else if (fn == "filterDone") {
    console.log("filterDone")
    var itemsIndex = 0;
    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainCountryArray[i] == country && mainGenderArray[i] == gender){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          if(i % 6 == 0 && i != 0){
            emailArray.push("ground")
            countryArray.push("")
            genderArray.push("ground")
            usernameArray.push(lang.Advertisement)
            distanceArray.push("ground");
            itemsIndex++;
          }
          else{
            emailArray.push(mainEmailArray[i-itemsIndex]);
            usernameArray.push(mainUsernameArray[i-itemsIndex]);
            countryArray.push(mainCountryArray[i-itemsIndex]);
            genderArray.push(mainGenderArray[i-itemsIndex]);
            distanceArray.push(mainDistanceArray[i-itemsIndex]);
            if (mainEmailArray[i-itemsIndex] in mainPhotoArray){
              console.log("mainEmailArray[i-itemsIndex] in mainPhotoArray: ", mainEmailArray[i-itemsIndex] in mainPhotoArray, mainEmailArray[i-itemsIndex])
              photoArray[mainEmailArray[i-itemsIndex]] = mainPhotoArray[mainEmailArray[i-itemsIndex]]
            }
          }
        }
      }
    }
  }
  global.emailArrayLength = emailArray.length - 1
}

downloadImages(imageIndex){

  if(!photoArray["ground"]){
    photoArray["ground"] = "ground"
  }
  console.log("image index:", imageIndex)
  if (!photoArray[emailArray[imageIndex]] && emailArray[imageIndex] != "ground" && (imageIndex % 6 != 0 || imageIndex % 6 == 0)){
    console.log("qqq:", emailArray[imageIndex])
    let dirs = RNFetchBlob.fs.dirs
    RNFetchBlob
    .config({
      fileCache : true,
      appendExt : 'jpg',
      path: dirs.DocumentDir + "/results/" + emailArray[imageIndex] + '.jpg'
    })
    .fetch('GET', this.downloadURL, {
      //some headers ..
    })
    .then((res) => {
      console.log('The file saved to ', res.path())
      photoArray[emailArray[imageIndex]] = "file://" + res.path()
      console.log("photoArray.length: ", Object.keys(photoArray).length)
      if (this.inSearchDone){
        mainPhotoArray[emailArray[imageIndex]] = "file://" + res.path()
      }
      this.setState({imagePath:  "file://" + res.path()})
      //console.log("photoArray: ", photoArray)
    }).catch(function(error) {
      console.log(error)
    });
  }
}

async getImageURL(imageIndex){
  if(emailArray[imageIndex] != "ground" && (imageIndex % 6 != 0 || imageIndex % 6 == 0)){
    var storageRef = storage().ref("Photos/" + emailArray[imageIndex] + "/1.jpg")
    await storageRef.getDownloadURL().then(data =>{
      this.downloadURL = data
      //photoArray.push(data)
      this.downloadImages(imageIndex);
    }).catch(function(error) {
      console.log(error)
      // Handle any errors
    });
  }

}

async allFunctionsCompleted(){
  var docRef1 = firestore().collection(auth().currentUser.uid).doc("Similarity")
  docRef1.get().then(async doc => {
    console.log("allFunctionsCompleted: ", doc.data())
    if(doc.exists){
        // createEmailDistanceArrays KISMI ////////////////////////////////////////
        var tempdict = doc.data();
        dict = Object.assign({}, tempdict, dict)
        console.log("DICT SONUCU: ", dict)
        await this.createEmailDistanceArrays("All Genders","All Countries","searchDone");
        ////////////////////////////////////////////////////////////////////////////////
        for(let i = 0; i <= 10; i++){
          // resim indirme KISMI /////////////////////////////////////////////////
          await this.getImageURL(i);
          //await this.downloadImages(i);
        }
        console.log("biyere geldik, mainPhotoArray.length ", Object.keys(mainPhotoArray).length)
        this.setState({
          uri0: null,
          uri1: null,
          uri2: photoArray[emailArray[0]],
          uri3: photoArray[emailArray[1]],
          uri4: photoArray[emailArray[2]],
          uri5: photoArray[emailArray[3]],
          uri2_username: usernameArray[0],
          uri2_country: countryArray[0],
          uri2_gender: genderArray[0],
          uri2_bio: bioDict[emailArray[0]],
          backgroundOpacity: 0,
          swipeableDisabled: false,
          messageButtonDisabled: false,
          messageButtonOpacity: 1,
          showFilter: true,
          loadingOpacity: 0
        })
        this.checkUri2FavOrBlocked()
        this.spinValue = new Animated.Value(0)
        console.log(photoArray)
        console.log(emailArray)
        console.log(genderArray)
        console.log(countryArray)
        console.log(distanceArray)
        console.log(bioDict)
    }
    console.log(this.state.uri2);
  }).catch(error => {
    console.log(error)
    var lang = language[global.lang]
    console.log("HATA1")
    Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
  });
}

async checkFunction(){
  var docReffuncdone = firestore().collection(auth().currentUser.uid).doc("Funcdone")
  docReffuncdone.onSnapshot(async doc => {
    console.log("CHECK FUNCTION: ", doc.data())
    console.log("doc.exists: ", doc.exists)
    console.log("this.probabilityDoneCheck: ", this.probabilityDoneCheck)
    if(doc.exists){
      if (this.probabilityDoneCheck) {
        var completedfuncs = parseInt(doc.data()["key"])
        var isFace = doc.data()["isface"].split("_")[0]
        console.log("isFace: ", isFace)
        if(isFace == "T"){
          console.log("completedfuncs: ", completedfuncs)
          console.log("global.functionNumber: ", global.functionNumber)
          console.log("funcnumval: ", funcnumval)
          if(completedfuncs == funcnumval + global.functionNumber){
            await this.allFunctionsCompleted()
            funcnumval = completedfuncs
          }
        }
        else{
          this.setState({
            loadingOpacity: 0
          })
          var lang = language[global.lang]
          this.spinValue = new Animated.Value(0)
          Alert.alert(lang.Error, lang.MainNoFace )
        }
      }
      else{
        console.log("funcnumval - doc.data[key]: ", doc.data()["key"])
        funcnumval = doc.data()["key"]
      }
    }
    else{
      funcnumval = 0
    }
    this.probabilityDoneCheck = true;
  });
}

async filterDone(){
  this.setState({loadingOpacity: 1})
  this.spinAnimation()
  this.inSearchDone = false;
  isFav = false
  isBlock = false
  emailArray = [];
  usernameArray = [];
  countryArray = [];
  genderArray = [];
  distanceArray = [];
  photoArray = {};
  this.downloadURL = "";
  this.url = "";
  this.complete= false
  global.swipeCount= 0
  this.releasedAfterRightD2= false
  this.releasedAfterLeftD2= false
  this.rightActionCount= 0
  this.leftActionCount= 0
  this.deactivate= null
  global.deactivateLeft= null
  global.deactivateRight= null
  global.deactivationRightDistance= global.width*(2.5/10)
  global.deactivationLeftDistance= global.width*(2.5/10)
  this.setState({
    messageButtonDisabled: true,
    messageButtonOpacity: 0,
    isVisible2: false,
    uri0: null,
    uri1: null,
    uri2: null,
    uri3: null,
    uri4: null,
    uri5: null,
    imagePath: null,
    swipeableDisabled: true,
    uri2_username: "",
    uri2_country: "",
    uri2_bio: "",
    uri2_gender: "",
  });
  console.log("photoArray.length filterdone = ", Object.keys(photoArray).length)
  if (this.state.gender == "All Genders" && this.state.country == "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all");
  }
  if (this.state.gender != "All Genders" && this.state.country == "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all countries");
  }
  if (this.state.gender == "All Genders" && this.state.country != "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all genders");
  }
  if (this.state.gender != "All Genders" && this.state.country != "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone");
  }
  console.log("photoArray.length filterdone end = ", Object.keys(photoArray).length)
  if (Object.keys(photoArray).length <= 10){
    for(let i = Object.keys(photoArray).length; i <= 10; i++){
      // resim indirme KISMI /////////////////////////////////////////////////
      await this.getImageURL(i);
      //this.downloadImages(i);
    }
  }
  this.setState({
    uri0: null,
    uri1: null,
    uri2: photoArray[emailArray[0]],
    uri3: photoArray[emailArray[1]],
    uri4: photoArray[emailArray[2]],
    uri5: photoArray[emailArray[3]],
    uri2_username: usernameArray[0],
    uri2_country: countryArray[0],
    uri2_gender: genderArray[0],
    uri2_bio: bioDict[emailArray[0]],
    backgroundOpacity: 0,
    swipeableDisabled: false,
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  this.checkUri2FavOrBlocked()
  console.log(this.state.uri2_bio);
  console.log(this.state.uri2);
  this.setState({loadingOpacity: 0})
}

async searchDone(value){

  isFav = false
  isBlock = false
  this.setState({
    notifIsVisible: true,
    showFilter: false,
    loadingOpacity: 1,
    backgroundOpacity: 0.2,
    messageButtonDisabled: true,
    messageButtonOpacity: 0,
    isVisible2: false,
    uri0: null,
    uri1: null,
    uri2: null,
    uri3: null,
    uri4: null,
    uri5: null,
    imagePath: null,
    swipeableDisabled: true,
    uri2_username: "",
    uri2_country: "",
    uri2_bio: "",
    uri2_gender: "",
  })
  this.spinAnimation()
  this.inSearchDone = true;
  //photoArray.splice(0, photoArray.length)
  emailArray.splice(0, emailArray.length)
  usernameArray.splice(0, usernameArray.length)
  countryArray.splice(0, countryArray.length)
  genderArray.splice(0, genderArray.length)
  distanceArray.splice(0, distanceArray.length)
  mainDistanceArray.splice(0, mainDistanceArray.length)
  mainUsernameArray.splice(0, mainUsernameArray.length)
  mainEmailArray.splice(0, mainEmailArray.length)
  mainGenderArray.splice(0, mainGenderArray.length)
  mainCountryArray.splice(0, mainCountryArray.length)
  //mainPhotoArray.splice(0, mainPhotoArray.length)
  emailArray = [];
  usernameArray = [];
  countryArray = [];
  genderArray = [];
  distanceArray = [];
  photoArray = {};
  mainDistanceArray = [];
  mainUsernameArray = [];
  mainEmailArray = [];
  mainGenderArray = [];
  mainCountryArray = [];
  mainPhotoArray = {};
  dict = {};
  bioDict = {};
  let dirs = RNFetchBlob.fs.dirs
  await RNFS
  .unlink(dirs.DocumentDir + "/results") // photoArray[imageIndex]
 .then(() => {console.log("FILE DELETED")})
 .catch((err) => {console.log("unlink olmadi")})
  console.log("EMAIL ARRAY LENGTH ", emailArray.length);
  this.downloadURL = "";
  this.url = "";
  this.complete= false
  global.swipeCount= 0
  this.releasedAfterRightD2= false
  this.releasedAfterLeftD2= false
  this.rightActionCount= 0
  this.leftActionCount= 0
  this.deactivate= null
  global.deactivateLeft= null
  global.deactivateRight= null
  global.deactivationRightDistance= global.width*(2.5/10)
  global.deactivationLeftDistance= global.width*(2.5/10)
  await this.saveSearchPhotoLocally(this.state.photoPath)
  await this.uploadSearchPhoto(this.state.photoPath)
}

async getLastSearchNo(){
  var lastSearch;
  lastSearch = await EncryptedStorage.getItem(auth().currentUser.uid + 'lastSearch')
  if(lastSearch == null){
    lastSearch = "0";
  }
  lastSearch = parseInt(lastSearch)
  return lastSearch
}
async getNoOfSearch(){
  var noOfSearch;
  noOfSearch = await EncryptedStorage.getItem(auth().currentUser.uid + 'noOfSearch')
  if(noOfSearch == null){
    noOfSearch = "0";
  }
  noOfSearch = parseInt(noOfSearch)
  return noOfSearch
}
async increaseNoOfSearch(){
  var noOfSearch;
  noOfSearch = await this.getNoOfSearch()
  if(noOfSearch == 20){
    flagIs20 = true;
  }
  if(noOfSearch < 20){
    noOfSearch = noOfSearch + 1;
    flagIs20 = false;
    await EncryptedStorage.setItem(auth().currentUser.uid + 'noOfSearch', noOfSearch.toString())
  }
  return noOfSearch;
}
async increaseLastSearchNo(){
  var lastSearch;
  lastSearch = await this.getLastSearchNo()
  lastSearch = lastSearch + 1
  await EncryptedStorage.setItem(auth().currentUser.uid + 'lastSearch', lastSearch.toString())
  return lastSearch;
}

async getHistoryImageArray(){
  var historyArray = []
  await EncryptedStorage.getItem(auth().currentUser.uid + 'historyArray')
    .then(req => {
      if(req){
         return JSON.parse(req)
      }
      else{
        return null
      }
    })
    .then(json => {
      historyArray = json
      if(historyArray == null){
        historyArray = []
      }
    })
  return historyArray
}

async arrangeSearchImageArray(lastSearch, noOfSearch){
  var historyArray = []
  historyArray = await this.getHistoryImageArray()
  if(noOfSearch == 20 && flagIs20){
    historyArray.shift()
  }
  var currentDate = new Date();
  var day = currentDate.getDate()
  var month = currentDate.getMonth() + 1
  var year = currentDate.getFullYear()
  var date = day + "." + month + "." + year;
  historyArray[noOfSearch-1] = {lastSearch: lastSearch, searchDate: date}
  console.log("GET HISTORY ARRAY2: ", historyArray)
  await EncryptedStorage.setItem(auth().currentUser.uid + 'historyArray', JSON.stringify(historyArray))
}

async saveSearchPhotoLocally(photoPath){
  var lastSearchNo = await this.increaseLastSearchNo()
  console.log("LAST SEARCH NO2: ", lastSearchNo)
  var noOfSearch = await this.increaseNoOfSearch()
  console.log("NO OF SEARCH2: ", noOfSearch)
  this.arrangeSearchImageArray(lastSearchNo, noOfSearch)
  RNFS.mkdir(RNFS.DocumentDirectoryPath + "/search-photos")
  await RNFS.copyFile(photoPath, RNFS.DocumentDirectoryPath + "/search-photos/" + lastSearchNo.toString() + ".jpg");
}
uploadSearchPhoto = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var storageRef = storage().ref();
    var metadata = {
      contentType: 'image/jpeg',
    };
    var ref1 = storageRef.child("Photos/" + auth().currentUser.uid + "/SearchPhotos/" + "search-photo.jpg");
    console.log("storageref child alındı")
    ref1.put(blob).then(snapshot => {
      console.log("global.functionNumber ", global.functionNumber)
      var lang = language[global.lang]
      if(global.functionNumber != -1){
        const updateRef = firestore().collection('Functions').doc('Embedder');
        var batch = 1
        var randFloat = Math.random()
        console.log(auth().currentUser.uid)
        const simRef = firestore().collection(auth().currentUser.uid).doc('Similarity');
        const bioRef = firestore().collection(auth().currentUser.uid).doc('Bios');
        const infoRef = firestore().collection(auth().currentUser.uid).doc('Users');
        simRef.set({
        }).then(()=> {
          console.log("Similarity updated")
          bioRef.set({
          }).then(()=> {
            console.log("Bios updated")
            infoRef.set({
            }).then(()=> {
              console.log("Users updated")
              updateRef.set({
              name: auth().currentUser.uid + "_" + batch.toString() + "_" + randFloat.toString() + "_" + global.functionNumber.toString()
              }).then(() => {

                console.log("Embedder updated")
                    this.setState({
                      messageButtonDisabled: true,
                      backgroundOpacity:0.2,
                      messageButtonOpacity: 0,
                      isVisible2: false,
                      uri0: null,
                      uri1: null,
                      uri2: null,
                      uri3: null,
                      uri4: null,
                      uri5: null,
                      imagePath: null,
                      swipeableDisabled: true,
                      uri2_username: "",
                      uri2_country: "",
                      uri2_bio: "",
                      uri2_gender: "",

                    });
                    if (this.probabilityDoneCheck == false){
                      this.checkFunction();
                    }
                  }).catch(error => {
                    console.log("buraya mı geldi")
                    this.setState({loadingOpacity: 0})
                    console.log("buraya mı geldi evet")
                    this.spinValue = new Animated.Value(0)
                    console.log("User2 update olmadı")
                    Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
                  });
            }).catch(error => {
              console.log(error)
              Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
            })
          }).catch(error => {
            console.log(error)
            Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
          })
        }).catch(error => {
          console.log(error)
          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
        })
      }
      else{
        const num_ref = firestore().collection('Functions').doc('Number');
        num_ref.get().then(doc => {
         if (doc.exists) {
           global.functionNumber = doc.data()["key"]
           const updateRef = firestore().collection('Functions').doc('Embedder');
           var batch = 1
           var randFloat = Math.random()
           const simRef = firestore().collection(auth().currentUser.uid).doc('Similarity');
           const bioRef = firestore().collection(auth().currentUser.uid).doc('Bios');
           const infoRef = firestore().collection(auth().currentUser.uid).doc('Users');
           simRef.set({
           }).then(()=> {
             console.log("Similarity updated")
             bioRef.set({
             }).then(()=> {
               console.log("Bios updated")
               infoRef.set({
               }).then(()=> {
                 console.log("Users updated")
                 updateRef.set({
                 name: auth().currentUser.uid + "_" + batch.toString() + "_" + randFloat.toString() + "_" + global.functionNumber.toString()
                 }).then(() => {
                   console.log("Embedder updated")
                       this.setState({
                         messageButtonDisabled: true,
                         messageButtonOpacity: 0,
                         backgroundOpacity:0.2,
                         isVisible2: false,
                         uri0: null,
                         uri1: null,
                         uri2: null,
                         uri3: null,
                         uri4: null,
                         uri5: null,
                         imagePath: null,
                         swipeableDisabled: true,
                         uri2_username: "",
                         uri2_country: "",
                         uri2_bio: "",
                         uri2_gender: "",

                       });
                       if (this.probabilityDoneCheck == false){
                         this.checkFunction();
                       }
                     }).catch(error => {
                       this.setState({loadingOpacity: 0})
                       this.spinValue = new Animated.Value(0)
                       console.log("User2 update olmadı")
                       Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
                     });
               }).catch(error => {
                 console.log(error)
                 Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
               })
             }).catch(error => {
               console.log(error),
               Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
             })
           }).catch(error => {
             console.log(error)
             Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
           })
         }
       }).catch(error => {
         this.setState({loadingOpacity: 0})
         this.spinValue = new Animated.Value(0)
         console.log("Function number catchi")
         Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
       });
      }
    }).catch(error => {
      this.setState({loadingOpacity: 0})
      this.spinValue = new Animated.Value(0)
      console.log("Search fotosu upload olmadı")
      Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
    });
}
search = () =>{
    this.setState({isVisible2: true})
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
    global.welcomeOpacity = 0;
    this.setState({
      photoPath: image.path,
      photo: {uri: image.path},
      borderOpacity: 0,
      opacity: 0,
      isVisible1: false,
      disabled: false,
      btnOpacity: 1,
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
    global.welcomeOpacity = 0;
    this.setState({
      photoPath: image.path,
      photo: {uri: image.path},
      borderOpacity: 0,
      opacity: 0,
      disabled: false,
      btnOpacity: 1,
    });
});
};

render(){
    var lang = language[global.lang]
    var emptyScreenHeight = this.height -( getStatusBarHeight() + headerHeight + this.width/6 + this.width/2*(7/6) + this.width/10 + this.width*(3/10)*(7/6) + this.width/10 + this.width/7)
    const {navigate} = this.props.navigation;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    const spinY = this.spinValueY.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })

    const spinZ = this.spinValueZ.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Main"}
      onPress = {()=> this.setState({isVisible2: true})}
      isFilterVisible = {this.state.showFilter}
      title = {"Twinizer"}>
      </CustomHeader>

      <BigImgInfo
      opacity = {this.state.messageButtonOpacity}
      username = {this.state.uri2_username}
      country = {this.state.uri2_country}/>

      <Swipeable
      style = {{width: this.width*501, left: -this.width*250,
      height: this.width*(5/10)*(7/6) }}
      disabled = {this.state.swipeableDisabled}
      rightContent={this.noRight()}
      leftContent={this.noLeft()}

      swipeStartMinDistance = {3}

      onSwipeStart = {()=> this.swipeStart()}
      onSwipeRelease = {()=> this.swipeRelease()}

      onLeftActionActivate = {()=> this.leftActionActivate()}
      onLeftActionActivate2 = {()=> this.leftActionActivate2()}
      onRightActionActivate = {()=> this.rightActionActivate()}
      onRightActionActivate2 = {()=> this.rightActionActivate2()}
      onLeftActionDeactivate= {()=> this.leftActionDeactivate()}
      onLeftActionDeactivate2= {()=> this.leftActionDeactivate2()}
      onRightActionDeactivate= {()=> this.rightActionDeactivate()}
      onRightActionDeactivate2 = {()=> this.rightActionDeactivate2()}

      onLeftActionComplete = {()=> this.leftActionComplete()}
      onRightActionComplete = { async ()=> this.rightActionComplete()}

      onLeftActionIncomplete = {()=> this.leftActionIncomplete()}
      onRightActionIncomplete = {()=> this.rightActionIncomplete()}>

      <View style = {{position: "absolute",flexDirection: "row", width: this.width*27/10, right: this.state.swipeableContentRight, justifyContent:"center", alignItems: "center"}}>


      <SwipeableSmallImg
      index = {7}
      imgSource = {this.state.uri0}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <View style = {{ height: this.width*5/10*(7/6), width: this.width*3/10}}/>

      <SwipeableSmallImg
      index = {6}
      imgSource = {this.state.uri1}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <Animated.View style = {{ height: this.width*5/10*(7/6), width: this.emptyWidthAnimation}}/>

      <SwipeableBigImg
      showAd = {this.state.showAd}
      disabled = {this.state.messageButtonOpacity == 0 ? true : false}
      isFavorite = { isFav ? 1 : 0}
      isBlocked = { isBlock ? 1 : 0}
      imgSource = {this.state.uri2}
      width = {this.widthAnimation}
      height = {this.heightAnimation}
      onPress = {()=>this.setState({openProfileIsVisible: true})}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <Animated.View style = {{height: this.width*5/10*(7/6), width: this.emptyWidthAnimation}}/>

      <SwipeableSmallImg
      index = {4}
      imgSource = {this.state.uri3}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <View style = {{height: this.width*5/10*(7/6), width: this.width*3/10}}/>

      <SwipeableSmallImg
      index = {3}
      imgSource = {this.state.uri4}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <View style = {{ height: this.width*5/10*(7/6), width: this.width*3/10}}/>

      <SwipeableSmallImg
      index = {2}
      imgSource = {this.state.uri5}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      </View>


      </Swipeable>

      <View
      style = {{opacity: this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 1 : 0 , backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.2)" : "rgba(181,181,181,0.6)" , flexDirection: "row", width: this.width/2, height: this.width/10, left: this.width/4,
      borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16,
      }}>
      <FavoriteUserButton
      disabled = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 0 : 1}
      onPress = {()=>this.addToFavButtonClicked("onMain")}
      opacity = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 1 : 0 }
      borderBottomLeftRadius = {16}
      borderTopLeftRadius = {16}
      isSelected = {isFav}/>
      <SendMsgButton
      disabled = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 0 : 1}
      onPress = {()=>this.sendFirstMessage()}
      opacity = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 1 : 0 }/>
      <BlockUserButton
      disabled = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 0 : 1}
      onPress = {()=>this.addToBlockButtonClicked("onMain")}
      borderBottomRightRadius = {16}
      borderTopRightRadius = {16}
      opacity = {this.state.messageButtonOpacity && (global.swipeCount % 6 != 0 || global.swipeCount == 0) ? 1 : 0 }
      isSelected = {isBlock}/>
      </View>

      <View
      style = {{justifyContent: "center", alignItems:"center",height: emptyScreenHeight/2}}/>

      <View
      style = {{justifyContent: "center", alignItems:"center",height: this.width*3/10*7/6}}>
      <ImageUploader
      position = {"relative"}
      width = {this.width*3/10}
      borderRadius = {16}
      borderOpacity = {this.state.borderOpacity}
      onPress={()=>this.setState({isVisible1: true})}
      textOpacity = {this.state.opacity}
      fontSize = {14}
      photo = {this.state.photo}/>
      </View>

      <View
      style = {{justifyContent: "center", alignItems:"center",height: emptyScreenHeight/4}}/>
      <View
      style = {{justifyContent: "center", alignItems:"center",height: this.width/10}}>
      <SearchButton
      position = "relative"
      onPress={()=>this.searchDone()}
      disabled = {this.state.disabled}
      opacity = {this.state.btnOpacity}/>
      </View>

      <InfoModal
      isVisible = {this.state.searchOnIsVisible}
      txtAlert = {"There is already a Twinizing process going on. You can automatically cancel it and start a new process by uploading a new image."}
      txtGotIt = {lang.GotIt}
      onPressClose = {()=>this.setState({searchOnIsVisible:false})}/>

      <InfoModal
      textVerticalAlign = {"center"}
      isVisible = {this.state.notifIsVisible}
      txtAlert = {lang.TwinizingProcessInfo}
      txtGotIt = {lang.GotIt}
      onPressClose = {()=> {this.setState({notifIsVisible:false}), interstitial.show()}}/>

      <ImageUploadModal
      isVisible={this.state.isVisible1}
      txtUploadPhoto = {lang.UploadAPhoto}
      txtCancel = {lang.Cancel}
      txtTakePhoto = {lang.Camera}
      txtOpenLibrary = {lang.Library}
      onPressCancel = {()=>this.setState({ isVisible1: false}) }
      onPressCamera = {this.camera}
      onPressLibrary = {this.library}/>

      <FilterModal
      isVisible={this.state.isVisible2}
      onBackdropPress = {()=> this.setState({isVisible2: false})}
      onValueChangeGender = {(value) => this.valueChangeGender(value.label)}
      onValueChangeCountry = {(value) => this.valueChangeCountry(value.label)}
      genderSelectedValue = {this.state.gender}
      countrySelectedValue = {this.state.country}
      placeHolder1 = {this.state.placeHolder1}
      placeHolder2 = {this.state.placeHolder2}
      onPressSearch = {()=>this.filterDone()}
      textSearch = {lang.Apply}
      opacity = {this.state.filterButtonOpacity}
      searchDisabled = {this.state.disabledSearch}
      textFilters = {lang.Filter}/>



      <PhotoPopUpModal
      isVisible = {this.state.openProfileIsVisible}
      onPressImage = {() => {
        this.props.navigation.setOptions({tabBarVisible: false})
        this.setState({imageViewerVisible: true})
      }}
      onBackdropPress = {()=> this.setState({openProfileIsVisible: false})}
      username = {this.state.uri2_username}
      bio = {this.state.uri2_bio}
      onPressCancel = {()=>this.setState({openProfileIsVisible:false}) }
      imgSource = {this.state.uri2}
      isFavorite = {isFav}
      isBlocked = {isBlock}
      onPressFav = {()=>this.addToFavButtonClicked("onModal")}
      onPressBlock = {()=>this.addToBlockButtonClicked("onModal")}
      onPressSendMsg = {()=>this.sendFirstMessage()}

      favBcancel = {lang.CancelCap}
      favBdialog = {lang.DontShowThisDialogAgain}
      favBtickIsVisible = {this.state.favTickVisible}
      favBonPressTick = {()=> this.setState({favTickVisible: this.state.favTickVisible ? 0 : 1})}
      favBisVisible = {this.state.addToFavVisibleUpper}
      favBimage = {"star"}
      favBtxtAlert = {lang.FavUserInfoPt1 + this.state.uri2_username + lang.FavUserInfoPt2}
      favBonPressAdd = {()=>this.favModalButtonClicked(emailArray[global.swipeCount])}
      favBonPressClose = {()=>this.setState({favTickVisible: false, addToFavVisible:false, addToFavVisibleUpper: false})}

      blockBcancel = {lang.CancelCap}
      blockBdialog = {lang.DontShowThisDialogAgain}
      blockBtickIsVisible = {this.state.blockTickVisible}
      blockBonPressTick = {()=> this.setState({blockTickVisible: this.state.blockTickVisible ? 0 : 1})}
      blockBisVisible = {this.state.addToBlockVisibleUpper}
      blockBimage = {"block"}
      blockBtxtAlert = {lang.BlockUserInfoPt1 +this.state.uri2_username + lang.BlockUserInfoPt2 }
      blockBonPressAdd = {()=>this.blockModalButtonClicked(emailArray[global.swipeCount])}
      blockBonPressClose = {()=>this.setState({blockTickVisible: false, addToBlockVisible:false, addToBlockVisibleUpper:false})}>

      </PhotoPopUpModal>

      <FavBlockModal
      cancel = {lang.CancelCap}
      dialog = {lang.DontShowThisDialogAgain}
      tickIsVisible = {this.state.favTickVisible}
      onPressTick = {()=> this.setState({favTickVisible: this.state.favTickVisible ? 0 : 1})}
      isVisible = {this.state.addToFavVisible}
      image = {"star"}
      txtAlert= {lang.FavUserInfoPt1 + this.state.uri2_username + lang.FavUserInfoPt2}
      onPressAdd= {()=>this.favModalButtonClicked(emailArray[global.swipeCount])}
      onPressClose = {()=>this.setState({favTickVisible: false,addToFavVisible:false, addToFavVisibleUpper: false})}/>

      <FavBlockModal
      cancel = {lang.CancelCap}
      dialog = {lang.DontShowThisDialogAgain}
      tickIsVisible = {this.state.blockTickVisible}
      onPressTick = {()=> this.setState({blockTickVisible: this.state.blockTickVisible ? 0 : 1})}
      isVisible = {this.state.addToBlockVisible}
      image = {"block"}
      txtAlert= {lang.BlockUserInfoPt1 +this.state.uri2_username + lang.BlockUserInfoPt2 }
      onPressAdd= {()=>this.blockModalButtonClicked(emailArray[global.swipeCount])}
      onPressClose = {()=>this.setState({blockTickVisible: false,addToBlockVisible:false, addToBlockVisibleUpper:false})}/>


      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', top: getStatusBarHeight() + headerHeight + this.width/6+(this.width/2)*(7/6)/2-this.width/30, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>



      <Animated.Image source={{uri: "logorenkli"}}
        style={{transform: [ {rotateY: spinY}, {rotateX: spinZ}], height: this.width*(2/15),width: this.width*(2/15),
        position: 'absolute', top: getStatusBarHeight() + headerHeight + this.width/6+(this.width/2)*(7/6)/2-this.width/15, left: this.width*(6.5/15) , opacity: 1}}/>

        <ImageViewerModal
        isVisible = {this.state.imageViewerVisible}
        images = {this.state.uri2}
        whichScreen = {"tabs"}
        onCancel = {() => {
          this.props.navigation.setOptions({tabBarVisible: true})
          this.setState({imageViewerVisible: false})
        }}/>
    </View>

        );
  }}
