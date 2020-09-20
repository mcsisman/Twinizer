import React from 'react';
import { InputToolbar, Send, Bubble, Time, GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from './FirebaseSvc';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ChatHeader from './components/ChatHeader'
import ImageUploadModal from './components/ImageUploadModal'
import ChatterInfo from './components/ChatterInfo'
import MessagesScreen from './Messages'
import ImageViewerModal from './components/ImageViewerModal'
import ImagePicker from 'react-native-image-crop-picker';
import ChatSendImgBottomBar from './components/ChatSendImgBottomBar'
import ChatSendImgTopBar from './components/ChatSendImgTopBar'
import CustomInputToolbar  from './components/CustomInputToolbar'
import ImageViewer from 'react-native-image-zoom-viewer';
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
    this.state = {
      imageViewerVisible: false,
      msgText: " ",
      currentIndex: 0,
      enableSwipeDown: false,
      bigViewerOpacity: 1,
      smallViewerOpacity:0,
      isVisible1: false,
      reRender: "ok",
      renderImageChatScreen: false,
      test: "",
      photoPopUpIsVisible: false,
      keyboardOpen: false,
    }

    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight

    this.windowHeight = Math.round(Dimensions.get('window').height);
    this.navbarHeight = this.height - this.windowHeight
    this.spinValue = new Animated.Value(0)
    firstTime = true
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
      this._subscribe = this.props.navigation.addListener('focus', async () => {

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
      if(global.currentProcessUidArray[global.receiverUid]){
        firebaseSvc.removeOn(async message =>{
          message.reverse()
          this.setState({messages: message})
          firebaseSvc.removeOff()
        })

      }
      firebaseSvc.refOn(async message =>{
        if(message != null){
          if(!firstTime){
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, message),
            }))
          }
          else{
            await this.getLastLocalMessages()
            messageArray.reverse()
            this.setState({
                messages: messageArray,
                loadingOpacity: 0
            })
          }
          firstTime = false
        }
      })
    }

componentWillUnmount() {
  clearInterval(lastSeenInterval)
  firebaseSvc.refOff();
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
    renderImageChatScreen: false
  })
}

  static navigationOptions = {
      header: null,
  };
_keyboardDidShow = (e) => {
  const { height, screenX, screenY, width } = e.endCoordinates
  keyboardYcord = screenY
  keyboardHeight = height
  this.setState({keyboardOpen: true, bigViewerOpacity: 0, smallViewerOpacity:1, enableSwipeDown: false,})
};
_keyboardDidHide = () => {
  this.setState({keyboardOpen: false, bigViewerOpacity: 1, smallViewerOpacity:0, enableSwipeDown: false, })
};

onPressCamera(){
  Keyboard.dismiss()
  this.setState({isVisible1: true})
}
library = () =>{
  ImagePicker.openPicker({
    cropping: true
  }).then(image1 => {
    this.setState({
      photoPath: image1.path,
      photo: {uri: image1.path},
      isVisible1: false,
    });
    this.imageSelected()
  });
};
camera = () => {
  ImagePicker.openCamera({
    cropping: true
  }).then(image1 => {
    this.setState({
      photoPath: image1.path,
      photo: {uri: image1.path},
      isVisible1: false,
    });
    this.imageSelected()
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
    global.comingFromChat = true

    this.props.navigation.navigate("Messages")
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
renderSend(props) {
      return (
          <Send
              {...props}
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
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
          borderTopColor: "rgba(177,177,177,1)"}}>
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
  this.setState({isVisible1: true})
}
closeImageMessage(){
  images = []
  this.setState({renderImageChatScreen: false})
}
onChange(){
  this.setState({reRender: "ok"})
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

  await AsyncStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
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
  AsyncStorage.setItem(auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMessages))
}
onLongPress(context, message) {
  const options = ['Delete Message', 'Cancel'];
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
    });
}

