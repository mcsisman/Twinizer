import React, {Component} from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationEvents} from 'react-navigation';

import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob'
import * as firebase from "firebase";
import {Image,
   Text,
   View,
   Dimensions,
   TouchableOpacity,
   ImageBackground,
   StatusBar,
   SafeAreaView,
   ScrollView,
   Animated,
   Easing,
   Platform,
   Alert,
   FlatList
  } from 'react-native';
import MessageBox from './components/MessageBox'
import MessageSwitchButton from './components/MessageSwitchButton'
import ChatScreen from './Chat';
import HistoryScreen from './History';
import CustomHeader from './components/CustomHeader'
import SettingsScreen from './Settings';
import ModifiedStatusBar from './components/ModifiedStatusBar'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var syncRef;
var didSync = false
var lastDBkey;
var lastMsgFlag = false
var afterDelete = false
var scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
var doneMessageColor = 'rgba(128,128,128,1)'
var doneRequestColor = 'rgba(128,128,128,1)'
var messageColorArray = []
var requestColorArray = []
var localMessages = [];
var messageLastSeenArray = []
var requestLastSeenArray = []
var newRequest = false
var uidArray = []
var dataArray = []
var noOfConversations = -1
var otherUserUid = ""
var count = 0
var nonRequestUids = []
var messageArray = []
var noOfNonRequests = 0
var requestArray = []
var photoArray = []
var requestPhotoArray = []
var messagePhotoArray = []
var requestUsernameArray = []
var messageUsernameArray = []
var conversationUidArray = []
var conversationUsernameArray = []
var differenceArray = []
var differenceArrayIndexes = []
var urlArray = []
var fromChat = false
var usernameListener = []
export default class MessagesScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      reRender: "ok",
      messageDoneDisabled: true,
      requestDoneDisabled: true,
      messageBoxDisabled: false,
      editPressed: false,
      cancelPressed: false,
      editText: "Edit",
      test: "",
      loadingOpacity: 1,
      backgroundColor: 'rgba(181,181,181,1)',
      whichScreen: "left",
      leftButtonOpacity: 0.6,
      leftButtonDisabled: true,

      rightButtonSize: this.width/6,
      rightButtonRight: this.width/8*2-this.width/48,

      leftButtonSize: this.width/8,
      leftButtonLeft: this.width/8*2,
      rightButtonOpacity: 1,
      rightButtonDisabled: false,
      loadingDone: false
    }
    this.leftAnimation = new Animated.Value(-this.width*(3/16))
//this.navigateToChat = this.navigateToChat.bind(this);
    this.spinValue = new Animated.Value(0)
    this.doesExist = false
    scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight()
  }
componentDidMount(){
  console.log("COMPONENT DID MOUNT")
  global.newMsgListenerArray = []
  this._subscribe = this.props.navigation.addListener('focus', async () => {
    this.leftAnimation = new Animated.Value(-this.width*(3/16))
    global.fromChatOfUid = ""
    global.fromMessages = true
    scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight()
    newRequest = false
    if(global.messagesFirstTime){
      this.initializeMessageScreen()
    }
    else{
      this.startFromLocal()
    }
  })

  this._subscribe = this.props.navigation.addListener('blur', async () => {
    this.spinAnimation()
    this.setState({loadingDone: false, loadingOpacity: 1, editPressed: false, cancelPressed: false, editText: "Edit", messageBoxDisabled: false})
  })
};
componentWillUnmount(){
  console.log("AFASFAS FAS FAS FASF ASF ASF ASF ASF ASF AF ")
  this.resetVariables()
}

static navigationOptions = {
    header: null,
};

