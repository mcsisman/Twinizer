import React, {Component} from 'react';
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


if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var distanceArray = [];
var usernameArray = [];
var emailArray = [];
var genderArray = [];
var countryArray = [];
var photoArray = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];
var mainDistanceArray = [];
var mainUsernameArray = [];
var mainEmailArray = [];
var mainGenderArray = [];
var mainCountryArray = [];
var mainPhotoArray = [];
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
export default class MainScreen extends Component<{}>{
constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.activationDistanceLeft = this.width*(2.5/10)
    global.deactivationDistanceLeft = this.width*(2.5/10)
    global.activationDistanceRight = this.width*(2.5/10)
    global.deactivationDistanceRight = this.width*(2.5/10)

    this.state = {
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
      addToBlockVisible: false,
      country: null,
      gender: null,
      disabledSearch: true,
      filterButtonOpacity: 0.4,
      placeHolder1: global.langCountry,
      placeHolder2: global.langGender,
      imagePath: null,
      backgroundOpacity: 0.2,
      swipeableDisabled: true,
      photoHeight2: global.width*(5/10)*(7/6),
      photoWidth2: global.width*(5/10),
      test: global.width*((12.5+2490)/10),
      photoRight0: global.width*((24+2490)/10),
      photoRight1: global.width*((19+2490)/10),
      photoRight2: global.width*((12.5+2490)/10),
      photoRight3: global.width*((9+2490)/10),
      photoRight4: global.width*((4+2490)/10),
      photoRight5: global.width*((-1+2490)/10),
      photoTop2: 0,
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
    this.doesExist = false,
    this.probabilityDoneCheck = false;
    this.downloadURL = "";
    this.url = "",
    this.countries = countries.countries
    this.welcome = {uri: 'welcome'}
    global.globalGender = "";
    this.photoRes = 7/6
    this.inSearchDone = false

    this.widthAnimation = new Animated.Value(global.width*(5/10))
    this.heightAnimation = new Animated.Value(global.width*(5/10)*(7/6))
    this.topAnimation = new Animated.Value(0)
    this.spinValue = new Animated.Value(0)
    var test = "xxx"
  }

async componentDidMount(){
  var authStatus = await messaging().requestPermission();
    favShowThisDialog = await AsyncStorage.getItem(auth().currentUser.uid + 'favShowThisDialog')
    blockShowThisDialog = await AsyncStorage.getItem(auth().currentUser.uid + 'blockShowThisDialog')
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

async onIds(device) {
    // Check playerId from local and change if it is changed
    playerId = await AsyncStorage.getItem(auth().currentUser.uid + 'playerId')
    global.playerId = device["userId"]
    console.log("playerId from storage: ", playerId)
    console.log("playerId from onesignal", global.playerId)
    if(playerId != global.playerId){
      var randO = Math.random()
      database().ref('/Users/'+auth().currentUser.uid + '/i').update({
        o: randO
      });
      database().ref('/PlayerIds/').update({
        [auth().currentUser.uid]: global.playerId
      });
      AsyncStorage.setItem(auth().currentUser.uid + 'playerId', global.playerId)
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
  await AsyncStorage.getItem(auth().currentUser.uid + 'favoriteUsers')
    .then(req => {
      if(req){
        return JSON.parse(req)
      }
      else{
        return null
      }
    })
    .then(json => {
      console.log("JSON DATA: ", json)
      favoriteUsers = json
      if (favoriteUsers == null){
        favoriteUsers = []
      }
      favoriteUsersSet = new Set(favoriteUsers)
    })
}
async getBlockedUsers(){
  await AsyncStorage.getItem(auth().currentUser.uid + 'blockedUsers')
    .then(req => {
      if(req){
         return JSON.parse(req)
      }
      else{
        return null
      }
    })
    .then(json => {
      blockedUsers = json
      if (blockedUsers == null){
        blockedUsers = []
      }
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
  if(!this.state.swipeableDisabled){
    this.widthAnimation.setValue(global.width*(5/10))
    this.heightAnimation.setValue(global.width*(5/10)*(7/6))
    this.topAnimation.setValue(0)
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
        Animated.timing(this.topAnimation, {
          duration: 200,
          toValue: global.width*(7/40),
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
    this.setState({
  photoRight2: this.state.photoRight3 + this.width*(5/10),
  messageButtonDisabled: true,
  messageButtonOpacity: 0})
  }
}
swipeRelease(){
  this.checkUri2FavOrBlocked()
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
          photoRight2: this.state.test,
          messageButtonDisabled: false,
          messageButtonOpacity: 1
          })

          this.widthAnimation.setValue(global.width*(2/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          this.topAnimation.setValue(global.width*(7/40))
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
              Animated.timing(this.topAnimation, {
                duration: 300,
                toValue: 0,
                easing: Easing.elastic(0.5),
                useNativeDriver: false
            }
          )

          ]).start()
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
  this.heightAnimation.setValue(global.width*(2/10)*(7/6))
  this.topAnimation.setValue(global.width*(7/40))
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
      Animated.timing(this.topAnimation, {
        duration: 200,
        toValue: 0,
        easing: Easing.elastic(0.5),
        useNativeDriver: false
    }
  )

  ]).start()
  console.log("Swipe Count:", global.swipeCount)
  if(this.leftActionCount == 2){
    this.activationCount = 0
    this.complete = false
    this.leftActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
    test: this.state.test + this.width*(10/10),
    photoRight0: this.state.photoRight0 + this.width*(10/10),
    photoRight1: this.state.photoRight1 + this.width*(10/10),
    photoRight2: this.state.test  + this.width*(10/10),
    photoRight3: this.state.photoRight3 + this.width*(10/10),
    photoRight4: this.state.photoRight4 + this.width*(10/10),
    photoRight5: this.state.photoRight5 + this.width*(10/10),
    uri5: this.state.uri3,
    uri4: this.state.uri2,
    uri3: this.state.uri1,
    uri2: this.state.uri0,
    uri1: photoArray[global.swipeCount - 1],
    uri0: photoArray[global.swipeCount - 2],
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
  }
    else{
      this.activationCount = 0
      this.complete = false
      this.leftActionCount = 0
      this.releasedAfterLeftD2 = false
      this.releasedAfterRightD2 = false
      this.setState({
      photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
      test: this.state.test + this.width*(5/10),
      photoRight0: this.state.photoRight0 + this.width*(5/10),
      photoRight1: this.state.photoRight1 + this.width*(5/10),
      photoRight2: this.state.test  + this.width*(5/10),
      photoRight3: this.state.photoRight3 + this.width*(5/10),
      photoRight4: this.state.photoRight4 + this.width*(5/10),
      photoRight5: this.state.photoRight5 + this.width*(5/10),
      uri5: this.state.uri4,
      uri4: this.state.uri3,
      uri3: this.state.uri2,
      uri2: this.state.uri1,
      uri1: this.state.uri0,
      uri0: photoArray[global.swipeCount - 2],
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
    }
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
  this.heightAnimation.setValue(global.width*(2/10)*(7/6))
  this.topAnimation.setValue(global.width*(7/40))
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
      Animated.timing(this.topAnimation, {
        duration: 200,
        toValue: 0,
        easing: Easing.elastic(0.5),
        useNativeDriver: false
    }
  )

  ]).start()
  if(this.rightActionCount == 2){
    this.activationCount = 0
    this.complete = false
    this.rightActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
    test: this.state.test - this.width*(10/10),
    photoRight0: this.state.photoRight0 - this.width*(10/10),
    photoRight1: this.state.photoRight1 - this.width*(10/10),
    photoRight2: this.state.test - this.width*(10/10),
    photoRight3: this.state.photoRight3 - this.width*(10/10),
    photoRight4: this.state.photoRight4 - this.width*(10/10),
    photoRight5: this.state.photoRight5 - this.width*(10/10),
    uri0: this.state.uri2,
    uri1: this.state.uri3,
    uri2: this.state.uri4,
    uri3: photoArray[global.swipeCount + 1],
    uri4: photoArray[global.swipeCount + 2],
    uri5: photoArray[global.swipeCount + 3],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:countryArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  if (photoArray.length < emailArray.length){
    await this.getImageURL(photoArray.length)
    //await this.downloadImages(photoArray.length)
    await this.getImageURL(photoArray.length)
    //await this.downloadImages(photoArray.length)
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
    photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
    test: this.state.test - this.width*(5/10),
    photoRight0: this.state.photoRight0 - this.width*(5/10),
    photoRight1: this.state.photoRight1 - this.width*(5/10),
    photoRight2: this.state.test - this.width*(5/10),
    photoRight3: this.state.photoRight3 - this.width*(5/10),
    photoRight4: this.state.photoRight4 - this.width*(5/10),
    photoRight5: this.state.photoRight5 - this.width*(5/10),
    uri0: this.state.uri1,
    uri1: this.state.uri2,
    uri2: this.state.uri3,
    uri3: this.state.uri4,
    uri4: photoArray[global.swipeCount + 2],
    uri5: photoArray[global.swipeCount + 3],
    uri2_username: usernameArray[global.swipeCount],
    uri2_country:countryArray[global.swipeCount],
    uri2_gender:genderArray[global.swipeCount],
    uri2_bio: bioDict[emailArray[global.swipeCount]],
    messageButtonDisabled: false,
    messageButtonOpacity: 1
  })
  if (photoArray.length < emailArray.length){
    await this.getImageURL(photoArray.length)
    //await this.downloadImages(photoArray.length)
  }
  global.deactivationDistanceRight = global.deactivationDistanceRight + this.width*(5/10)
  global.activationDistanceLeft = global.activationDistanceLeft - this.width*(5/10)
  global.deactivationDistanceLeft = global.deactivationDistanceLeft - this.width*(5/10)
  console.log("RightActionCompleted tek")
  console.log(this.state.uri2_bio);
  }
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
    this.heightAnimation.setValue(global.width*(2/10)*(7/6))
    this.topAnimation.setValue(global.width*(7/40))
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
        Animated.timing(this.topAnimation, {
          duration: 200,
          toValue: 0,
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
    this.activationCount = 0
    this.complete = false
    this.leftActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
    test: this.state.test + this.width*(5/10),
    photoRight0: this.state.photoRight0 + this.width*(5/10),
    photoRight1: this.state.photoRight1 + this.width*(5/10),
    photoRight2: this.state.test  + this.width*(5/10),
    photoRight3: this.state.photoRight3 + this.width*(5/10),
    photoRight4: this.state.photoRight4 + this.width*(5/10),
    photoRight5: this.state.photoRight5 + this.width*(5/10),
    uri5: this.state.uri4,
    uri4: this.state.uri3,
    uri3: this.state.uri2,
    uri2: this.state.uri1,
    uri1: this.state.uri0,
    uri0: photoArray[global.swipeCount - 2],
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
    this.heightAnimation.setValue(global.width*(2/10)*(7/6))
    this.topAnimation.setValue(global.width*(7/40))
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
        Animated.timing(this.topAnimation, {
          duration: 200,
          toValue: 0,
          easing: Easing.elastic(0.5),
          useNativeDriver: false
      }
    )

  ]).start(),
    this.activationCount = 0
    this.complete = false
    this.rightActionCount = 0
    this.releasedAfterLeftD2 = false
    this.releasedAfterRightD2 = false
    this.setState({
    photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
    test: this.state.test - this.width*(5/10),
    photoRight0: this.state.photoRight0 - this.width*(5/10),
    photoRight1: this.state.photoRight1 - this.width*(5/10),
    photoRight2: this.state.test - this.width*(5/10),
    photoRight3: this.state.photoRight3 - this.width*(5/10),
    photoRight4: this.state.photoRight4 - this.width*(5/10),
    photoRight5: this.state.photoRight5 - this.width*(5/10),
    uri0: this.state.uri1,
    uri1: this.state.uri2,
    uri2: this.state.uri3,
    uri3: this.state.uri4,
    uri4: photoArray[global.swipeCount - 2],
    uri5: photoArray[global.swipeCount - 3],
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
}

async sendFirstMessage(){
  //global.receiverMail = emailArray[global.swipeCount]
  //global.receiverGender = genderArray[global.swipeCount]
  //global.receiverCountry = countryArray[global.swipeCount]
  //global.receiverUsername = usernameArray[global.swipeCount]
  global.msgFromMain = true
  global.receiverUid = "p9UY4QQtEnRTWBYDfgG4pyHiyZg2"
  global.receiverMail = "cemil.sisman@ug.bilkent.edu.tr"
  global.receiverGender = "Male"
  global.receiverCountry = "Australia"
  global.receiverUsername = "cemil ug"
  //global.firstMessage = true
  global.playerIdArray[global.receiverUid] = await AsyncStorage.getItem(global.receiverUid + "playerId")
  console.log("global.playerIdArray: ", global.playerIdArray)
  var tempo = await AsyncStorage.getItem(global.receiverUid + "o")
  var realtimeo = 0;
  database().ref('/Users/'+ global.receiverUid + "/i/o").once('value').then(snapshot => {
    realtimeo = snapshot.val()
  });
  if(tempo != realtimeo){
    database().ref('/PlayerIds/'+global.receiverUid).once('value').then(snapshot => {
      console.log("PLAYER ID READ EDIYO")
      global.playerIdArray[global.receiverUid] = snapshot.val()
      AsyncStorage.setItem(global.receiverUid + "playerId", snapshot.val())
      AsyncStorage.setItem(global.receiverUid + "o", realtimeo)
    });
  }
  this.props.navigation.navigate("Chat")
}

addToFavButtonClicked(){
  if (isFav){
    var index = favoriteUsers.indexOf(emailArray[global.swipeCount])
    favoriteUsers.splice(index,1)
    AsyncStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    favoriteUsersSet.delete(emailArray[global.swipeCount])
    isFav = false
    this.setState({addToFavVisible:false})
  }
  else{
    if(favShowThisDialog == "true" || favShowThisDialog == null){
      this.setState({addToFavVisible:true})
    }
    else{
      this.favModalButtonClicked(emailArray[global.swipeCount])
      this.setState({addToFavVisible:false})
    }
  }
}
addToBlockButtonClicked(){
  if (isBlock){
    var index = blockedUsers.indexOf(emailArray[global.swipeCount])
    blockedUsers.splice(index,1)
    AsyncStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
    blockedUsersSet.delete(emailArray[global.swipeCount])
    isBlock = false
    this.setState({addToBlockVisible:false})
  }
  else{
    if(blockShowThisDialog == "true" || blockShowThisDialog == null){
      this.setState({addToBlockVisible:true})
    }
    else{
      this.blockModalButtonClicked(emailArray[global.swipeCount])
      this.setState({addToBlockVisible:false})
    }
  }
}

favModalButtonClicked(uid){
  if(this.state.favTickVisible){
    favShowThisDialog = "false"
    AsyncStorage.setItem(auth().currentUser.uid + 'favShowThisDialog', favShowThisDialog)
  }
  this.addToFavoriteUsers(uid)
  isBlock = false
  isFav = true
  this.setState({addToFavVisible:false})
}
blockModalButtonClicked(uid){
  if(this.state.blockTickVisible){
    blockShowThisDialog = "false"
    AsyncStorage.setItem(auth().currentUser.uid + 'blockShowThisDialog', blockShowThisDialog)
  }
  this.addToBlockedUsers(uid)
  isBlock = true
  isFav = false
  this.setState({addToBlockVisible:false})
}

addToFavoriteUsers(uid){
  console.log("favoriteUsers: ", favoriteUsers)
  if (favoriteUsers == null){
    if (blockedUsersSet.has(uid)){
      var index = blockedUsers.indexOf(uid)
      blockedUsers.splice(index,1)
      AsyncStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
      blockedUsersSet.delete(uid)
    }
    favoriteUsers.push(uid)
    favoriteUsersSet.add(uid)
    AsyncStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
  }
  else if (favoriteUsers.length == 0 || !favoriteUsersSet.has(uid)) {
    if (favoriteUsers.length <= 15){
      if (blockedUsersSet.has(uid)){
        var index = blockedUsers.indexOf(uid)
        blockedUsers.splice(index,1)
        AsyncStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
        blockedUsersSet.delete(uid)
      }
      favoriteUsers.push(uid)
      favoriteUsersSet.add(uid)
      AsyncStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    }
  }
}
addToBlockedUsers(uid){
  if (blockedUsers == null || blockedUsers.length == 0 || !blockedUsersSet.has(uid)){
    if (favoriteUsersSet.has(uid)){
      var index = favoriteUsers.indexOf(uid)
      favoriteUsers.splice(index,1)
      AsyncStorage.setItem(auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUsers))
    }
    blockedUsers.push(uid)
    blockedUsersSet.add(uid)
    AsyncStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
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
  if(this.state.swipeableDisabled || global.swipeCount == photoArray.length+1){ // this.state.swipeableDisabled
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
  if (fn == "searchDone"){
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
     for(let i = 0; i < length; i++){
       if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(items[i][0]) == false){
         countryArray.push(((usersDict[items[i][0]]).split("_"))[1]);
         genderArray.push(((usersDict[items[i][0]]).split("_"))[0]);
         emailArray.push(items[i][0]);
         usernameArray.push(((usersDict[items[i][0]]).split("_"))[2]);
         distanceArray.push(items[i][1]);
         mainCountryArray.push(((usersDict[items[i][0]]).split("_"))[1]);
         mainGenderArray.push(((usersDict[items[i][0]]).split("_"))[0]);
         mainEmailArray.push(items[i][0]);
         mainUsernameArray.push(((usersDict[items[i][0]]).split("_"))[2]);
         mainDistanceArray.push(items[i][1]);
       }
     }
     console.log(items);
     console.log(emailArray);
     console.log(distanceArray);
     //console.log(distanceArray);
  }
  else if (fn == "filterDone with all") {

    for (let i = 0; i < mainEmailArray.length; i++){
      if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
        emailArray.push(mainEmailArray[i]);
        usernameArray.push(mainUsernameArray[i]);
        countryArray.push(mainCountryArray[i]);
        genderArray.push(mainGenderArray[i]);
        distanceArray.push(mainDistanceArray[i]);
        if (i < mainPhotoArray.length){
          photoArray.push(mainPhotoArray[i]);
        }
      }
    }
  }
  else if (fn == "filterDone with all genders") {

    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainCountryArray[i] == country){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          emailArray.push(mainEmailArray[i]);
          usernameArray.push(mainUsernameArray[i]);
          countryArray.push(mainCountryArray[i]);
          genderArray.push(mainGenderArray[i]);
          distanceArray.push(mainDistanceArray[i]);
          if (i < mainPhotoArray.length){
            photoArray.push(mainPhotoArray[i]);
          }
        }
      }
    }
  }
  else if (fn == "filterDone with all countries") {

    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainGenderArray[i] == gender){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          emailArray.push(mainEmailArray[i]);
          usernameArray.push(mainUsernameArray[i]);
          countryArray.push(mainCountryArray[i]);
          genderArray.push(mainGenderArray[i]);
          distanceArray.push(mainDistanceArray[i]);
          if (i < mainPhotoArray.length){
            photoArray.push(mainPhotoArray[i]);
            console.log("photoArray.length for = ", i, photoArray.length)
          }
        }
      }
    }
  }
  else if (fn == "filterDone") {

    for (let i = 0; i < mainEmailArray.length; i++){
      if (mainCountryArray[i] == country && mainGenderArray[i] == gender){
        if (blockedUsers == null || blockedUsers.length == 0 || blockedUsersSet.has(mainEmailArray[i]) == false){
          emailArray.push(mainEmailArray[i]);
          usernameArray.push(mainUsernameArray[i]);
          countryArray.push(mainCountryArray[i]);
          genderArray.push(mainGenderArray[i]);
          distanceArray.push(mainDistanceArray[i]);
          if (i < mainPhotoArray.length){
            photoArray.push(mainPhotoArray[i]);
          }
        }
      }
    }
  }
}

