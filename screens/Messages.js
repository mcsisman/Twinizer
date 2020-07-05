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
import BottomBar from './components/BottomBar'
import ModifiedStatusBar from './components/ModifiedStatusBar'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var whoseListener = []
var syncRef;
var didSync = false
var lastDBkey;
var lastMsgFlag = false
var afterDelete = false
var scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
var ourBlue = 'rgba(77,120,204,1)'
var doneMessageColor = 'rgba(128,128,128,1)'
var doneRequestColor = 'rgba(128,128,128,1)'
var messageColorArray = []
var requestColorArray = []
var localMessages = [];
var syncListener = [];
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
export default class MessagesScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
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
    this.navigateToChat = this.navigateToChat.bind(this);
    this.spinValue = new Animated.Value(0)
    this.doesExist = false
    scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight()
  }
componentDidMount(){

  this._subscribe = this.props.navigation.addListener('focus', async () => {
    global.fromMessages = true
    scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight()
    newRequest = false
    console.log("FIRST TIME?: ", global.messagesFirstTime)
    if(global.messagesFirstTime){
      this.initializeMessageScreen()
      global.messagesFirstTime = false
    }
    else{
      this.resetVariables()
      this.spinAnimation()
      this.startFromLocal()
    }
  })
};
componentWillUnmount(){
  this.resetVariables()
}