messageBoxAnimation(){
  if(this.state.editText == "Cancel"){
    Animated.timing(this.leftAnimation, {
      duration: 100,
      toValue: -this.width*(3/16),
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }
  if(this.state.editText == "Edit"){
    Animated.timing(this.leftAnimation, {
      duration: 100,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }
}
updateState = () =>{
  console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
  this.setState({reRender: "ok"})
  return "TESTTTT"
}
resetVariables(){
  if(!newRequest){
    didSync = false
    lastDBkey;
    lastMsgFlag = false
    afterDelete = false
    doneRequestColor = 'rgba(128,128,128,1)'
    doneMessageColor = 'rgba(128,128,128,1)'
    messageColorArray = []
    requestColorArray = []
    localMessages = [];
    localMessagesDouble = [];
    messageLastSeenArray = []
    requestLastSeenArray = []
    uidArray = []
    dataArray = []
    nonRequestUids = []
    messageArray = []
    requestArray = []
    photoArray = []
    requestPhotoArray = []
    messagePhotoArray = []
    requestUsernameArray = []
    messageUsernameArray = []
    conversationUidArray = []
    conversationUsernameArray = []
    differenceArray = []
    differenceArrayIndexes = []
    urlArray = []

    noOfConversations = -1
    noOfNonRequests = 0
    otherUserUid = ""
    count = 0
    this.doesExist = false
    fromChat = false
    messageColorArray.splice(0, messageColorArray.length)
    requestColorArray.splice(0, requestColorArray.length)
    messageLastSeenArray.splice(0, messageLastSeenArray.length)
    requestLastSeenArray.splice(0, messageLastSeenArray.length)
    uidArray.splice(0, uidArray.length)
    dataArray.splice(0, dataArray.length)
    nonRequestUids.splice(0, nonRequestUids.length)
    messageArray.splice(0, messageArray.length)
    requestArray.splice(0, requestArray.length)
    photoArray.splice(0, photoArray.length)
    requestPhotoArray.splice(0, requestPhotoArray.length)
    messagePhotoArray.splice(0, messagePhotoArray.length)
    requestUsernameArray.splice(0, requestUsernameArray.length)
    messageUsernameArray.splice(0, messageUsernameArray.length)
    conversationUidArray.splice(0, conversationUidArray.length)
    conversationUsernameArray.splice(0, conversationUsernameArray.length)
    differenceArray.splice(0, differenceArray.length)
    differenceArrayIndexes.splice(0, differenceArrayIndexes.length)
    urlArray.splice(0, urlArray.length)
    this.setState({
      messageDoneDisabled: true,
      requestDoneDisabled: true,
      messageBoxDisabled: false,
      editPressed: false,
      cancelPressed: false,
      test: "",
      loadingOpacity: 1,
      backgroundColor: 'rgba(181,181,181,1)',
      loadingDone: false,
      editText: "Edit"
    })
  }
}
async initializeMessageScreen(){
  this.resetVariables()
  this.spinAnimation()
  await this.createConversationArrays()
}
async startFromLocal(){
  newRequest = false
  await this.resetVariables()
  await this.spinAnimation()
  var localUids = []
  localUids.splice(0, localUids.length)
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_uids')
    .then(req => JSON.parse(req))
    .then(json => localUids = json)

  if(localUids != undefined && localUids != null){
    conversationUidArray = localUids
    noOfConversations = conversationUidArray.length

    await this.getUsernameOfTheUid()

    uidArray = await this.createUidPhotoArrays()
    await this.printMessagesData()
    newRequest = true
  }
  else{
    this.setState({loadingDone: true, loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
  }

}
async getUsernameOfTheUid(){

  if(global.messagesFirstTime){
    global.fromChatOfUid = ""
    console.log("MESSAGESA İLK DEFA GİRDİ")
    for( i = 0; i < noOfConversations; i++){
      var usernameOnceListener = firebase.database().ref('Users/' + conversationUidArray[i] + "/i");
      await usernameOnceListener.once('value').then(async snapshot => {
        if(conversationUsernameArray[i].p != snapshot.val().p){
          var downloadURL;
          var storageRef = firebase.storage().ref("Photos/" + conversationUidArray[i] + "/1.jpg")
          await storageRef.getDownloadURL().then(data =>{
            downloadURL = data
          })
          let dirs = RNFetchBlob.fs.dirs
          await RNFetchBlob
          .config({
            fileCache : true,
            appendExt : 'jpg',
            path: dirs.DocumentDir + '/' + conversationUidArray[i] + "y" + '.jpg'
          })
          .fetch('GET', downloadURL, {
            //some headers ..
          })

        }
        conversationUsernameArray[i] = snapshot.val()
      })
      const index = i
      usernameListener[i] = firebase.database().ref('Users/' + conversationUidArray[i]);
      await usernameListener[i].on('child_changed', async snap => await this.createUsernameArray(snap, index, conversationUidArray[index]));
    }
  }
  else{
    if(newRequest){
      console.log("İLK DEĞİL, NEW REQUEST")
      var localUsernames = []
      await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_usernames')
        .then(req => JSON.parse(req))
        .then(json => localUsernames = json)
      conversationUsernameArray = localUsernames

      if(conversationUsernameArray == null){
        conversationUsernameArray = []
      }
      usernameListener[noOfConversations-1] = firebase.database().ref('Users/' + conversationUidArray[noOfConversations-1]);
      await usernameListener[noOfConversations-1].on('child_changed', async snap => await this.createUsernameArray(snap, noOfConversations-1, conversationUidArray[noOfConversations-1]));
      var usernameOnceListener = firebase.database().ref('Users/' + conversationUidArray[noOfConversations-1] + "/i");
      await usernameOnceListener.once('value').then(async snapshot => {
        if(conversationUsernameArray.length == 0){
          conversationUsernameArray[0] = snapshot.val()
        }
        else{
          conversationUsernameArray.push(snapshot.val())
        }
        conversationUsernameArray
      })
      await AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
    }
    else{
      console.log("BAŞKA SAYFADAN GELDİ; İLK DEĞİL")
      if(!global.comingFromChat){
        global.fromChatOfUid = ""
      }
      global.comingFromChat = false
      var localUsernames = []
      await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_usernames')
        .then(req => JSON.parse(req))
        .then(json => localUsernames = json)
      conversationUsernameArray = localUsernames
      newRequest = true
    }
    }
}
createUsernameArray = async (snap, i, conversationUid) => {
  console.log("CREATE USERNAME ARRAY")
  var localUsernames = []
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_usernames')
    .then(req => JSON.parse(req))
    .then(json => localUsernames = json)
  conversationUsernameArray = localUsernames

  if(conversationUsernameArray[i].p != snap.val().p){
    var downloadURL;
    var storageRef = firebase.storage().ref("Photos/" + conversationUid + "/1.jpg")
    await storageRef.getDownloadURL().then(data =>{
      downloadURL = data
    })
    let dirs = RNFetchBlob.fs.dirs
    await RNFetchBlob
    .config({
      fileCache : true,
      appendExt : 'jpg',
      path: dirs.DocumentDir + '/' + conversationUid + "y" + '.jpg'
    })
    .fetch('GET', downloadURL, {
      //some headers ..
    })

  }
  conversationUsernameArray[i] = snap.val()

  AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
  this.startFromLocal()
}
async createConversationArrays(){

    var db = firebase.firestore();
    var docRef = db.collection(firebase.auth().currentUser.uid).doc("MessageInformation");
    await docRef.onSnapshot(async doc =>{
      if(!afterDelete){
        if(!newRequest){
          if(doc.exists){
            conversationUidArray = await doc.data()["UidArray"]
            noOfConversations = conversationUidArray.length
            for( i = 0; i < noOfConversations; i++){
              global.newMsgListenerArray[i] = {isOpen: false, uid: conversationUidArray[i], listenerID: "" }
            }
            await this.getUsernameOfTheUid()
            uidArray = await this.createUidPhotoArrays()
            await this.printMessagesData()
            newRequest = true
            global.messagesFirstTime = false

          }
          else{
              newRequest = true
              global.messagesFirstTime = false
              this.setState({loadingDone: true, loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
          }
        }
        else{
          await this.resetVariables()
          await this.spinAnimation()
          conversationUidArray = await doc.data()["UidArray"]
          noOfConversations = conversationUidArray.length,

          global.newMsgListenerArray[noOfConversations-1] = {isOpen: false, uid: conversationUidArray[noOfConversations-1], listenerID: "" }

          await this.getUsernameOfTheUid()
          uidArray = await this.createUidPhotoArrays()
          await this.printMessagesData()
          global.messagesFirstTime = false
        }
      }
    })
}
async createUidPhotoArrays(){
  differenceArrayIndexes = []
  differenceArrayIndexes.splice(0, differenceArrayIndexes.length)
  urlArray = []
  urlArray.splice(0, urlArray.length)
  // GET THE UIDS THAT ARE SAVED TO LOCAL
  var localUids = []
  localUids.splice(0, localUids.length)
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_uids')
    .then(req => JSON.parse(req))
    .then(json => localUids = json)

    if(localUids != null && localUids.length != 0){

      if(conversationUidArray.concat().sort().join(',') === localUids.concat().sort().join(',')){
      }
      else {
        console.log("ÜST TARAF")
        console.log("LOCAL UIDLER:", localUids)
        console.log("CONVERSATION UIDLER:", conversationUidArray)
        differenceArray = conversationUidArray.filter(x => !localUids.includes(x))
        console.log("DIFFERENCE ARRAY:", differenceArray)
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_uids', JSON.stringify(conversationUidArray))
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
        for(i = 0; i < conversationUidArray.length; i++){
          for(j = 0; j < differenceArray.length; j++){
            if( conversationUidArray[i] == differenceArray[j] ){
              differenceArrayIndexes.push(i)
            }
          }
        }
        console.log("DIFFERENCE ARRAY INDEXES:", differenceArrayIndexes)
        for(i = 0; i < differenceArray.length; i++){
          var storageRef = firebase.storage().ref("Photos/" + conversationUidArray[differenceArrayIndexes[i]] + "/1.jpg")
          await storageRef.getDownloadURL().then(data =>{
            urlArray.push(data)
          })
          let dirs = RNFetchBlob.fs.dirs
          await RNFetchBlob
          .config({
            fileCache : true,
            appendExt : 'jpg',
            path: dirs.DocumentDir + '/' + differenceArray[i] + "y" + '.jpg'
          })
          .fetch('GET', urlArray[i], {
            //some headers ..
          })
        }
      }
    }
    else{
      console.log("ALT TARAF")
      console.log("LOCAL UIDLER:", localUids)
      console.log("CONVERSATION UIDLER:", conversationUidArray)
      differenceArray = conversationUidArray
      AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_uids', JSON.stringify(conversationUidArray))
      AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
      console.log("DIFFERENCE ARRAY:", differenceArray)
      for(i = 0; i < conversationUidArray.length; i++){
        for(j = 0; j < differenceArray.length; j++){
          if( conversationUidArray[i] == differenceArray[j] ){
            differenceArrayIndexes.push(i)
          }
        }
      }
      console.log("DIFFERENCE ARRAY INDEXES:", differenceArrayIndexes)
      for(i = 0; i < differenceArray.length; i++){
        var storageRef = firebase.storage().ref("Photos/" + conversationUidArray[i] + "/1.jpg")
        await storageRef.getDownloadURL().then(data =>{
          urlArray.push(data)
        })
        let dirs = RNFetchBlob.fs.dirs
        await RNFetchBlob
        .config({
          fileCache : true,
          appendExt : 'jpg',
          path: dirs.DocumentDir + '/' + differenceArray[i] + "y" + '.jpg'
        })
        .fetch('GET', urlArray[i], {
          //some headers ..
        })
      }
    }
  for(i = 0; i < conversationUidArray.length; i++){
      photoArray[i] = "file:///data/user/0/com.twinizer/files/" + conversationUidArray[i] + "y"+ ".jpg"
  }
  return conversationUidArray
}
async printMessagesData(){
  count = 0;
  while(count < noOfConversations){
    otherUserUid = uidArray[count]
    await this.getMessagesData()
    count++;
  }
}

getMessagesData = async callback =>{
  var arr = []
  arr.splice(0, arr.length)
  arr[0] = firebase.auth().currentUser.uid
  arr[1] = uidArray[count]
  arr.sort()
  var key = arr[0] + "" + arr[1];


  var listener23 = firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + uidArray[count]).orderByKey().endAt("A").startAt("-").limitToLast(1);
  await listener23.once('value').then(async snapshot => {
      console.log("ONCE A GİRDİ:", snapshot.val())
      var data;
      if(snapshot.val() == null || snapshot.val() == undefined ){
        var localMsgs = []
        await AsyncStorage.getItem(firebase.auth().currentUser.uid + uidArray[count] + '/messages')
          .then(req => JSON.parse(req))
          .then(json => localMsgs = json)
        if(localMsgs == null){

        }
        data = localMsgs[localMsgs.length - 1]
        lastDBkey = localMsgs[localMsgs.length - 1]._id
      }
      else{
        var snapVal = snapshot.val()
        var messageKey = Object.keys(snapVal)[0]
        const user = { _id: uidArray[count], r: firebase.auth().currentUser.uid}
        const { c: numberStamp, i: isRequest, text} = snapVal[messageKey];
        const id = messageKey;
        const _id = messageKey; //needed for giftedchat
        const c = numberStamp
        const createdAt = new Date(numberStamp);
        const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
        const message = {
          c,
          id,
          _id,
          createdAt,
          isRequest,
          text,
          user,
          image
        };
        data = message
        lastDBkey = messageKey
      }

      messageArray.splice(0, messageArray.length)
      requestArray.splice(0, requestArray.length)

      if(!fromChat){
        if(dataArray.length < noOfConversations){
          dataArray[count] = data
        }
        if(dataArray.length == noOfConversations){
          for(i = 0; i < noOfConversations; i++){
            if( (data.user.r == dataArray[i].user.r && data.user._id == dataArray[i].user._id) || (data.user.r == dataArray[i].user._id && data.user._id == dataArray[i].user.r) ){
              dataArray[i] = data
              break;
            }
          }
          for( i = 0; i < noOfConversations; i++){
            if(dataArray[i].isRequest == "f" || dataArray[i].user._id == firebase.auth().currentUser.uid){
              messageArray.push(dataArray[i])
              noOfNonRequests++;
            }
            else{
              requestArray.push(dataArray[i])

            }
          }
          requestArray.sort(this.sortByProperty("c"));
          requestArray.reverse()
          messageArray.sort(this.sortByProperty("c"));
          messageArray.reverse()

          // CHECKING FOR LAST SEEN
          for( i = 0; i < requestArray.length; i++){
            requestColorArray[i] = "trashgray"
            var key;
            var time;
            if(requestArray[i].user._id == firebase.auth().currentUser.uid){
              requestLastSeenArray[i] = 0
            }
            else{
              key = firebase.auth().currentUser.uid + "" + requestArray[i].user._id
              time = await AsyncStorage.getItem(key + 'lastSeen')
              if(requestArray[i].c > time){
                requestLastSeenArray[i] = 1
              }
              else{
                requestLastSeenArray[i] = 0
              }
            }
          }
          console.log("MESSAGE ARRAY ONCE:", messageArray)
          for( i = 0; i < messageArray.length; i++){
            messageColorArray[i] = "trashgray"
            var key;
            var time;

            if(messageArray[i].user._id == firebase.auth().currentUser.uid){
              messageLastSeenArray[i] = 0
            }
            else{
              key = firebase.auth().currentUser.uid + "" + messageArray[i].user._id
              time = await AsyncStorage.getItem(key + 'lastSeen')
              if(messageArray[i].c > time){
                messageLastSeenArray[i] = 1
              }
              else{
                messageLastSeenArray[i] = 0
              }
            }
          }

          for( i = 0; i < requestArray.length; i++){
            for( j = 0; j < photoArray.length; j++){
              if(requestArray[i].user._id == conversationUidArray[j]){
                requestPhotoArray[i] = photoArray[j]
                requestUsernameArray[i] = conversationUsernameArray[j]
              }
            }
          }
          for( i = 0; i < messageArray.length; i++){
            for( j = 0; j < photoArray.length; j++){
              if(messageArray[i].user._id == conversationUidArray[j] || messageArray[i].user.r == conversationUidArray[j]){
                messagePhotoArray[i] = photoArray[j]
                messageUsernameArray[i] = conversationUsernameArray[j]
              }
            }
          }

          this.setState({loadingDone: true, test: "1", loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
        }
      }


  })
  var lastLocalKey = await this.getLastLocalMessage()
  if(lastLocalKey == lastDBkey + "z"){
    didSync = true
  }

  var uidCount = count;
  if(!global.newMsgListenerArray[count].isOpen && global.fromChatOfUid != global.newMsgListenerArray[count].uid){
    console.log("CREATED LISTENER FOR:", global.newMsgListenerArray[count].uid)
    global.newMsgListenerArray[count].isOpen = true
    global.newMsgListenerArray[count].listenerID = firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + uidArray[count]).orderByKey().endAt("A").startAt("-");
    await global.newMsgListenerArray[count].listenerID.on('value', async snapshot => await this.syncLocalMessages(snapshot, uidCount));

  }
};
async getLastLocalMessage(){

  var lastLocalKey;
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + otherUserUid + '/messages')
    .then(req => JSON.parse(req))
    .then(json => localMessages[count] = json)
    if(localMessages[count] != null && localMessages[count].length != 0){
      var key = localMessages[count][localMessages[count].length - 1]._id
      lastLocalKey = key + "z";
    }else{
      lastLocalKey = ""
    }

  return lastLocalKey
}
syncLocalMessages = async (snapshot, uidCount) => {
  // remove k from snapshot data
  if(snapshot.val() != null){
    var snapVal = snapshot.val()
    console.log("MESAJ GELDİ:", snapshot.val())
    var messageKey;
    var noOfNewMsgs = Object.keys(snapVal).length
    if(noOfNewMsgs != 0){
      for(i = 0; i < noOfNewMsgs; i++){
        messageKey = Object.keys(snapshot.val())[i]
        console.log("SNAP VAL: ", snapVal)

        const user = { _id: uidArray[uidCount], r: firebase.auth().currentUser.uid}
        const { c: numberStamp, i: isRequest, text} = snapVal[messageKey];
        const id = messageKey;
        const _id = messageKey; //needed for giftedchat
        const c = numberStamp
        const createdAt = new Date(numberStamp);
        const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
        const msg = {
          c,
          id,
          _id,
          createdAt,
          isRequest,
          text,
          user,
          image
        };

          if(localMessages[uidCount] == null || localMessages[uidCount].length == 0){
            localMessages[uidCount] = [msg]
            console.log("Locale kaydedilen mesaj on if: ", msg)
          }
          else{
            localMessages[uidCount].push(msg)
            console.log("Locale kaydedilen mesaj on else: ", msg)
          }
      }
      firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + uidArray[uidCount]).remove();
      firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + uidArray[uidCount]).update({
        k:1
      })

        await AsyncStorage.setItem(firebase.auth().currentUser.uid + uidArray[uidCount] + '/messages', JSON.stringify(localMessages[uidCount]))
        lastMsgFlag = lastDBkey == localMessages[uidCount][localMessages[uidCount].length - 1]._id
        if(lastMsgFlag || didSync){
          didSync = true

          // CREATE DATA ARRAY PART
          messageArray.splice(0, messageArray.length)
          requestArray.splice(0, requestArray.length)
          if(!fromChat){
            const data = localMessages[uidCount][localMessages[uidCount].length - 1]
            if(dataArray.length < noOfConversations){
              dataArray[count] = data
            }
            if(dataArray.length == noOfConversations){
              for(i = 0; i < noOfConversations; i++){
                if( (data.user.r == dataArray[i].user.r && data.user._id == dataArray[i].user._id) || (data.user.r == dataArray[i].user._id && data.user._id == dataArray[i].user.r) ){
                  dataArray[i] = data
                  break;
                }
              }
              for( i = 0; i < noOfConversations; i++){
                if(dataArray[i].isRequest == "f" || dataArray[i].user._id == firebase.auth().currentUser.uid){
                  messageArray.push(dataArray[i])
                  noOfNonRequests++;
                }
                else{
                  requestArray.push(dataArray[i])
                }
              }
              requestArray.sort(this.sortByProperty("c"));
              requestArray.reverse()
              messageArray.sort(this.sortByProperty("c"));
              messageArray.reverse()

              // CHECKING FOR LAST SEEN
              for( i = 0; i < requestArray.length; i++){
                requestColorArray[i] = "trashgray"
                var key;
                var time;
                if(requestArray[i].user._id == firebase.auth().currentUser.uid){
                  requestLastSeenArray[i] = 0
                }
                else{
                  key = firebase.auth().currentUser.uid + "" + requestArray[i].user._id
                  time = await AsyncStorage.getItem(key + 'lastSeen')
                  if(requestArray[i].c > time){
                    requestLastSeenArray[i] = 1
                  }
                  else{
                    requestLastSeenArray[i] = 0
                  }
                }
              }

              for( i = 0; i < messageArray.length; i++){
                messageColorArray[i] = "trashgray"
                var key;
                var time;

                if(messageArray[i].user._id == firebase.auth().currentUser.uid){
                  messageLastSeenArray[i] = 0
                }
                else{
                  key = firebase.auth().currentUser.uid + "" + messageArray[i].user._id
                  time = await AsyncStorage.getItem(key + 'lastSeen')
                  if(messageArray[i].c > time){
                    messageLastSeenArray[i] = 1
                  }
                  else{
                    messageLastSeenArray[i] = 0
                  }
                }
              }

              for( i = 0; i < requestArray.length; i++){
                for( j = 0; j < photoArray.length; j++){
                  if(requestArray[i].user._id == conversationUidArray[j]){
                    requestPhotoArray[i] = photoArray[j]
                    requestUsernameArray[i] = conversationUsernameArray[j]
                  }
                }
              }
              for( i = 0; i < messageArray.length; i++){
                for( j = 0; j < photoArray.length; j++){
                  if(messageArray[i].user._id == conversationUidArray[j] || messageArray[i].user.r == conversationUidArray[j]){
                    messagePhotoArray[i] = photoArray[j]
                    messageUsernameArray[i] = conversationUsernameArray[j]
                  }
                }
              }
              console.log("MESSAGE ARRAY: ", messageArray)
              console.log("REQUEST ARRAY: ", requestArray)
              newRequest = true

              this.setState({loadingDone: true, test: "1", loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false, reRender:"oke"})
            }
          }
        }
    }
  }


};

sortByProperty(property){
   return function(a,b){
      if(a[property] > b[property])
         return 1;
      else if(a[property] < b[property])
         return -1;
      return 0;
   }
}

spinAnimation(){
  if(!newRequest){
    this.setState({test: "1", editPressed: false, cancelPressed: false,})
  }

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


navigateToChat(receiverUid, receiverPhoto, receiverUsername){

  //const {navigate} = this.props.navigation;
  global.localMessages = localMessages[count]
  global.receiverUid = receiverUid
  global.receiverPhoto = receiverPhoto
  global.receiverUsername = receiverUsername.u
  global.receiverGender = receiverUsername.g
  global.receiverCountry = receiverUsername.c
  global.receiverBio = receiverUsername.b
  global.firstMessage = false
  for( i = 0; i < global.newMsgListenerArray.length; i++){
    if(global.receiverUid == global.newMsgListenerArray[i].uid){
      global.newMsgListenerArray[i].isOpen = false
      var x = global.newMsgListenerArray[i].listenerID
      x.off()
      console.log("LISTENER CLOSED FOR:",global.newMsgListenerArray[i].uid)
    }
  }
  fromChat = true
  this.setState({loadingDone: false, loadingOpacity: 1, editPressed: false, cancelPressed: false, editText: "Edit", messageBoxDisabled: false,})
  global.fromChatOfUid = global.receiverUid
  this.props.navigation.navigate("Chat")
}
getMsgTime(timestamp){

  var currentDate = new Date()
  var currentDay = currentDate.getDate()
  var currentMonth = currentDate.getMonth() + 1
  var currentYear = currentDate.getFullYear()

  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var day = date.getDate()
  var month = currentDate.getMonth() + 1
  var year = currentDate.getFullYear()

  if(currentYear > year){
    if(day < 10)
      day = "0" + day
    if(month < 10)
      month = "0" + month
    return day + "." + month + "." + year;
  }
  else if(currentMonth > month){
    if(day < 10)
      day = "0" + day
    if(month < 10)
      month = "0" + month
    return day + "." + month + "." + year;
  }
  else if( currentDay - day > 1){
    if(day < 10)
      day = "0" + day
    if(month < 10)
      month = "0" + month
    return day + "." + month + "." + year;
  }
  else if( currentDay - day == 1){
    if(day < 10)
      day = "0" + day
    if(month < 10)
      month = "0" + month
    return "Yesterday";
  }
  else{
    if(minutes < 10)
      minutes = "0" + minutes;
    return hours + ':' + minutes;
  }
}

renderMessageBoxes(){
  if(messageArray.length == 0){
    return(
      <View style = {{flex: 1, flexDirection: "column", width: this.width, height: scrollViewHeight}}>
      <View style = {{ alignItems: 'center', justifyContent: 'center', width: this.width, height: scrollViewHeight/2}}>
      <Image source={{uri: 'sadface' + global.themeForImages}}
        style={{width: scrollViewHeight/4, height: scrollViewHeight/4, opacity: 0.4}}/>
      </View>

      <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, height: scrollViewHeight/4}}>
      <Text
        style = {{fontSize: 25, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)" }}>
        No messages, sorry...
      </Text>
      </View>
      </View>
    )
  }
  else{
    var timeArray = []
    timeArray.splice(0, timeArray.length)
    var receiverArray = []
    receiverArray.splice(0, receiverArray.length)
    var messages = [];
    messages.splice(0, messages.length)
    var count = 0;
    while( count < messageArray.length){
      timeArray[count] = this.getMsgTime(messageArray[count].c)

      if( messageArray[count].user.r == firebase.auth().currentUser.uid){
        receiverArray[count] = messageArray[count].user._id
      }
      else{
        receiverArray[count] = messageArray[count].user.r
      }

      count++;
    }
    count = 0
      while( count < messageArray.length){
        const temp = count
        messages.push(
          <MessageBox
          left = {this.leftAnimation}
          color = {messageColorArray[temp]}
          disabled = {this.state.messageBoxDisabled}
          editPressed = {this.state.editPressed}
          cancelPressed = {this.state.cancelPressed}
          trashOnPress = {()=> this.messageTrashButtonPressed(temp)}
          onPress = {()=>this.navigateToChat(receiverArray[temp], messagePhotoArray[temp], messageUsernameArray[temp])}
          senderName = {messageUsernameArray[count].u}
          lastMsg = {messageArray[count].text}
          lastMsgTime = {timeArray[count]}
          avatarSource = {messagePhotoArray[count]}
          isSeen = {messageLastSeenArray[count]}
          key={count}/>
        )
        count = count + 1;
    }
    return messages;
  }

}
renderRequestBoxes(){
  if(requestArray.length == 0){

    return(
      <View style = {{flex: 1, flexDirection: "column", width: this.width, height: scrollViewHeight}}>
      <View style = {{ alignItems: 'center', justifyContent: 'center', width: this.width, height: scrollViewHeight/2}}>
      <Image source={{uri: 'sadface' + global.themeForImages}}
        style={{width: scrollViewHeight/4, height: scrollViewHeight/4, opacity: 0.4}}/>
      </View>

      <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, height: scrollViewHeight/4}}>
      <Text
        style = {{fontSize: 25, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        No requests, sorry...
      </Text>
      </View>
      </View>
    )
  }
  else{
    var timeArray = []
    timeArray.splice(0, timeArray.length)
    var receiverArray = []
    receiverArray.splice(0, receiverArray.length)
    var messages = [];
    messages.splice(0, messages.length)
    var count = 0;
    while( count < requestArray.length){
      timeArray[count] = this.getMsgTime(requestArray[count].c)

      if( requestArray[count].user.r == firebase.auth().currentUser.uid){
        receiverArray[count] = requestArray[count].user._id
      }
      else{
        receiverArray[count] = requestArray[count].user.r
      }

      count++;
    }
    count = 0
      while( count < requestArray.length){
        const temp = count
        messages.push(
          <MessageBox
          left = {this.leftAnimation}
          color = {requestColorArray[temp]}
          disabled = {this.state.messageBoxDisabled}
          editPressed = {this.state.editPressed}
          cancelPressed = {this.state.cancelPressed}
          trashOnPress = {()=> this.requestTrashButtonPressed(temp)}
          onPress = {()=>this.navigateToChat(receiverArray[temp], requestPhotoArray[temp], requestUsernameArray[temp])}
          senderName = {requestUsernameArray[count].u}
          lastMsg = {requestArray[count].text}
          lastMsgTime = {timeArray[count]}
          avatarSource = {requestPhotoArray[count]}
          isSeen = {requestLastSeenArray[count]}
          key={count}/>
        )
        count = count + 1;
    }
    return messages;
  }

}
editButtonPressed(){
    console.log("EDIT BUTTON PRESSED DIŞ")
    if(this.state.editText == "Edit"){
      this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false, messageBoxDisabled: true})
      console.log("EDIT BUTTON PRESSED İF")
      this.messageBoxAnimation()
    }
    else{
      this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true, messageBoxDisabled: false})
      console.log("EDIT BUTTON PRESSED ELSE")
      this.messageBoxAnimation()
      for( i = 0; i < requestColorArray.length; i++){
        requestColorArray[i] = "trashgray"
      }
      for( i = 0; i < messageColorArray.length; i++){
        messageColorArray[i] = "trashgray"
      }
      doneMessageColor = 'rgba(128,128,128,1)'
      doneRequestColor = 'rgba(128,128,128,1)'
    }
}
requestTrashButtonPressed(count){
  if(requestColorArray[count] == "trashgray"){
    requestColorArray[count] = "trash" + global.themeForImages
  }
  else{
    requestColorArray[count] = "trashgray"
  }
  this.arrangeDoneColor()
}

messageTrashButtonPressed(count){
  if(messageColorArray[count] == "trashgray"){
    messageColorArray[count] = "trash" + global.themeForImages
  }
  else{
    messageColorArray[count] = "trashgray"
  }
  this.arrangeDoneColor()
}

switchButtonPressed(whichButtonPressed){
  if(whichButtonPressed == "left"){
    doneMessageColor = 'rgba(128,128,128,1)'
    doneRequestColor = 'rgba(128,128,128,1)'
    this.setState({messageDoneDisabled: true, requestDoneDisabled: true, leftButtonSize: this.width/8, leftButtonLeft: this.width/8*2, whichScreen: "left", leftButtonOpacity: 0.6,
    rightButtonSize: this.width/6, rightButtonRight: this.width/8*2 - this.width/48, leftButtonDisabled: true, rightButtonOpacity: 1, rightButtonDisabled: false, editPressed: false,
    cancelPressed: false})

  }
  else{
    doneMessageColor = 'rgba(128,128,128,1)'
    doneRequestColor = 'rgba(128,128,128,1)'
    this.setState({messageDoneDisabled: true, requestDoneDisabled: true, rightButtonSize: this.width/8, rightButtonRight: this.width/8*2,whichScreen: "right", rightButtonOpacity: 0.6,
    leftButtonSize: this.width/6, leftButtonLeft: this.width/8*2 - this.width/48, rightButtonDisabled: true, leftButtonOpacity: 1, leftButtonDisabled: false, editPressed: false,
    cancelPressed: false})

  }
}
arrangeDoneColor(){
  var flag1 = false
  var flag2 = false
  for( i = 0; i < messageColorArray.length; i++){
    if( messageColorArray[i] == "trash" + global.themeForImages){
      flag1 = true
      doneMessageColor = global.themeColor
      this.setState({messageDoneDisabled: false})
      break
    }
  }
  if(!flag1){
    doneMessageColor = 'rgba(128,128,128,1)'
    this.setState({messageDoneDisabled: true})
  }
  for( i = 0; i < requestColorArray.length; i++){
    if( requestColorArray[i] == "trash" + global.themeForImages){
      flag2 = true
      doneRequestColor = global.themeColor
      this.setState({requestDoneDisabled: false})
      break
    }
  }
  if(!flag2){
    doneRequestColor = 'rgba(128,128,128,1)'
    this.setState({requestDoneDisabled: true})
  }
}
requestDonePress(){
}
async deleteMessage(){
  var docRef = firebase.firestore().collection(firebase.auth().currentUser.uid).doc("MessageInformation");
  var uidarr = []
  await docRef.get().then(async doc =>{
    uidarr = await doc.data()["UidArray"]
  })
  afterDelete = true
  var messageLength = messageColorArray.length
  var receiverUid;
  for( i = messageLength - 1; i >= 0; i--){
    if(firebase.auth().currentUser.uid == messageArray[i].user._id){
      receiverUid = messageArray[i].user.r
    }
    else{
      receiverUid = messageArray[i].user._id
    }
    if(messageColorArray[i] == "trash" + global.themeForImages){
      uidarr.splice(i,1)
      messageColorArray.splice(i,1)
      messageLastSeenArray.splice(i,1)
      messageArray.splice(i,1)
      messagePhotoArray.splice(i,1)
      messageUsernameArray.splice(i,1)
    }
  }
  var senderRef = firebase.firestore().collection(firebase.auth().currentUser.uid).doc("MessageInformation");
  senderRef.set({
    UidArray: uidarr,
  }, {merge: true})

  this.arrangeDoneColor()
  this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true, messageBoxDisabled: false})
}
messageDonePress(){
  var deleteCount = 0
  for( i = 0; i < messageColorArray.length; i++){
    if(messageColorArray[i] == "trash" + global.themeForImages){
      deleteCount++;
    }
  }
  var alertMsg;
  if(deleteCount == 1){
    alertMsg = "If you proceed to delete this conversation, you can't access it until you receive a new message request."
  }
  else{
    alertMsg = "If you proceed to delete these " + deleteCount + " conversations, you can't access them until you receive a new message request. "
  }
  Alert.alert(
  'Warning!',
  alertMsg ,
  [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {text: 'Delete Anyways', onPress: () => this.deleteMessage()},
  ],
  {cancelable: false},
);
}
render(){
  const {navigate} = this.props.navigation;
  var showEditMessage = true
  if(messageArray.length == 0){
    showEditMessage = false
  }
  if(messageArray.length > 0){
    showEditMessage = true
  }

  var showEditRequest = true
  if(requestArray.length == 0){
    showEditRequest = false
  }
  if(requestArray.length > 0){
    showEditRequest = true
  }
  scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
  const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })
  if(this.state.editPressed){
    if(!this.state.loadingDone){
      if(this.state.whichScreen == "left"){
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  title = {"Requests"}/>

                  <Animated.Image source={{uri: 'loading' + global.themeForImages}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
        </View>
        )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Requests"}/>

                  <Animated.Image source={{uri: 'loading' + global.themeForImages}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
        </View>
        )
      }
    }
    else{
      if(this.state.whichScreen == "left"){
        return(
          <View
          style={{width: this.width, height: this.height, flex:1, flexDirection: 'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>

                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Messages"}/>

                  <View style = {{borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity = {1}
                    disabled = {this.state.messageDoneDisabled}
                    style={{opacity: this.state.messageDoneDisabled ? 0 : 1, position: "absolute", right: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress = {()=> this.messageDonePress()}>
                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  Done
                  </Text>
                  </TouchableOpacity>
                  </View>


                  <FlatList
                    style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                    renderItem = {()=>this.renderMessageBoxes()}
                    data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>
        </View>
            )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Requests"}
                  />

                  <View style = {{borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled = {this.state.requestDoneDisabled}
                    style={{opacity: this.state.requestDoneDisabled ? 0 : 1, position: "absolute", right: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress = {()=> this.requestDonePress()}>
                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  Done
                  </Text>
                  </TouchableOpacity>

                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=>this.renderRequestBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>
        </View>
        )
      }
    }
  }
  else{ // IF EDIT IS NOT PRESSED
    if(!this.state.loadingDone){ // IF PAGE IS LOADED
      if(this.state.whichScreen == "left"){ // IF SCREEN IS LEFT
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  title = {"Messages"}
                  />

                  <Animated.Image source={{uri: 'loading' + global.themeForImages}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
        </View>
        )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Requests"}
                  />

                  <Animated.Image source={{uri: 'loading' + global.themeForImages}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
        </View>
        )
      }
    }
    else{
      if(this.state.whichScreen == "left"){
        return(
          <View
          style={{width: this.width, height: this.height, flex:1, flexDirection: 'column', alignItems: 'center', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>

                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Messages"}
                  />

                  <View style = {{opacity: messageArray.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {messageArray.length == 0 ? true : false}>

                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=> this.renderMessageBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>

        </View>
            )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column', backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Requests"}/>

                  <View style = {{opacity: requestArray.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {requestArray.length == 0 ? true : false}>

                  <Text style = {{fontSize: 20, color: global.themeColor}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=>this.renderRequestBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>


        </View>
        )
      }
    }
  }


  ;
}
}
