import React from 'react';
import { MessageImage, InputToolbar, Send, Bubble, Time, GiftedChat, LoadEarlier } from 'react-native-gifted-chat';
import RNFetchBlob from 'rn-fetch-blob';
import firebaseSvc from './FirebaseSvc';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, CommonActions, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import ImageViewer from 'react-native-image-zoom-viewer';


import MessagesScreen from './Messages'

import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal'
import ImageViewerModal from '../Components/Common/ImageViewer/ImageViewerModal'
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import ChatterInfo from '../Components/Messaging/Chat/ChatterInfo/ChatterInfo'
import ChatSendImgBottomBar from '../Components/Messaging/Chat/ChatImgSending/ChatSendImgBottomBar'
import ChatSendImgTopBar from '../Components/Messaging/Chat/ChatImgSending/ChatSendImgTopBar'
import CustomInputToolbar  from '../Components/Messaging/Chat/GiftedChat/CustomInputToolbar'
import ChatHeader from '../Components/Messaging/Chat/Header/ChatHeader'
import EncryptedStorage from 'react-native-encrypted-storage';
import language from '../Utils/Languages/lang.json'
import {Image,
   Text,
   View,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   ImageBackground,
   KeyboardAvoidingView,
   TextInput,
   Picker,
   Alert,
   StatusBar,
   Animated,
   Easing,
   AppState,
   Platform,
   Keyboard
  } from 'react-native';

var lang = language[global.lang]
var lastMsg = ""
var lastSeenInterval;
var localMessages = [];
var messageArray = [];
var firstTime = true
var images = []
var keyboardHeight;
var keyboardYcord;
type Props = {
  name?: string,
  avatar?: string,
};

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
export default class ChatScreen extends React.Component<Props> {

  constructor(props) {

    super(props);
    this.onLongPress = this.onLongPress.bind(this);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight
    this.state = {
      giftedChatHeight: this.height - this.statusBarHeaderTotalHeight,
      imageViewerVisible: false,
      msgText: " ",
      currentIndex: 0,
      enableSwipeDown: false,
      bigViewerOpacity: 1,
      smallViewerOpacity:0,
      isVisible1: false,
      reRender: false,
      renderImageChatScreen: false,
      test: "",
      photoPopUpIsVisible: false,
      keyboardOpen: false,
      test123: "123",
      imageSendDisabled: false,
    }
    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navbarHeight = this.height - this.windowHeight
    this.spinValue = new Animated.Value(0)
    firstTime = true
  }
  componentDidMount() {
    lang = language[global.lang]
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      global.callback = async (data, noOfNewMsgs) => {
        var localMessages = []
        await EncryptedStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
          .then(req => {
            if(req){
               return JSON.parse(req)
            }
            else{
              return null
            }
          })
          .then(json => localMessages = json)
        if( noOfNewMsgs == 1){
          localMessages.reverse()
          this.setState({
            messages: localMessages
          })
          this.setState( {reRender: !this.state.reRender})
        }
        else{
          localMessages.reverse()
          this.setState({
            messages: localMessages
          })
          this.setState( {reRender: !this.state.reRender})
        }
      }
      this.resetVariables()
      this.spinAnimation()
      await this.getLastLocalMessages()
      messageArray.reverse()
        this.setState({
            messages: messageArray,
            loadingOpacity: 0
        })
      lastSeenInterval = setInterval(()=> this.updateLastSeenFile(), 100)
    });
    firebaseSvc.refOn(async message =>{
      if(message != null){
        if(true){//!firstTime
          if(message.image == ""){
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message),
            }))
          }
          else{
            var localMessages = []
            await EncryptedStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
              .then(req => {
                if(req){
                   return JSON.parse(req)
                }
                else{
                  return null
                }
              })
              .then(json => localMessages = json)
            var downloadURL;
            console.log("Photos/" + auth().currentUser.uid + "/MessagePhotos/" + message.id + ".jpg")
            var storageRef = storage().ref("Photos/" + auth().currentUser.uid + "/MessagePhotos/" + message.id + ".jpg")
            var fileExists = false
            while(!fileExists){
              await storageRef.getDownloadURL().then(data =>{
                downloadURL = data
                console.log("downloadURL2:", downloadURL)
                fileExists = true
                let dirs = RNFetchBlob.fs.dirs
                RNFetchBlob
                .config({
                  fileCache : true,
                  appendExt : 'jpg',
                  path: RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + message.id + ".jpg"
                })
                .fetch('GET', downloadURL, {


                }).then( async data =>{
                  console.log("resim indirildi:", RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + message.id + ".jpg"),

                  await EncryptedStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
                    .then(req => {
                      if(req){
                         return JSON.parse(req)
                      }
                      else{
                        return null
                      }
                    })
                    .then(json => localMessages = json)
                  localMessages.reverse()
                  this.setState(previousState => ({
                    messages: localMessages
                  }))
                  this.setState( {reRender: !this.state.reRender})
                })
              }).catch(e=> {console.log(e)})
            }
          }
        }
        else{
          await this.getLastLocalMessages()
          messageArray.reverse()
          var downloadURL;
          var storageRef = storage().ref("Photos/" + auth().currentUser.uid + "/MessagePhotos/" + message.id + ".jpg")
          var fileExists = false
          while(!fileExists){
            await storageRef.getDownloadURL().then(data =>{
              downloadURL = data
              console.log("downloadURL2:", downloadURL)
              fileExists = true
              let dirs = RNFetchBlob.fs.dirs
              RNFetchBlob
              .config({
                fileCache : true,
                appendExt : 'jpg',
                path: RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + message.id + ".jpg"
              })
              .fetch('GET', downloadURL, {

              }).then( data =>{
                console.log("resim indirildi:", RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + message.id + ".jpg"),
                this.setState({
                    messages: messageArray,
                    loadingOpacity: 0
                })
              })
            })
          }
        }
        firstTime = false
      }
    })
  }

