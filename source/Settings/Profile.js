import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {Snackbar} from 'react-native-paper';
import {
  NavigationContainer,
  StackActions,
  CommonActions,
  navigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
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
  Button,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';

import DeleteOptionsScreen from './DeleteOptions';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';

import ProfileBioButton from '../Components/Settings/Profile/Bio/ProfileBioButton';
import CustomPicker from '../Components/Common/Pickers/CustomPicker';
import LogoutButton from '../Components/Settings/Common/LogoutButton';
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal';
import ImageViewerModal from '../Components/Common/ImageViewer/ImageViewerModal';
import GoBackInfoModal from '../Components/Common/Info/GoBackInfoModal';
import InfoModal from '../Components/Common/Info/InfoModal';
import AuthenticationModal from '../Components/Settings/DeleteOptions/AuthenticationModal';
import countries from '../Utils/Countries';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var currentUserGender;
var currentUserCountry;
var currentUserUsername;
var currentUserBio;
var currentUserPhotoCount;
var updateImage;
var infoChanged = false;
var keyboardHeight;
var keyboardYcord;
var lang = language[global.lang];
export default class ProfileScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      authenticationVisible: false,
      whichInput: null,
      keyboardOpen: false,
      keyboardOpenAuth: false,
      saveInfoModalVisible: false,
      imageViewerVisible: false,
      goBackInfoModalVisible: false,
      newPhoto: false,
      profilePhoto: '',
      loadingDone: false,
      loadingDonePhoto: false,
      loadingOpacity: 0,
      userUsername: '',
      userGender: '',
      userCountry: '',
      userBio: '',
      userPhotoCount: 0,
      isVisible: false,
      bioOpacity: 1,
      bioLimit: 0,
      saveBtnDisabled: false,
      upperComponentsOpacity: 1,
      upperComponentsDisabled: false,
      test: 'TEST',
      text: 'Aemil Şişmannnnnnnnn',
      selection: {
        start: 0,
        end: 0,
      },
    };
    this.downloadURL = '';
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navBarHeight = this.height - this.windowHeight;
    this.spinValue = new Animated.Value(0);
  }

  async componentDidMount() {
    this.setState({loadingDone: false, loadingDonePhoto: false});
    this.spinAnimation();
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      infoChanged = false;
      this.setState({
        loadingDone: false,
        goBackInfoModalVisible: false,
        loadingDonePhoto: false,
      });
      this.spinAnimation();
      await this.checkIfUserDataExistsInLocalAndSaveIfNot();
      console.log('subscribe');
      this.setState({
        reRender: 'ok',
        profilePhoto: this.state.profilePhoto + '?' + new Date(),
      });
    });
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      infoChanged = false;
      this.setState({
        loadingDone: false,
        goBackInfoModalVisible: false,
        loadingDonePhoto: false,
      });
      this.spinAnimation();
    });
    global.popUp = () => {
      var lang = language[global.lang];
      this.props.navigation.dispatch(StackActions.popToTop());
      Alert.alert('', lang.DeleteAccountSuccess);
    };
    console.log('PROFİL COMP');
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  }

  componentWillUnmount() {
    console.log('PROFİL COMP UN');
    Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
  }
  static navigationOptions = {
    header: null,
  };
  _keyboardDidHide = () => {
    if (this.state.bioOpacity == 1) {
      this.setState({
        keyboardOpenAuth: false,
        upperComponentsOpacity: 1,
        upperComponentsDisabled: false,
        keyboardOpen: false,
      });
    } else {
      this.setState({
        keyboardOpenAuth: false,
        bioOpacity: 1,
        keyboardOpen: false,
      });
    }
  };
  _keyboardDidShow = (e) => {
    const {height, screenX, screenY, width} = e.endCoordinates;
    this.setState({keyboardOpenAuth: true});
    console.log(height);
    console.log('y:', screenY);
    if (this.state.whichInput == 'bio') {
      this.setState({keyboardOpen: true});
      if (this.state.bioOpacity == 1) {
        this.setState({
          upperComponentsOpacity: 0,
          upperComponentsDisabled: true,
        });
      }
    }
  };
  keyboardWillHide() {
    if (this.state.bioOpacity == 1) {
      this.setState({
        keyboardOpenAuth: false,
        upperComponentsOpacity: 1,
        upperComponentsDisabled: false,
        keyboardOpen: false,
      });
    } else {
      this.setState({
        keyboardOpenAuth: false,
        bioOpacity: 1,
        keyboardOpen: false,
      });
    }
  }
  keyboardWillShow() {
    this.setState({
      whichInput: 'bio',
      keyboardOpen: true,
      upperComponentsOpacity: 0,
      upperComponentsDisabled: true,
    });
    if (this.state.whichInput == 'bio') {
      this.setState({keyboardOpen: true});
      if (this.state.bioOpacity == 1) {
        this.setState({
          upperComponentsOpacity: 0,
          upperComponentsDisabled: true,
        });
      }
    }
  }
  spinAnimation() {
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

  checkIfUsernameValid(text) {
    var regex = /^[A-Za-z0-9. ]+$/;
    if (regex.test(text) && text.length >= 3) {
      return true;
    } else {
      return false;
    }
  }
  checkIfBioValid(text) {
    var regex = /^[A-Za-z0-9. ]+$/;
    if (regex.test(text)) {
      return true;
    } else {
      return false;
    }
  }

  async checkIfUserDataExistsInLocalAndSaveIfNot() {
    // from asyncstorage part

    console.log('current user:', auth().currentUser.uid);
    await EncryptedStorage.getItem(auth().currentUser.uid + 'userGender').then(
      (req) => {
        currentUserGender = req;
      },
    );
    await EncryptedStorage.getItem(auth().currentUser.uid + 'userCountry').then(
      (req) => {
        currentUserCountry = req;
      },
    );
    await EncryptedStorage.getItem(auth().currentUser.uid + 'userName').then(
      (req) => {
        currentUserUsername = req;
      },
    );
    await EncryptedStorage.getItem(auth().currentUser.uid + 'userBio').then(
      (req) => {
        currentUserBio = req;
      },
    );
    await EncryptedStorage.getItem(auth().currentUser.uid + 'userPhotoCount')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => {
        currentUserPhotoCount = json;
      });
    console.log('1:', currentUserCountry);
    console.log('2:', currentUserGender);
    console.log('3:', currentUserUsername);
    console.log('4:', currentUserBio);
    console.log('5:', currentUserPhotoCount);

    if (
      currentUserCountry == null ||
      currentUserGender == null ||
      currentUserUsername == null ||
      currentUserBio == null ||
      currentUserPhotoCount == null
    ) {
      console.log('LOCAL USER DATA IS NULL');
      var infoListener = database().ref(
        'Users/' + auth().currentUser.uid + '/i',
      );
      await infoListener
        .once('value')
        .then(async (snapshot) => {
          this.setState({
            loadingDone: true,
            userGender: snapshot.val().g,
            userCountry: snapshot.val().c,
            userUsername: snapshot.val().u,
            userBio: snapshot.val().b,
            bioLimit: snapshot.val().b.length,
            userPhotoCount: snapshot.val().p,
            selection: {
              start: snapshot.val().u.length,
              end: snapshot.val().u.length,
            },
          });
          await this.getImageURL();
          await this.downloadImages();
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userGender',
            this.state.userGender,
          );
          console.log('this.state.userGender: ', this.state.userGender);
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userCountry',
            this.state.userCountry,
          );
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userName',
            this.state.userUsername,
          );
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userBio',
            this.state.userBio,
          );
          await EncryptedStorage.setItem(
            auth().currentUser.uid + 'userPhotoCount',
            JSON.stringify(this.state.userPhotoCount),
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        loadingDonePhoto: true,
        profilePhoto:
          'file://' +
          RNFS.DocumentDirectoryPath +
          '/' +
          auth().currentUser.uid +
          'profile.jpg',
        loadingDone: true,
        userGender: currentUserGender,
        userCountry: currentUserCountry,
        userUsername: currentUserUsername,
        userBio: currentUserBio,
        bioLimit: currentUserBio.length,
        userPhotoCount: currentUserPhotoCount,
        selection: {
          start: currentUserUsername.length,
          end: currentUserUsername.length,
        },
      });
      console.log('LOCAL USER DATA IS NOT NULL:', this.state.profilePhoto);
    }
  }

  async getImageURL() {
    console.log('getImageURL');
    var storageRef = storage().ref(
      'Photos/' + auth().currentUser.uid + '/1.jpg',
    );
    await storageRef
      .getDownloadURL()
      .then((data) => {
        this.downloadURL = data;
        console.log('profil photo: ', data);
      })
      .catch(function (error) {
        // Handle any errors
      });
  }

  async downloadImages() {
    console.log('downloadImages');
    let dirs = RNFetchBlob.fs.dirs;
    console.log(
      dirs.DocumentDir + '/' + auth().currentUser.uid + 'profile.jpg',
    );
    await RNFetchBlob.config({
      fileCache: true,
      appendExt: 'jpg',
      path: dirs.DocumentDir + '/' + auth().currentUser.uid + 'profile.jpg',
    })
      .fetch('GET', this.downloadURL, {
        //some headers ..
      })
      .then((res) => {
        console.log('The file saved to ', res.path());
        this.setState({
          profilePhoto: 'file://' + res.path(),
          loadingDonePhoto: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async onPressSave() {
    var lang = language[global.lang];
    if (this.checkIfUsernameValid(this.state.userUsername)) {
      console.log('BİO:', this.state.userBio);
      if (this.checkIfBioValid(this.state.userBio)) {
        this.setState({saveBtnDisabled: true});
        try {
          if (this.state.newPhoto) {
            var uploadDone = false;
            var storageRef = storage().ref();
            var metadata = {
              contentType: 'image/jpeg',
            };
            const response = await fetch(this.state.profilePhoto);
            const blob = await response.blob();
            var ref1 = storageRef.child(
              'Photos/' + auth().currentUser.uid + '/1.jpg',
            );
            await ref1.put(blob);
            RNFS.copyFile(
              this.state.profilePhoto,
              RNFS.DocumentDirectoryPath +
                '/' +
                auth().currentUser.uid +
                'profile.jpg',
            );
            this.setState({
              profilePhoto: this.state.profilePhoto + '?' + new Date(),
              userPhotoCount: this.state.userPhotoCount + 1,
            });
          }
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userGender',
            this.state.userGender,
          );
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userCountry',
            this.state.userCountry,
          );
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userName',
            this.state.userUsername,
          );
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'userBio',
            this.state.userBio,
          );
          await EncryptedStorage.setItem(
            auth().currentUser.uid + 'userPhotoCount',
            JSON.stringify(this.state.userPhotoCount),
          );

          await database()
            .ref('Users/' + auth().currentUser.uid + '/i')
            .update({
              g: this.state.userGender,
              c: this.state.userCountry,
              b: this.state.userBio,
              u: this.state.userUsername,
              p: this.state.userPhotoCount,
            })
            .then(() => {
              infoChanged = false;
              this.setState({
                saveInfoModalVisible: true,
                loadingOpacity: 0,
                saveBtnDisabled: false,
              });
              this.spinValue = new Animated.Value(0);
            });
        } catch (error) {
          this.setState({saveBtnDisabled: false});
          Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed);
        }
      } else {
        Alert.alert(lang.Warning, lang.InvalidBio);
      }
    } else {
      Alert.alert(lang.Warning, lang.InvalidUsername);
    }
  }
  onCountryValueChange(value) {
    if (this.state.userCountry != value.label) {
      infoChanged = true;
    }
    this.setState({userCountry: value.label});
  }
  onValueChangeGender(value) {
    var g;
    if (value.label == 'Erkek') {
      g = 'Male';
    } else if (value.label == 'Kadın') {
      g = 'Female';
    } else {
      g = value.label;
    }

    if (this.state.userGender != g) {
      infoChanged = true;
    }
    this.setState({userGender: g});
  }
  onValueChangeUsername(text) {
    if (this.state.userUsername != text) {
      infoChanged = true;
    }
    this.setState({
      userUsername: text,
      selection: {
        start: text.length,
        end: text.length,
      },
    });
  }
  valueChange(value) {
    if (this.state.userBio != value) {
      infoChanged = true;
    }
    if (this.state.bioLimit <= 100) {
      this.setState({userBio: value});
      global.globalBio = value;
      this.setState({bioLimit: value.length});
    }
  }

  onPressCountry() {
    Keyboard.dismiss();
    this.setState({bioOpacity: 1});
  }
  onPressGender() {
    console.log('girdimi');
    Keyboard.dismiss();
    this.refs.test.blur();
    this.setState({bioOpacity: 1});
  }
  onPressEdit() {
    Keyboard.dismiss();
    this.setState({bioOpacity: 1, isVisible: true});
    //this.refs.test.blur()
  }
  onPressScreen() {
    if (this.state.bioOpacity == 1) {
      this.setState({
        keyboardOpenAuth: false,
        upperComponentsOpacity: 1,
        upperComponentsDisabled: false,
        keyboardOpen: false,
      });
    } else {
      this.setState({
        keyboardOpenAuth: false,
        bioOpacity: 1,
        keyboardOpen: false,
      });
    }
    Keyboard.dismiss();
  }
  library = () => {
    this.setState({
      isVisible: false,
    });
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true,
    }).then((image) => {
      var lang = language[global.lang];
      if (image.size > global.imageSizeLimit) {
        Alert.alert(lang.Warning, lang.ImageSizeExceeded);
      } else {
        infoChanged = true;
        this.setState({
          newPhoto: true,
          profilePhoto: image.path,
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
      var lang = language[global.lang];
      if (image.size > global.imageSizeLimit) {
        Alert.alert(lang.Warning, lang.ImageSizeExceeded);
      } else {
        infoChanged = true;
        this.setState({
          newPhoto: true,
          profilePhoto: image.path,
        });
      }
    });
  };
  onPressDelete() {
    var lang = language[global.lang];
    Alert.alert(
      '',
      lang.DeleteAccount,
      [
        {
          text: lang.NO,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: lang.YES,
          onPress: () => this.setState({authenticationVisible: true}),
        },
      ],
      {cancelable: true},
    );
  }

  onPressGoBack() {
    if (infoChanged) {
      this.setState({goBackInfoModalVisible: true});
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    var lang = language[global.lang];
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    var backgroundColor = global.themeColor;
    backgroundColor = backgroundColor.slice(0, -2);
    backgroundColor = backgroundColor + '0.2)';
    const {navigate} = this.props.navigation;
    if (!this.state.loadingDone) {
      return (
        <SafeAreaView
          style={{
            width: this.width,
            height: this.height,
            flex: 1,
            flexDirection: 'column',
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
          }}>
          <ModifiedStatusBar />

          <CustomHeader
            whichScreen={'Profile'}
            isFilterVisible={this.state.showFilter}
            title={lang.Profile}></CustomHeader>

          <Animated.Image
            source={{uri: 'loading' + global.themeForImages}}
            style={{
              transform: [{rotate: spin}],
              width: this.width * (1 / 15),
              height: this.width * (1 / 15),
              position: 'absolute',
              top: this.height / 3,
              left: this.width * (7 / 15),
              opacity: this.state.loadingDone ? 0 : 1,
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            width: this.width,
            height: this.height,
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
          }}>
          <ModifiedStatusBar />
          <TouchableOpacity
            disabled={this.state.loadingOpacity == 1 ? true : false}
            onPress={() => this.onPressScreen()}
            activeOpacity={1}
            style={{
              backgroundColor: global.isDarkMode
                ? global.darkModeColors[1]
                : 'rgba(242,242,242,1)',
              width: this.width,
              height: this.height,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View
              pointerEvents={this.state.loadingOpacity == 1 ? 'none' : null}
              style={{
                position: 'absolute',
                bottom: this.state.keyboardOpen
                  ? (this.height - headerHeight - getStatusBarHeight()) / 2
                  : 0,
                width: this.width,
                height: this.height - headerHeight,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  opacity: this.state.upperComponentsOpacity,
                  width: this.width,
                  height:
                    (this.height - headerHeight - getStatusBarHeight()) / 2,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    opacity: this.state.upperComponentsOpacity,
                    width: this.width / 2,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    disabled={
                      this.state.upperComponentsDisabled ||
                      !this.state.loadingDonePhoto
                    }
                    style={{
                      opacity: this.state.upperComponentsOpacity,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                      width: (this.width / 2) * (8 / 10),
                      height: (this.width / 2) * (8 / 10) * (7 / 6),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'gray',
                    }}
                    onPress={() => {
                      Keyboard.dismiss(),
                        this.setState({imageViewerVisible: true});
                    }}>
                    <Image
                      style={{
                        opacity: this.state.upperComponentsOpacity,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                        width: (this.width / 2) * (8 / 10),
                        height: (this.width / 2) * (8 / 10) * (7 / 6),
                      }}
                      source={{uri: this.state.profilePhoto}}></Image>

                    <Animated.Image
                      source={{uri: 'loading' + global.themeForImages}}
                      style={{
                        position: 'absolute',
                        transform: [{rotate: spin}],
                        width: this.width * (1 / 15),
                        height: this.width * (1 / 15),
                        opacity: this.state.loadingDonePhoto ? 0 : 1,
                      }}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      opacity: this.state.upperComponentsOpacity,
                      top:
                        (this.width / 2) * (8 / 10) * (7 / 6) +
                        ((this.height - headerHeight - getStatusBarHeight()) /
                          2 -
                          (this.width / 2) * (8 / 10) * (7 / 6)) /
                          2,
                      position: 'absolute',
                      width: this.width / 2,
                      height: (this.width / 2) * (8 / 10) * (1 / 6),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      disabled={
                        this.state.upperComponentsDisabled ||
                        this.state.loadingOpacity == 1
                          ? true
                          : false
                      }
                      onPress={() => this.onPressEdit()}
                      style={{
                        opacity: this.state.upperComponentsOpacity,
                        position: 'absolute',
                        width: '50%',
                        height: '70%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 18 * (this.width / 360),
                          color: global.themeColor,
                        }}>
                        {lang.Edit}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    opacity: this.state.upperComponentsOpacity,
                    width: this.width / 2,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextInput
                    spellCheck={false}
                    autoCorrect={false}
                    maxLength={15}
                    ref={'test'}
                    defaultValue={this.state.userUsername}
                    editable={!this.state.upperComponentsDisabled}
                    selection={this.state.selection}
                    numberOfLines={1}
                    style={{
                      color: global.isDarkMode
                        ? global.darkModeColors[3]
                        : 'rgba(0,0,0,1)',
                      opacity: this.state.upperComponentsOpacity,
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingLeft: 12,
                      paddingRight: 12,
                      textAlign: 'left',
                      backgroundColor: global.isDarkMode
                        ? 'rgba(0,0,0,0.1)'
                        : 'rgba(255,255,255,1)',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,

                      elevation: 2,
                      fontSize: 14 * (this.width / 360),
                      borderRadius: 2,
                      width: (this.width / 2) * (8 / 10),
                      height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5,
                    }}
                    onChangeText={(text) =>
                      this.onValueChangeUsername(text)
                    }></TextInput>

                  <View
                    style={{
                      width: (this.width / 2) * (8 / 10),
                      height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}></View>

                  <CustomPicker
                    backgroundColor={'white'}
                    placeHolder={false}
                    borderWidth={0.4}
                    borderBottomWidth={0.4}
                    borderColor={'gray'}
                    borderBottomColor={'gray'}
                    selectedValue={this.state.userCountry}
                    disabled={this.state.upperComponentsDisabled}
                    opacity={this.state.upperComponentsOpacity}
                    onOpen={() => this.onPressCountry()}
                    onValueChange={(value) => this.onCountryValueChange(value)}
                    items={countries.newGenderItems}
                    label={'label'}
                    height={((this.width / 2) * (8 / 10) * (7 / 6)) / 5}
                    width={(this.width / 2) * (8 / 10)}
                  />

                  <View
                    style={{
                      width: (this.width / 2) * (8 / 10),
                      height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5.5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}></View>

                  <CustomPicker
                    backgroundColor={'white'}
                    placeHolder={false}
                    borderWidth={0.4}
                    borderBottomWidth={0.4}
                    borderColor={'gray'}
                    borderBottomColor={'gray'}
                    selectedValue={
                      this.state.userGender == 'Male'
                        ? lang.MaleSmall
                        : lang.FemaleSmall
                    }
                    disabled={this.state.upperComponentsDisabled}
                    opacity={this.state.upperComponentsOpacity}
                    onOpen={() => this.onPressGender()}
                    onValueChange={(value) => this.onValueChangeGender(value)}
                    items={[
                      {label: lang.MaleSmall, key: 1},
                      {label: lang.FemaleSmall, key: 2},
                    ]}
                    label={'label'}
                    height={((this.width / 2) * (8 / 10) * (7 / 6)) / 5}
                    width={(this.width / 2) * (8 / 10)}
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: this.width,
                  height:
                    (this.height - headerHeight - getStatusBarHeight()) / 2,
                  flexDirection: 'column',
                }}>
                <ProfileBioButton
                  onFocus={() => this.keyboardWillShow()}
                  opacity={this.state.bioOpacity}
                  defaultText={this.state.userBio}
                  onChangeText={(text) => this.valueChange(text)}
                  characterNo={this.state.bioLimit}
                />

                <TouchableOpacity
                  disabled={this.state.saveBtnDisabled}
                  activeOpacity={1}
                  style={{
                    borderBottomLeftRadius: 12,
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: backgroundColor,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  onPress={() => this.onPressSave()}>
                  <Text
                    style={{
                      color: global.themeColor,
                      fontSize: 15 * (this.width / 360),
                    }}>
                    {lang.Save}
                  </Text>
                </TouchableOpacity>

                <LogoutButton
                  text={lang.DeleteMyAccount}
                  onPress={() => this.onPressDelete()}
                />
              </View>
            </View>

            <AuthenticationModal
              isKeyboardOpen={this.state.keyboardOpenAuth}
              modalBottom={
                (this.height +
                  getStatusBarHeight() -
                  global.keyboardHeight -
                  (this.width * 8) / 10) /
                  2 +
                global.keyboardHeight
              }
              isVisible={this.state.authenticationVisible}
              onPressEnter={() => {
                this.deletePress();
              }}
              onPressCancel={() => {
                this.setState({authenticationVisible: false});
              }}
              onBackdropPress={() => {
                this.setState({authenticationVisible: false});
              }}
            />

            <ImageUploadModal
              isVisible={this.state.isVisible}
              txtUploadPhoto={lang.UploadAPhoto}
              txtCancel={global.langCancel}
              txtTakePhoto={lang.Camera}
              txtOpenLibrary={lang.Library}
              onPressCancel={() => this.setState({isVisible: false})}
              onPressCamera={this.camera}
              onPressLibrary={this.library}
            />

            <ImageViewerModal
              isVisible={this.state.imageViewerVisible}
              images={this.state.profilePhoto}
              onCancel={() => {
                this.setState({imageViewerVisible: false});
              }}
            />

            <GoBackInfoModal
              isVisible={this.state.goBackInfoModalVisible}
              txtAlert={lang.DidntSave}
              txtOk={lang.YES}
              txtSave={lang.Save}
              txtCancel={lang.CancelCap}
              onPressOk={() => this.props.navigation.goBack()}
              onPressSave={() => {
                this.setState({goBackInfoModalVisible: false});
                this.onPressSave();
              }}
              onPressClose={() =>
                this.setState({goBackInfoModalVisible: false})
              }
            />

            <Snackbar
              duration={1000}
              style={{
                bottom: this.state.keyboardOpen
                  ? global.keyboardHeight + this.navBarHeight + this.width / 7
                  : this.width / 7,
              }}
              visible={this.state.saveInfoModalVisible}
              onDismiss={() => this.setState({saveInfoModalVisible: false})}>
              {lang.YourChangesHaveBeenSaved}
            </Snackbar>

            <Animated.Image
              source={{uri: 'loading' + global.themeForImages}}
              style={{
                transform: [{rotate: spin}],
                width: this.width * (1 / 15),
                height: this.width * (1 / 15),
                position: 'absolute',
                bottom:
                  this.height * (20 / 100) -
                  getStatusBarHeight() +
                  ((this.width * 3) / 10) * (7 / 6) +
                  this.width / 30 -
                  this.width / 7,
                left: this.width * (7 / 15),
                opacity: this.state.loadingOpacity,
              }}
            />

            <CustomHeader
              whichScreen={'Profile'}
              onPress={() => this.onPressGoBack()}
              isFilterVisible={this.state.showFilter}
              title={lang.Profile}></CustomHeader>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
  }
}
