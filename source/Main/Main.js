import React, {Component, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-snap-carousel';
import messaging from '@react-native-firebase/messaging';
//import OneSignal from 'react-native-onesignal';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {FAB, Snackbar, Button} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  AdEventType,
  admob,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  MaxAdContentRating,
} from '@react-native-firebase/admob';
import {
  Image,
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
  Animated,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import ChatScreen from '../Messaging/Chat';

import countries from '../Utils/Countries';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import ImageViewerModal from '../Components/Common/ImageViewer/ImageViewerModal';
import SendMsgButton from '../Components/Common/FavBlockMsg/SendMsgButton';
import BlockUserButton from '../Components/Common/FavBlockMsg/BlockUserButton';
import FavoriteUserButton from '../Components/Common/FavBlockMsg/FavoriteUserButton';
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal';
import ImageUploader from '../Components/Common/ImageUpload/ImageUploader';
import SearchButton from '../Components/Common/SearchButton/SearchButton';
import InfoModal from '../Components/Common/Info/InfoModal';

import CarouselItem from '../Components/Main/Carousel/CarouselItem';

import FavBlockModal from '../Components/Main/FavBlock/FavBlockModal';
import FilterModal from '../Components/Main/Filter/FilterModal';
import PhotoPopUpModal from '../Components/Main/Swipeable/PhotoPopUpModal';
import language from '../Utils/Languages/lang.json';
if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}

var lang = language[global.lang];
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
var addingToWhichList = '';
var listToAdd = '';
var favoriteUsers = [];
var blockedUsers = [];
var favoriteUsersSet = new Set();
var blockedUsersSet = new Set();
var favShowThisDialog = 'true';
var blockShowThisDialog = 'true';
const adUnitId =
  Platform.OS === 'android'
    ? 'ca-app-pub-5851216250959661/2799313720'
    : 'ca-app-pub-5851216250959661/4802482925';