async downloadImages(imageIndex){

  if (imageIndex < emailArray.length){
    let dirs = RNFetchBlob.fs.dirs
    await RNFetchBlob
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
      while(this.doesExist){
        RNFetchBlob.fs.exists(res.path())
        .then((exist) => {
          this.doesExist = !exist
        })
        .catch(() => { })
      }
      photoArray.push("file://" + res.path())
      if (this.inSearchDone){
        mainPhotoArray.push("file://" + res.path())
      }
      this.setState({imagePath:  "file://" + res.path()})
    })
  }
  console.log("photoArray.length: ", photoArray.length)
}

async getImageURL(imageIndex){
    var storageRef = storage().ref("Photos/" + emailArray[imageIndex] + "/1.jpg")
    await storageRef.getDownloadURL().then(data =>{
      this.downloadURL = data
      photoArray.push(data)

    }).catch(function(error) {
      // Handle any errors
    });
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
          if(dict["noface"] != null){
            this.setState({
              loadingOpacity: 0
            })
            this.spinValue = new Animated.Value(0)
            Alert.alert("Error!", "There is no face in your search photo.." )
          }
          else{
            await this.createEmailDistanceArrays("All Genders","All Countries","searchDone");
            ////////////////////////////////////////////////////////////////////////////////
            for(let i = 0; i < 10; i++){
              // resim indirme KISMI /////////////////////////////////////////////////
              await this.getImageURL(i);
              //await this.downloadImages(i);
            }
            console.log("biyere geldik, mainPhotoArray.length ", mainPhotoArray.length)
            this.setState({
              uri0: null,
              uri1: null,
              uri2: photoArray[0],
              uri3: photoArray[1],
              uri4: photoArray[2],
              uri5: photoArray[3],
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
    }
    console.log(this.state.uri2);
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
        console.log("completedfuncs: ", completedfuncs)
        console.log("global.functionNumber: ", global.functionNumber)
        console.log("funcnumval: ", funcnumval)
        if(completedfuncs == funcnumval + global.functionNumber){
          await this.allFunctionsCompleted()
          funcnumval = completedfuncs
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
  })
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
  photoArray = [];
  this.doesExist = false;
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
  console.log("photoArray.length filterdone = ", photoArray.length)
  if (this.state.gender == "All Genders" && this.state.country == "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all");
  }
  if (this.state.gender != "All Genders" && this.state.country == "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all countries");
  }
  if (this.state.gender = "All Genders" && this.state.country != "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone with all genders");
  }
  if (this.state.gender != "All Genders" && this.state.country != "All Countries"){
    await this.createEmailDistanceArrays(this.state.gender,this.state.country,"filterDone");
  }
  console.log("photoArray.length filterdone end = ", photoArray.length)
  if (photoArray.length < 10){
    for(let i = photoArray.length; i < 10; i++){
      // resim indirme KISMI /////////////////////////////////////////////////
      await this.getImageURL(i);
      //await this.downloadImages(i);
    }
  }
  this.setState({
    uri0: null,
    uri1: null,
    uri2: photoArray[0],
    uri3: photoArray[1],
    uri4: photoArray[2],
    uri5: photoArray[3],
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
  this.setState({showFilter: false,
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
  photoArray.splice(0, photoArray.length)
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
  mainPhotoArray.splice(0, mainPhotoArray.length)
  emailArray = [];
  usernameArray = [];
  countryArray = [];
  genderArray = [];
  distanceArray = [];
  photoArray = [];
  mainDistanceArray = [];
  mainUsernameArray = [];
  mainEmailArray = [];
  mainGenderArray = [];
  mainCountryArray = [];
  mainPhotoArray = [];
  dict = {};
  bioDict = {};
  let dirs = RNFetchBlob.fs.dirs
  await RNFS
  .unlink(dirs.DocumentDir + "/results") // photoArray[imageIndex]
 .then(() => {console.log("FILE DELETED")})
 .catch((err) => {console.log("unlink olmadi")})
  console.log("EMAIL ARRAY LENGTH ", emailArray.length);
  this.doesExist = false;
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
  await this.uploadSearchPhoto("file://" + RNFS.DocumentDirectoryPath + "/search-photos/1.jpg")
}

async getLastSearchNo(){
  var lastSearch;
  lastSearch = await AsyncStorage.getItem(auth().currentUser.uid + 'lastSearch')
  if(lastSearch == null){
    lastSearch = "0";
  }
  lastSearch = parseInt(lastSearch)
  return lastSearch
}
async getNoOfSearch(){
  var noOfSearch;
  noOfSearch = await AsyncStorage.getItem(auth().currentUser.uid + 'noOfSearch')
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
    await AsyncStorage.setItem(auth().currentUser.uid + 'noOfSearch', noOfSearch.toString())
  }
  return noOfSearch;
}
async increaseLastSearchNo(){
  var lastSearch;
  lastSearch = await this.getLastSearchNo()
  lastSearch = lastSearch + 1
  await AsyncStorage.setItem(auth().currentUser.uid + 'lastSearch', lastSearch.toString())
  return lastSearch;
}

async getHistoryImageArray(){
  var historyArray = []
  await AsyncStorage.getItem(auth().currentUser.uid + 'historyArray')
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
  await AsyncStorage.setItem(auth().currentUser.uid + 'historyArray', JSON.stringify(historyArray))
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
                      messageButtonOpacity: 0,
                      isVisible2: false,
                      uri0: null,
                      uri1: null,
                      uri2: null,
                      uri3: null,
                      uri4: null,
                      uri5: null,
                      notifIsVisible: true,
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
                    Alert.alert("Connection Failed", "Please try Again.." )
                  });
            }).catch(error => {
              console.log(error)
              Alert.alert("Connection Failed", "Please try Again.." )
            })
          }).catch(error => {
            console.log(error)
            Alert.alert("Connection Failed", "Please try Again.." )
          })
        }).catch(error => {
          console.log(error)
          Alert.alert("Connection Failed", "Please try Again.." )
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
                         isVisible2: false,
                         uri0: null,
                         uri1: null,
                         uri2: null,
                         uri3: null,
                         uri4: null,
                         uri5: null,
                         notifIsVisible: true,
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
                       Alert.alert("Connection Failed", "Please try Again.." )
                     });
               }).catch(error => {
                 console.log(error)
                 Alert.alert("Connection Failed", "Please try Again.." )
               })
             }).catch(error => {
               console.log(error),
               Alert.alert("Connection Failed", "Please try Again.." )
             })
           }).catch(error => {
             console.log(error)
             Alert.alert("Connection Failed", "Please try Again.." )
           })
         }
       }).catch(error => {
         this.setState({loadingOpacity: 0})
         this.spinValue = new Animated.Value(0)
         console.log("Function number catchi")
         Alert.alert("Connection Failed", "Please try Again.." )
       });
      }
      }).catch(error => {
        this.setState({loadingOpacity: 0})
        this.spinValue = new Animated.Value(0)
        console.log("Search fotosu upload olmadı")
        Alert.alert("Connection Failed", "Please try Again.. 1")
      });
}
search = () =>{
    this.setState({isVisible2: true})
}
library = () =>{
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
      isVisible1: false,
      disabled: false,
      btnOpacity: 1,
    });
});
};

