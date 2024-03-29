import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
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

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';

import FavBlockedUsersButtonModal from '../Components/Settings/ProfileBlockedUser/FavBlockedUsersButtonModal';
import SendMsgButton from '../Components/Common/FavBlockMsg/SendMsgButton';
import BlockUserButton from '../Components/Common/FavBlockMsg/BlockUserButton';
import FavoriteUserButton from '../Components/Common/FavBlockMsg/FavoriteUserButton';
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
var listener;
var lang = language[global.lang];
export default class ProfileFavUserScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      removeModalVisible: false,
      blockModalVisible: false,
      profilePhoto: '',
      loadingDone: false,
      userUsername: '',
      userGender: '',
      userCountry: '',
      userBio: '',
      upperComponentsOpacity: 1,
      upperComponentsDisabled: false,
      selection: {
        start: 0,
        end: 0,
      },
    };
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.spinValue = new Animated.Value(0);
  }

  async componentDidMount() {
    this.setState({loadingDone: false});
    this.spinAnimation();
    //console.log('comp did mount');
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({
        loadingDone: true,
        profilePhoto: global.selectedFavUserUrl,
      });
      //this.spinAnimation()
      //console.log('subscribe');
      await this.initializeFavoriteUsersScreen();
      this.setState({reRender: 'ok'});
    });
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      this.setState({loadingDone: false});
      this.spinAnimation();
    });
  }

  static navigationOptions = {
    header: null,
  };
  getGenderPickerSelectedValue() {
    var lang = language[global.lang];
    if (this.state.userGender == 'Male') {
      return lang.MaleSmall;
    } else if (this.state.userGender == 'Female') {
      return lang.FemaleSmall;
    } else {
      return lang.Unknown;
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

  async initializeFavoriteUsersScreen() {
    listener = database().ref('Users/' + global.selectedFavUserUid + '/i');
    await listener.on('value', async (snap) => await this.listenerFunc(snap));
  }

  listenerFunc = async (snap) => {
    this.setState({
      userUsername: snap.val().u,
      userGender: snap.val().g,
      userCountry: snap.val().c,
      userBio: snap.val().b,
    });
    //console.log('ProfileFavUser Listener');
  };

  goBack() {
    listener.off();
    this.props.navigation.navigate('FavoriteUsers');
  }
  remove() {
    listener.off();
    global.removeFromFavUser = true;
    global.removedFromFavList = true;
    global.isFavListUpdated = true;
    this.props.navigation.navigate('FavoriteUsers');
  }
  async block() {
    listener.off();
    global.removeFromFavUser = true;
    global.isBlockListUpdated = true;
    global.isFavListUpdated = true;
    await EncryptedStorage.getItem(auth().currentUser.uid + 'blockedUsers')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return [];
        }
      })
      .then((json) => {
        blockedUsers = json;
        blockedUsers.push(global.selectedFavUserUid);
        EncryptedStorage.setItem(
          auth().currentUser.uid + 'blockedUsers',
          JSON.stringify(blockedUsers),
        );
        global.changedBlockInMain = true;
        this.props.navigation.navigate('FavoriteUsers');
      });
  }
  sendMsg() {
    global.receiverUid = global.selectedFavUserUid;
    global.receiverGender = this.state.userGender;
    global.receiverCountry = this.state.userCountry;
    global.receiverUsername = this.state.userUsername;
    global.receiverPhoto = this.state.profilePhoto;
    global.receiverBio = this.state.userBio;
    //global.firstMessage = true
    this.props.navigation.navigate('Chat');
  }

  async buttonClicked(whichButton) {
    if (whichButton == 'block') {
      await this.block();
    }
    if (whichButton == 'remove') {
      this.remove();
    }
    this.setState({removeModalVisible: false, blockModalVisible: false});
  }

  render() {
    var totalEmptyHeight =
      this.height -
      getStatusBarHeight() -
      headerHeight -
      this.width * (4 / 10) * (7 / 6) -
      this.width / 2.5 -
      this.width / 10;
    var lang = language[global.lang];
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    var backgroundColor = global.themeColor;
    backgroundColor = backgroundColor.slice(0, -2);
    backgroundColor = backgroundColor + '0.2)';
    const {navigate} = this.props.navigation;
    if (false) {
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
            title={lang.FavoriteUsers}></CustomHeader>

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
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
            width: this.width,
            height: this.height,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <ModifiedStatusBar />

          <CustomHeader
            whichScreen={'Profile'}
            onPress={() => this.goBack()}
            isFilterVisible={this.state.showFilter}
            title={lang.FavoriteUsers}></CustomHeader>

          <View style={{height: totalEmptyHeight / 4}} />

          <View
            style={{
              opacity: this.state.upperComponentsOpacity,
              width: this.width,
              height: this.width * (4 / 10) * (7 / 6),
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
            </View>

            <View
              style={{
                opacity: this.state.upperComponentsOpacity,
                bottom: 0,
                position: 'absolute',
                width: this.width / 2,
                height:
                  (this.height -
                    this.width / 7 -
                    headerHeight -
                    getStatusBarHeight()) /
                    4 -
                  ((this.width / 2) * (8 / 10) * (7 / 6)) / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>

            <View
              style={{
                opacity: this.state.upperComponentsOpacity,
                width: this.width / 2,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: global.isDarkMode
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                  width: (this.width / 2) * (8 / 10),
                  height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.9,
                  borderColor: 'gray',
                  borderRadius: 8,
                }}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={{
                    fontFamily: global.fontFam,
                    marginHorizontal: 5,
                    color: global.isDarkMode
                      ? global.darkModeColors[3]
                      : 'rgba(0,0,0,1)',
                    fontSize: 15 * (this.width / 360),
                  }}>
                  {this.state.userUsername}
                </Text>
              </View>

              <View
                style={{
                  width: (this.width / 2) * (8 / 10),
                  height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>

              <View
                style={{
                  backgroundColor: global.isDarkMode
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                  width: (this.width / 2) * (8 / 10),
                  height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.9,
                  borderColor: 'gray',
                  borderRadius: 8,
                }}>
                <Text
                  adjustsFontSizeToFit={true}
                  numberOfLines={1}
                  style={{
                    fontFamily: global.fontFam,
                    marginHorizontal: 5,
                    color: global.isDarkMode
                      ? global.darkModeColors[3]
                      : 'rgba(0,0,0,1)',
                    fontSize: 15 * (this.width / 360),
                  }}>
                  {this.state.userCountry}
                </Text>
              </View>

              <View
                style={{
                  width: (this.width / 2) * (8 / 10),
                  height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>

              <View
                style={{
                  backgroundColor: global.isDarkMode
                    ? 'rgba(0,0,0,0.1)'
                    : 'white',
                  width: (this.width / 2) * (8 / 10),
                  height: ((this.width / 2) * (8 / 10) * (7 / 6)) / 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.9,
                  borderColor: 'gray',
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: global.fontFam,
                    color: global.isDarkMode
                      ? global.darkModeColors[3]
                      : 'rgba(0,0,0,1)',
                    fontSize: 15 * (this.width / 360),
                  }}>
                  {this.getGenderPickerSelectedValue()}
                </Text>
              </View>
            </View>
          </View>

          <View style={{height: totalEmptyHeight / 4}} />

          <View
            style={{
              width: (this.width * 8) / 10,
              height: this.width / 2.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: global.isDarkMode
                  ? 'rgba(0,0,0,0.1)'
                  : 'white',
                width: (this.width * 8) / 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderWidth: 0.9,
                borderColor: 'gray',
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontFamily: global.fontFam,
                  color: global.isDarkMode
                    ? global.darkModeColors[3]
                    : 'rgba(0,0,0,1)',
                  fontSize: 15 * (this.width / 360),
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 3,
                }}>
                {this.state.userBio}
              </Text>
            </View>
          </View>

          <View style={{height: totalEmptyHeight / 4}} />

          <View
            style={{
              opacity: 1,
              backgroundColor: global.isDarkMode
                ? 'rgba(0,0,0,0.1)'
                : 'rgba(181,181,181,0.6)',
              flexDirection: 'row',
              width: this.width / 2,
              height: this.width / 10,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}>
            <FavoriteUserButton
              disabled={false}
              image={'trashyellow'}
              onPress={() => this.setState({removeModalVisible: true})}
              opacity={1}
            />
            <SendMsgButton
              disabled={false}
              onPress={async () => await this.sendMsg()}
              opacity={1}
            />
            <BlockUserButton
              disabled={false}
              onPress={() => this.setState({blockModalVisible: true})}
              opacity={1}
            />
          </View>

          <FavBlockedUsersButtonModal
            isVisible={this.state.removeModalVisible}
            txtButton={lang.YES}
            txtAlert={
              lang.FavUserDeleteAlertSinglePt1 +
              this.state.userUsername +
              lang.FavUserDeleteAlertSinglePt2
            }
            onPressAdd={async () => await this.buttonClicked('remove')}
            onPressClose={() => this.setState({removeModalVisible: false})}
          />

          <FavBlockedUsersButtonModal
            isVisible={this.state.blockModalVisible}
            txtButton={lang.YES}
            txtAlert={
              lang.BlockuserPt1 + this.state.userUsername + lang.BlockuserPt2
            }
            onPressAdd={async () => await this.buttonClicked('block')}
            onPressClose={() => this.setState({blockModalVisible: false})}
          />
        </SafeAreaView>
      );
    }
  }
}