//const adUnitId = Platform.OS === 'android' ? "ca-app-pub-5851216250959661/2799313720" : "ca-app-pub-5851216250959661/4802482925";

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default class MainScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    global.navBarHeight = this.height - this.windowHeight;
    this.width = Math.round(Dimensions.get('screen').width);

    this.lastDownloadedIndex = 9;
    this.searchResultArray = [];
    var lang = language[global.lang];
    this.state = {
      isFavArray: [],
      isBlockArray: [],
      currentCarouselIndex: 0,
      carouselArray: [],
      showAd: false,
      imageViewerVisible: false,
      favTickVisible: false,
      blockTickVisible: false,
      showFilter: false,
      photoPath: '',
      splashOver: false,
      email: '',
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
      addToBlockVisibleUpper: false,
      country: null,
      gender: null,
      disabledSearch: true,
      filterButtonOpacity: 0.4,
      placeHolder1: lang.Country,
      placeHolder2: lang.Gender,
      imagePath: null,
      backgroundOpacity: 0.2,
      swipeableDisabled: true,
      openProfileIsVisible: false,
      messageButtonOpacity: 0,
      sadfaceOpacity: 0,
      messageButtonDisabled: true,
      loadingAnimation: true,
      photo: null,
    };
    this.probabilityDoneCheck = false;
    this.downloadURL = '';
    (this.url = ''), (this.countries = countries.countries);
    this.welcome = {uri: 'welcome'};
    global.globalGender = '';
    this.photoRes = 7 / 6;
    this.inSearchDone = false;
    this.emptyWidthAnimation = new Animated.Value(global.width * (1.5 / 10));
    this.widthAnimation = new Animated.Value(global.width * (5 / 10));
    this.heightAnimation = new Animated.Value(
      global.width * (5 / 10) * (7 / 6),
    );
    this.spinValue = new Animated.Value(0);
    this.spinValueY = new Animated.Value(0);
    this.spinValueZ = new Animated.Value(0);
    var test = 'xxx';
    isFav = false;
    isBlock = false;
  }

  async componentDidMount() {
    //this.logoAnimation() not working properly on ios transform: [ {rotateY: spinY}, {rotateX: spinZ}]
    this.initializeVars();
    interstitial.onAdEvent((type) => {
      if (type === AdEventType.ERROR) {
        console.log('error geldi tekrar load et');
        interstitial.load();
      }
      if (type === AdEventType.LOADED) {
        console.log('ad loaded');
      }
      if (type === AdEventType.CLOSED) {
        interstitial.load();
      }
    });
    interstitial.load();

    //console.log("rwar:", lang.SignUp)
    favShowThisDialog = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'favShowThisDialog',
    );
    blockShowThisDialog = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'blockShowThisDialog',
    );
    global.fromMessages = false;
    var localMessages = [];
    var arr = [];
    //this.addToFavoriteUsers("k209WPn6gmfHP3f2PphxyXeb84p1")
    await this.getBlockedUsers();
    await this.getFavoriteUsers();
    //this.addToFavoriteUsers("k209WPn6gmfHP3f2PphxyXeb84p1")
    //this.addToFavoriteUsers("rfd2z5DtyCgkdliwRa7Uv6aQQ5i1")
    //this.addToFavoriteUsers("JtfxB5eiDvSzOM4dbhgGeU7PXVC2")
    //this.addToBlockedUsers("rfd2z5DtyCgkdliwRa7Uv6aQQ5i1")
    //this.addToBlockedUsers("JtfxB5eiDvSzOM4dbhgGeU7PXVC2")
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log('distanceArray: ', distanceArray);
      this.setState({reRender: 'ok'});
      global.fromChat = false;
      if (global.isFavListUpdated) {
        console.log('componentdidmount - fav list updated');
        await this.getFavoriteUsers();
        global.isFavListUpdated = false;
        if (emailArray.length != 0) {
          let favArray = this.state.isFavArray;
          for (let i = 0; i < favArray.length; i++) {
            favArray[i] = false;
            if (favoriteUsersSet.has(emailArray[i])) {
              favArray[i] = true;
            }
          }
          this.setState({isFavArray: favArray});
        }
      }
      if (global.isBlockListUpdated) {
        console.log('componentdidmount - block list updated');
        await this.getBlockedUsers();
        global.isBlockListUpdated = false;
        if (emailArray.length != 0) {
          let blockArray = this.state.isBlockArray;
          for (let i = 0; i < blockArray.length; i++) {
            blockArray[i] = false;
            if (blockedUsersSet.has(emailArray[i])) {
              blockArray[i] = true;
            }
          }
          this.setState({isBlockArray: blockArray});
        }
      }
      if (global.fromHistorySearch) {
        console.log('componentdidmount - from history search');
        await this.setSearchPhotoFromHistory(global.historyPhotoUri);
      }
      if (
        this.state.uri2_username != '' &&
        this.state.uri2_username != null &&
        this.state.uri2_username != undefined
      ) {
        this.checkUri2FavOrBlocked();
      }
    });
    // WHOLE ONESIGNAL THINGS
    /*OneSignal.setLogLevel(6, 0);
    OneSignal.init('7af3b2d1-d4fe-418d-a096-4f57f2c384c8', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.getPermissionSubscriptionState((status) => {
      console.log(status);
      global.playerId = status.userId;
      console.log(global.playerId);
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', await this.onIds);*/
    // this.checkIfAlreadySearching()
    this.welcome = {uri: 'twinizermain'};
  }

  static navigationOptions = {
    header: null,
  };

  updateState = () => {
    console.log('LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG');
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    //const {navigate} = this.props.navigation;
    //navigate("Messages")
  }
  logoAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.spinValueY, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.spinValueZ, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.spinValueY, {
          toValue: 0,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(this.spinValueZ, {
          toValue: 0,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }
  async onIds(device) {
    // Check playerId from local and change if it is changed
    playerId = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'playerId',
    );
    var lang = language[global.lang];
    global.playerId = device['userId'];
    console.log('playerId from storage: ', playerId);
    console.log('playerId from onesignal', global.playerId);
    if (playerId != global.playerId) {
      var randO = Math.random();
      database()
        .ref('/Users/' + auth().currentUser.uid + '/i')
        .update({
          o: randO,
        })
        .catch((error) => {
          var lang = language[global.lang];
          console.log('HATA2');
          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
        });
      database()
        .ref('/PlayerIds/')
        .update({
          [auth().currentUser.uid]: global.playerId,
        })
        .catch((error) => {
          console.log('HATA3');
          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
        });
      EncryptedStorage.setItem(
        auth().currentUser.uid + 'playerId',
        global.playerId,
      );
    }
    console.log('Device info: ', device);
  }

  async checkIfAlreadySearching() {
    var listener23 = database().ref(
      'Users/' + auth().currentUser.uid + '/s/sb',
    );
    await listener23.once('value').then(async (snapshot) => {
      if (snapshot.val() == 't') {
        this.checkFunction();
        this.setState({searchOnIsVisible: true});
      }
    });
  }

  initializeVars() {
    console.log('main initializeVars');
    distanceArray = [];
    usernameArray = [];
    emailArray = [];
    genderArray = [];
    countryArray = [];
    photoArray = {};
    mainDistanceArray = [];
    mainUsernameArray = [];
    mainEmailArray = [];
    mainGenderArray = [];
    mainCountryArray = [];
    mainPhotoArray = {};
    dict = {};
    bioDict = {};
    usersDict = {};
    hepsi = true;
    flagIs20 = false;
    currentUserGender;
    currentUserCountry;
    playerId;
    currentUserUsername;
    currentUserBio;
    resultCounter;
    funcnumval = 0;
    isFav = false;
    isBlock = false;
    addingToWhichList = '';
    listToAdd = '';
    favoriteUsers = [];
    blockedUsers = [];
    favoriteUsersSet = new Set();
    blockedUsersSet = new Set();
    favShowThisDialog = 'true';
    blockShowThisDialog = 'true';
  }

  checkUri2FavOrBlocked() {
    if (
      favoriteUsers != null &&
      favoriteUsers.length != 0 &&
      favoriteUsersSet.has(emailArray[this.state.currentCarouselIndex])
    ) {
      isFav = true;
      isBlock = false;
    } else {
      isFav = false;
      if (
        blockedUsers != null &&
        blockedUsers.length != 0 &&
        blockedUsersSet.has(emailArray[this.state.currentCarouselIndex])
      ) {
        isBlock = true;
      } else {
        isBlock = false;
      }
    }
    this.setState({reRender: 'okeyyy'});
  }
  async getFavoriteUsers() {
    await EncryptedStorage.getItem(auth().currentUser.uid + 'favoriteUsers')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return [];
        }
      })
      .then((json) => {
        console.log('FAVORITE USERS: ', json);
        favoriteUsers = json;
        favoriteUsersSet = new Set(favoriteUsers);
      });
  }
  async getBlockedUsers() {
    await EncryptedStorage.getItem(auth().currentUser.uid + 'blockedUsers')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return [];
        }
      })
      .then((json) => {
        console.log('BLOCKED USERS: ', json);
        blockedUsers = json;
        blockedUsersSet = new Set(blockedUsers);
      });
  }

  spinAnimation() {
    console.log('SPIN ANIMATION');
    this.spinValue = new Animated.Value(0);
    // First set up animation
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }
  async setSearchPhotoFromHistory(uri) {
    this.setState({
      photoPath: uri,
      photo: {uri: uri},
      borderOpacity: 0,
      opacity: 0,
      isVisible1: false,
      disabled: false,
      btnOpacity: 1,
    });
    console.log('URI: ', uri);
    global.fromHistorySearch = false;
  }

  async sendFirstMessage(index) {
    if (this.state.currentCarouselIndex != index) {
      return;
    }
    //global.receiverMail = emailArray[this.state.currentCarouselIndex]
    //global.receiverGender = genderArray[this.state.currentCarouselIndex]
    //global.receiverCountry = countryArray[this.state.currentCarouselIndex]
    //global.receiverUsername = usernameArray[this.state.currentCarouselIndex]
    console.log('sendfirst start');
    global.msgFromMain = true;
    global.enteredChatFromMain = true;
    global.receiverUid = 'p9UY4QQtEnRTWBYDfgG4pyHiyZg2';
    global.receiverMail = 'cemil.sisman@ug.bilkent.edu.tr';
    global.receiverGender = 'Male';
    global.receiverCountry = 'Australia';
    global.receiverUsername = 'cemil ug';
    global.fromChatOfUid = global.receiverUid;
    if (
      global.newMsgListenerArray != undefined &&
      global.newMsgListenerArray != null
    ) {
      for (let i = 0; i < global.newMsgListenerArray.length; i++) {
        if (global.receiverUid == global.newMsgListenerArray[i].uid) {
          global.newMsgListenerArray[i].isOpen = false;
        }
      }
    }
    //global.firstMessage = true
    //global.playerIdArray[global.receiverUid] = await EncryptedStorage.getItem(global.receiverUid + "playerId")
    console.log('global.playerIdArray: ', global.playerIdArray);
    //var tempo = await EncryptedStorage.getItem(global.receiverUid + "o")
    //var realtimeo = 0;
    console.log('sendfirst before database once');
    console.log('sendfirst before if');
    if (!global.playerIdArray[global.receiverUid]) {
      database()
        .ref('/PlayerIds/' + global.receiverUid)
        .on('child_changed', (snap) => {
          console.log('PLAYER ID READ EDIYO');
          global.playerIdArray[global.receiverUid] = snap.val();
        });
    }
    console.log('sendfirst end');
    this.props.navigation.navigate('Chat');
  }

  favButton(fromWhere, index) {
    if (this.state.currentCarouselIndex != index) {
      console.log('favButton - is not currentCarouselIndex');
      return;
    }
    console.log('favButton - fav buttona basıldı indexi:', index);
    console.log(
      'favButton - fav buttona basıldı currentCarouselIndex:',
      this.state.currentCarouselIndex,
    );
    if (favoriteUsersSet.has(emailArray[this.state.currentCarouselIndex])) {
      console.log('favButton - is already fav');
      this.removeFromFav(emailArray[this.state.currentCarouselIndex]);
    } else {
      console.log('favButton - is not fav');
      if (blockedUsersSet.has(emailArray[this.state.currentCarouselIndex])) {
        console.log('favButton - removing from block');
        this.removeFromBlock(emailArray[this.state.currentCarouselIndex]);
      }
      this.addToFav(emailArray[this.state.currentCarouselIndex]);
    }
  }
  blockButton(fromWhere, index) {
    if (this.state.currentCarouselIndex != index) {
      console.log('blockButton - is not currentCarouselIndex');
      return;
    }
    console.log('blockButton - block buttona basıldı indexi:', index);
    console.log(
      'blockButton - block buttona basıldı currentCarouselIndex:',
      this.state.currentCarouselIndex,
    );
    if (blockedUsersSet.has(emailArray[this.state.currentCarouselIndex])) {
      console.log('blockButton - is already block');
      this.removeFromBlock(emailArray[this.state.currentCarouselIndex]);
    } else {
      console.log('blockButton - is not blocked');
      if (favoriteUsersSet.has(emailArray[this.state.currentCarouselIndex])) {
        console.log('blockButton - removing from fav');
        this.removeFromFav(emailArray[this.state.currentCarouselIndex]);
      }
      this.addToBlock(emailArray[this.state.currentCarouselIndex]);
    }
  }
  addToFav(uid) {
    favoriteUsers.push(uid);
    favoriteUsersSet.add(uid);
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'favoriteUsers',
      JSON.stringify(favoriteUsers),
    );
    let favArray = this.state.isFavArray;
    favArray[this.state.currentCarouselIndex] = true;
    this.setState({isFavArray: favArray});
  }
  addToBlock(uid) {
    blockedUsers.push(uid);
    blockedUsersSet.add(uid);
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'blockedUsers',
      JSON.stringify(blockedUsers),
    );
    let blockArray = this.state.isBlockArray;
    blockArray[this.state.currentCarouselIndex] = true;
    this.setState({isBlockArray: blockArray});
  }
  removeFromFav(uid) {
    var favUsersindex = favoriteUsers.indexOf(uid);
    favoriteUsers.splice(favUsersindex, 1);
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'favoriteUsers',
      JSON.stringify(favoriteUsers),
    );
    favoriteUsersSet.delete(uid);
    let favArray = this.state.isFavArray;
    favArray[this.state.currentCarouselIndex] = false;
    this.setState({
      isFavArray: favArray,
      addToFavVisible: false,
      addToFavVisibleUpper: false,
    });
  }
  removeFromBlock(uid) {
    var blockedUsersindex = blockedUsers.indexOf(uid);
    blockedUsers.splice(blockedUsersindex, 1);
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'blockedUsers',
      JSON.stringify(blockedUsers),
    );
    blockedUsersSet.delete(uid);
    let blockArray = this.state.isBlockArray;
    blockArray[this.state.currentCarouselIndex] = false;
    this.setState({
      isBlockArray: blockArray,
      addToFavVisible: false,
      addToFavVisibleUpper: false,
    });
  }

  valueChangeCountry(value) {
    this.setState({country: value, placeHolder1: value});
    if (this.state.gender != null && value != null) {
      this.setState({disabledSearch: false, filterButtonOpacity: 1});
    }
  }
  valueChangeGender(value) {
    this.setState({placeHolder2: value});
    if (value == 'Erkek') {
      value = 'Male';
      this.setState({gender: 'Male'});
    }
    if (value == 'Kadın') {
      value = 'Female';
      this.setState({gender: 'Female'});
    }
    if (value == 'Tüm Cinsiyetler') {
      value = 'All Genders';
      this.setState({gender: 'All Genders'});
    }
    this.setState({gender: value});
    if (this.state.country != null && value != null) {
      this.setState({disabledSearch: false, filterButtonOpacity: 1});
    }
  }

  async createEmailDistanceArrays(gender, country, fn) {
    console.log('fn: ', fn);
    var lang = language[global.lang];
    if (fn == 'searchDone') {
      console.log('searchDone');
      try {
        bioDict_ref = firestore()
          .collection(auth().currentUser.uid)
          .doc('Bios');
        bioDict_ref.get().then((doc) => {
          if (doc.exists) {
            bioDict = doc.data();
          }
        });
        usersDict_ref = firestore()
          .collection(auth().currentUser.uid)
          .doc('Users');
        await usersDict_ref.get().then((doc) => {
          if (doc.exists) {
            usersDict = doc.data();
          }
        });
        var items = Object.keys(dict).map(function (key) {
          return [key, dict[key]];
        });
        // Sort the array based on the second element
        items.sort(function (first, second) {
          return first[1] - second[1];
        });
        var length = Object.keys(dict).length;
        console.log(length);
        var itemsIndex = 0;
        var ccc = 0;
        var favArray = [];
        var blockArray = [];
        for (let i = 0; i < length; i++) {
          if (
            blockedUsers == null ||
            blockedUsers.length == 0 ||
            blockedUsersSet.has(items[i][0]) == false
          ) {
            if (ccc % 6 == 0 && ccc != 0) {
              emailArray.push('ground');
              countryArray.push('');
              genderArray.push('ground');
              usernameArray.push(lang.Advertisement);
              distanceArray.push('ground');
              itemsIndex++;
              favArray.push(false);
              blockArray.push(false);
            } else {
              countryArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[1],
              );
              genderArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[0],
              );
              emailArray.push(items[i - itemsIndex][0]);
              usernameArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[2],
              );
              distanceArray.push(items[i - itemsIndex][1]);
              mainCountryArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[1],
              );
              mainGenderArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[0],
              );
              mainEmailArray.push(items[i - itemsIndex][0]);
              mainUsernameArray.push(
                usersDict[items[i - itemsIndex][0]].split('_')[2],
              );
              mainDistanceArray.push(items[i - itemsIndex][1]);

              favArray.push(favoriteUsersSet.has(emailArray[i]));
              blockArray.push(blockedUsersSet.has(emailArray[i]));
            }
            ccc++;
          }
        }
        this.setState({isFavArray: favArray, isBlockArray: blockArray});
        //console.log('IS FAV ARRAY:', this.state.isFavArray);
        //console.log(items);
        //console.log(emailArray);
        //console.log(distanceArray);
        //console.log(distanceArray);
      } catch (error) {
        var lang = language[global.lang];
        //console.log(error);
        //console.log('HATA4');
        Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
      }
    } else if (fn == 'filterDone with all') {
      console.log('filterDone with all');
      var itemsIndex = 0;
      var ccc = 0;
      for (let i = 0; i < mainEmailArray.length; i++) {
        if (
          blockedUsers == null ||
          blockedUsers.length == 0 ||
          blockedUsersSet.has(mainEmailArray[i]) == false
        ) {
          if (ccc % 6 == 0 && ccc != 0) {
            emailArray.push('ground');
            countryArray.push('');
            genderArray.push('ground');
            usernameArray.push(lang.Advertisement);
            distanceArray.push('ground');
            itemsIndex++;
          } else {
            emailArray.push(mainEmailArray[i - itemsIndex]);
            usernameArray.push(mainUsernameArray[i - itemsIndex]);
            countryArray.push(mainCountryArray[i - itemsIndex]);
            genderArray.push(mainGenderArray[i - itemsIndex]);
            distanceArray.push(mainDistanceArray[i - itemsIndex]);
            if (mainEmailArray[i - itemsIndex] in mainPhotoArray) {
              console.log(
                'mainEmailArray[i-itemsIndex] in mainPhotoArray: ',
                mainEmailArray[i - itemsIndex] in mainPhotoArray,
                mainEmailArray[i - itemsIndex],
              );
              photoArray[mainEmailArray[i - itemsIndex]] =
                mainPhotoArray[mainEmailArray[i - itemsIndex]];
            }
          }
          ccc++;
        }
      }
    } else if (fn == 'filterDone with all genders') {
      console.log('filterDone with all genders');
      var itemsIndex = 0;
      var ccc = 0;
      for (let i = 0; i < mainEmailArray.length; i++) {
        if (mainCountryArray[i] == country) {
          if (
            blockedUsers == null ||
            blockedUsers.length == 0 ||
            blockedUsersSet.has(mainEmailArray[i]) == false
          ) {
            if (ccc % 6 == 0 && ccc != 0) {
              emailArray.push('ground');
              countryArray.push('');
              genderArray.push('ground');
              usernameArray.push(lang.Advertisement);
              distanceArray.push('ground');
              itemsIndex++;
            } else {
              emailArray.push(mainEmailArray[i - itemsIndex]);
              usernameArray.push(mainUsernameArray[i - itemsIndex]);
              countryArray.push(mainCountryArray[i - itemsIndex]);
              genderArray.push(mainGenderArray[i - itemsIndex]);
              distanceArray.push(mainDistanceArray[i - itemsIndex]);
              if (mainEmailArray[i - itemsIndex] in mainPhotoArray) {
                console.log(
                  'mainEmailArray[i-itemsIndex] in mainPhotoArray: ',
                  mainEmailArray[i - itemsIndex] in mainPhotoArray,
                  mainEmailArray[i - itemsIndex],
                );
                photoArray[mainEmailArray[i - itemsIndex]] =
                  mainPhotoArray[mainEmailArray[i - itemsIndex]];
              }
            }
            ccc++;
          }
        }
      }
    } else if (fn == 'filterDone with all countries') {
      console.log('filterDone with all countries');
      var itemsIndex = 0;
      var ccc = 0;
      for (let i = 0; i < mainEmailArray.length; i++) {
        if (mainGenderArray[i] == gender) {
          if (
            blockedUsers == null ||
            blockedUsers.length == 0 ||
            blockedUsersSet.has(mainEmailArray[i]) == false
          ) {
            if (ccc % 6 == 0 && ccc != 0) {
              emailArray.push('ground');
              countryArray.push('');
              genderArray.push('ground');
              usernameArray.push(lang.Advertisement);
              distanceArray.push('ground');
              itemsIndex++;
            } else {
              emailArray.push(mainEmailArray[i - itemsIndex]);
              usernameArray.push(mainUsernameArray[i - itemsIndex]);
              countryArray.push(mainCountryArray[i - itemsIndex]);
              genderArray.push(mainGenderArray[i - itemsIndex]);
              distanceArray.push(mainDistanceArray[i - itemsIndex]);
              if (mainEmailArray[i - itemsIndex] in mainPhotoArray) {
                console.log(
                  'mainEmailArray[i-itemsIndex] in mainPhotoArray: ',
                  mainEmailArray[i - itemsIndex] in mainPhotoArray,
                  mainEmailArray[i - itemsIndex],
                );
                photoArray[mainEmailArray[i - itemsIndex]] =
                  mainPhotoArray[mainEmailArray[i - itemsIndex]];
                console.log(
                  'photoArray.length for = ',
                  i,
                  Object.keys(photoArray).length,
                );
              }
            }
            ccc++;
          }
        }
      }
    } else if (fn == 'filterDone') {
      console.log('filterDone');
      var itemsIndex = 0;
      var ccc = 0;
      for (let i = 0; i < mainEmailArray.length; i++) {
        if (mainCountryArray[i] == country && mainGenderArray[i] == gender) {
          if (
            blockedUsers == null ||
            blockedUsers.length == 0 ||
            blockedUsersSet.has(mainEmailArray[i]) == false
          ) {
            if (ccc % 6 == 0 && ccc != 0) {
              emailArray.push('ground');
              countryArray.push('');
              genderArray.push('ground');
              usernameArray.push(lang.Advertisement);
              distanceArray.push('ground');
              itemsIndex++;
            } else {
              emailArray.push(mainEmailArray[i - itemsIndex]);
              usernameArray.push(mainUsernameArray[i - itemsIndex]);
              countryArray.push(mainCountryArray[i - itemsIndex]);
              genderArray.push(mainGenderArray[i - itemsIndex]);
              distanceArray.push(mainDistanceArray[i - itemsIndex]);
              if (mainEmailArray[i - itemsIndex] in mainPhotoArray) {
                console.log(
                  'mainEmailArray[i-itemsIndex] in mainPhotoArray: ',
                  mainEmailArray[i - itemsIndex] in mainPhotoArray,
                  mainEmailArray[i - itemsIndex],
                );
                photoArray[mainEmailArray[i - itemsIndex]] =
                  mainPhotoArray[mainEmailArray[i - itemsIndex]];
              }
            }
            ccc++;
          }
        }
      }
    }
    global.emailArrayLength = emailArray.length - 1;
  }

  downloadImages(imageIndex) {
    if (!photoArray['ground']) {
      photoArray['ground'] = 'ground';
    }
    console.log('image index:', imageIndex);
    if (
      !photoArray[emailArray[imageIndex]] &&
      emailArray[imageIndex] != 'ground' &&
      (imageIndex % 6 != 0 || imageIndex % 6 == 0)
    ) {
      console.log('qqq:', emailArray[imageIndex]);
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
        path: dirs.DocumentDir + '/results/' + emailArray[imageIndex] + '.jpg',
      })
        .fetch('GET', this.downloadURL, {
          //some headers ..
        })
        .then((res) => {
          console.log('The file saved to ', res.path());
          photoArray[emailArray[imageIndex]] = 'file://' + res.path();
          console.log('photoArray.length: ', Object.keys(photoArray).length);
          if (this.inSearchDone) {
            mainPhotoArray[emailArray[imageIndex]] = 'file://' + res.path();
          }
          this.setState({imagePath: 'file://' + res.path()});
          //console.log("photoArray: ", photoArray)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  async getImageURL(imageIndex) {
    if (
      emailArray[imageIndex] != 'ground' &&
      (imageIndex % 6 != 0 || imageIndex % 6 == 0)
    ) {
      var storageRef = storage().ref(
        'Photos/' + emailArray[imageIndex] + '/1.jpg',
      );
      await storageRef
        .getDownloadURL()
        .then((data) => {
          this.downloadURL = data;
          //photoArray.push(data)
          //this.downloadImages(imageIndex);
          photoArray[emailArray[imageIndex]] = data;
        })
        .catch(function (error) {
          console.log(error);
          // Handle any errors
        });
    }
  }

  async allFunctionsCompleted() {
    var docRef1 = firestore()
      .collection(auth().currentUser.uid)
      .doc('Similarity');
    docRef1
      .get()
      .then(async (doc) => {
        console.log('allFunctionsCompleted: ', doc.data());
        if (doc.exists) {
          // createEmailDistanceArrays KISMI ////////////////////////////////////////
          var tempdict = doc.data();
          dict = Object.assign({}, tempdict, dict);
          console.log('DICT SONUCU: ', dict);
          await this.createEmailDistanceArrays(
            'All Genders',
            'All Countries',
            'searchDone',
          );
          ////////////////////////////////////////////////////////////////////////////////
          for (let i = 0; i <= emailArray.length; i++) {
            // resim indirme KISMI /////////////////////////////////////////////////
            await this.getImageURL(i);
            //await this.downloadImages(i);
          }
          console.log(
            'biyere geldik, mainPhotoArray.length ',
            Object.keys(mainPhotoArray).length,
          );
          this.createCarouselItemArray();

          this.setState({
            backgroundOpacity: 0,
            swipeableDisabled: false,
            messageButtonDisabled: false,
            messageButtonOpacity: 1,
            sadfaceOpacity: 0,
            showFilter: true,
            loadingAnimation: false,
          });
          if (emailArray.length == 0 || emailArray[0] == null) {
            this.setState({messageButtonOpacity: 0, sadfaceOpacity: 1});
          }
          this.checkUri2FavOrBlocked();
          this.spinValue = new Animated.Value(0);

          console.log(photoArray);
          console.log(emailArray);
          console.log(genderArray);
          console.log(countryArray);
          console.log(distanceArray);
          console.log(bioDict);
        }
      })
      .catch((error) => {
        console.log(error);
        var lang = language[global.lang];
        console.log('HATA1');
        Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
      });
  }

  async checkFunction() {
    var docReffuncdone = firestore()
      .collection(auth().currentUser.uid)
      .doc('Funcdone');
    docReffuncdone.onSnapshot(async (doc) => {
      console.log('CHECK FUNCTION: ', doc.data());
      console.log('doc.exists: ', doc.exists);
      console.log('this.probabilityDoneCheck: ', this.probabilityDoneCheck);
      if (doc.exists) {
        if (this.probabilityDoneCheck) {
          var completedfuncs = parseInt(doc.data()['key']);
          var isFace = doc.data()['isface'].split('_')[0];
          console.log('isFace: ', isFace);
          if (isFace == 'T') {
            console.log('completedfuncs: ', completedfuncs);
            console.log('global.functionNumber: ', global.functionNumber);
            console.log('funcnumval: ', funcnumval);
            if (completedfuncs == funcnumval + global.functionNumber) {
              await this.allFunctionsCompleted();
              funcnumval = completedfuncs;
            }
          } else {
            this.setState({
              loadingAnimation: false,
            });
            var lang = language[global.lang];
            this.spinValue = new Animated.Value(0);

            Alert.alert(lang.Error, lang.MainNoFace);
          }
        } else {
          console.log('funcnumval - doc.data[key]: ', doc.data()['key']);
          funcnumval = doc.data()['key'];
        }
      } else {
        funcnumval = 0;
      }
      this.probabilityDoneCheck = true;
    });
  }

  async filterDone() {
    var emptyArr = [];
    this.animation.play();
    this.setState({
      loadingAnimation: true,
      currentCarouselIndex: 0,

      carouselArray: emptyArr,
    });
    if (this._carousel != undefined) {
      this._carousel.snapToItem(0, false, false);
    }

    this.spinAnimation();
    this.inSearchDone = false;
    isFav = false;
    isBlock = false;
    emailArray = [];
    usernameArray = [];
    countryArray = [];
    genderArray = [];
    distanceArray = [];
    this.downloadURL = '';
    this.url = '';
    this.complete = false;
    this.setState({
      messageButtonDisabled: true,
      messageButtonOpacity: 0,
      sadfaceOpacity: 0,
      backgroundOpacity: 0.2,
      isVisible2: false,
      imagePath: null,
      swipeableDisabled: true,
    });
    console.log(
      'photoArray.length filterdone = ',
      Object.keys(photoArray).length,
    );
    if (
      this.state.gender == 'All Genders' &&
      this.state.country == 'All Countries'
    ) {
      await this.createEmailDistanceArrays(
        this.state.gender,
        this.state.country,
        'filterDone with all',
      );
    }
    if (
      this.state.gender != 'All Genders' &&
      this.state.country == 'All Countries'
    ) {
      await this.createEmailDistanceArrays(
        this.state.gender,
        this.state.country,
        'filterDone with all countries',
      );
    }
    if (
      this.state.gender == 'All Genders' &&
      this.state.country != 'All Countries'
    ) {
      await this.createEmailDistanceArrays(
        this.state.gender,
        this.state.country,
        'filterDone with all genders',
      );
    }
    if (
      this.state.gender != 'All Genders' &&
      this.state.country != 'All Countries'
    ) {
      await this.createEmailDistanceArrays(
        this.state.gender,
        this.state.country,
        'filterDone',
      );
    }
    console.log(
      'photoArray.length filterdone end = ',
      Object.keys(photoArray).length,
    );
    if (emailArray.length == 0 || emailArray[0] == null) {
      this.setState({
        backgroundOpacity: 0,
        swipeableDisabled: true,
        messageButtonDisabled: false,
        messageButtonOpacity: 0,
        sadfaceOpacity: 1,
      });
    } else {
      this.setState({
        backgroundOpacity: 0,
        swipeableDisabled: false,
        messageButtonDisabled: false,
        messageButtonOpacity: 1,
        sadfaceOpacity: 0,
      });
    }
    this.checkUri2FavOrBlocked();
    console.log(this.state.uri2_bio);
    console.log(this.state.uri2);
    this.createCarouselItemArray();

    this.setState({loadingAnimation: false});
  }

  async searchDone(value) {
    var emptyArr = [];
    isFav = false;
    isBlock = false;
    this.animation.play();

    this.setState({
      currentCarouselIndex: 0,

      carouselArray: emptyArr,
      filterButtonOpacity: 0.4,
      disabledSearch: true,
      gender: null,
      country: null,
      disabled: true,
      notifIsVisible: true,
      showFilter: false,
      loadingAnimation: true,
      backgroundOpacity: 0.2,
      messageButtonDisabled: true,
      messageButtonOpacity: 0,
      sadfaceOpacity: 0,
      isVisible2: false,
      imagePath: null,
      swipeableDisabled: true,
    });

    if (this._carousel != undefined) {
      this._carousel.snapToItem(0, false, false);
    }
    this.spinAnimation();
    this.inSearchDone = true;
    //photoArray.splice(0, photoArray.length)
    emailArray.splice(0, emailArray.length);
    usernameArray.splice(0, usernameArray.length);
    countryArray.splice(0, countryArray.length);
    genderArray.splice(0, genderArray.length);
    distanceArray.splice(0, distanceArray.length);
    mainDistanceArray.splice(0, mainDistanceArray.length);
    mainUsernameArray.splice(0, mainUsernameArray.length);
    mainEmailArray.splice(0, mainEmailArray.length);
    mainGenderArray.splice(0, mainGenderArray.length);
    mainCountryArray.splice(0, mainCountryArray.length);
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
    let dirs = RNFetchBlob.fs.dirs;
    await RNFS.unlink(dirs.DocumentDir + '/results') // photoArray[imageIndex]
      .then(() => {
        console.log('FILE DELETED');
      })
      .catch((err) => {
        console.log('unlink olmadi');
      });
    console.log('EMAIL ARRAY LENGTH ', emailArray.length);
    this.downloadURL = '';
    this.url = '';
    this.complete = false;
    this.releasedAfterRightD2 = false;
    this.releasedAfterLeftD2 = false;
    this.rightActionCount = 0;
    this.leftActionCount = 0;
    this.deactivate = null;
    global.deactivateLeft = null;
    global.deactivateRight = null;
    global.deactivationRightDistance = global.width * (2.5 / 10);
    global.deactivationLeftDistance = global.width * (2.5 / 10);
    await this.saveSearchPhotoLocally(this.state.photoPath);
    await this.uploadSearchPhoto(this.state.photoPath);
  }

  async getLastSearchNo() {
    var lastSearch;
    lastSearch = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'lastSearch',
    );
    if (lastSearch == null) {
      lastSearch = '0';
    }
    lastSearch = parseInt(lastSearch);
    return lastSearch;
  }
  async getNoOfSearch() {
    var noOfSearch;
    noOfSearch = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'noOfSearch',
    );
    if (noOfSearch == null) {
      noOfSearch = '0';
    }
    noOfSearch = parseInt(noOfSearch);
    return noOfSearch;
  }
  async increaseNoOfSearch() {
    var noOfSearch;
    noOfSearch = await this.getNoOfSearch();
    if (noOfSearch == 20) {
      flagIs20 = true;
    }
    if (noOfSearch < 20) {
      noOfSearch = noOfSearch + 1;
      flagIs20 = false;
      await EncryptedStorage.setItem(
        auth().currentUser.uid + 'noOfSearch',
        noOfSearch.toString(),
      );
    }
    return noOfSearch;
  }
  async increaseLastSearchNo() {
    var lastSearch;
    lastSearch = await this.getLastSearchNo();
    lastSearch = lastSearch + 1;
    await EncryptedStorage.setItem(
      auth().currentUser.uid + 'lastSearch',
      lastSearch.toString(),
    );
    return lastSearch;
  }

  async getHistoryImageArray() {
    var historyArray = [];
    await EncryptedStorage.getItem(auth().currentUser.uid + 'historyArray')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => {
        historyArray = json;
        if (historyArray == null) {
          historyArray = [];
        }
      });
    return historyArray;
  }

  async arrangeSearchImageArray(lastSearch, noOfSearch) {
    var historyArray = [];
    historyArray = await this.getHistoryImageArray();
    if (noOfSearch == 20 && flagIs20) {
      historyArray.shift();
    }
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var date = day + '.' + month + '.' + year;
    historyArray[noOfSearch - 1] = {lastSearch: lastSearch, searchDate: date};
    console.log('GET HISTORY ARRAY2: ', historyArray);
    await EncryptedStorage.setItem(
      auth().currentUser.uid + 'historyArray',
      JSON.stringify(historyArray),
    );
  }

  async saveSearchPhotoLocally(photoPath) {
    var lastSearchNo = await this.increaseLastSearchNo();
    console.log('LAST SEARCH NO2: ', lastSearchNo);
    var noOfSearch = await this.increaseNoOfSearch();
    console.log('NO OF SEARCH2: ', noOfSearch);
    this.arrangeSearchImageArray(lastSearchNo, noOfSearch);
    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/search-photos');
    await RNFS.copyFile(
      photoPath,
      RNFS.DocumentDirectoryPath +
        '/search-photos/' +
        lastSearchNo.toString() +
        '.jpg',
    );
  }
  uploadSearchPhoto = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var storageRef = storage().ref();
    var metadata = {
      contentType: 'image/jpeg',
    };
    var ref1 = storageRef.child(
      'Photos/' +
        auth().currentUser.uid +
        '/SearchPhotos/' +
        'search-photo.jpg',
    );
    console.log('storageref child alındı');
    ref1
      .put(blob)
      .then((snapshot) => {
        console.log('global.functionNumber ', global.functionNumber);
        var lang = language[global.lang];
        if (global.functionNumber != -1) {
          const updateRef = firestore().collection('Functions').doc('Embedder');
          var batch = 1;
          var randFloat = Math.random();
          console.log(auth().currentUser.uid);
          const simRef = firestore()
            .collection(auth().currentUser.uid)
            .doc('Similarity');
          const bioRef = firestore()
            .collection(auth().currentUser.uid)
            .doc('Bios');
          const infoRef = firestore()
            .collection(auth().currentUser.uid)
            .doc('Users');
          simRef
            .set({})
            .then(() => {
              console.log('Similarity updated');
              bioRef
                .set({})
                .then(() => {
                  console.log('Bios updated');
                  infoRef
                    .set({})
                    .then(() => {
                      console.log('Users updated');
                      updateRef
                        .set({
                          name:
                            auth().currentUser.uid +
                            '_' +
                            batch.toString() +
                            '_' +
                            randFloat.toString() +
                            '_' +
                            global.functionNumber.toString(),
                        })
                        .then(() => {
                          console.log('Embedder updated');
                          this.setState({
                            messageButtonDisabled: true,
                            backgroundOpacity: 0.2,
                            messageButtonOpacity: 0,
                            sadfaceOpacity: 0,
                            isVisible2: false,
                            imagePath: null,
                            swipeableDisabled: true,
                          });
                          if (this.probabilityDoneCheck == false) {
                            this.checkFunction();
                          }
                        })
                        .catch((error) => {
                          console.log('buraya mı geldi');

                          this.setState({loadingAnimation: false});
                          console.log('buraya mı geldi evet');
                          this.spinValue = new Animated.Value(0);
                          console.log('User2 update olmadı');
                          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
                    });
                })
                .catch((error) => {
                  console.log(error);
                  Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
                });
            })
            .catch((error) => {
              console.log(error);
              Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
            });
        } else {
          const num_ref = firestore().collection('Functions').doc('Number');
          num_ref
            .get()
            .then((doc) => {
              if (doc.exists) {
                global.functionNumber = doc.data()['key'];
                const updateRef = firestore()
                  .collection('Functions')
                  .doc('Embedder');
                var batch = 1;
                var randFloat = Math.random();
                const simRef = firestore()
                  .collection(auth().currentUser.uid)
                  .doc('Similarity');
                const bioRef = firestore()
                  .collection(auth().currentUser.uid)
                  .doc('Bios');
                const infoRef = firestore()
                  .collection(auth().currentUser.uid)
                  .doc('Users');
                simRef
                  .set({})
                  .then(() => {
                    console.log('Similarity updated');
                    bioRef
                      .set({})
                      .then(() => {
                        console.log('Bios updated');
                        infoRef
                          .set({})
                          .then(() => {
                            console.log('Users updated');
                            updateRef
                              .set({
                                name:
                                  auth().currentUser.uid +
                                  '_' +
                                  batch.toString() +
                                  '_' +
                                  randFloat.toString() +
                                  '_' +
                                  global.functionNumber.toString(),
                              })
                              .then(() => {
                                console.log('Embedder updated');
                                this.setState({
                                  messageButtonDisabled: true,
                                  messageButtonOpacity: 0,
                                  sadfaceOpacity: 0,
                                  backgroundOpacity: 0.2,
                                  isVisible2: false,
                                  imagePath: null,
                                  swipeableDisabled: true,
                                });
                                if (this.probabilityDoneCheck == false) {
                                  this.checkFunction();
                                }
                              })
                              .catch((error) => {
                                this.setState({loadingAnimation: false});
                                this.spinValue = new Animated.Value(0);
                                console.log('User2 update olmadı');
                                Alert.alert(
                                  lang.PlsTryAgain,
                                  lang.ConnectionFailed,
                                );
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                            Alert.alert(
                              lang.PlsTryAgain,
                              lang.ConnectionFailed,
                            );
                          });
                      })
                      .catch((error) => {
                        console.log(error),
                          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
                  });
              }
            })
            .catch((error) => {
              this.setState({loadingAnimation: false});
              this.spinValue = new Animated.Value(0);
              console.log('Function number catchi');
              Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
            });
        }
      })
      .catch((error) => {
        this.setState({loadingAnimation: false});
        this.spinValue = new Animated.Value(0);
        console.log('Search fotosu upload olmadı');
        Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
      });
  };
  search = () => {
    this.setState({isVisible2: true});
  };
  library = () => {
    this.setState({
      isVisible1: false,
    });
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true,
    }).then((image) => {
      global.welcomeOpacity = 0;
      var lang = language[global.lang];
      if (image.size > global.imageSizeLimit) {
        Alert.alert(lang.Warning, lang.ImageSizeExceeded);
      } else {
        this.setState({
          photoPath: image.path,
          photo: {uri: image.path},
          borderOpacity: 0,
          opacity: 0,
          isVisible1: false,
          disabled: false,
          btnOpacity: 1,
        });
      }
    });
  };
  camera = () => {
    this.setState({
      isVisible1: false,
    });
    ImagePicker.openCamera({
      width: 600,
      height: 700,
      cropping: true,
    }).then((image) => {
      global.welcomeOpacity = 0;
      var lang = language[global.lang];
      if (image.size > global.imageSizeLimit) {
        Alert.alert(lang.Warning, lang.ImageSizeExceeded);
      } else {
        this.setState({
          photoPath: image.path,
          photo: {uri: image.path},
          borderOpacity: 0,
          opacity: 0,
          disabled: false,
          btnOpacity: 1,
        });
      }
    });
  };

  createCarouselItemArray() {
    var arr = [];
    for (let i = 0; i < emailArray.length; i++) {
      const index = i;
      arr.push(
        <CarouselItem
          index={index}
          username={usernameArray[index]}
          country={countryArray[index]}
          onPressImage={() =>
            this.setState({
              openProfileIsVisible: this.state.currentCarouselIndex == index,
            })
          }
          onPressSendMsg={() => this.sendFirstMessage(index)}
          onPressFav={() => this.favButton('onMain', index)}
          onPressBlock={() => this.blockButton('onMain', index)}
          isFavorite={this.state.isFavArray}
          isBlocked={this.state.isBlockArray}
          image={photoArray[emailArray[index]]}
        />,
      );
    }
    this.setState({carouselArray: arr});
  }

  _renderCarouselItem = ({item, index}) => {
    return this.state.carouselArray[index];
  };
  render() {
    var lang = language[global.lang];

    const {navigate} = this.props.navigation;
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const spinY = this.spinValueY.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const spinZ = this.spinValueZ.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    return (
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(242,242,242,1)',
          backgroundColor: 'red',
        }}>
        <ModifiedStatusBar />

        <CustomHeader
          whichScreen={'Main'}
          onPress={() => this.setState({isVisible2: true})}
          isFilterVisible={this.state.showFilter}
          title={'Twinizer'}></CustomHeader>

        <View
          style={{
            height:
              this.height -
              this.width / 7 -
              headerHeight -
              getStatusBarHeight(),
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: 'green',
          }}>
          {!this.state.loadingAnimation && (
            <Carousel
              onSnapToItem={(slideIndex) => {
                this.setState({currentCarouselIndex: slideIndex});
              }}
              enableSnap={true}
              containerCustomStyle={{
                flexGrow: 0,
              }}
              ref={(c) => {
                this._carousel = c;
              }}
              firstItem={this.state.currentCarouselIndex}
              inactiveSlideOpacity={0.8}
              inactiveSlideScale={0.6}
              data={this.state.carouselArray}
              renderItem={this._renderCarouselItem}
              sliderWidth={this.width}
              itemWidth={this.width / 2}
            />
          )}

          <View
            style={{
              width:
                this.state.loadingAnimation == true ? (this.width * 5) / 10 : 0,
              aspectRatio: 6 / 10,
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 5,
            }}>
            <LottieView
              loop={true}
              style={{flex: 1}}
              ref={(animation) => {
                if (this.animation == null) {
                  this.animation = animation;
                }
              }}
              source={require('./facescan.json')}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: (((this.width * 3) / 10) * 7) / 6,
            }}>
            <ImageUploader
              position={'relative'}
              width={(this.width * 3) / 10}
              borderRadius={16}
              borderOpacity={this.state.borderOpacity}
              onPress={() => this.setState({isVisible1: true})}
              textOpacity={this.state.opacity}
              fontSize={14}
              photo={this.state.photo}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: this.width / 10,
            }}>
            {!this.state.isVisible2 && (
              <FAB
                zIndex={1}
                style={{
                  opacity: this.state.btnOpacity,
                  backgroundColor: global.themeColor,
                  width: this.width / 10,
                  height: this.width / 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                small
                icon={({size, color}) => (
                  <Image
                    source={{uri: 'search'}}
                    style={{width: '55%', height: '55%'}}
                  />
                )}
                animated={false}
                onPress={() => this.searchDone()}
                disabled={this.state.disabled}
              />
            )}
          </View>
        </View>

        <Snackbar
          duration={1500}
          style={{bottom: this.width / 7}}
          visible={this.state.notifIsVisible}
          onDismiss={() => {
            this.setState({notifIsVisible: false, disabled: false}),
              interstitial.show();
          }}>
          {lang.TwinizingProcessInfo}
        </Snackbar>

        <ImageUploadModal
          isVisible={this.state.isVisible1}
          txtUploadPhoto={lang.UploadAPhoto}
          txtCancel={lang.Cancel}
          txtTakePhoto={lang.Camera}
          txtOpenLibrary={lang.Library}
          onPressCancel={() => this.setState({isVisible1: false})}
          onPressCamera={this.camera}
          onPressLibrary={this.library}
        />

        <FilterModal
          isVisible={this.state.isVisible2}
          onBackdropPress={() => this.setState({isVisible2: false})}
          onValueChangeGender={(value) => this.valueChangeGender(value.label)}
          onValueChangeCountry={(value) => this.valueChangeCountry(value.label)}
          genderSelectedValue={
            lang[
              this.state.gender == 'All Genders'
                ? 'AllGenders'
                : this.state.gender + 'Small'
            ]
          }
          countrySelectedValue={this.state.country}
          placeHolder1={this.state.placeHolder1}
          placeHolder2={this.state.placeHolder2}
          onPressSearch={() => this.filterDone()}
          textSearch={lang.Apply}
          opacity={this.state.filterButtonOpacity}
          searchDisabled={this.state.disabledSearch}
          textFilters={lang.Filter}
        />

        <PhotoPopUpModal
          isVisible={this.state.openProfileIsVisible}
          onPressImage={() => {
            this.props.navigation.setOptions({tabBarVisible: false});
            this.setState({imageViewerVisible: true});
          }}
          onBackdropPress={() => this.setState({openProfileIsVisible: false})}
          username={usernameArray[this.state.currentCarouselIndex]}
          bio={bioDict[emailArray[this.state.currentCarouselIndex]]}
          onPressCancel={() => this.setState({openProfileIsVisible: false})}
          imgSource={photoArray[emailArray[this.state.currentCarouselIndex]]}
          isFavorite={this.state.isFavArray[this.state.currentCarouselIndex]}
          isBlocked={this.state.isBlockArray[this.state.currentCarouselIndex]}
          onPressFav={() =>
            this.favButton('onModal', this.state.currentCarouselIndex)
          }
          onPressBlock={() =>
            this.blockButton('onModal', this.state.currentCarouselIndex)
          }
          onPressSendMsg={() =>
            this.sendFirstMessage(this.state.currentCarouselIndex)
          }
          favBcancel={lang.CancelCap}
          favBdialog={lang.DontShowThisDialogAgain}
          favBtickIsVisible={this.state.favTickVisible}
          favBonPressTick={() =>
            this.setState({favTickVisible: this.state.favTickVisible ? 0 : 1})
          }
          favBisVisible={this.state.addToFavVisibleUpper}
          favBimage={'star'}
          favBtxtAlert={
            lang.FavUserInfoPt1 +
            usernameArray[this.state.currentCarouselIndex] +
            lang.FavUserInfoPt2
          }
          favBonPressAdd={() =>
            this.favModalButtonClicked(
              emailArray[this.state.currentCarouselIndex],
            )
          }
          favBonPressClose={() =>
            this.setState({
              favTickVisible: false,
              addToFavVisible: false,
              addToFavVisibleUpper: false,
            })
          }
          blockBcancel={lang.CancelCap}
          blockBdialog={lang.DontShowThisDialogAgain}
          blockBtickIsVisible={this.state.blockTickVisible}
          blockBonPressTick={() =>
            this.setState({
              blockTickVisible: this.state.blockTickVisible ? 0 : 1,
            })
          }
          blockBisVisible={this.state.addToBlockVisibleUpper}
          blockBimage={'block'}
          blockBtxtAlert={
            lang.BlockUserInfoPt1 +
            usernameArray[this.state.currentCarouselIndex] +
            lang.BlockUserInfoPt2
          }
          blockBonPressAdd={() =>
            this.blockModalButtonClicked(
              emailArray[this.state.currentCarouselIndex],
            )
          }
          blockBonPressClose={() =>
            this.setState({
              blockTickVisible: false,
              addToBlockVisible: false,
              addToBlockVisibleUpper: false,
            })
          }></PhotoPopUpModal>

        <FavBlockModal
          cancel={lang.CancelCap}
          dialog={lang.DontShowThisDialogAgain}
          tickIsVisible={this.state.favTickVisible}
          onPressTick={() =>
            this.setState({favTickVisible: this.state.favTickVisible ? 0 : 1})
          }
          isVisible={this.state.addToFavVisible}
          image={'star'}
          txtAlert={
            lang.FavUserInfoPt1 +
            usernameArray[this.state.currentCarouselIndex] +
            lang.FavUserInfoPt2
          }
          onPressAdd={() =>
            this.favModalButtonClicked(
              emailArray[this.state.currentCarouselIndex],
            )
          }
          onPressClose={() =>
            this.setState({
              favTickVisible: false,
              addToFavVisible: false,
              addToFavVisibleUpper: false,
            })
          }
        />

        <FavBlockModal
          cancel={lang.CancelCap}
          dialog={lang.DontShowThisDialogAgain}
          tickIsVisible={this.state.blockTickVisible}
          onPressTick={() =>
            this.setState({
              blockTickVisible: this.state.blockTickVisible ? 0 : 1,
            })
          }
          isVisible={this.state.addToBlockVisible}
          image={'block'}
          txtAlert={
            lang.BlockUserInfoPt1 +
            usernameArray[this.state.currentCarouselIndex] +
            lang.BlockUserInfoPt2
          }
          onPressAdd={() =>
            this.blockModalButtonClicked(
              emailArray[this.state.currentCarouselIndex],
            )
          }
          onPressClose={() =>
            this.setState({
              blockTickVisible: false,
              addToBlockVisible: false,
              addToBlockVisibleUpper: false,
            })
          }
        />

        <ImageViewerModal
          isVisible={this.state.imageViewerVisible}
          images={photoArray[emailArray[this.state.currentCarouselIndex]]}
          whichScreen={'tabs'}
          onCancel={() => {
            this.props.navigation.setOptions({tabBarVisible: true});
            this.setState({imageViewerVisible: false});
          }}
        />
      </SafeAreaView>
    );
  }
}
