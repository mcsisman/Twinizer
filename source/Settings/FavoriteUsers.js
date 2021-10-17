import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import {navigate, route} from './RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
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
  ScrollView,
  FlatList,
} from 'react-native';

import ProfileFavUserScreen from './ProfileFavUser';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import FavoriteUserBox from '../Components/Settings/FavoriteUsers/FavoriteUserBox';
import EditBox from '../Components/Messaging/Messages/EditBox/EditBox';
import language from '../Utils/Languages/lang.json';
if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var favoriteUserUids = [];
var favoriteUserUsernames = {};
var usernameListener = [];
var noOfFavUsers;
var imageUrls = {};
var colorArray = [];
var focusedtoThisScreen = false;
var lang = language[global.lang];
export default class FavoriteUsersScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      allSelected: false,
      loadingDone: false,
      editPressed: false,
      favoriteBoxDisabled: false,
      doneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
      reRender: false,
    };
    this.spinValue = new Animated.Value(0);
    this.leftAnimation = new Animated.Value((-this.width * 3) / 16);
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    lang = language[global.lang];
    this.setState({loadingDone: false});
    this.spinAnimation();
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.spinAnimation();
      focusedtoThisScreen = true;
      await this.initializeFavoriteUsersScreen();
      if (
        global.changedFavInMain ||
        Object.keys(global.usernameListeners).length == 0
      ) {
        this.updateUsernameListeners();
        global.changedFavInMain = false;
      }
      if (global.removeFromFavUser) {
        this.removeFromUser();
      }
      this.leftAnimation = new Animated.Value((-this.width * 3) / 16);
      this.setState({reRender: 'ok'});
    });
  }
  updateState = () => {
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };
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
  favoriteBoxAnimation(reset) {
    if (this.state.editText == 'Cancel' || reset == 'reset') {
      Animated.timing(this.leftAnimation, {
        duration: 200,
        toValue: -this.width * (3 / 16),
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start();
    } else if (this.state.editText == 'Edit') {
      Animated.timing(this.leftAnimation, {
        duration: 200,
        toValue: 0,
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start();
    }
  }
  editButtonPressed() {
    for (let i = 0; i < noOfFavUsers; i++) {
      colorArray[i] = 'trashgray';
    }
    if (this.state.editText == 'Edit') {
      this.setState({
        favoriteBoxDisabled: true,
        doneDisabled: true,
        editText: 'Cancel',
        editPressed: true,
        cancelPressed: false,
      });
      this.favoriteBoxAnimation();
    } else {
      this.setState({
        favoriteBoxDisabled: false,
        doneDisabled: true,
        editText: 'Edit',
        editPressed: false,
        cancelPressed: true,
      });
      this.favoriteBoxAnimation();
    }
  }

  updateUsernameListeners() {
    var uidset = new Set(favoriteUserUids);
    for (let i = 0; i < favoriteUserUids.length; i++) {
      //console.log("updateListeners: ", favoriteUserUids[i])
      if (!global.usernameListeners[favoriteUserUids[i]]) {
        global.usernameListeners[favoriteUserUids[i]] = database()
          .ref('Users/' + favoriteUserUids[i] + '/i/u')
          .on(
            'value',
            async (snap) =>
              await this.newlistener(snap, i, favoriteUserUids[i]),
          );
        //console.log("global.usernameListeners[favoriteUserUids[i]]: ", global.usernameListeners[favoriteUserUids[i]])
      }
    }
    for ([key, val] of Object.entries(global.usernameListeners)) {
      //console.log("[key, val]: ", key)
      if (!uidset.has(key)) {
        database()
          .ref('Users/' + key + '/i/u')
          .off();
        delete global.usernameListeners[key];
      }
    }
  }
  newlistener = async (snap, i, conversationUid) => {
    if (!focusedtoThisScreen) {
      await EncryptedStorage.getItem(auth().currentUser.uid + 'FavUsernames')
        .then((req) => {
          if (req) {
            return JSON.parse(req);
          } else {
            return {};
          }
        })
        .then((json) => {
          //console.log('FAV USERNAMES: ', json);
          favoriteUserUsernames = json;
          favoriteUserUsernames[conversationUid] = snap.val();
          EncryptedStorage.setItem(
            auth().currentUser.uid + 'FavUsernames',
            JSON.stringify(favoriteUserUsernames),
          );
        });
    } else {
      favoriteUserUsernames[conversationUid] = snap.val();
      //console.log("newlistener (focusedtoThisScreen) - favoriteUserUsernames: ", favoriteUserUsernames)
      await EncryptedStorage.setItem(
        auth().currentUser.uid + 'FavUsernames',
        JSON.stringify(favoriteUserUsernames),
      );
      this.setState({reRender: !this.state.reRender});
    }
  };

  async initializeFavoriteUsersScreen() {
    await this.getFavoriteUserUids();
    //console.log("global.favoriteUsersListeners: ", global.favoriteUsersListeners)
    //console.log("noOfFavUsers: ", noOfFavUsers)
    await this.createUsernameArray();
  }

  async getFavoriteUserUids() {
    await EncryptedStorage.getItem(auth().currentUser.uid + 'favoriteUsers')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => {
        favoriteUserUids = json;
        if (favoriteUserUids == null || favoriteUserUids == undefined) {
          noOfFavUsers = 0;
        } else {
          noOfFavUsers = favoriteUserUids.length;
        }
      });
  }
  async createUsernameArray() {
    //console.log("createUsernameArray - entered ")
    await EncryptedStorage.getItem(auth().currentUser.uid + 'FavUsernames')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return {};
        }
      })
      .then((json) => {
        //console.log('FAV USERNAMES: ', json);
        favoriteUserUsernames = json;
        this.setState({reRender: 'ok'});
        for (let i = 0; i < noOfFavUsers; i++) {
          //console.log("getImageURL: ", i)
          this.getImageURL(favoriteUserUids[i], i);
        }
        global.favoriteUsersListeners = noOfFavUsers;
      });
  }

  getImageURL(uid, i) {
    var storageRef = storage().ref('Photos/' + uid + '/1.jpg');
    storageRef
      .getDownloadURL()
      .then((data) => {
        imageUrls[uid] = data;
        //console.log("profil photo: ", data)
        this.setState({loadingDone: true, reRender: !this.state.reRender});
      })
      .catch(function (error) {
        //console.log(error)
      });
  }

  renderFavoriteUserBoxes() {
    var lang = language[global.lang];
    var scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    var boxes = [];
    if (noOfFavUsers == 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: this.width,
            height: scrollViewHeight,
          }}>
          <View
            style={{
              opacity: 0.7,
              alignItems: 'center',
              width: this.width,
              top: scrollViewHeight / 4,
              height: scrollViewHeight / 4,
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                fontSize: (20 * this.width) / 360,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {lang.NoFavoriteUsers}
            </Text>
          </View>
        </View>
      );
    } else {
      for (let i = 0; i < noOfFavUsers; i++) {
        const temp = i;
        boxes.push(
          <FavoriteUserBox
            left={this.leftAnimation}
            trashImage={colorArray[temp]}
            trashOnPress={() => this.trashButtonPressed(temp)}
            photoSource={imageUrls[favoriteUserUids[temp]]}
            disabled={this.state.favoriteBoxDisabled}
            text={favoriteUserUsernames[favoriteUserUids[temp]]}
            onPress={() =>
              this.select(
                imageUrls[favoriteUserUids[temp]],
                favoriteUserUids[temp],
                usernameListener[temp],
                temp,
              )
            }
            key={i}
          />,
        );
      }
    }
    return boxes;
  }

  donePress() {
    var lang = language[global.lang];
    var alertMsg = lang.FavUserDeleteAlert;
    Alert.alert(
      lang.Warning,
      alertMsg,
      [
        {
          text: lang.NO,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: lang.YES, onPress: () => this.deleteFavUser()},
      ],
      {cancelable: false},
    );
  }
  deleteFavUser() {
    var limit = noOfFavUsers;
    for (let i = limit - 1; i >= 0; i--) {
      if (colorArray[i] == 'trash' + global.themeForImages) {
        delete imageUrls[favoriteUserUids[i]];
        delete favoriteUserUsernames[favoriteUserUids[i]];
        database()
          .ref('Users/' + favoriteUserUids[i] + '/i/u')
          .off();
        delete global.usernameListeners[favoriteUserUids[i]];
        favoriteUserUids.splice(i, 1);
        global.favoriteUsersListeners = global.favoriteUsersListeners - 1;
        noOfFavUsers = noOfFavUsers - 1;
      }
    }
    global.removedFromFavList = true;
    global.isFavListUpdated = true;
    colorArray = [];
    for (let i = 0; i < noOfFavUsers; i++) {
      colorArray[i] = 'trashgray';
    }
    this.setState({
      favoriteBoxDisabled: false,
      doneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
    });
    this.favoriteBoxAnimation('reset');
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'favoriteUsers',
      JSON.stringify(favoriteUserUids),
    );
  }
  arrangeDoneColor() {
    var flag1 = false;
    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i] == 'trash' + global.themeForImages) {
        flag1 = true;
        doneColor = global.themeColor;
        this.setState({doneDisabled: false});
        break;
      }
    }
    if (!flag1) {
      doneColor = 'rgba(128,128,128,1)';
      this.setState({doneDisabled: true});
    }
  }
  async trashButtonPressed(i) {
    if (colorArray[i] == 'trashgray') {
      colorArray[i] = 'trash' + global.themeForImages;
    } else {
      colorArray[i] = 'trashgray';
    }
    var trashGrayCount = 0;
    var trashColoredCount = 0;
    //console.log("COLOR ARRAY:", colorArray)

    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i] == 'trashgray') {
        trashGrayCount++;
      } else {
        trashColoredCount++;
      }
    }
    if (trashColoredCount == colorArray.length) {
      this.setState({allSelected: true});
    }
    if (trashGrayCount == colorArray.length) {
      this.setState({allSelected: false});
    }
    this.arrangeDoneColor();
  }
  selectAll() {
    if (this.state.allSelected) {
      for (i = 0; i < colorArray.length; i++) {
        colorArray[i] = 'trashgray';
      }
      this.setState({allSelected: !this.state.allSelected, doneDisabled: true});
    } else {
      for (i = 0; i < colorArray.length; i++) {
        colorArray[i] = 'trash' + global.themeForImages;
      }
      this.setState({
        allSelected: !this.state.allSelected,
        doneDisabled: false,
      });
    }
  }
  goBack() {
    focusedtoThisScreen = false;
    global.selectedFavUserIndex = null;
    this.props.navigation.navigate('Settings');
  }
  select(url, uid, listener, index) {
    //console.log(url)
    //console.log(uid)
    //console.log(listener)
    //console.log(index)
    var storageRef = storage().ref('Photos/' + uid + '/1.jpg');
    storageRef
      .getDownloadURL()
      .then((data) => {
        global.selectedFavUserUrl = data;
        //console.log("profil photo: ", data)
        this.setState({reRender: !this.state.reRender});
        global.selectedFavUserUid = uid;
        global.selectedFavUserIndex = index;
        this.props.navigation.navigate('ProfileFavUser');
      })
      .catch(function (error) {
        //console.log(error)
      });
  }
  removeFromUser() {
    delete imageUrls[favoriteUserUids[global.selectedFavUserIndex]];
    delete favoriteUserUsernames[favoriteUserUids[global.selectedFavUserIndex]];
    database()
      .ref('Users/' + favoriteUserUids[global.selectedFavUserIndex] + '/i/u')
      .off();
    delete global.usernameListeners[
      favoriteUserUids[global.selectedFavUserIndex]
    ];
    favoriteUserUids.splice(global.selectedFavUserIndex, 1);
    noOfFavUsers = noOfFavUsers - 1;
    global.removeFromFavUser = false;
    global.favoriteUsersListeners = global.favoriteUsersListeners - 1;
    this.setState({reRender: !this.state.reRender});
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'favoriteUsers',
      JSON.stringify(favoriteUserUids),
    );
  }

  render() {
    var lang = language[global.lang];
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
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
            whichScreen={'FavoriteUsers'}
            onPress={() => this.goBack()}
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
              opacity: this.state.loadingOpacity,
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
          }}>
          <ModifiedStatusBar />

          <CustomHeader
            whichScreen={'FavoriteUsers'}
            onPress={() => this.goBack()}
            isFilterVisible={this.state.showFilter}
            title={lang.FavoriteUsers}></CustomHeader>

          <EditBox
            editButtonPressed={() => this.editButtonPressed()}
            messageSelectAll={() => this.selectAll()}
            messageDoneDisabled={this.state.doneDisabled}
            messageDonePress={() => this.donePress()}
            editText={this.state.editText}
            allSelected={this.state.allSelected}
            messageArray={noOfFavUsers == 0 ? [] : [1]}
            whichScreen={'left'}
            editPressed={this.state.editPressed}
          />

          <FlatList
            style={{
              height:
                this.height -
                this.width / 7 -
                this.width / 9 -
                headerHeight -
                getStatusBarHeight(),
              width: this.width,
              flex: 1,
              flexDirection: 'column',
            }}
            renderItem={() => this.renderFavoriteUserBoxes()}
            data={[{bos: 'boş', key: 'key'}]}
            refreshing={true}></FlatList>
        </SafeAreaView>
      );
    }
  }
}
