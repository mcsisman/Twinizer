import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import {navigate, route} from './RootNavigation';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
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

import ProfileBlockedUserScreen from './ProfileBlockedUser';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import BlockedUserBox from '../Components/Settings/BlockedUsers/BlockedUserBox';
import EditBox from '../Components/Messaging/Messages/EditBox/EditBox';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var blockedUserUids = [];
var blockedUserUsernames = {};
var usernameListener = [];
var noOfBlockedUsers;
var colorArray = [];
var imageUrls = {};
var focusedtoThisScreen = false;
var lang = language[global.lang];
export default class BlockedUsersScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      allSelected: false,
      loadingDone: false,
      editPressed: false,
      blockedBoxDisabled: false,
      doneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
      reRender: false,
    };
    this.spinValue = new Animated.Value(0);
    this.leftAnimation = new Animated.Value(-this.width / 8);
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    lang = language[global.lang];
    this.setState({loadingDone: false});
    this.spinAnimation();
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({loadingDone: false});
      this.spinAnimation();
      focusedtoThisScreen = true;
      await this.initializeBlockedUsersScreen();
      if (
        global.changedBlockInMain ||
        Object.keys(global.usernameListeners).length == 0
      ) {
        this.updateUsernameListeners();
        global.changedBlockInMain = false;
      }
      if (global.removeFromBlockedUser) {
        this.removeFromUser();
      }
      this.leftAnimation = new Animated.Value(-this.width / 8);
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
  blockedBoxAnimation(reset) {
    if (this.state.editText == 'Cancel' || reset == 'reset') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: -this.width * (2 / 16),
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
    if (this.state.editText == 'Edit') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }

  editButtonPressed() {
    for (let i = 0; i < noOfBlockedUsers; i++) {
      colorArray[i] = 'trashgray';
    }
    if (this.state.editText == 'Edit') {
      this.setState({
        blockedBoxDisabled: true,
        doneDisabled: true,
        editText: 'Cancel',
        editPressed: true,
        cancelPressed: false,
      });
      this.blockedBoxAnimation();
    } else {
      this.setState({
        blockedBoxDisabled: false,
        doneDisabled: true,
        editText: 'Edit',
        editPressed: false,
        cancelPressed: true,
      });
      this.blockedBoxAnimation();
    }
  }

  async updateUsernameListeners() {
    var uidset = new Set(blockedUserUids);
    //console.log("updateUsernameListeners - uidset: ", uidset)
    for (let i = 0; i < blockedUserUids.length; i++) {
      //console.log("updateListeners: ", blockedUserUids[i])
      if (!global.usernameListeners[blockedUserUids[i]]) {
        global.usernameListeners[blockedUserUids[i]] = await database()
          .ref('Users/' + blockedUserUids[i] + '/i/u')
          .on(
            'value',
            async (snap) => await this.newlistener(snap, i, blockedUserUids[i]),
          );
        //console.log("global.usernameListeners[blockedUserUids[i]]: ", global.usernameListeners[blockedUserUids[i]])
      }
    }
    for ([key, val] of Object.entries(global.usernameListeners)) {
      //console.log("[key, val]: ", key)
      if (!uidset.has(key)) {
        //console.log("updateUsernameListeners - close listener for: ", key)
        database()
          .ref('Users/' + key + '/i/u')
          .off();
        delete global.usernameListeners[key];
      }
    }
  }

  newlistener = async (snap, i, conversationUid) => {
    //console.log("newlistener - conversationUid: ", conversationUid)
    if (!focusedtoThisScreen) {
      await EncryptedStorage.getItem(
        auth().currentUser.uid + 'BlockedUsernames',
      )
        .then((req) => {
          if (req) {
            return JSON.parse(req);
          } else {
            return {};
          }
        })
        .then(async (json) => {
          //console.log('newlistener - BLOCKED USERNAMES: ', json);
          blockedUserUsernames = json;
          blockedUserUsernames[conversationUid] = snap.val();
          //console.log("newlistener - blockedUserUsernames: ", blockedUserUsernames)
          await EncryptedStorage.setItem(
            auth().currentUser.uid + 'BlockedUsernames',
            JSON.stringify(blockedUserUsernames),
          );
        });
    } else {
      blockedUserUsernames[conversationUid] = snap.val();
      //console.log("newlistener (focusedtoThisScreen) - blockedUserUsernames: ", blockedUserUsernames)
      await EncryptedStorage.setItem(
        auth().currentUser.uid + 'BlockedUsernames',
        JSON.stringify(blockedUserUsernames),
      );
      this.setState({reRender: !this.state.reRender});
    }
  };

  async initializeBlockedUsersScreen() {
    await this.getBlockedUserUids();
    //console.log("global.blockedUsersListeners: ", global.blockedUsersListeners)
    //console.log("noOfBlockedUsers: ", noOfBlockedUsers)
    await this.createUsernameArray();
  }

  async getBlockedUserUids() {
    await EncryptedStorage.getItem(auth().currentUser.uid + 'blockedUsers')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => {
        blockedUserUids = json;
        if (blockedUserUids == null || blockedUserUids == undefined) {
          noOfBlockedUsers = 0;
        } else {
          noOfBlockedUsers = blockedUserUids.length;
        }
      });
    this.setState({loadingDone: true});
  }
  async createUsernameArray() {
    //console.log("createUsernameArray - entered ")
    await EncryptedStorage.getItem(auth().currentUser.uid + 'BlockedUsernames')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return {};
        }
      })
      .then((json) => {
        //console.log('createUsernameArray - BLOCKED USERNAMES: ', json);
        blockedUserUsernames = json;
        this.setState({reRender: 'ok'});
        global.blockedUsersListeners = noOfBlockedUsers;
      });
  }

  async getUsernameOfTheUid(uid, i) {
    usernameListener[i] = database().ref('Users/' + uid + '/i/u');
    const firstTotalblocks = noOfBlockedUsers;
    await usernameListener[i].on(
      'value',
      async (snap) => await this.listenerFunc(snap, i, uid, firstTotalblocks),
    );
  }
  listenerFunc = async (snap, i, conversationUid, firstTotal) => {
    //console.log("LISTENER")
    var diff = firstTotal - noOfBlockedUsers;
    blockedUserUsernames[i - diff] = snap.val();
    if (focusedtoThisScreen) {
      this.setState({reRender: !this.state.reRender});
    }
  };

  renderBlockedUserBoxes() {
    var lang = language[global.lang];
    var scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    var boxes = [];
    if (noOfBlockedUsers == 0) {
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
                fontSize: (20 * this.width) / 360,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {lang.NoBlockedUsers}
            </Text>
          </View>
        </View>
      );
    } else {
      for (let i = 0; i < noOfBlockedUsers; i++) {
        const temp = i;
        boxes.push(
          <BlockedUserBox
            left={this.leftAnimation}
            trashImage={colorArray[temp]}
            trashOnPress={() => this.trashButtonPressed(temp)}
            photoSource={imageUrls[blockedUserUids[temp]]}
            disabled={this.state.blockedBoxDisabled}
            text={blockedUserUsernames[blockedUserUids[temp]]}
            onPress={() =>
              this.select(
                imageUrls[blockedUserUids[temp]],
                blockedUserUids[temp],
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
    var alertMsg = lang.BlockedUserDeleteAlert;
    Alert.alert(
      lang.Warning,
      alertMsg,
      [
        {
          text: lang.NO,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: lang.YES, onPress: () => this.deleteBlockedUser()},
      ],
      {cancelable: false},
    );
  }

  deleteBlockedUser() {
    var limit = noOfBlockedUsers;
    for (let i = limit - 1; i >= 0; i--) {
      if (colorArray[i] == 'trash' + global.themeForImages) {
        delete imageUrls[blockedUserUids[i]];
        delete blockedUserUsernames[blockedUserUids[i]];
        database()
          .ref('Users/' + blockedUserUids[i] + '/i/u')
          .off();
        delete global.usernameListeners[blockedUserUids[i]];
        blockedUserUids.splice(i, 1);
        global.blockedUsersListeners = global.blockedUsersListeners - 1;
        noOfBlockedUsers = noOfBlockedUsers - 1;
      }
    }
    global.removedFromBlockedList = true;
    global.isBlockListUpdated = true;
    colorArray = [];
    for (let i = 0; i < noOfBlockedUsers; i++) {
      colorArray[i] = 'trashgray';
    }
    this.setState({
      blockedBoxDisabled: false,
      doneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
    });
    this.blockedBoxAnimation('reset');
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'blockedUsers',
      JSON.stringify(blockedUserUids),
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
    global.selectedBlockedUserIndex = null;
    this.props.navigation.navigate('Settings');
  }

  select(url, uid, listener, index) {
    //console.log(url)
    //console.log(uid)
    //console.log(listener)
    //console.log(index)
    //listener.off()
    global.selectedBlockedUserUid = uid;
    global.selectedBlockedUserUrl = url;
    global.selectedBlockedUserIndex = index;
    this.props.navigation.navigate('ProfileBlockedUser');
  }

  removeFromUser() {
    delete imageUrls[blockedUserUids[global.selectedBlockedUserIndex]];
    delete blockedUserUsernames[
      blockedUserUids[global.selectedBlockedUserIndex]
    ];
    database()
      .ref('Users/' + blockedUserUids[global.selectedBlockedUserIndex] + '/i/u')
      .off();
    delete global.usernameListeners[
      blockedUserUids[global.selectedBlockedUserIndex]
    ];
    blockedUserUids.splice(global.selectedBlockedUserIndex, 1);
    noOfBlockedUsers = noOfBlockedUsers - 1;
    global.removeFromBlockedUser = false;
    global.blockedUsersListeners = global.blockedUsersListeners - 1;
    this.setState({reRender: !this.state.reRender});
    EncryptedStorage.setItem(
      auth().currentUser.uid + 'blockedUsers',
      JSON.stringify(blockedUserUids),
    );
  }

  render() {
    var lang = language[global.lang];
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
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
            whichScreen={'BlockedUsers'}
            onPress={() => this.goBack()}
            isFilterVisible={this.state.showFilter}
            title={lang.BlockedUsers}></CustomHeader>

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
            whichScreen={'BlockedUsers'}
            onPress={() => this.goBack()}
            isFilterVisible={this.state.showFilter}
            title={lang.BlockedUsers}></CustomHeader>

          <EditBox
            editButtonPressed={() => this.editButtonPressed()}
            messageSelectAll={() => this.selectAll()}
            messageDoneDisabled={this.state.doneDisabled}
            messageDonePress={() => this.donePress()}
            editText={this.state.editText}
            allSelected={this.state.allSelected}
            messageArray={noOfBlockedUsers == 0 ? [] : [1]}
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
            renderItem={() => this.renderBlockedUserBoxes()}
            data={[{bos: 'boş', key: 'key'}]}
            refreshing={true}></FlatList>
        </SafeAreaView>
      );
    }
  }
}