render(){
    var emptyScreenHeight = this.height -( getStatusBarHeight() + headerHeight + this.width/6 + this.width/2*(7/6) + this.width/10 + this.width*(3/10)*(7/6) + this.width/10 + this.width/7)
    const {navigate} = this.props.navigation;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
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

      <SwipeableSmallImg
      imgSource = {this.state.uri0}
      right = {this.state.photoRight0}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <SwipeableSmallImg
      imgSource = {this.state.uri1}
      right = {this.state.photoRight1}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <SwipeableBigImg
      isFavorite = { isFav ? 1 : 0}
      isBlocked = { isBlock ? 1 : 0}
      imgSource = {this.state.uri2}
      width = {this.widthAnimation}
      height = {this.heightAnimation}
      top = {this.topAnimation}
      right = {this.state.photoRight2}
      onPress = {()=>this.setState({openProfileIsVisible: true})}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <SwipeableSmallImg
      imgSource = {this.state.uri3}
      right = {this.state.photoRight3}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <SwipeableSmallImg
      imgSource = {this.state.uri4}
      right = {this.state.photoRight4}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      <SwipeableSmallImg
      imgSource = {this.state.uri5}
      right = {this.state.photoRight5}
      backgroundOpacity = {this.state.backgroundOpacity}/>

      </Swipeable>

      <View
      style = {{opacity: this.state.messageButtonOpacity, backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.2)" : "rgba(181,181,181,0.6)" , flexDirection: "row", width: this.width/2, height: this.width/10, left: this.width/4,
      borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16,
      }}>
      <FavoriteUserButton
      disabled = {this.state.messageButtonDisabled}
      onPress = {()=>this.addToFavButtonClicked()}
      opacity = {1}
      borderBottomLeftRadius = {16}
      borderTopLeftRadius = {16}
      isSelected = {isFav}/>
      <SendMsgButton
      disabled = {this.state.messageButtonDisabled}
      onPress = {()=>this.sendFirstMessage()}
      opacity = {1}/>
      <BlockUserButton
      disabled = {this.state.messageButtonDisabled}
      onPress = {()=>this.addToBlockButtonClicked()}
      borderBottomRightRadius = {16}
      borderTopRightRadius = {16}
      opacity = {1}
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
      onPress={()=>this.setState({ isVisible1: true})}
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
      txtGotIt = {global.langGotIt}
      onPressClose = {()=>this.setState({searchOnIsVisible:false})}/>

      <InfoModal
      isVisible={this.state.notifIsVisible}
      txtAlert = {"Your Twinizing process has started."}
      txtGotIt = {global.langGotIt}
      onPressClose = {()=>this.setState({notifIsVisible:false})}/>

      <FavBlockModal
      tickIsVisible = {this.state.favTickVisible}
      onPressTick = {()=> this.setState({favTickVisible: this.state.favTickVisible ? 0 : 1})}
      isVisible = {this.state.addToFavVisible}
      image = {"star"}
      txtAlert= {"You are adding " +this.state.uri2_username+ " to favorite users. Are you sure?"}
      onPressAdd= {()=>this.favModalButtonClicked(emailArray[global.swipeCount])}
      onPressClose = {()=>this.setState({addToFavVisible:false})}/>

      <FavBlockModal
      tickIsVisible = {this.state.blockTickVisible}
      onPressTick = {()=> this.setState({blockTickVisible: this.state.blockTickVisible ? 0 : 1})}
      isVisible = {this.state.addToBlockVisible}
      image = {"block"}
      txtAlert= {"You are blocking " +this.state.uri2_username + ". Are you sure?"}
      onPressAdd= {()=>this.blockModalButtonClicked(emailArray[global.swipeCount])}
      onPressClose = {()=>this.setState({addToBlockVisible:false})}/>

      <ImageUploadModal
      isVisible={this.state.isVisible1}
      txtUploadPhoto = {global.langUploadPhoto}
      txtCancel = {global.langCancel}
      txtTakePhoto = {global.langTakePhoto}
      txtOpenLibrary = {global.langLibrary}
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
      textSearch = {global.langSearch}
      opacity = {this.state.filterButtonOpacity}
      searchDisabled = {this.state.disabledSearch}
      textFilters = {global.langFilters}/>

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
      onPressFav = {()=>this.addToFavButtonClicked()}
      onPressBlock = {()=>this.addToBlockButtonClicked()}
      onPressSendMsg = {()=>this.sendFirstMessage()}/>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
        position: 'absolute', top: getStatusBarHeight() + headerHeight + this.width/6+(this.width/2)*(7/6)/2-this.width/30, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>





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