static navigationOptions = {
    header: null,
};
resetVariables(){
  if(!newRequest){
    syncListener = [];
    whoseListener = []
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
    whoseListener.splice(0, whoseListener.length)
    syncListener.splice(0, syncListener.length)
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
      loadingDone: false
    })
  }
}
async initializeMessageScreen(){
  this.resetVariables()
  this.spinAnimation()
  await this.createConversationArrays()
}
async startFromLocal(){
  await this.resetVariables()
  await this.spinAnimation()

  var localUsernames = []
  localUsernames.splice(0, localUsernames.length)
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_usernames')
    .then(req => JSON.parse(req))
    .then(json => localUsernames = json)
  var localUids = []
  localUids.splice(0, localUids.length)
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_uids')
    .then(req => JSON.parse(req))
    .then(json => localUids = json)

  conversationUidArray = localUids
  conversationUsernameArray = localUsernames

  noOfConversations = conversationUidArray.length
  uidArray = await this.createUidPhotoArrays()
  await this.printMessagesData()
}
async createConversationArrays(){

  if(!newRequest){
    var db = firebase.firestore();
    var docRef = db.collection(firebase.auth().currentUser.uid).doc("MessageInformation");
    await docRef.onSnapshot(async doc =>{
      console.log("READ FIRESTORE")
      if(!afterDelete){
        if(!newRequest){
          if(doc.exists){
            console.log("READ FIRESTORE İÇ")
            conversationUidArray = await doc.data()["UidArray"]
            conversationUsernameArray = await doc.data()["UsernameArray"]
            noOfConversations = conversationUidArray.length
            uidArray = await this.createUidPhotoArrays()
            await this.printMessagesData()
            newRequest = true
          }
          else{
              this.setState({loadingDone: true, loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
          }
        }
        else{
          await this.resetVariables()
          await this.spinAnimation()
          conversationUidArray = await doc.data()["UidArray"]
          conversationUsernameArray = await doc.data()["UsernameArray"]
          noOfConversations = conversationUidArray.length
          uidArray = await this.createUidPhotoArrays()
          await this.printMessagesData()
        }
      }
    })
  }
}
async createUidPhotoArrays(){

  console.log("GİRMEDEN ÖNCE:", conversationUsernameArray)
  await this.createUsernameArray()
  console.log("GİRDİKTEN SONRA:", conversationUsernameArray)

  // GET THE UIDS THAT ARE SAVED TO LOCAL
  var localUids = []
  localUids.splice(0, localUids.length)
  await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'message_uids')
    .then(req => JSON.parse(req))
    .then(json => localUids = json)

    if(localUids != null && localUids.length != 0){

      if(conversationUidArray.concat().sort().join(',') === localUids.concat().sort().join(',')){
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
      }
      else {
        differenceArray = conversationUidArray.filter(x => !localUids.includes(x))
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_uids', JSON.stringify(conversationUidArray))
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))
        for(i = 0; i < conversationUidArray.length; i++){
          for(j = 0; j < differenceArray.length; j++){
            if( conversationUidArray[i] == differenceArray[j] ){
              differenceArrayIndexes.push(i)
            }
          }
        }
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
      differenceArray = conversationUidArray
      AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_uids', JSON.stringify(conversationUidArray))
      AsyncStorage.setItem(firebase.auth().currentUser.uid + 'message_usernames', JSON.stringify(conversationUsernameArray))

      for(i = 0; i < conversationUidArray.length; i++){
        for(j = 0; j < differenceArray.length; j++){
          if( conversationUidArray[i] == differenceArray[j] ){
            differenceArrayIndexes.push(i)
          }
        }
      }
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

  var listener23 = firebase.database().ref('Messages/' + "" + key).limitToLast(1);
  await listener23.once('child_added').then(async snapshot => {
    lastDBkey = snapshot.key
    messageArray.splice(0, messageArray.length)
    requestArray.splice(0, requestArray.length)
    if(!fromChat){
      const data = snapshot.val()
      if(dataArray.length < noOfConversations){
        dataArray.push(data)
      }
      if(dataArray.length == noOfConversations){
        for(i = 0; i < noOfConversations; i++){
          if( (data.user.r == dataArray[i].user.r && data.user._id == dataArray[i].user._id) || (data.user.r == dataArray[i].user._id && data.user._id == dataArray[i].user._r) ){
            dataArray[i] = data
            break;
          }
        }
        for( i = 0; i < noOfConversations; i++){
          if(dataArray[i].i == "f" || dataArray[i].user._id == firebase.auth().currentUser.uid){
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

        console.log("MESSAGE ARRAY: ", messageArray)
        console.log("REQUEST ARRAY: ", requestArray)
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
        this.setState({loadingDone: true, test: "1", loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
      }
    }
  })

  var lastLocalKey = await this.getLastLocalMessage()
  if(lastLocalKey == lastDBkey + "z"){
    didSync = true
  }
  syncListener[count] = firebase.database().ref('Messages/' + "" + key).orderByKey().startAt(lastLocalKey);
  whoseListener[count] = uidArray[count]
  var uidCount = count;
  await syncListener[count].on('child_added', async snap => await this.syncLocalMessages(snap, uidCount));
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
syncLocalMessages = async (snap, uidCount) => {
  if(snap.val() != null){
    var key = snap.key + ""
    var val = snap.val()

    const { c: numberStamp, i: isRequest, text, user } = snap.val();
    const { key: id } = snap;
    const { key: _id } = snap; //needed for giftedchat
    const createdAt = new Date(numberStamp);
    const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
    const msg = {
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
    }
    else{
      localMessages[uidCount].push(msg)
    }
    await AsyncStorage.setItem(firebase.auth().currentUser.uid + uidArray[uidCount] + '/messages', JSON.stringify(localMessages[uidCount]))
    lastMsgFlag = lastDBkey == snap.key
    if(lastMsgFlag || didSync){
      didSync = true

      // CREATE DATA ARRAY PART
      messageArray.splice(0, messageArray.length)
      requestArray.splice(0, requestArray.length)
      if(!fromChat){
        const data = snap.val()
        if(dataArray.length < noOfConversations){
          dataArray.push(data)
        }
        if(dataArray.length == noOfConversations){
          for(i = 0; i < noOfConversations; i++){
            if( (data.user.r == dataArray[i].user.r && data.user._id == dataArray[i].user._id) || (data.user.r == dataArray[i].user._id && data.user._id == dataArray[i].user._r) ){
              dataArray[i] = data
              break;
            }
          }
          for( i = 0; i < noOfConversations; i++){
            if(dataArray[i].i == "f" || dataArray[i].user._id == firebase.auth().currentUser.uid){
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
          this.setState({loadingDone: true, test: "1", loadingOpacity: 0, backgroundColor: "white", editPressed: false, cancelPressed: false,})
        }
      }
    }
  }
};

createUsernameArray(){
  var usernameIndex = -1;
  for (i = 0; i < conversationUsernameArray.length; i++) {
    for(j = 0; j < conversationUsernameArray[i].length; j++){
      if(conversationUsernameArray[i].charAt(j) == "_"){
        usernameIndex = j
        break
      }
    }
    if(usernameIndex != - 1){
      conversationUsernameArray[i] = conversationUsernameArray[i].substring(0,usernameIndex)
    }

  }
}


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

  const {navigate} = this.props.navigation;
  global.localMessages = localMessages[count]
  global.receiverUid = receiverUid
  global.receiverPhoto = receiverPhoto
  global.receiverUsername = receiverUsername
  global.firstMessage = false
  for( i = 0; i < syncListener.length; i++){
    if(global.receiverUid == whoseListener[i]){
      var x = syncListener[i]
      x.off()
    }
  }
  fromChat = true
  this.setState({loadingDone: false, loadingOpacity: 1, editPressed: false, cancelPressed: false, editText: "Edit", messageBoxDisabled: false,})
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
      <Image source={{uri: 'sadface'}}
        style={{width: scrollViewHeight/4, height: scrollViewHeight/4, opacity: 0.4}}/>
      </View>

      <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, height: scrollViewHeight/4}}>
      <Text
        style = {{fontSize: 25, fontFamily: "Candara" }}>
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
          color = {messageColorArray[temp]}
          disabled = {this.state.messageBoxDisabled}
          editPressed = {this.state.editPressed}
          cancelPressed = {this.state.cancelPressed}
          trashOnPress = {()=> this.messageTrashButtonPressed(temp)}
          onPress = {()=>this.navigateToChat(receiverArray[temp], messagePhotoArray[temp], messageUsernameArray[temp])}
          senderName = {messageUsernameArray[count]}
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
      <Image source={{uri: 'sadface'}}
        style={{width: scrollViewHeight/4, height: scrollViewHeight/4, opacity: 0.4}}/>
      </View>

      <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, height: scrollViewHeight/4}}>
      <Text
        style = {{fontSize: 25, fontFamily: "Candara" }}>
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
          color = {requestColorArray[temp]}
          disabled = {this.state.messageBoxDisabled}
          editPressed = {this.state.editPressed}
          cancelPressed = {this.state.cancelPressed}
          trashOnPress = {()=> this.requestTrashButtonPressed(temp)}
          onPress = {()=>this.navigateToChat(receiverArray[temp], requestPhotoArray[temp], requestUsernameArray[temp])}
          senderName = {requestUsernameArray[count]}
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
    if(this.state.editText == "Edit"){
      this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false, messageBoxDisabled: true})
    }
    else{
      this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true, messageBoxDisabled: false})
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
    requestColorArray[count] = "trashblue"
  }
  else{
    requestColorArray[count] = "trashgray"
  }
  this.arrangeDoneColor()
}