render() {
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
        return(
          <View
          style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, flexDirection:"column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

          <ModifiedStatusBar/>

          <ImageViewer
          index = {this.state.currentIndex}
          onChange={async (index) => { this.setState({ currentIndex: index }) }}
          imageUrls={images}
          onClick = {()=> Keyboard.dismiss()}/>

          <ChatSendImgTopBar
          onPressTrash = {()=> this.deleteImageFromArray()}
          onPressCross = {()=> this.closeImageMessage()}/>

          <ChatSendImgBottomBar
            onPressPlus = {()=> this.onPressPlus()}
            keyboardOpen = {this.state.keyboardOpen}
            keyboardHeight = {keyboardHeight}
            onChangeText = {(text) => this.setState({msgText: text})}
            onPressSend = {()=>this.sendMsgWithImage(this.state.msgText)}/>
          <ImageUploadModal
          bottom = {keyboardHeight/2}
          isVisible={this.state.isVisible1}
          txtUploadPhoto = {global.langUploadPhoto}
          txtCancel = {global.langCancel}
          txtTakePhoto = {global.langTakePhoto}
          txtOpenLibrary = {global.langLibrary}
          onPressCancel = {()=>this.setState({ isVisible1: false}) }
          onPressCamera = {this.camera}
          onPressLibrary = {this.library}/>
          </View>
        )
    }
    else{
      if(global.firstMessage){
        if(Platform.OS === 'ios'){
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

            <TouchableOpacity
            activeOpacity = {1}
            style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
             onPress={()=> Keyboard.dismiss() }>

            <ModifiedStatusBar/>

            <View
              style = {{ position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
              onLongPress={this.onLongPress}
              textInputStyle = {{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
              renderInputToolbar={(props) => this.messengerBarContainer(props)}
                scrollToBottom = {true}
                messages={this.state.messages}
                onSend={this.sendMsg}
                user={this.user}
                loadEarlier = {true}
                renderTime = {this.renderTime}
                renderBubble={this.renderBubble}
                renderSend = {this.renderSend}
                renderAvatar={null}
              />
            </View>

            <ChatHeader
            onPressBack = {()=> this.goBackOnPress()}
            onPressInfo = {()=> this.onPressInfo()}
            onPressCamera = {()=> this.onPressCamera()}/>

            <ImageUploadModal
            isVisible={this.state.isVisible1}
            txtUploadPhoto = {global.langUploadPhoto}
            txtCancel = {global.langCancel}
            txtTakePhoto = {global.langTakePhoto}
            txtOpenLibrary = {global.langLibrary}
            onPressCancel = {()=>this.setState({ isVisible1: false}) }
            onPressCamera = {this.camera}
            onPressLibrary = {this.library}/>

            <ChatterInfo
            isVisible = {this.state.photoPopUpIsVisible}
            onBackdropPress = {()=> this.setState({photoPopUpIsVisible: false})}
            onPressImage = {() => {this.setState({imageViewerVisible: true})}}
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>

            <ImageViewerModal
            isVisible = {this.state.imageViewerVisible}
            images = {global.receiverPhoto}
            onCancel = {() => {
              this.setState({imageViewerVisible: false})
            }}/>

            </TouchableOpacity>
            </View>
          )
        }
        else{
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

            <TouchableOpacity
            activeOpacity = {1}
            style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
             onPress={()=> Keyboard.dismiss() }>

            <ModifiedStatusBar/>

            <KeyboardAvoidingView  behavior="padding"
              keyboardVerticalOffset={this.state.keyboardOpen ? -this.height+getStatusBarHeight() : 0}
              style = {{  position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0, flex: 1}}>
              <GiftedChat
              onLongPress={this.onLongPress}
              textInputStyle = {{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
              renderInputToolbar={(props) => this.messengerBarContainer(props)}
                scrollToBottom = {true}
                messages={this.state.messages}
                onSend={this.sendMsg}
                user={this.user}
                loadEarlier = {true}
                renderTime = {this.renderTime}
                renderBubble={this.renderBubble}
                renderSend = {this.renderSend}
                renderAvatar={null}
              />
            </KeyboardAvoidingView>

            <ChatHeader
            onPressBack = {()=> this.goBackOnPress()}
            onPressInfo = {()=> this.onPressInfo()}
            onPressCamera = {()=> this.onPressCamera()}/>

            <ImageUploadModal
            isVisible={this.state.isVisible1}
            txtUploadPhoto = {global.langUploadPhoto}
            txtCancel = {global.langCancel}
            txtTakePhoto = {global.langTakePhoto}
            txtOpenLibrary = {global.langLibrary}
            onPressCancel = {()=>this.setState({ isVisible1: false}) }
            onPressCamera = {this.camera}
            onPressLibrary = {this.library}/>

            <ChatterInfo
            isVisible = {this.state.photoPopUpIsVisible}
            onBackdropPress = {()=> this.setState({photoPopUpIsVisible: false})}
            onPressImage = {() => {this.setState({imageViewerVisible: true})}}
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>

            <ImageViewerModal
            isVisible = {this.state.imageViewerVisible}
            images = {global.receiverPhoto}
            onCancel = {() => {
              this.setState({imageViewerVisible: false})
            }}/>

            </TouchableOpacity>
            </View>
          )
        }
      }
      else{
        if(Platform.OS === 'ios'){
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

            <TouchableOpacity
            activeOpacity = {1}
            style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
             onPress={()=> Keyboard.dismiss() }>

            <ModifiedStatusBar/>

            <View
              style = {{ position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
              onLongPress={this.onLongPress}
              textInputStyle = {{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
              renderInputToolbar={(props) => this.messengerBarContainer(props)}
                scrollToBottom = {true}
                messages={this.state.messages}
                onSend={this.sendMsg}
                user={this.user}
                loadEarlier = {true}
                renderTime = {this.renderTime}
                renderBubble={this.renderBubble}
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
            txtUploadPhoto = {global.langUploadPhoto}
            txtCancel = {global.langCancel}
            txtTakePhoto = {global.langTakePhoto}
            txtOpenLibrary = {global.langLibrary}
            onPressCancel = {()=>this.setState({ isVisible1: false}) }
            onPressCamera = {this.camera}
            onPressLibrary = {this.library}/>

            <ChatterInfo
            isVisible = {this.state.photoPopUpIsVisible}
            onBackdropPress = {()=> this.setState({photoPopUpIsVisible: false})}
            onPressImage = {() => {this.setState({imageViewerVisible: true})}}
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>

            <ImageViewerModal
            isVisible = {this.state.imageViewerVisible}
            images = {global.receiverPhoto}
            onCancel = {() => {
              this.setState({imageViewerVisible: false})
            }}/>

            </TouchableOpacity>
            </View>
          )
        }
        else{
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}}>

            <TouchableOpacity
            activeOpacity = {1}
            style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}
             onPress={()=> Keyboard.dismiss() }>

            <ModifiedStatusBar/>

            <KeyboardAvoidingView  behavior="padding"
              keyboardVerticalOffset={this.state.keyboardOpen && Platform.OS === 'android' ? -this.height+getStatusBarHeight() : 0}
              style = {{  position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0, flex: 1}}>
              <GiftedChat
              onLongPress={this.onLongPress}
              textInputStyle = {{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}
              renderInputToolbar={(props) => this.messengerBarContainer(props)}
                scrollToBottom = {true}
                messages={this.state.messages}
                onSend={this.sendMsg}
                user={this.user}
                loadEarlier = {true}
                renderTime = {this.renderTime}
                renderBubble={this.renderBubble}
                renderSend = {this.renderSend}
                renderAvatar={null}
              />
            </KeyboardAvoidingView>
            <Animated.Image source={{uri: 'loading' + global.themeForImages}}
              style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
            />

            <ChatHeader
            onPressBack = {()=> this.goBackOnPress()}
            onPressInfo = {()=> this.onPressInfo()}
            onPressCamera = {()=> this.onPressCamera()}/>

            <ImageUploadModal
            isVisible={this.state.isVisible1}
            txtUploadPhoto = {global.langUploadPhoto}
            txtCancel = {global.langCancel}
            txtTakePhoto = {global.langTakePhoto}
            txtOpenLibrary = {global.langLibrary}
            onPressCancel = {()=>this.setState({ isVisible1: false}) }
            onPressCamera = {this.camera}
            onPressLibrary = {this.library}/>

            <ChatterInfo
            isVisible = {this.state.photoPopUpIsVisible}
            onBackdropPress = {()=> this.setState({photoPopUpIsVisible: false})}
            onPressImage = {() => {this.setState({imageViewerVisible: true})}}
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>

            <ImageViewerModal
            isVisible = {this.state.imageViewerVisible}
            images = {global.receiverPhoto}
            onCancel = {() => {
              this.setState({imageViewerVisible: false})
            }}/>

            </TouchableOpacity>
            </View>
          )
        }
      }
    }

  }

  async updateLastSeenFile(){
    var currentTime = "" + new Date().getTime();
    var key = auth().currentUser.uid + "" + global.receiverUid
    AsyncStorage.setItem(key + 'lastSeen', currentTime )

  }
async getLastLocalMessages(){
    messageArray = []
    messageArray.splice(0, messageArray.length)
    await AsyncStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
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
