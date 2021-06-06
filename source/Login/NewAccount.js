import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {TextField} from 'react-native-ui-lib';
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
  Button,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
  Picker,
  Alert,
  StatusBar,
  Platform,
  Keyboard,
  FlatList,
  ScrollView,
} from 'react-native';
import LoginScreen from './Login';
import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import OvalButton from '../Components/Common/OvalButton/OvalButton';
import TermsAndPrivacyModal from '../Components/Login/TermsAndPrivacyModal';
import language from '../Utils/Languages/lang.json';
import texts from '../termsAndPrivacy.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var keyboardHeight;
var keyboardYcord;
var termsTxt;
var privacyTxt;

export default class NewAccountScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOpen: false,
      reRender: true,
      termsAndPrivacyIsVisible: false,
      selectedTxt: 'Terms',
      usernameColor: 'black',
      splashOver: false,
      isim: '',
      sifre: '',
      sifre2: '',
      email: '',
      gender: '',
      verificationSended: false,
      agreeDisabled: false,
      textInputHeight: 0,
      emailErrorMsg: '',
      usernameErrorMsg: '',
      pwErrorMsg: '',
      confirmPwErrorMsg: '',
    };
    var lang = language[global.lang];
    this.props.navigation.setParams({otherParam: lang.SignUp});
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight;
    this.height = Math.round(Dimensions.get('screen').height);
    global.globalUsername = '';
    this.width = Math.round(Dimensions.get('screen').width);
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navBarHeight = this.height - this.windowHeight;
    this.textFieldHeight = 0;
  }
  componentDidMount() {
    var lang = language[global.lang];
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log('subscribe');
      this.setState({reRender: !this.state.reRender});
    });
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  static navigationOptions = {
    header: null,
  };
  _keyboardDidShow = (e) => {
    console.log('did show');
    const {height, screenX, screenY, width} = e.endCoordinates;
    keyboardHeight = height;
    if (global.keyboardHeight == null || global.keyboardHeight == undefined) {
      global.keyboardHeight = keyboardHeight;
      console.log('global:', global.keyboardHeight);
      EncryptedStorage.setItem(
        'keyboardHeight',
        global.keyboardHeight.toString(),
      );
      this.setState({reRender: !this.state.reRender, keyboardOpen: true});
    }
  };
  _keyboardDidHide = () => {
    this.setState({keyboardOpen: false});
    this.flatListRef.scrollToOffset({
      animated: false,
      offset: 0,
    });
    console.log('keyboard kapandı');
  };
  writeUserData(userId, name, email, imageUrl) {
    database()
      .ref('users/' + userId)
      .set({
        username: name,
        email: email,
        profile_picture: imageUrl,
      });
  }
  SignUp = (email, password) => {
    console.log('SIGNUP');
    this.setState({agreeDisabled: true});
    var lang = language[global.lang];
    const {navigate} = this.props.navigation;
    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.sifre)
      .then(() => {
        console.log(database().ref('/Users/' + auth().currentUser.uid + '/i'));

        database()
          .ref('/Users/' + auth().currentUser.uid + '/i')
          .set({
            u: this.state.isim,
          })
          .catch((error) => {
            this.setState({agreeDisabled: false});
            console.log("Can't update database");
          });
        EncryptedStorage.setItem(
          auth().currentUser.uid + 'userName',
          this.state.isim,
        );
        auth()
          .currentUser.sendEmailVerification()
          .catch((error) => {
            this.setState({agreeDisabled: false});
            Alert.alert(lang.PlsTryAgain, lang.SendEmailFailed);
          });
        this.setState({agreeDisabled: false});
        navigate('Login');
        Alert.alert('', lang.VerificationSent);
      })
      .catch((error) => {
        console.log('Create account error: ', error.message);
        if (
          error.message ==
          '[auth/invalid-email] The email address is badly formatted.'
        ) {
          this.setState({agreeDisabled: false});
          Alert.alert(lang.PlsTryAgain, lang.InvalidEmail);
        } else {
          this.setState({agreeDisabled: false});
          Alert.alert(lang.PlsTryAgain, lang.EmailAlready);
        }
      });
  };
  check() {
    var lang = language[global.lang];
    var usernameErrorMsg = '';
    var emailErrorMsg = '';
    var pwErrorMsg = '';
    var confirmPwErrorMsg = '';

    if (this.state.isim == '') {
      usernameErrorMsg = lang.ThisFieldIsRequired;
    } else if (this.state.isim.length < 3) {
      usernameErrorMsg = lang.InvalidUsernameChar;
    } else if (!this.checkIfUsernameValid(this.state.isim)) {
      usernameErrorMsg = lang.InvalidUsernameType;
    } else {
      usernameErrorMsg = '';
    }

    if (this.state.sifre == '') {
      pwErrorMsg = lang.ThisFieldIsRequired;
    } else if (this.state.sifre.length < 6) {
      pwErrorMsg = lang.PasswordCharacter;
    } else {
      pwErrorMsg = '';
    }
    if (this.state.sifre2 == '') {
      confirmPwErrorMsg = lang.ThisFieldIsRequired;
    } else if (this.state.sifre2.length < 6) {
      confirmPwErrorMsg = lang.PasswordCharacter;
    } else if (this.state.sifre != this.state.sifre2) {
      confirmPwErrorMsg = lang.PasswordMatch;
    } else {
      confirmPwErrorMsg = '';
    }

    emailErrorMsg = this.state.email == '' ? lang.ThisFieldIsRequired : '';

    this.setState({
      emailErrorMsg: emailErrorMsg,
      usernameErrorMsg: usernameErrorMsg,
      pwErrorMsg: pwErrorMsg,
      confirmPwErrorMsg: confirmPwErrorMsg,
    });
  }
  async onPressCreate() {
    console.log('create');

    Keyboard.dismiss();
    this.setState({keyboardOpen: false});
    await this.check();
    if (
      this.state.emailErrorMsg == '' &&
      this.state.usernameErrorMsg == '' &&
      this.state.pwErrorMsg == '' &&
      this.state.confirmPwErrorMsg == ''
    ) {
      this.setState({termsAndPrivacyIsVisible: true});
    }
  }
  onUsernameTextChange(text) {
    this.setState({isim: text});
    if (this.checkIfUsernameValid(text)) {
      this.setState({usernameColor: 'black'});
    } else {
      this.setState({usernameColor: 'red'});
    }
  }
  checkIfUsernameValid(text) {
    var regex = /^[A-Za-z0-9. ]+$/;
    if (regex.test(text)) {
      return true;
    } else {
      return false;
    }
  }
  handleClick = (path) => {
    fetch(path)
      .then((r) => r.text())
      .then((text) => {
        return text;
        console.log(text);
      });
  };

  render() {
    var lang = language[global.lang];
    var keyboardAvoidingHeight;
    if (global.keyboardHeight == null || global.keyboardHeight == undefined) {
      keyboardAvoidingHeight = 0;
    } else {
      keyboardAvoidingHeight = global.keyboardHeight + this.navBarHeight;
    }
    console.log('RENDER SIGN UP');
    const {navigate} = this.props.navigation;
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
        <CustomHeader
          title={lang.SignUp}
          onPress={() => this.props.navigation.goBack()}
        />

        <FlatList
          keyboardShouldPersistTaps={true}
          style={{
            flex: 1,
          }}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          scrollEnabled={this.state.keyboardOpen}
          nestedScrollEnabled={this.state.keyboardOpen}
          renderItem={() => {
            return (
              <View
                style={{
                  width: this.width,
                  height:
                    this.height +
                    (this.height -
                      getStatusBarHeight() -
                      headerHeight -
                      this.navBarHeight -
                      this.textFieldHeight * 3),
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    width: this.width,
                    height:
                      this.height +
                      (this.height -
                        getStatusBarHeight() -
                        headerHeight -
                        this.navBarHeight -
                        this.textFieldHeight * 3),
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('touchable pressed');
                    Keyboard.dismiss();
                    this.setState({keyboardOpen: false});
                  }}>
                  <View
                    style={{
                      width: this.width,
                      height:
                        this.height -
                        getStatusBarHeight() -
                        headerHeight -
                        this.navBarHeight,
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        width: this.width,
                        height: this.height / 2,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: this.width,
                          paddingVertical: '3%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TextField
                          style={{
                            fontSize: 17 * (this.width / 360),
                            width: this.width * (6 / 10),
                          }}
                          spellCheck={false}
                          autoCorrect={false}
                          onFocus={() => {
                            this.flatListRef.scrollToOffset({
                              animated: true,
                              offset: this.textFieldHeight * 0,
                            });
                            this.setState({keyboardOpen: true});
                          }}
                          hideUnderline={false}
                          underlineColor={
                            this.state.emailErrorMsg == ''
                              ? 'gray'
                              : global.themeColor
                          }
                          floatingPlaceholder={true}
                          floatOnFocus={true}
                          centered={false}
                          multiline={false}
                          error={this.state.emailErrorMsg}
                          placeholder={lang.Email}
                          keyboardType="email-address"
                          onChangeText={(text) => this.setState({email: text})}
                        />
                      </View>
                      <View
                        style={{
                          width: this.width,
                          paddingVertical: '3%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TextField
                          style={{
                            fontSize: 17 * (this.width / 360),
                            width: this.width * (6 / 10),
                          }}
                          spellCheck={false}
                          autoCorrect={false}
                          onFocus={() => {
                            this.flatListRef.scrollToOffset({
                              animated: true,
                              offset: this.textFieldHeight * 1,
                            });
                            this.setState({keyboardOpen: true});
                          }}
                          hideUnderline={false}
                          underlineColor={
                            this.state.usernameErrorMsg == ''
                              ? 'gray'
                              : global.themeColor
                          }
                          floatingPlaceholder={true}
                          floatOnFocus={true}
                          centered={false}
                          multiline={false}
                          error={this.state.usernameErrorMsg}
                          placeholder={lang.Username}
                          onChangeText={(text) =>
                            this.onUsernameTextChange(text)
                          }
                        />
                      </View>
                      <View
                        style={{
                          width: this.width,
                          paddingVertical: '3%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TextField
                          style={{
                            fontSize: 17 * (this.width / 360),
                            width: this.width * (6 / 10),
                          }}
                          spellCheck={false}
                          autoCorrect={false}
                          onFocus={() => {
                            this.flatListRef.scrollToOffset({
                              animated: true,
                              offset: this.textFieldHeight * 2,
                            });
                            this.setState({keyboardOpen: true});
                          }}
                          hideUnderline={false}
                          underlineColor={
                            this.state.pwErrorMsg == ''
                              ? 'gray'
                              : global.themeColor
                          }
                          floatingPlaceholder={true}
                          floatOnFocus={true}
                          centered={false}
                          multiline={false}
                          error={this.state.pwErrorMsg}
                          placeholder={lang.Password}
                          secureTextEntry
                          onChangeText={(text) => this.setState({sifre: text})}
                        />
                      </View>
                      <View
                        onLayout={(event) => {
                          this.textFieldHeight =
                            event.nativeEvent.layout.height;
                        }}
                        style={{
                          width: this.width,
                          paddingVertical: '3%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <TextField
                          style={{
                            fontSize: 17 * (this.width / 360),
                            width: this.width * (6 / 10),
                          }}
                          spellCheck={false}
                          autoCorrect={false}
                          onFocus={() => {
                            this.flatListRef.scrollToOffset({
                              animated: true,
                              offset: this.textFieldHeight * 3,
                            });
                            this.setState({keyboardOpen: true});
                          }}
                          hideUnderline={false}
                          underlineColor={
                            this.state.confirmPwErrorMsg == ''
                              ? 'gray'
                              : global.themeColor
                          }
                          floatingPlaceholder={true}
                          floatOnFocus={true}
                          centered={false}
                          multiline={false}
                          error={this.state.confirmPwErrorMsg}
                          placeholder={lang.ConfirmPassword}
                          secureTextEntry
                          onChangeText={(text) => this.setState({sifre2: text})}
                        />
                      </View>
                      <View
                        style={{
                          width: this.width,
                          height: (this.height * 18) / 100,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <OvalButton
                          opacity={1}
                          backgroundColor={
                            global.isDarkMode
                              ? global.darkModeColors[1]
                              : 'rgba(255,255,255,1)'
                          }
                          title={lang.Create}
                          textColor={global.themeColor}
                          onPress={() => this.onPressCreate()}
                          borderColor={global.themeColor}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          data={[{bos: 'boş1', key: 'key1'}]}></FlatList>
        <TermsAndPrivacyModal
          agreeDisabled={this.state.agreeDisabled}
          isVisible={this.state.termsAndPrivacyIsVisible}
          txtCancel={lang.Cancel}
          txtOk={lang.Agree}
          txtTerms={lang.TermsOfUse}
          txtPrivacy={lang.PrivacyPolicy}
          onPressClose={() => {
            this.setState({termsAndPrivacyIsVisible: false});
          }}
          onPressOk={() => {
            this.SignUp(this.state.email, this.state.password);
            this.setState({termsAndPrivacyIsVisible: false});
          }}
          onPressTerms={() => {
            this.setState({selectedTxt: 'Terms'});
          }}
          onPressPrivacy={() => {
            this.setState({selectedTxt: 'Privacy'});
          }}
          selected={this.state.selectedTxt}
          txt={
            this.state.selectedTxt === 'Terms'
              ? texts['terms']
              : texts['privacy']
          }
        />
      </SafeAreaView>
    );
  }
}
