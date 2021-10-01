import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import RNRestart from 'react-native-restart';
import {connect} from 'react-redux';
import {updateChat} from '../Redux/Actions';
import {
  NavigationContainer,
  CommonActions,
  navigation,
  StackActions,
} from '@react-navigation/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {NavigationEvents} from 'react-navigation';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  AppState,
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import ChatScreen from './Chat';
import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';

import MessageBox from '../Components/Messaging/Messages/MessageBox/MessageBox';
import EditBox from '../Components/Messaging/Messages/EditBox/EditBox';
import MessageSwitchButton from '../Components/Messaging/Messages/MessageSwitchButton/MessageSwitchButton';
import DeleteMessageModal from '../Components/Messaging/Messages/DeleteMessage/DeleteMessageModal';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var snapshotListener;
var playerIdListener;
var lang = language[global.lang];
var testVar = 0;
var syncRef;
var didSync = false;
var afterDelete = false;
var scrollViewHeight =
  this.height -
  this.width / 7 -
  this.width / 9 -
  headerHeight -
  getStatusBarHeight();
var doneMessageColor = 'rgba(128,128,128,1)';
var doneRequestColor = 'rgba(128,128,128,1)';
var messageColorArray = [];
var requestColorArray = [];
var localMessages = [];
var messageLastSeenArray = [];
var requestLastSeenArray = [];
var newRequest = false;
var uidArray = [];
var dataArray = [];
var noOfConversations = -1;
var otherUserUid = '';
var count = 0;
var nonRequestUids = [];
var messageArray = [];
var noOfNonRequests = 0;
var requestArray = [];
var photoArray = [];
var requestPhotoArray = [];
var messagePhotoArray = [];
var requestUsernameArray = [];
var messageUsernameArray = [];
var conversationUidArray = [];
var conversationUsernameArray = [];
var differenceArray = [];
var differenceArrayIndexes = [];
var urlArray = [];
var fromChat = false;
var usernameListener = [];
class MessagesScreen extends Component<{}> {
  constructor(props) {
    super(props);
    lang = language[global.lang];
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      appState: AppState.currentState,
      deleteModalVisible: false,
      allSelected: false,
      reRender: 'ok',
      messageDoneDisabled: true,
      requestDoneDisabled: true,
      messageBoxDisabled: false,
      editPressed: false,
      cancelPressed: false,
      editText: 'Edit',
      test: '',
      loadingOpacity: 1,
      backgroundColor: 'rgba(181,181,181,1)',
      whichScreen: 'left',
      leftButtonOpacity: 0.6,
      leftButtonDisabled: true,

      rightButtonSize: this.width / 6,
      rightButtonRight: (this.width / 8) * 2 - this.width / 48,

      leftButtonSize: this.width / 8,
      leftButtonLeft: (this.width / 8) * 2,
      rightButtonOpacity: 1,
      rightButtonDisabled: false,
      loadingDone: false,
    };
    this.leftAnimation = new Animated.Value(-this.width * (3 / 16));
    //this.navigateToChat = this.navigateToChat.bind(this);
    this.spinValue = new Animated.Value(0);
    this.doesExist = false;
    scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
  }
  componentDidMount() {
    this.initializeVars();
    lang = language[global.lang];
    global.newMsgListenerArray = [];
    AppState.addEventListener('change', this._handleAppStateChange);
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      global.fromChatOfUid = '';
      global.fromMessages = true;
      scrollViewHeight =
        this.height -
        this.width / 7 -
        this.width / 9 -
        headerHeight -
        getStatusBarHeight();
      newRequest = false;
      if (global.messagesFirstTime) {
        this.initializeMessageScreen();
      } else {
        if (global.fromChat || global.enteredChatFromMain) {
          this.startFromLocal();
        } else {
          this.setState({
            loadingDone: true,
            loadingOpacity: 0,
            editPressed: false,
            cancelPressed: false,
            editText: 'Edit',
            messageBoxDisabled: false,
          });
        }
      }
    });

    this._subscribe = this.props.navigation.addListener('blur', async () => {
      this.messageBoxAnimation('reset');
      this.spinAnimation();
      this.resetTrashColors();
      this.setState({
        editPressed: false,
        cancelPressed: false,
        editText: 'Edit',
        messageBoxDisabled: false,
      });
    });
  }
  componentWillUnmount() {
    this.resetVariables();
  }

  static navigationOptions = {
    header: null,
  };
  _handleAppStateChange = (nextAppState) => {
    if (
      (this.state.appState == 'inactive' ||
        this.state.appState == 'background') &&
      nextAppState === 'active'
    ) {
    }
    if (
      (nextAppState == 'inactive' || nextAppState == 'background') &&
      this.state.appState === 'active'
    ) {
      if (Platform.OS === 'ios') {
        this.props.navigation.navigate('Tabs', {screen: 'Main'});
        this.turnOffAllListeners();
      }
    }
    this.setState({appState: nextAppState});
  };

  resetTrashColors() {
    for (let i = 0; i < requestColorArray.length; i++) {
      requestColorArray[i] = 'trashgray';
    }
    for (let i = 0; i < messageColorArray.length; i++) {
      messageColorArray[i] = 'trashgray';
    }
  }
  initializeVars() {
    testVar = 0;
    didSync = false;
    afterDelete = false;
    scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    doneMessageColor = 'rgba(128,128,128,1)';
    doneRequestColor = 'rgba(128,128,128,1)';
    messageColorArray = [];
    requestColorArray = [];
    localMessages = [];
    messageLastSeenArray = [];
    requestLastSeenArray = [];
    newRequest = false;
    uidArray = [];
    dataArray = [];
    noOfConversations = -1;
    otherUserUid = '';
    count = 0;
    nonRequestUids = [];
    messageArray = [];
    noOfNonRequests = 0;
    requestArray = [];
    photoArray = [];
    requestPhotoArray = [];
    messagePhotoArray = [];
    requestUsernameArray = [];
    messageUsernameArray = [];
    conversationUidArray = [];
    conversationUsernameArray = [];
    differenceArray = [];
    differenceArrayIndexes = [];
    urlArray = [];
    fromChat = false;
    usernameListener = [];
  }
  messageBoxAnimation(reset) {
    // reset is to reset the message box position when leaving the screen
    if (this.state.editText == 'Cancel' || reset == 'reset') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: -this.width * (3 / 16),
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (this.state.editText == 'Edit') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }
  updateState = () => {
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };
  resetVariables() {
    if (!newRequest) {
      afterDelete = false;
      doneRequestColor = 'rgba(128,128,128,1)';
      doneMessageColor = 'rgba(128,128,128,1)';
      messageColorArray = [];
      requestColorArray = [];
      localMessages = [];
      localMessagesDouble = [];
      messageLastSeenArray = [];
      requestLastSeenArray = [];
      uidArray = [];
      dataArray = [];
      nonRequestUids = [];
      messageArray = [];
      requestArray = [];
      photoArray = [];
      requestPhotoArray = [];
      messagePhotoArray = [];
      requestUsernameArray = [];
      messageUsernameArray = [];
      conversationUidArray = [];
      conversationUsernameArray = [];
      differenceArray = [];
      differenceArrayIndexes = [];
      urlArray = [];

      noOfConversations = -1;
      noOfNonRequests = 0;
      otherUserUid = '';
      count = 0;
      this.doesExist = false;
      fromChat = false;
      messageColorArray.splice(0, messageColorArray.length);
      requestColorArray.splice(0, requestColorArray.length);
      messageLastSeenArray.splice(0, messageLastSeenArray.length);
      requestLastSeenArray.splice(0, messageLastSeenArray.length);
      uidArray.splice(0, uidArray.length);
      dataArray.splice(0, dataArray.length);
      nonRequestUids.splice(0, nonRequestUids.length);
      messageArray.splice(0, messageArray.length);
      requestArray.splice(0, requestArray.length);
      photoArray.splice(0, photoArray.length);
      requestPhotoArray.splice(0, requestPhotoArray.length);
      messagePhotoArray.splice(0, messagePhotoArray.length);
      requestUsernameArray.splice(0, requestUsernameArray.length);
      messageUsernameArray.splice(0, messageUsernameArray.length);
      conversationUidArray.splice(0, conversationUidArray.length);
      conversationUsernameArray.splice(0, conversationUsernameArray.length);
      differenceArray.splice(0, differenceArray.length);
      differenceArrayIndexes.splice(0, differenceArrayIndexes.length);
      urlArray.splice(0, urlArray.length);
      this.setState({
        allSelected: false,
        messageDoneDisabled: true,
        requestDoneDisabled: true,
        messageBoxDisabled: false,
        editPressed: false,
        cancelPressed: false,
        test: '',
        loadingOpacity: 1,
        backgroundColor: 'rgba(181,181,181,1)',
        loadingDone: false,
        editText: 'Edit',
      });
    }
  }
  async initializeMessageScreen() {
    this.resetVariables();
    this.spinAnimation();
    await this.createConversationArrays();
  }
  async startFromLocal() {
    newRequest = false;
    await this.resetVariables();
    await this.spinAnimation();
    var localUids = [];
    localUids.splice(0, localUids.length);
    await EncryptedStorage.getItem(auth().currentUser.uid + 'message_uids')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => (localUids = json));

    if (localUids != undefined && localUids != null) {
      conversationUidArray = localUids;
      noOfConversations = conversationUidArray.length;

      await this.getUsernameOfTheUid();

      uidArray = await this.createUidPhotoArrays();
      await this.printMessagesData();
      newRequest = true;
    } else {
      this.setState({
        loadingDone: true,
        loadingOpacity: 0,
        backgroundColor: 'white',
        editPressed: false,
        cancelPressed: false,
      });
    }
  }

  async updatePlayerIds(snapshot, index) {
    playerIdListener = database()
      .ref('/PlayerIds/' + conversationUidArray[index])
      .on('child_changed', (snap) => {
        global.playerIdArray[conversationUidArray[index]] = snap.val();
        //EncryptedStorage.setItem(conversationUidArray[index] + "playerId", snap.val())
      });
  }

  async getUsernameOfTheUid() {
    if (global.messagesFirstTime) {
      global.fromChatOfUid = '';
      var localUsernames = [];
      await EncryptedStorage.getItem(
        auth().currentUser.uid + 'message_usernames',
      )
        .then((req) => {
          if (req) {
            return JSON.parse(req);
          } else {
            return null;
          }
        })
        .then((json) => (localUsernames = json));

      for (let i = 0; i < noOfConversations; i++) {
        var usernameOnceListener = database().ref(
          'Users/' + conversationUidArray[i] + '/i',
        );
        await usernameOnceListener.once('value').then(async (snapshot) => {
          conversationUsernameArray[i] = snapshot.val();
          await this.updatePlayerIds(snapshot, i);
        });
        //console.log('conversationusernameArray:', conversationUsernameArray[i]);
        const index = i;
        usernameListener[i] = database().ref(
          'Users/' + conversationUidArray[i],
        );
        await EncryptedStorage.setItem(
          auth().currentUser.uid + 'message_usernames',
          JSON.stringify(conversationUsernameArray),
        );
        await usernameListener[i].on(
          'child_changed',
          async (snap) =>
            await this.createUsernameArray(
              snap,
              index,
              conversationUidArray[index],
            ),
        );
      }

      if (localUsernames != null) {
        for (let i = 0; i < localUsernames.length; i++) {
          if (conversationUsernameArray[i].p != localUsernames[i].p) {
            var downloadURL;
            var storageRef = storage().ref(
              'Photos/' + conversationUidArray[i] + '/1.jpg',
            );
            await storageRef.getDownloadURL().then((data) => {
              downloadURL = data;
            });
            let dirs = RNFetchBlob.fs.dirs;
            await RNFetchBlob.config({
              fileCache: true,
              appendExt: 'jpg',
              path:
                dirs.DocumentDir + '/' + conversationUidArray[i] + 'y' + '.jpg',
            }).fetch('GET', downloadURL, {
              //some headers ..
            });
          }
        }
      }
    } else {
      if (newRequest) {
        var localUsernames = [];
        await EncryptedStorage.getItem(
          auth().currentUser.uid + 'message_usernames',
        )
          .then((req) => {
            if (req) {
              return JSON.parse(req);
            } else {
              return null;
            }
          })
          .then((json) => (localUsernames = json));
        conversationUsernameArray = localUsernames;

        if (conversationUsernameArray == null) {
          conversationUsernameArray = [];
        }
        usernameListener[noOfConversations - 1] = database().ref(
          'Users/' + conversationUidArray[noOfConversations - 1],
        );
        await usernameListener[noOfConversations - 1].on(
          'child_changed',
          async (snap) =>
            await this.createUsernameArray(
              snap,
              noOfConversations - 1,
              conversationUidArray[noOfConversations - 1],
            ),
        );
        var usernameOnceListener = database().ref(
          'Users/' + conversationUidArray[noOfConversations - 1] + '/i',
        );
        await usernameOnceListener.once('value').then(async (snapshot) => {
          if (conversationUsernameArray.length == 0) {
            conversationUsernameArray[0] = snapshot.val();
          } else {
            conversationUsernameArray.push(snapshot.val());
          }
          await this.updatePlayerIds(
            snapshot,
            conversationUsernameArray.length - 1,
          );
        });
        await EncryptedStorage.setItem(
          auth().currentUser.uid + 'message_usernames',
          JSON.stringify(conversationUsernameArray),
        );
      } else {
        if (!global.comingFromChat && !global.enteredChatFromMain) {
          global.fromChatOfUid = '';
        }
        global.enteredChatFromMain = false;
        global.comingFromChat = false;
        var localUsernames = [];
        await EncryptedStorage.getItem(
          auth().currentUser.uid + 'message_usernames',
        )
          .then((req) => {
            if (req) {
              return JSON.parse(req);
            } else {
              return null;
            }
          })
          .then((json) => (localUsernames = json));
        conversationUsernameArray = localUsernames;
        newRequest = true;
      }
    }
  }
  createUsernameArray = async (snap, i, conversationUid) => {
    var localUsernames = [];
    await EncryptedStorage.getItem(auth().currentUser.uid + 'message_usernames')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => (localUsernames = json));
    conversationUsernameArray = localUsernames;

    if (conversationUsernameArray[i].p != snap.val().p) {
      var downloadURL;
      var storageRef = storage().ref('Photos/' + conversationUid + '/1.jpg');
      await storageRef.getDownloadURL().then((data) => {
        downloadURL = data;
      });
      let dirs = RNFetchBlob.fs.dirs;
      await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
        path: dirs.DocumentDir + '/' + conversationUid + 'y' + '.jpg',
      }).fetch('GET', downloadURL, {
        //some headers ..
      });
    }
    await this.updatePlayerIds(snap, i);
    conversationUsernameArray[i] = snap.val();

    EncryptedStorage.setItem(
      auth().currentUser.uid + 'message_usernames',
      JSON.stringify(conversationUsernameArray),
    );
    this.startFromLocal();
  };
  async createConversationArrays() {
    var db = firestore();
    var docRef = db
      .collection(auth().currentUser.uid)
      .doc('MessageInformation');
    snapshotListener = await docRef.onSnapshot(async (doc) => {
      if (!afterDelete) {
        if (!newRequest) {
          if (doc.exists) {
            conversationUidArray = await doc.data()['UidArray'];
            noOfConversations = conversationUidArray.length;
            for (let i = 0; i < noOfConversations; i++) {
              global.newMsgListenerArray[i] = {
                isOpen: false,
                uid: conversationUidArray[i],
                listenerID: '',
              };
            }
            await this.getUsernameOfTheUid();
            uidArray = await this.createUidPhotoArrays();
            await this.printMessagesData();
            newRequest = true;
            global.messagesFirstTime = false;
          } else {
            newRequest = true;
            global.messagesFirstTime = false;
            this.setState({
              loadingDone: true,
              loadingOpacity: 0,
              backgroundColor: 'white',
              editPressed: false,
              cancelPressed: false,
            });
          }
        } else {
          await this.resetVariables();
          await this.spinAnimation();
          conversationUidArray = await doc.data()['UidArray'];
          (noOfConversations = conversationUidArray.length),
            (global.addedMsgs[
              conversationUidArray[noOfConversations - 1]
            ] = []);
          global.newMsgListenerArray[noOfConversations - 1] = {
            isOpen: false,
            uid: conversationUidArray[noOfConversations - 1],
            listenerID: '',
          };

          await this.getUsernameOfTheUid();
          uidArray = await this.createUidPhotoArrays();
          await this.printMessagesData();
          global.messagesFirstTime = false;
        }
      }
    });
  }
  async createUidPhotoArrays() {
    differenceArrayIndexes = [];
    differenceArrayIndexes.splice(0, differenceArrayIndexes.length);
    urlArray = [];
    urlArray.splice(0, urlArray.length);
    // GET THE UIDS THAT ARE SAVED TO LOCAL
    var localUids = [];
    localUids.splice(0, localUids.length);
    await EncryptedStorage.getItem(auth().currentUser.uid + 'message_uids')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => (localUids = json));

    if (localUids != null && localUids != undefined && localUids.length != 0) {
      if (
        conversationUidArray.concat().sort().join(',') ===
        localUids.concat().sort().join(',')
      ) {
      } else {
        differenceArray = conversationUidArray.filter(
          (x) => !localUids.includes(x),
        );
        EncryptedStorage.setItem(
          auth().currentUser.uid + 'message_uids',
          JSON.stringify(conversationUidArray),
        );
        EncryptedStorage.setItem(
          auth().currentUser.uid + 'message_usernames',
          JSON.stringify(conversationUsernameArray),
        );
        for (let i = 0; i < conversationUidArray.length; i++) {
          for (let j = 0; j < differenceArray.length; j++) {
            if (conversationUidArray[i] == differenceArray[j]) {
              differenceArrayIndexes.push(i);
            }
          }
        }
        for (let i = 0; i < differenceArray.length; i++) {
          var storageRef = storage().ref(
            'Photos/' +
              conversationUidArray[differenceArrayIndexes[i]] +
              '/1.jpg',
          );
          await storageRef.getDownloadURL().then((data) => {
            urlArray.push(data);
          });
          let dirs = RNFetchBlob.fs.dirs;
          await RNFetchBlob.config({
            fileCache: true,
            appendExt: 'jpg',
            path: dirs.DocumentDir + '/' + differenceArray[i] + 'y' + '.jpg',
          }).fetch('GET', urlArray[i], {
            //some headers ..
          });
        }
      }
    } else {
      //console.log('localde mesaj yok');
      differenceArray = conversationUidArray;
      EncryptedStorage.setItem(
        auth().currentUser.uid + 'message_uids',
        JSON.stringify(conversationUidArray),
      );
      EncryptedStorage.setItem(
        auth().currentUser.uid + 'message_usernames',
        JSON.stringify(conversationUsernameArray),
      );
      for (let i = 0; i < conversationUidArray.length; i++) {
        for (let j = 0; j < differenceArray.length; j++) {
          if (conversationUidArray[i] == differenceArray[j]) {
            differenceArrayIndexes.push(i);
          }
        }
      }
      for (let i = 0; i < differenceArray.length; i++) {
        var storageRef = storage().ref(
          'Photos/' + conversationUidArray[i] + '/1.jpg',
        );
        await storageRef.getDownloadURL().then((data) => {
          urlArray.push(data);
        });
        let dirs = RNFetchBlob.fs.dirs;
        await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'jpg',
          path: dirs.DocumentDir + '/' + differenceArray[i] + 'y' + '.jpg',
        }).fetch('GET', urlArray[i], {
          //some headers ..
        });
      }
    }
    for (let i = 0; i < conversationUidArray.length; i++) {
      let dirs = RNFetchBlob.fs.dirs;
      photoArray[i] =
        'file://' +
        dirs.DocumentDir +
        '/' +
        conversationUidArray[i] +
        'y' +
        '.jpg' +
        '?' +
        new Date();
    }
    return conversationUidArray;
  }
  async printMessagesData() {
    count = 0;
    while (count < noOfConversations) {
      otherUserUid = uidArray[count];
      await this.getMessagesData();
      count++;
    }
  }

  getMessagesData = async (callback) => {
    var isEmpty = false;
    var arr = [];
    arr.splice(0, arr.length);
    arr[0] = auth().currentUser.uid;
    arr[1] = uidArray[count];
    arr.sort();
    var key = arr[0] + '' + arr[1];

    var listener23 = database()
      .ref('Messages/' + auth().currentUser.uid + '/' + uidArray[count])
      .orderByKey()
      .endAt('A')
      .startAt('-')
      .limitToLast(1);
    await listener23.once('value').then(async (snapshot) => {
      var data = '';
      var lang = language[global.lang];
      var emptyMessage;
      if (snapshot.val() == null || snapshot.val() == undefined) {
        isEmpty = true;
        var localMsgs = [];
        await EncryptedStorage.getItem(
          auth().currentUser.uid + uidArray[count] + '/messages',
        )
          .then((req) => {
            if (req) {
              return JSON.parse(req);
            } else {
              return null;
            }
          })
          .then((json) => (localMsgs = json));

        if (
          localMsgs != null &&
          localMsgs != undefined &&
          localMsgs.length != 0
        ) {
          data = localMsgs[localMsgs.length - 1];
        } else {
          data = {
            c: 'notime',
            id: 'emptymsgid',
            _id: 'emptymsgid',
            text: lang.NoMessage,
            user: {_id: auth().currentUser.uid, r: uidArray[count]},
            image: '',
          };
        }
      } else {
        var snapVal = snapshot.val();
        var messageKey = Object.keys(snapVal)[0];
        const user = {_id: uidArray[count], r: auth().currentUser.uid};
        const {p: p, c: numberStamp, text} = snapVal[messageKey];
        const id = messageKey;
        const _id = messageKey; //needed for giftedchat
        const c = numberStamp;
        const createdAt = new Date(numberStamp);

        var image = '';
        if (p == 't') {
          image =
            'file://' +
            RNFS.DocumentDirectoryPath +
            '/' +
            auth().currentUser.uid +
            '/' +
            messageKey +
            '.jpg';
        }
        const message = {
          c,
          id,
          _id,
          createdAt,
          text,
          user,
          image,
        };
        data = message;
      }
      //ELSE İN DIŞI
      messageArray.splice(0, messageArray.length);
      requestArray.splice(0, requestArray.length);

      if (!fromChat && data != '') {
        if (dataArray.length < noOfConversations) {
          dataArray[count] = data;
        }
        var newMsgIndex;
        if (dataArray.length == noOfConversations) {
          for (let i = 0; i < noOfConversations; i++) {
            if (
              (data.user.r == dataArray[i].user.r &&
                data.user._id == dataArray[i].user._id) ||
              (data.user.r == dataArray[i].user._id &&
                data.user._id == dataArray[i].user.r)
            ) {
              dataArray[i] = data;
              break;
            }
          }
          for (let i = 0; i < noOfConversations; i++) {
            var isReq = await EncryptedStorage.getItem(
              'IsRequest/' + auth().currentUser.uid + '/' + uidArray[i],
            );
            var kVal;
            var kListener = database().ref(
              'Messages/' + auth().currentUser.uid + '/' + uidArray[i] + '/k',
            );
            await kListener.once('value').then(async (snapshot) => {
              if (snapshot.val() != null) {
                kVal = snapshot.val();
              }
            });

            var showBox = await EncryptedStorage.getItem(
              'ShowMessageBox/' + auth().currentUser.uid + '/' + uidArray[i],
            );
            if (kVal == 0) {
              isReq = 'true';
            } else {
              isReq = 'false';
            }
            this.setLocalIsRequest(uidArray[i], isReq);
            if (showBox == 'true' || showBox == undefined || showBox == null) {
              if (isReq == 'false') {
                messageArray.push(dataArray[i]);
                noOfNonRequests++;
              } else {
                requestArray.push(dataArray[i]);
              }
            }
          }
          requestArray.sort(this.sortByProperty('c'));
          requestArray.reverse();
          messageArray.sort(this.sortByProperty('c'));
          messageArray.reverse();

          // CHECKING FOR LAST SEEN
          for (let i = 0; i < requestArray.length; i++) {
            requestColorArray[i] = 'trashgray';
            var key;
            var time;
            if (requestArray[i].user._id == auth().currentUser.uid) {
              requestLastSeenArray[i] = 0;
            } else {
              key = auth().currentUser.uid + '' + requestArray[i].user._id;
              time = await EncryptedStorage.getItem(key + 'lastSeen');
              if (requestArray[i].c > time) {
                requestLastSeenArray[i] = 1;
              } else {
                requestLastSeenArray[i] = 0;
              }
            }
          }
          for (let i = 0; i < messageArray.length; i++) {
            messageColorArray[i] = 'trashgray';
            var key;
            var time;

            if (messageArray[i].user._id == auth().currentUser.uid) {
              messageLastSeenArray[i] = 0;
            } else {
              key = auth().currentUser.uid + '' + messageArray[i].user._id;
              time = await EncryptedStorage.getItem(key + 'lastSeen');
              if (messageArray[i].c > time) {
                messageLastSeenArray[i] = 1;
              } else {
                messageLastSeenArray[i] = 0;
              }
            }
          }
          for (let i = 0; i < requestArray.length; i++) {
            for (let j = 0; j < photoArray.length; j++) {
              if (
                requestArray[i].user._id == conversationUidArray[j] ||
                requestArray[i].user.r == conversationUidArray[j]
              ) {
                requestPhotoArray[i] = photoArray[j];
                requestUsernameArray[i] = conversationUsernameArray[j];
              }
            }
          }
          for (let i = 0; i < messageArray.length; i++) {
            for (let j = 0; j < photoArray.length; j++) {
              if (
                messageArray[i].user._id == conversationUidArray[j] ||
                messageArray[i].user.r == conversationUidArray[j]
              ) {
                messagePhotoArray[i] = photoArray[j];
                messageUsernameArray[i] = conversationUsernameArray[j];
              }
            }
          }

          this.setState({
            loadingDone: true,
            loadingOpacity: 0,
            backgroundColor: 'white',
            editPressed: false,
            cancelPressed: false,
          });
        }
      } else {
        this.setState({
          loadingDone: true,
          loadingOpacity: 0,
          backgroundColor: 'white',
          editPressed: false,
          cancelPressed: false,
        });
      }
    });
    var lastLocalKey = await this.getLastLocalMessage();

    var uidCount = count;
    if (
      !global.newMsgListenerArray[count].isOpen &&
      global.fromChatOfUid != global.newMsgListenerArray[count].uid
    ) {
      global.listenersCreated = true;
      global.newMsgListenerArray[count].isOpen = true;
      global.newMsgListenerArray[count].listenerID = database()
        .ref('Messages/' + auth().currentUser.uid + '/' + uidArray[count])
        .orderByKey()
        .endAt('A')
        .startAt('-');
      testVar = 1;
      //console.log('LISTENER CREATED FOR:', uidArray[count]);
      await global.newMsgListenerArray[count].listenerID.on(
        'child_added',
        async (snapshot) => await this.syncLocalMessages(snapshot, uidCount),
      );
    }
  };
  async getLastLocalMessage() {
    var lastLocalKey;
    await EncryptedStorage.getItem(
      auth().currentUser.uid + otherUserUid + '/messages',
    )
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => (localMessages[count] = json));

    if (
      localMessages[count] != null &&
      localMessages[count] != undefined &&
      localMessages[count].length != 0
    ) {
      var key = localMessages[count][localMessages[count].length - 1]._id;
      lastLocalKey = key + 'z';
    } else {
      lastLocalKey = '';
    }

    return lastLocalKey;
  }
  syncLocalMessages = async (snapshot, uidCount) => {
    // remove k from snapshot data
    if (snapshot.val() != null) {
      var snapVal = snapshot.val();

      var messageKey = snapshot.key;
      await this.setShowMessageBox(uidArray[uidCount], 'true');
      // REQUEST BOZULMUŞLSA REMOVEDAN MESSAGE KEY SİLİNECEK
      database()
        .ref(
          'Messages/' +
            auth().currentUser.uid +
            '/' +
            uidArray[uidCount] +
            '/' +
            messageKey,
        )
        .remove();
      //console.log('REMOVEA GELDİ MESSAGESTA');

      const user = {_id: uidArray[uidCount], r: auth().currentUser.uid};
      //console.log('SNAP VAL:', snapVal);
      //console.log('SNAP VAL MESSAGE KEY:', 'i:', i, 'key:', messageKey);
      const {p: p, c: numberStamp, text} = snapVal;
      const id = messageKey;
      const _id = messageKey; //needed for giftedchat
      const c = numberStamp;
      const createdAt = new Date(numberStamp);

      var image = '';
      if (p == 't') {
        image =
          'file://' +
          RNFS.DocumentDirectoryPath +
          '/' +
          auth().currentUser.uid +
          '/' +
          messageKey +
          '.jpg' +
          '#' +
          new Date();
      }

      const msg = {
        c,
        id,
        _id,
        createdAt,
        text,
        user,
        image,
      };
      //console.log('LOCALE KAYDEDİLEN MESAJ KEYİ', messageKey);
      if (
        localMessages[uidCount] == null ||
        localMessages[uidCount].length == 0
      ) {
        localMessages[uidCount] = [msg];
      } else {
        localMessages[uidCount].push(msg);
      }

      EncryptedStorage.setItem(
        auth().currentUser.uid + uidArray[uidCount] + '/messages',
        JSON.stringify(localMessages[uidCount]),
      );

      if (p == 't') {
        var downloadURL;
        var storageRef = storage().ref(
          'Photos/' +
            auth().currentUser.uid +
            '/MessagePhotos/' +
            messageKey +
            '.jpg',
        );
        var fileExists = false;
        while (!fileExists) {
          await storageRef
            .getDownloadURL()
            .then((data) => {
              downloadURL = data;
              //console.log('download URL ready for:', downloadURL);
              fileExists = true;
            })
            .catch(function (error) {});
        }

        let dirs = RNFetchBlob.fs.dirs;
        RNFetchBlob.config({
          fileCache: true,
          appendExt: 'jpg',
          path:
            RNFS.DocumentDirectoryPath +
            '/' +
            auth().currentUser.uid +
            '/' +
            messageKey +
            '.jpg',
        })
          .fetch('GET', downloadURL, {
            //some headers ..
          })
          .then((data) => {
            //console.log('indirme bitti');
            this.props.updateChat();
          });
        /*if (noOfNewMsgs > 1) {
          //console.log(noOfNewMsgs, ' new message!');
          localMessages[uidCount].sort(this.sortByInteger('c'));
          //console.log('LOCAL MESSAGES:', localMessages[0]);
          await EncryptedStorage.setItem(
            auth().currentUser.uid + uidArray[uidCount] + '/messages',
            JSON.stringify(localMessages[uidCount]),
          );
        }
*/
        var kValue;
        var isRequ = await EncryptedStorage.getItem(
          'IsRequest/' + auth().currentUser.uid + '/' + uidArray[uidCount],
        );
        if (isRequ == undefined || isRequ == null || isRequ == 'true') {
          kValue = 0;
        }
        if (isRequ == 'false') {
          kValue = 1;
        }
        this.setRequestDB(uidArray[uidCount], kValue);

        //console.log('IF 0');
        // CREATE DATA ARRAY PART
        messageArray.splice(0, messageArray.length);
        requestArray.splice(0, requestArray.length);
        if (!fromChat) {
          //console.log('IF 2');
          const data =
            localMessages[uidCount][localMessages[uidCount].length - 1];
          if (dataArray.length < noOfConversations) {
            //console.log('IF 3');
            dataArray[count] = data;
          }
          if (dataArray.length == noOfConversations) {
            //console.log('IF 4');
            for (let i = 0; i < noOfConversations; i++) {
              if (
                (data.user.r == dataArray[i].user.r &&
                  data.user._id == dataArray[i].user._id) ||
                (data.user.r == dataArray[i].user._id &&
                  data.user._id == dataArray[i].user.r)
              ) {
                dataArray[i] = data;
                break;
              }
            }
            for (let i = 0; i < noOfConversations; i++) {
              var isReq = await EncryptedStorage.getItem(
                'IsRequest/' + auth().currentUser.uid + '/' + uidArray[i],
              );
              if (isReq == undefined || isReq == null || isReq == '') {
                var kVal;
                var kListener = database().ref(
                  'Messages/' +
                    auth().currentUser.uid +
                    '/' +
                    uidArray[i] +
                    '/k',
                );
                await kListener.once('value').then(async (snapshot) => {
                  if (snapshot.val() != null) {
                    kVal = snapshot.val();
                  }
                });

                if (kVal == 0) {
                  isReq = 'true';
                } else {
                  isReq = 'false';
                }
                this.setLocalIsRequest(uidArray[i], isReq);
              }
              if (isReq == 'false') {
                messageArray.push(dataArray[i]);
                noOfNonRequests++;
              } else {
                requestArray.push(dataArray[i]);
              }
            }
            requestArray.sort(this.sortByProperty('c'));
            requestArray.reverse();
            messageArray.sort(this.sortByProperty('c'));
            messageArray.reverse();

            // CHECKING FOR LAST SEEN
            for (let i = 0; i < requestArray.length; i++) {
              requestColorArray[i] = 'trashgray';
              var key;
              var time;
              if (requestArray[i].user._id == auth().currentUser.uid) {
                requestLastSeenArray[i] = 0;
              } else {
                key = auth().currentUser.uid + '' + requestArray[i].user._id;
                time = await EncryptedStorage.getItem(key + 'lastSeen');
                if (requestArray[i].c == 'notime') {
                  requestLastSeenArray[i] = 0;
                } else {
                  if (requestArray[i].c > time) {
                    requestLastSeenArray[i] = 1;
                  } else {
                    requestLastSeenArray[i] = 0;
                  }
                }
              }
            }
            for (let i = 0; i < messageArray.length; i++) {
              messageColorArray[i] = 'trashgray';
              var key;
              var time;

              if (messageArray[i].user._id == auth().currentUser.uid) {
                messageLastSeenArray[i] = 0;
              } else {
                key = auth().currentUser.uid + '' + messageArray[i].user._id;
                time = await EncryptedStorage.getItem(key + 'lastSeen');
                if (messageArray[i].c == 'notime') {
                  messageLastSeenArray[i] = 0;
                } else {
                  if (messageArray[i].c > time) {
                    messageLastSeenArray[i] = 1;
                  } else {
                    messageLastSeenArray[i] = 0;
                  }
                }
              }
            }

            for (let i = 0; i < requestArray.length; i++) {
              for (let j = 0; j < photoArray.length; j++) {
                if (requestArray[i].user._id == conversationUidArray[j]) {
                  requestPhotoArray[i] = photoArray[j];
                  requestUsernameArray[i] = conversationUsernameArray[j];
                }
              }
            }
            for (let i = 0; i < messageArray.length; i++) {
              for (let j = 0; j < photoArray.length; j++) {
                if (
                  messageArray[i].user._id == conversationUidArray[j] ||
                  messageArray[i].user.r == conversationUidArray[j]
                ) {
                  messagePhotoArray[i] = photoArray[j];
                  messageUsernameArray[i] = conversationUsernameArray[j];
                }
              }
            }
            newRequest = true;
            this.setState({
              loadingDone: true,
              test: '1',
              loadingOpacity: 0,
              backgroundColor: 'white',
              editPressed: false,
              cancelPressed: false,
              reRender: 'oke',
            });
          }
        }
      }
    }
  };

  sortByProperty(property) {
    return function (a, b) {
      if (a[property] == 'notime') {
        return -1;
      } else if (b[property] == 'notime') {
        return 1;
      } else if (a[property] > b[property]) {
        return 1;
      } else if (a[property] < b[property]) {
        return -1;
      }
      return 0;
    };
  }

  sortByInteger(property) {
    //console.log('if');
    return function (a, b) {
      if (a[property] > b[property]) {
        return 1;
      } else {
        return -1;
      }
    };
  }

  spinAnimation() {
    if (!newRequest) {
      this.setState({test: '1', editPressed: false, cancelPressed: false});
    }

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

  turnOffAllListeners() {
    global.messagesFirstTime = true;
    for (let i = 0; i < global.newMsgListenerArray.length; i++) {
      if (global.newMsgListenerArray[i].isOpen == true) {
        var x = global.newMsgListenerArray[i].listenerID;
        x.off(); //Msg Listeners
        usernameListener[i].off(); //Username Listeners
      }
    }
    snapshotListener();
    //playerIdListener.off();
  }
  navigateToChat(receiverUid, receiverPhoto, receiverUsername) {
    //console.log('navigated to chat');
    global.fromChat = true;
    global.messageRemoved = false;
    global.check = false;
    global.messageBuffer = [];
    global.localMessages = localMessages[count];
    global.receiverUid = receiverUid;
    global.receiverPhoto = receiverPhoto;
    global.receiverUsername = receiverUsername.u;
    global.receiverGender = receiverUsername.g;
    global.receiverCountry = receiverUsername.c;
    global.receiverBio = receiverUsername.b;
    global.firstMessage = false;
    for (let i = 0; i < global.newMsgListenerArray.length; i++) {
      if (global.receiverUid == global.newMsgListenerArray[i].uid) {
        global.newMsgListenerArray[i].isOpen = false;
        var x = global.newMsgListenerArray[i].listenerID;
        x.off();
      }
    }
    fromChat = true;
    this.setState({
      editPressed: false,
      cancelPressed: false,
      editText: 'Edit',
      messageBoxDisabled: false,
    });
    global.fromChatOfUid = global.receiverUid;
    this.props.navigation.navigate('Chat');
  }
  getMsgTime(timestamp) {
    var lang = language[global.lang];
    if (timestamp == 'notime') {
      return '';
    } else {
      var currentDate = new Date();
      var currentDay = currentDate.getDate();
      var currentMonth = currentDate.getMonth() + 1;
      var currentYear = currentDate.getFullYear();

      var date = new Date(timestamp);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var day = date.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();

      if (currentYear > year) {
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        return day + '.' + month + '.' + year;
      } else if (currentMonth > month) {
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        return day + '.' + month + '.' + year;
      } else if (currentDay - day > 1) {
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        return day + '.' + month + '.' + year;
      } else if (currentDay - day == 1) {
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;
        return lang.Yesterday;
      } else {
        if (minutes < 10) minutes = '0' + minutes;
        return hours + ':' + minutes;
      }
    }
  }

  renderMessageBoxes() {
    var lang = language[global.lang];
    if (messageArray.length == 0) {
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
              alignItems: 'center',
              justifyContent: 'center',
              width: this.width,
              height: scrollViewHeight / 2,
            }}>
            <Image
              source={{uri: 'sadface' + global.themeForImages}}
              style={{
                width: this.width / 2.5,
                height: this.width / 2.5,
                opacity: 0.4,
              }}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              opacity: 0.7,
              alignItems: 'center',
              width: this.width,
              height: scrollViewHeight / 4,
            }}>
            <Text
              style={{
                fontSize: (20 * this.width) / 360,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {lang.NoMessages}
            </Text>
          </View>
        </View>
      );
    } else {
      var timeArray = [];
      timeArray.splice(0, timeArray.length);
      var receiverArray = [];
      receiverArray.splice(0, receiverArray.length);
      var messages = [];
      messages.splice(0, messages.length);
      var count = 0;
      while (count < messageArray.length) {
        timeArray[count] = this.getMsgTime(messageArray[count].c);

        if (messageArray[count].user.r == auth().currentUser.uid) {
          receiverArray[count] = messageArray[count].user._id;
        } else {
          receiverArray[count] = messageArray[count].user.r;
        }

        count++;
      }
      count = 0;
      while (count < messageArray.length) {
        const temp = count;
        messages.push(
          <MessageBox
            isPhoto={
              messageArray[count].image == '' ||
              messageArray[count].image == undefined
                ? false
                : true
            }
            left={this.leftAnimation}
            color={messageColorArray[temp]}
            disabled={this.state.messageBoxDisabled}
            editPressed={this.state.editPressed}
            cancelPressed={this.state.cancelPressed}
            trashOnPress={() => this.messageTrashButtonPressed(temp)}
            onPress={() =>
              this.navigateToChat(
                receiverArray[temp],
                messagePhotoArray[temp],
                messageUsernameArray[temp],
              )
            }
            senderName={messageUsernameArray[count].u}
            lastMsg={messageArray[count].text}
            lastMsgTime={timeArray[count]}
            avatarSource={messagePhotoArray[count]}
            isSeen={messageLastSeenArray[count]}
            key={count}
          />,
        );
        count = count + 1;
      }
      return messages;
    }
  }
  renderRequestBoxes() {
    var lang = language[global.lang];
    if (requestArray.length == 0) {
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
              alignItems: 'center',
              justifyContent: 'center',
              width: this.width,
              height: scrollViewHeight / 2,
            }}>
            <Image
              source={{uri: 'sadface' + global.themeForImages}}
              style={{
                width: this.width / 2.5,
                height: this.width / 2.5,
                opacity: 0.4,
              }}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              opacity: 0.7,
              alignItems: 'center',
              width: this.width,
              height: scrollViewHeight / 4,
            }}>
            <Text
              style={{
                fontSize: (20 * this.width) / 360,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {lang.NoRequests}
            </Text>
          </View>
        </View>
      );
    } else {
      var timeArray = [];
      timeArray.splice(0, timeArray.length);
      var receiverArray = [];
      receiverArray.splice(0, receiverArray.length);
      var messages = [];
      messages.splice(0, messages.length);
      var count = 0;
      while (count < requestArray.length) {
        timeArray[count] = this.getMsgTime(requestArray[count].c);

        if (requestArray[count].user.r == auth().currentUser.uid) {
          receiverArray[count] = requestArray[count].user._id;
        } else {
          receiverArray[count] = requestArray[count].user.r;
        }

        count++;
      }
      count = 0;
      while (count < requestArray.length) {
        const temp = count;
        messages.push(
          <MessageBox
            isPhoto={
              requestArray[count].image == '' ||
              requestArray[count].image == undefined
                ? false
                : true
            }
            left={this.leftAnimation}
            color={requestColorArray[temp]}
            disabled={this.state.messageBoxDisabled}
            editPressed={this.state.editPressed}
            cancelPressed={this.state.cancelPressed}
            trashOnPress={() => this.requestTrashButtonPressed(temp)}
            onPress={() =>
              this.navigateToChat(
                receiverArray[temp],
                requestPhotoArray[temp],
                requestUsernameArray[temp],
              )
            }
            senderName={requestUsernameArray[count].u}
            lastMsg={requestArray[count].text}
            lastMsgTime={timeArray[count]}
            avatarSource={requestPhotoArray[count]}
            isSeen={requestLastSeenArray[count]}
            key={count}
          />,
        );
        count = count + 1;
      }
      return messages;
    }
  }
  editButtonPressed() {
    if (this.state.editText == 'Edit') {
      this.setState({
        allSelected: false,
        messageDoneDisabled: true,
        requestDoneDisabled: true,
        editText: 'Cancel',
        editPressed: true,
        cancelPressed: false,
        messageBoxDisabled: true,
      });
      this.messageBoxAnimation();
    } else {
      this.setState({
        allSelected: false,
        messageDoneDisabled: true,
        requestDoneDisabled: true,
        editText: 'Edit',
        editPressed: false,
        cancelPressed: true,
        messageBoxDisabled: false,
      });
      this.messageBoxAnimation();
      for (let i = 0; i < requestColorArray.length; i++) {
        requestColorArray[i] = 'trashgray';
      }
      for (let i = 0; i < messageColorArray.length; i++) {
        messageColorArray[i] = 'trashgray';
      }
      doneMessageColor = 'rgba(128,128,128,1)';
      doneRequestColor = 'rgba(128,128,128,1)';
    }
  }
  requestTrashButtonPressed(count) {
    if (requestColorArray[count] == 'trashgray') {
      requestColorArray[count] = 'trash' + global.themeForImages;
    } else {
      requestColorArray[count] = 'trashgray';
    }
    var trashGrayCount = 0;
    var trashColoredCount = 0;
    for (let i = 0; i < requestColorArray.length; i++) {
      if (requestColorArray[i] == 'trashgray') {
        trashGrayCount++;
      } else {
        trashColoredCount++;
      }
    }
    if (trashGrayCount == requestColorArray.length) {
      this.setState({allSelected: false});
    }
    if (trashColoredCount == requestColorArray.length) {
      this.setState({allSelected: true});
    }
    this.arrangeDoneColor();
  }

  messageTrashButtonPressed(count) {
    if (messageColorArray[count] == 'trashgray') {
      messageColorArray[count] = 'trash' + global.themeForImages;
    } else {
      messageColorArray[count] = 'trashgray';
    }
    var trashGrayCount = 0;
    var trashColoredCount = 0;
    for (let i = 0; i < messageColorArray.length; i++) {
      if (messageColorArray[i] == 'trashgray') {
        trashGrayCount++;
      } else {
        trashColoredCount++;
      }
    }
    if (trashGrayCount == messageColorArray.length) {
      this.setState({allSelected: false});
    }
    if (trashColoredCount == messageColorArray.length) {
      this.setState({allSelected: true});
    }
    this.arrangeDoneColor();
  }

  switchButtonPressed(whichButtonPressed) {
    if (whichButtonPressed == 'left') {
      doneMessageColor = 'rgba(128,128,128,1)';
      doneRequestColor = 'rgba(128,128,128,1)';
      this.setState({
        messageDoneDisabled: true,
        requestDoneDisabled: true,
        leftButtonSize: this.width / 8,
        leftButtonLeft: (this.width / 8) * 2,
        whichScreen: 'left',
        leftButtonOpacity: 0.6,
        rightButtonSize: this.width / 6,
        rightButtonRight: (this.width / 8) * 2 - this.width / 48,
        leftButtonDisabled: true,
        rightButtonOpacity: 1,
        rightButtonDisabled: false,
        editPressed: false,
        cancelPressed: false,
      });
    } else {
      doneMessageColor = 'rgba(128,128,128,1)';
      doneRequestColor = 'rgba(128,128,128,1)';
      this.setState({
        messageDoneDisabled: true,
        requestDoneDisabled: true,
        rightButtonSize: this.width / 8,
        rightButtonRight: (this.width / 8) * 2,
        whichScreen: 'right',
        rightButtonOpacity: 0.6,
        leftButtonSize: this.width / 6,
        leftButtonLeft: (this.width / 8) * 2 - this.width / 48,
        rightButtonDisabled: true,
        leftButtonOpacity: 1,
        leftButtonDisabled: false,
        editPressed: false,
        cancelPressed: false,
      });
    }
  }
  arrangeDoneColor() {
    var flag1 = false;
    var flag2 = false;
    for (let i = 0; i < messageColorArray.length; i++) {
      if (messageColorArray[i] == 'trash' + global.themeForImages) {
        flag1 = true;
        doneMessageColor = global.themeColor;
        this.setState({messageDoneDisabled: false});
        break;
      }
    }
    if (!flag1) {
      doneMessageColor = 'rgba(128,128,128,1)';
      this.setState({messageDoneDisabled: true});
    }
    for (let i = 0; i < requestColorArray.length; i++) {
      if (requestColorArray[i] == 'trash' + global.themeForImages) {
        flag2 = true;
        doneRequestColor = global.themeColor;
        this.setState({requestDoneDisabled: false});
        break;
      }
    }
    if (!flag2) {
      doneRequestColor = 'rgba(128,128,128,1)';
      this.setState({requestDoneDisabled: true});
    }
  }

  async clearMessages(uid) {
    var emptyArr = [];
    await EncryptedStorage.setItem(
      auth().currentUser.uid + uid + '/messages',
      JSON.stringify(emptyArr),
    );
  }
  async deleteMessages(uid, which) {
    await this.clearMessages(uid);
    if (which == 'messages') {
      await this.setLocalIsRequest(uid, 'true');
      await this.setRequestDB(uid, 0);
    }
    await this.setShowMessageBox(uid, 'false');
  }

  async setShowMessageBox(uid, bool) {
    await EncryptedStorage.setItem(
      'ShowMessageBox/' + auth().currentUser.uid + '/' + uid,
      bool,
    );
  }
  async setLocalIsRequest(uid, bool) {
    await EncryptedStorage.setItem(
      'IsRequest/' + auth().currentUser.uid + '/' + uid,
      bool,
    );
  }
  async setRequestDB(uid, value) {
    //console.log('set requestDB:', uid);
    await database()
      .ref('Messages/' + auth().currentUser.uid + '/' + uid)
      .update({
        k: value,
      });
  }
  async deleteMessagesPressed() {
    for (let i = 0; i < messageColorArray.length; i++) {
      if (messageColorArray[i] != 'trashgray') {
        if (messageArray[i].user.r == auth().currentUser.uid) {
          await this.deleteMessages(messageArray[i].user._id, 'messages');
        } else {
          await this.deleteMessages(messageArray[i].user.r, 'messages');
        }
      }
    }
    this.reloadPage();
  }
  async deleteRequestPressed() {
    for (let i = 0; i < requestColorArray.length; i++) {
      if (requestColorArray[i] != 'trashgray') {
        if (requestArray[i].user.r == auth().currentUser.uid) {
          await this.deleteMessages(requestArray[i].user._id, 'requests');
        } else {
          await this.deleteMessages(requestArray[i].user.r, 'requests');
        }
      }
    }
    this.reloadPage();
  }
  async clearMessagesPressed() {
    for (let i = 0; i < messageColorArray.length; i++) {
      if (messageColorArray[i] != 'trashgray') {
        if (messageArray[i].user.r == auth().currentUser.uid) {
          await this.clearMessages(messageArray[i].user._id);
        } else {
          await this.clearMessages(messageArray[i].user.r);
        }
      }
    }
    this.reloadPage();
  }
  async clearRequestPressed() {
    for (let i = 0; i < requestColorArray.length; i++) {
      if (requestColorArray[i] != 'trashgray') {
        if (requestArray[i].user.r == auth().currentUser.uid) {
          await this.clearMessages(requestArray[i].user._id);
        } else {
          await this.clearMessages(requestArray[i].user.r);
        }
      }
    }
    this.reloadPage();
  }

  reloadPage() {
    this.startFromLocal();
    this.leftAnimation = new Animated.Value(-this.width * (3 / 16));
    this.setState({
      deleteModalVisible: false,
      allSelected: false,
      messageDoneDisabled: true,
      requestDoneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
      messageBoxDisabled: false,
    });
  }
  requestDonePress() {
    this.setState({deleteModalVisible: true});
  }
  messageDonePress() {
    this.setState({deleteModalVisible: true});
  }
  messageSelectAll() {
    if (this.state.allSelected) {
      for (let i = 0; i < messageArray.length; i++) {
        messageColorArray[i] = 'trashgray';
      }
      this.setState({
        allSelected: !this.state.allSelected,
        messageDoneDisabled: true,
      });
    } else {
      for (let i = 0; i < messageArray.length; i++) {
        messageColorArray[i] = 'trash' + global.themeForImages;
      }
      this.setState({
        allSelected: !this.state.allSelected,
        messageDoneDisabled: false,
      });
    }
  }
  requestSelectAll() {
    if (this.state.allSelected) {
      for (let i = 0; i < requestArray.length; i++) {
        requestColorArray[i] = 'trashgray';
      }
      this.setState({
        allSelected: !this.state.allSelected,
        requestDoneDisabled: true,
      });
    } else {
      for (let i = 0; i < requestArray.length; i++) {
        requestColorArray[i] = 'trash' + global.themeForImages;
      }
      this.setState({
        allSelected: !this.state.allSelected,
        requestDoneDisabled: false,
      });
    }
  }
  render() {
    var lang = language[global.lang];
    const {navigate} = this.props.navigation;

    scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    if (!this.state.loadingDone) {
      // IF PAGE IS LOADING
      return (
        <SafeAreaView
          style={{
            width: this.width,
            height: this.height,
            top: 0,
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
          }}>
          <ModifiedStatusBar />
          <CustomHeader
            editPressed={this.state.editText}
            onPress={() =>
              this.switchButtonPressed(
                this.state.whichScreen == 'left' ? 'right' : 'left',
              )
            }
            whichScreen={'Messages'}
            title={
              this.state.whichScreen == 'left' ? lang.Messages : lang.Requests
            }
          />

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
      // PAGE IS LOADED
      return (
        <SafeAreaView
          style={{
            width: this.width,
            height: this.height,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
          }}>
          <ModifiedStatusBar />

          <CustomHeader
            editPressed={this.state.editText}
            onPress={() =>
              this.switchButtonPressed(
                this.state.whichScreen == 'left' ? 'right' : 'left',
              )
            }
            whichScreen={'Messages'}
            title={
              this.state.whichScreen == 'left' ? lang.Messages : lang.Requests
            }
          />

          <EditBox
            editButtonPressed={() => this.editButtonPressed()}
            messageSelectAll={() => this.messageSelectAll()}
            messageDoneDisabled={this.state.messageDoneDisabled}
            messageDonePress={() => this.messageDonePress()}
            editText={this.state.editText}
            allSelected={this.state.allSelected}
            requestSelectAll={() => this.requestSelectAll()}
            requestDoneDisabled={this.state.requestDoneDisabled}
            requestDonePress={() => this.messageDonePress()}
            messageArray={messageArray}
            requestArray={requestArray}
            whichScreen={this.state.whichScreen}
            editPressed={this.state.editPressed}
          />

          <FlatList
            style={{
              height: scrollViewHeight,
              width: this.width,
              right: 0,
              bottom: 0,
              position: 'absolute',
              flex: 1,
              flexDirection: 'column',
            }}
            renderItem={
              this.state.whichScreen == 'left'
                ? () => this.renderMessageBoxes()
                : () => this.renderRequestBoxes()
            }
            data={[{bos: 'boş', key: 'key'}]}></FlatList>

          <DeleteMessageModal
            onPressClose={() => this.setState({deleteModalVisible: false})}
            isVisible={this.state.deleteModalVisible}
            onPressClear={
              this.state.whichScreen == 'left'
                ? () => this.clearMessagesPressed()
                : () => this.clearRequestPressed()
            }
            onPressDelete={
              this.state.whichScreen == 'left'
                ? () => this.deleteMessagesPressed()
                : () => this.deleteRequestPressed()
            }
            txtAlert={lang.ChooseAnOption}
          />
        </SafeAreaView>
      );
    }
  }
}
const mapStateToProps = (state) => ({
  _state: state,
});
const mapActionsToProps = {
  updateChat,
};
export default connect(mapStateToProps, mapActionsToProps)(MessagesScreen);