componentWillUnmount() {
  clearInterval(lastSeenInterval)

  this.keyboardDidShowListener.remove();
  this.keyboardDidHideListener.remove();
}

sendMsg = (messages) => {
  firebaseSvc.send(messages, "f")
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages[0]),
  }))
}

onPressInfo(){
  Keyboard.dismiss()
  this.setState({photoPopUpIsVisible: true})
}
sendMsgWithImage = async (text) =>{
  this.setState({imageSendDisabled: true})
  var messages;
  for( i = 0; i < images.length; i++){
    if( i != 0 ){
      text = " "
    }
    messages = [{text: text, user: this.user, createdAt: new Date()}]
    await firebaseSvc.send(messages, "t", images, i)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, global.msgToDisplay),
    }))
  }
  images = []
  this.setState({
    currentIndex: 0,
    msgText: " ",
    renderImageChatScreen: false,
    imageSendDisabled: false,
  })
}

  static navigationOptions = {
      header: null,
  };
_keyboardDidShow = (e) => {
  const { height, screenX, screenY, width } = e.endCoordinates
  keyboardYcord = screenY
  keyboardHeight = height
  this.setState({keyboardOpen: true, bigViewerOpacity: 0, smallViewerOpacity:1, enableSwipeDown: false, giftedChatHeight: this.state.giftedChatHeight - keyboardHeight - this.navbarHeight})
};
_keyboardDidHide = () => {
  this.setState({keyboardOpen: false, bigViewerOpacity: 1, smallViewerOpacity:0, enableSwipeDown: false, giftedChatHeight: this.state.giftedChatHeight + keyboardHeight + this.navbarHeight})
};

onPressCamera(){
  Keyboard.dismiss()
  this.setState({isVisible1: true})
}
library = () =>{
  this.setState({
    isVisible1: false,
  })
  ImagePicker.openPicker({
    cropping: true
  }).then(image1 => {
    var lang = language[global.lang]
    if(image1.size > global.imageSizeLimit){
      Alert.alert(lang.Warning, lang.ImageSizeExceeded);
    }
    else{
      this.setState({
        photoPath: image1.path,
        photo: {uri: image1.path},
      });
      this.imageSelected()
    }

  });
};