messageTrashButtonPressed(count){
  if(messageColorArray[count] == "trashgray"){
    messageColorArray[count] = "trashblue"
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
    if( messageColorArray[i] == "trashblue"){
      flag1 = true
      doneMessageColor = ourBlue
      this.setState({messageDoneDisabled: false})
      break
    }
  }
  if(!flag1){
    doneMessageColor = 'rgba(128,128,128,1)'
    this.setState({messageDoneDisabled: true})
  }
  for( i = 0; i < requestColorArray.length; i++){
    if( requestColorArray[i] == "trashblue"){
      flag2 = true
      doneRequestColor = ourBlue
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
  var usernamearr = []
  await docRef.get().then(async doc =>{
    uidarr = await doc.data()["UidArray"]
    usernamearr = await doc.data()["UsernameArray"]
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
    if(messageColorArray[i] == "trashblue"){
      uidarr.splice(i,1)
      usernamearr.splice(i,1)
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
    UsernameArray: usernamearr
  }, {merge: true})

  this.arrangeDoneColor()
  this.setState({messageDoneDisabled: true, requestDoneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true, messageBoxDisabled: false})
}
messageDonePress(){
  var deleteCount = 0
  for( i = 0; i < messageColorArray.length; i++){
    if(messageColorArray[i] == "trashblue"){
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
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  title = {"Requests"}/>

                  <Animated.Image source={{uri: 'loading'}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settingsOnPress = {()=> navigate("Settings")}/>
        </View>
        )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Requests"}/>

                  <Animated.Image source={{uri: 'loading'}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settings = {()=> navigate("Settings")}/>
        </View>
        )
      }
    }
    else{
      if(this.state.whichScreen == "left"){
        return(
          <View
          style={{width: this.width, height: this.height, flex:1, flexDirection: 'column', alignItems: 'center',}}>
                  <ModifiedStatusBar/>

                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Messages"}/>

                  <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: ourBlue}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>


                  <FlatList
                    style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                    renderItem = {()=>this.renderMessageBoxes()}
                    data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>

                  <View
                  style = {{borderColor: 'rgba(188,188,188,0.6)', borderTopWidth: 1, backgroundColor: 'rgba(209,192,188,0.6)', height: this.width/7,
                   width: this.width, bottom: 0, left:0, position:"absolute", justifyContent: "center", alignItems:"center"}}>
                  <TouchableOpacity
                  style = {{justifyContent: 'center', position: 'absolute', backgroundColor: doneMessageColor, height: this.width*(0.8/10), paddingLeft: 15, paddingRight: 15,
                  borderBottomLeftRadius: 24, borderTopRightRadius: 24, borderTopLeftRadius: 24, borderBottomRightRadius: 24}}
                  disabled = {this.state.messageDoneDisabled}
                  onPress = {()=> this.messageDonePress()}>
                  <Text style = {{fontSize: 21, fontFamily: 'Candara', color: "white"}}>
                  Done
                  </Text>
                  </TouchableOpacity>
                  </View>

        </View>
            )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editText = {this.state.editText}
                  title = {"Requests"}
                  />

                  <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: ourBlue}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=>this.renderRequestBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>

                  <View
                  style = {{borderColor: 'rgba(188,188,188,0.6)', borderTopWidth: 1, backgroundColor: 'rgba(209,192,188,0.6)', height: this.width/7, width: this.width, bottom: 0, left:0, position:"absolute", justifyContent: "center", alignItems:"center"}}>
                  <TouchableOpacity
                  style = {{justifyContent: 'center', position: 'absolute', backgroundColor: doneRequestColor, height: this.width*(0.8/10), paddingLeft: 15, paddingRight: 15,
                  borderBottomLeftRadius: 24, borderTopRightRadius: 24, borderTopLeftRadius: 24, borderBottomRightRadius: 24}}
                  disabled = {this.state.requestDoneDisabled}
                  onPress = {()=> this.requestDonePress()}>
                  <Text style = {{fontSize: 21, fontFamily: 'Candara', color: 'white'}}>
                  Done
                  </Text>
                  </TouchableOpacity>
                  </View>
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
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  editPressed = {this.state.editText}
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  title = {"Messages"}
                  />

                  <Animated.Image source={{uri: 'loading'}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settingsOnPress = {()=> navigate("Settings")}/>
        </View>
        )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Requests"}
                  />

                  <Animated.Image source={{uri: 'loading'}}
                    style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
                  />
                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settingsOnPress = {()=> navigate("Settings")}/>
        </View>
        )
      }
    }
    else{
      if(this.state.whichScreen == "left"){
        return(
          <View
          style={{width: this.width, height: this.height, flex:1, flexDirection: 'column', alignItems: 'center',}}>
                  <ModifiedStatusBar/>

                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("right")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Messages"}
                  />

                  <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: ourBlue}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=> this.renderMessageBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>

                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settingsOnPress = {()=> navigate("Settings")}/>
        </View>
            )
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, top: 0, alignItems: 'center', flex: 1, flexDirection: 'column'}}>
                  <ModifiedStatusBar/>
                  <CustomHeader
                  onPress = {()=> this.switchButtonPressed("left")}
                  whichScreen = {"Messages"}
                  editPressed = {this.state.editText}
                  title = {"Requests"}/>

                  <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
                  <TouchableOpacity
                    activeOpacity = {1}
                    style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
                    onPress={()=>this.editButtonPressed()}
                    disabled = {false}>

                  <Text style = {{fontSize: 20, color: ourBlue}}>
                  {this.state.editText}
                  </Text>
                  </TouchableOpacity>
                  </View>

                  <FlatList
                  style = {{height: scrollViewHeight, width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}
                  renderItem = {()=>this.renderRequestBoxes()}
                  data = { [{bos:"boş", key: "key"}]}>
                  </FlatList>

                  <BottomBar
                  whichScreen = {"Messages"}
                  homeOnPress = {()=> navigate("Main")}
                  historyOnPress = {()=> navigate("History")}
                  settingsOnPress = {()=> navigate("Settings")}/>
        </View>
        )
      }
    }
  }


  ;
}
}
