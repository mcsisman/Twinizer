import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import OneSignal from 'react-native-onesignal';
import firestore from '@react-native-firebase/firestore';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-community/async-storage';
import language from '../../../Utils/Languages/lang.json';
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  Platform,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';

email = '';
pw = '';
if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var lang = language[global.lang];
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class AuthenticationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteStarted: false,
    };
    this.spinValue = new Animated.Value(0);
  }
  static propTypes = {
    isVisible: PropTypes.bool,
    onBackdropPress: PropTypes.func,
    onPressCancel: PropTypes.func,
    onPressEnter: PropTypes.func,
    isKeyboardOpen: PropTypes.bool,
    modalBottom: PropTypes.bottom,
    onFocus: PropTypes.func,
  };
  static defaultProps = {};
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
  async deletePress(email, password) {
    if (email == '' || password == '') {
      return;
    }
    try {
      var lang = language[global.lang];
      console.log('DELETE PRESS');
      this.spinAnimation();
      this.setState({authenticationVisible: false, deleteStarted: true});
      var authenticated = false;
      if (auth().currentUser.email == email) {
        await auth()
          .signInWithEmailAndPassword(email, password)
          .then(async () => {
            authenticated = true;
            console.log('authenticated');
          });
        if (authenticated) {
          await OneSignal.removeEventListener('received', this.onReceived);
          await OneSignal.removeEventListener('opened', this.onOpened);
          await OneSignal.removeEventListener('ids', this.onIds);
          // async storage remove
          EncryptedStorage.removeItem(auth().currentUser.uid + 'userGender');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'userCountry');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'userName');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'userBio');
          EncryptedStorage.removeItem(
            auth().currentUser.uid + 'userPhotoCount',
          );
          EncryptedStorage.removeItem(auth().currentUser.uid + 'blockedUsers');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'favoriteUsers');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'noOfSearch');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'lastSearch');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'historyArray');
          EncryptedStorage.removeItem(
            auth().currentUser.uid + 'favShowThisDialog',
          );
          EncryptedStorage.removeItem(
            auth().currentUser.uid + 'blockShowThisDialog',
          );
          EncryptedStorage.removeItem(auth().currentUser.uid + 'o');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'playerId');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'message_uids');
          EncryptedStorage.removeItem(
            auth().currentUser.uid + 'message_usernames',
          );
          EncryptedStorage.removeItem(auth().currentUser.uid + 'theme');
          EncryptedStorage.removeItem(auth().currentUser.uid + 'mode');
          var messageUidsArray = firestore()
            .collection(auth().currentUser.uid)
            .doc('MessageInformation');
          console.log('messageuidsarray: ', messageUidsArray);
          await messageUidsArray.get().then(async (doc) => {
            console.log('firestore içi');
            if (doc.exists) {
              var conversationUidArray = await doc.data()['UidArray'];
              for (let i = 0; i < conversationUidArray.length; i++) {
                EncryptedStorage.removeItem(
                  auth().currentUser.uid +
                    conversationUidArray[i] +
                    '/messages',
                );
                EncryptedStorage.removeItem(
                  'IsRequest/' +
                    auth().currentUser.uid +
                    '/' +
                    conversationUidArray[i],
                );
                EncryptedStorage.removeItem(
                  'ShowMessageBox/' +
                    auth().currentUser.uid +
                    '/' +
                    conversationUidArray[i],
                );
                EncryptedStorage.removeItem(
                  auth().currentUser.uid +
                    '' +
                    conversationUidArray[i] +
                    'lastSeen',
                );
              }
            }
          });
          // firestore delete
          await firestore()
            .collection(auth().currentUser.uid)
            .doc('ModelResult')
            .delete()
            .then(() => {
              console.log('ModelResult deleted!');
            })
            .catch((error) => {
              console.log(error);
            });
          await firestore()
            .collection(auth().currentUser.uid)
            .doc('Bios')
            .delete()
            .then(() => {
              console.log('Bİos deleted!');
            })
            .catch((error) => {
              console.log(error);
            });
          await firestore()
            .collection(auth().currentUser.uid)
            .doc('Similarity')
            .delete()
            .then(() => {
              console.log('Similarity deleted!');
            })
            .catch((error) => {
              console.log(error);
            });
          await firestore()
            .collection(auth().currentUser.uid)
            .doc('MessageInformation')
            .delete()
            .then(() => {
              console.log('MessageInformation deleted!');
            })
            .catch((error) => {
              console.log(error);
            });
          await firestore()
            .collection(auth().currentUser.uid)
            .doc('Funcdone')
            .delete()
            .then(() => {
              console.log('Funcdone deleted!');
            });
          // storage delete
          await storage()
            .ref(
              'Photos/' +
                auth().currentUser.uid +
                '/SearchPhotos/search-photo.jpg',
            )
            .delete()
            .then(() => {
              console.log('search-photo deleted');
            })
            .catch((error) => {
              console.log(error);
            });
          await storage()
            .ref(
              'Photos/' + auth().currentUser.uid + '/SearchPhotos/vec.pickle',
            )
            .delete()
            .then(() => {
              console.log('vec deleted!');
            })
            .catch((error) => {
              console.log(error);
            });
          await storage()
            .ref('Photos/' + auth().currentUser.uid + '/2.jpg')
            .delete()
            .then(() => {
              console.log('2 deleted!');
            });
          await storage()
            .ref('Photos/' + auth().currentUser.uid + '/3.jpg')
            .delete()
            .then(() => {
              console.log('3 deleted!');
            });
          await storage()
            .ref('Photos/' + auth().currentUser.uid + '/4.jpg')
            .delete()
            .then(() => {
              console.log('4 deleted!');
            });
          await storage()
            .ref('Photos/' + auth().currentUser.uid + '/5.jpg')
            .delete()
            .then(() => {
              console.log('5 deleted!');
            });
          await storage()
            .ref('Embeddings/' + auth().currentUser.uid + '.pickle')
            .delete()
            .then(() => {
              console.log('embeddings deleted!');
            });
          await storage()
            .ref('Photos/' + auth().currentUser.uid + '/1.jpg')
            .delete()
            .then(() => {
              console.log('1 deleted!');
            });
          // realtime remove
          await database()
            .ref('/PlayerIds/' + auth().currentUser.uid)
            .remove()
            .then(() => {
              console.log('playerId deleted!');
            });
          await database()
            .ref('/Users/' + auth().currentUser.uid)
            .remove()
            .then(() => {
              console.log('user info deleted!');
            });
          // delete account from authentication
          await auth()
            .currentUser.delete()
            .then(function () {
              console.log('LOGOUT SUCCESSFUL');
              global.popUp();
            });
        } else {
          this.setState({authenticationVisible: false, deleteStarted: false});
          Alert.alert(lang.PlsTryAgain, lang.WrongEmailPassword);
        }
      } else {
        this.setState({authenticationVisible: false, deleteStarted: false});
        Alert.alert(lang.PlsTryAgain, lang.WrongEmailPassword);
      }
    } catch (error) {
      console.log(error);
      this.setState({authenticationVisible: false, deleteStarted: false});
      Alert.alert(lang.PlsTryAgain, lang.SomethingWentWrong);
    }
  }
  render() {
    var lang = language[global.lang];
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <Modal /*BÜYÜTÜLMÜŞ FOTOĞRAF MODALI*/
        style={{
          alignItems: 'center',
          justifyContent: this.props.isKeyboardOpen ? 'flex-start' : 'center',
        }}
        backdropOpacity={0.4}
        coverScreen={false}
        deviceHeight={this.height}
        deviceWidth={this.width}
        hideModalContentWhileAnimating={true}
        onBackdropPress={this.props.onBackdropPress}
        animationIn="flipInY"
        animationOut="flipOutY"
        animationInTiming={750}
        animationOutTiming={750}
        isVisible={this.props.isVisible}>
        <View
          style={{
            borderBottomLeftRadius: 12,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: 'white',
            width: this.width * (8 / 10),
            flexDirection: 'column',
            paddingTop: 0,
            paddingBottom: 0,
            position: this.props.isKeyboardOpen ? 'absolute' : 'relative',
            bottom: this.props.isKeyboardOpen ? this.props.modalBottom : null,
          }}>
          <ImageBackground
            source={{uri: 'flare'}}
            style={{
              alignItems: 'center',
              borderBottomLeftRadius: 12,
              borderTopRightRadius: 12,
              borderTopLeftRadius: 12,
              borderBottomRightRadius: 12,
              width: this.width * (8 / 10),
              height: this.width * (8 / 10),
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                width: this.width * (8 / 10),
                height: this.width * (8 / 10),
                flex: 1,
                alignItems: 'center',
              }}
              onPress={() => Keyboard.dismiss()}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  position: 'absolute',
                  width: this.width * (6 / 10),
                  height: (this.width * 2) / 10,
                  flex: 1,
                  top: (this.width * 1) / 10,
                  borderColor: 'rgba(241,51,18,0)',
                }}>
                <Text
                  numberOfLines={3}
                  adjustsFontSizeToFit={true}
                  style={{fontSize: 17 * (this.width / 360), color: 'white'}}>
                  {lang.VerifyEmailPW}
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: this.width * (8 / 10),
                  height: (this.width * 5) / 10,
                  flex: 1,
                  top: (this.width * 3) / 10,
                  borderColor: 'rgba(241,51,18,0)',
                }}>
                <TextInput
                  spellCheck={false}
                  autoCorrect={false}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  placeholder={lang.Email}
                  onFocus={this.props.onFocus}
                  keyboardType="email-address"
                  style={{
                    fontSize: 16 * (this.width / 360),
                    width: this.width * (6 / 10),
                    height: (this.height * 6) / 100,
                    borderColor: 'rgba(241,51,18,0)',
                    borderBottomColor: 'white',
                    borderBottomWidth: 1,
                  }}
                  onChangeText={(text) => (email = text)}></TextInput>

                <View style={{height: (this.height * 2) / 100}}></View>

                <TextInput
                  spellCheck={false}
                  autoCorrect={false}
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  placeholder={lang.Password}
                  onFocus={this.props.onFocus}
                  secureTextEntry
                  style={{
                    fontSize: 16 * (this.width / 360),
                    width: this.width * (6 / 10),
                    height: (this.height * 6) / 100,
                    borderColor: 'rgba(241,51,18,0)',
                    borderBottomColor: 'white',
                    borderBottomWidth: 1,
                  }}
                  onChangeText={(text) => (pw = text)}></TextInput>

                <View style={{height: (this.height * 3) / 100}}></View>
                {this.state.deleteStarted && (
                  <Animated.Image
                    source={{uri: 'loadingwhite'}}
                    style={{
                      transform: [{rotate: spin}],
                      width: this.width * (1 / 15),
                      height: this.width * (1 / 15),
                    }}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    justifyContent: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                    height: (this.height * 6) / 100,
                  }}
                  onPress={() => {
                    this.deletePress(email, pw);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 18 * (this.width / 360),
                    }}>
                    {lang.Enter}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: this.width * (1 / 10),
                height: this.width * (1 / 10),
                right: 0,
                position: 'absolute',
                top: 0,
              }}
              onPress={this.props.onPressCancel}>
              <Image
                source={{uri: 'cross' + global.themeForImages}}
                style={{
                  width: '40%',
                  height: '40%',
                  right: '30%',
                  bottom: '30%',
                  position: 'absolute',
                }}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    );
  }
}

export * from './AuthenticationModal';