camera = () => {
  this.setState({
    isVisible1: false,
  })
  ImagePicker.openCamera({
    cropping: true
  }).then(image1 => {
    var lang = language[global.lang]
    if(image1.size > global.imageSizeLimit){
      Alert.alert(lang.Warning, lang.ImageSizeExceeded);
    }
    else{
      this.setState({
        photoPath: image1.path,
        photo: {uri: image1.path},
      });
      this.imageSelected()
    }

});
};
imageSelected(){
  this.setState({renderImageChatScreen: false})
  var image = { url: this.state.photoPath}

  images.push(image)
  this.setState({renderImageChatScreen: true})
}
spinAnimation(){
    this.setState({test: "1"})
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
goBackOnPress(){
  firebaseSvc.refOff();
  if(global.msgFromMain){
    global.msgFromMain = false
    this.props.navigation.navigate("Main")
  }
  else{
    global.comingFromChat = true
    this.props.navigation.navigate("Messages")
  }
  }
renderTime(props) {
      return (
        <Time
          {...props}
          timeTextStyle={{
            right: {
              color: "white"
            },
            left: {
              color: "white"
            }
          }}
        />
      );
    }
renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            opacity: 1,
            backgroundColor: global.themeColor
          },
          left: {
            backgroundColor: 'rgba(40,44,52,0.8)',
          }
        }}
        textProps={{
          style: {
            color: props.position === 'left' ? 'white' : 'white',
          },
        }}
        textStyle={{
          left: {
            color: 'white',
          },
          right: {
            color: 'white',
          },
        }}
      />
    )
  }
  renderMessageImage = (props) => {
    let image = props.currentMessage.image;

    return (
        <MessageImage
            {...props}
            imageProps={{key: this.state.reRender}}
        />)
}
renderLoadEarlier(props){
  var lang = language[global.lang]
  return(
    <LoadEarlier
      {...props}
      label = {lang.LoadEarlierMessages}>
    </LoadEarlier>
  )
}
renderSend(props) {
  var lang = language[global.lang]
      return (
          <Send
              {...props}
              alwaysShowSend = {true}
              label = {lang.Send}
              textStyle={{
                color: global.themeColor
              }}
          >

          </Send>
      );
  }
messengerBarContainer(props){
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(244,244,244,1)",
          borderTopColor: "rgba(88,88,88,1)"}}>
      </InputToolbar>
    );
  };
get user() {
  return {
    _id: firebaseSvc.uid,
    r: global.receiverUid,
  };
}
onPressPlus(){
  Keyboard.dismiss()
  this.setState({isVisible1: true, keyboardOpen: false})
}
closeImageMessage(){
  images = []
  this.setState({renderImageChatScreen: false})
}
onChange(){
  this.setState({reRender: !this.state.reRender})
}
async deleteImageFromArray(){

  this.setState({renderImageChatScreen: false})
  images.splice(this.state.currentIndex, 1)
  if(images.length != 0){
    if(images.length == this.state.currentIndex){
      await this.setState({currentIndex: this.state.currentIndex - 1, renderImageChatScreen: true})
      await this.setState({renderImageChatScreen: false})
      await this.setState({renderImageChatScreen: true})
    }
    else{
      await this.setState({renderImageChatScreen: true})
      await this.setState({renderImageChatScreen: false})
      await this.setState({renderImageChatScreen: true})
    }
  }
}

async deleteMessage(message){
  var messageId;
  messageId = message.id
  messageArray = this.state.messages
  for( i = messageArray.length - 1; i >= 0; i--){
    if(messageId == messageArray[i].id){
      messageArray.splice(i,1)
      break
    }
  }
  this.setState({messages: messageArray})

  await EncryptedStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
    .then(req => {
      if(req){
         return JSON.parse(req)
      }
      else{
        return null
      }
    })
    .then(json => localMessages = json)

  for( i = localMessages.length - 1; i >= 0; i--){
    if(messageId == localMessages[i].id){
      localMessages.splice(i,1)
      break
    }
  }
  EncryptedStorage.setItem(auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMessages))
}
onLongPress(context, message) {
  /* Disabled for now, bugged.
  const options = [lang.DeleteMessage, lang.Cancel];
  const cancelButtonIndex = options.length - 1;
  context.actionSheet().showActionSheetWithOptions({
    options,
    cancelButtonIndex,
  },
  (buttonIndex) => {
    switch (buttonIndex) {
    case 0:
      this.deleteMessage(message)
      break;
    }
  });*/
}

render() {

  lang = language[global.lang]
  var renderKeyboardHeight;
    if(this.state.messages != undefined){
      var msgs = this.state.messages
      if(msgs.length != 0 ){
        global.firstMessage = false
      }
    }
    if(lastMsg == ""){
      global.firstMessage = true
    }

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    //this.state.renderImageChatScreen
    if(keyboardHeight == undefined){
      keyboardHeight = 0
    }
    if(this.state.renderImageChatScreen){
      console.log("HEEY:", this.state.keyboardOpen ? (this.height-getStatusBarHeight())*8/12 - global.keyboardHeight: (this.height-getStatusBarHeight())*10/12)
        return(
          <SafeAreaView>
          <View
          style={{ width: this.width, height: this.height, top: 0, flexDirection:"column"}}>

          <ModifiedStatusBar/>
          <View
          style={{ width: this.width, height: (this.height-getStatusBarHeight())/12, position:"absolute", bottom: this.state.keyboardOpen ? global.keyboardHeight + this.navbarHeight + getStatusBarHeight(): getStatusBarHeight(), backgroundColor:"black"}}/>

          { !this.state.keyboardOpen &&(
            <View
            style={{ backgroundColor:"black", width: this.width, height:(this.height-getStatusBarHeight())*10/12, top: (this.height-getStatusBarHeight())/12, flexDirection:"column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>
            <ImageViewer
            backgroundColor= {"black"}
            index = {this.state.currentIndex}
            onChange={async (index) => { this.setState({ currentIndex: index }) }}
            imageUrls={images}
            onClick = {()=> Keyboard.dismiss()}/>
            </View>
          )}

          { this.state.keyboardOpen &&(
            <View
            style={{ backgroundColor:"black", width: this.width, height: (this.height-getStatusBarHeight())*10/12 - global.keyboardHeight - this.navbarHeight, top: (this.height-getStatusBarHeight())/12, flexDirection:"column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>
            <ImageViewer
            backgroundColor= {"black"}
            index = {this.state.currentIndex}
            onChange={async (index) => { this.setState({ currentIndex: index }) }}
            imageUrls={images}
            onClick = {()=> Keyboard.dismiss()}/>
            </View>
          )}


          <ChatSendImgTopBar
          height = {(this.height-getStatusBarHeight())/12}
          onPressTrash = {()=> this.deleteImageFromArray()}
          onPressCross = {()=> this.closeImageMessage()}/>

          <ChatSendImgBottomBar
            height = {(this.height-getStatusBarHeight())/12}
            sendDisabled = {this.state.imageSendDisabled}
            onPressPlus = {()=> this.onPressPlus()}
            keyboardOpen = {this.state.keyboardOpen}
            keyboardHeight = {keyboardHeight}
            onChangeText = {(text) => this.setState({msgText: text})}
            onPressSend = {()=>this.sendMsgWithImage(this.state.msgText)}
            sendText = {lang.Send}/>
          <ImageUploadModal
          bottom = {this.keyboardOpen ? 55: 0}
          isVisible={this.state.isVisible1}
          txtUploadPhoto = {lang.UploadAPhoto}
          txtCancel = {""}
          txtTakePhoto = {lang.Camera}
          txtOpenLibrary = {lang.Library}
          onPressCancel = {()=>this.setState({ isVisible1: false}) }
          onPressCamera = {this.camera}
          onPressLibrary = {this.library}/>

          </View>
          </SafeAreaView>
        )
    }
    else{
      return(
        <SafeAreaView
        style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

        <View
        activeOpacity = {1}
        style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
         onPress={()=> Keyboard.dismiss() }>

        <ModifiedStatusBar/>

        <View
          style = {{ position: 'absolute', height: Platform.OS === 'android' ? this.state.giftedChatHeight : this.height - this.statusBarHeaderTotalHeight -global.insets.bottom,
          width: this.width, top: headerHeight , right: 0}}>
          <GiftedChat
          isKeyboardInternallyHandled = {Platform.OS === 'android' ? false : true}
          bottomOffset={global.insets.bottom}
          keyboardShouldPersistTaps = {"never"}
          placeholder = {""}
          onLongPress={this.onLongPress}
          renderMessageImage={this.renderMessageImage}
          textInputStyle = {{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
          renderInputToolbar={(props) => this.messengerBarContainer(props)}
            scrollToBottom = {true}
            messages={this.state.messages}
            onSend={this.sendMsg}
            user={this.user}

            renderTime = {this.renderTime}
            renderBubble={this.renderBubble}
            renderLoadEarlier = {this.renderLoadEarlier}
            renderSend = {this.renderSend}
            renderAvatar={null}
          />
        </View>
        <Animated.Image source={{uri: 'loading' + global.themeForImages}}
          style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
        />

        <ChatHeader
        onPressBack = {()=> this.goBackOnPress()}
        onPressInfo = {()=> this.onPressInfo()}
        onPressCamera = {()=> this.onPressCamera()}/>

        <ImageUploadModal
        isVisible={this.state.isVisible1}
        txtUploadPhoto = {lang.UploadAPhoto}
        txtCancel = {""}
        txtTakePhoto = {lang.Camera}
        txtOpenLibrary = {lang.Library}
        onPressCancel = {()=>this.setState({ isVisible1: false}) }
        onPressCamera = {this.camera}
        onPressLibrary = {this.library}/>

        <ChatterInfo
        isVisible = {this.state.photoPopUpIsVisible}
        onBackdropPress = {()=> this.setState({photoPopUpIsVisible: false})}
        onPressImage = {() => {this.setState({imageViewerVisible: true})}}
        username = {global.receiverUsername}
        country = {global.receiverCountry}
        gender = {global.receiverGender}
        bio = {global.receiverBio}
        onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
        imgSource = {global.receiverPhoto}/>

        <ImageViewerModal
        isVisible = {this.state.imageViewerVisible}
        images = {global.receiverPhoto}
        onCancel = {() => {
          this.setState({imageViewerVisible: false})
        }}/>

        </View>
        </SafeAreaView>
      )

    }

  }

  async updateLastSeenFile(){
    var currentTime = "" + new Date().getTime();
    var key = auth().currentUser.uid + "" + global.receiverUid
    EncryptedStorage.setItem(key + 'lastSeen', currentTime )

  }
async getLastLocalMessages(){
    messageArray = []
    messageArray.splice(0, messageArray.length)
    await EncryptedStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
      .then(req => {
        if(req){
           return JSON.parse(req)
        }
        else{
          return null
        }
      })
      .then(json => localMessages = json)
    var number;
    if(localMessages != null){
      if(localMessages.length < 20){
        number = 0
      }
      else{
        number = localMessages.length - 20
      }
      for( i = number; i < localMessages.length; i++){
        messageArray.push(localMessages[i])
      }
    }

  }
resetVariables(){
    lastMsg = ""
    lastSeenInterval;
    localMessages = [];
    messageArray = [];
    localMessages.splice(0, localMessages.length)
    messageArray.splice(0, messageArray.length)
    firstTime = true
  }
}
