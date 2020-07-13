import firebase from 'firebase';
import React from 'react';
import { Send, Bubble, Time, GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from './FirebaseSvc';
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
import ImagePicker from 'react-native-image-crop-picker';
import ChatSendImgBottomBar from './components/ChatSendImgBottomBar'
import ChatSendImgTopBar from './components/ChatSendImgTopBar'
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
var isRequest = "t"
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
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
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
  firebaseSvc.send(messages)
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages[0]),
  }))
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
  var image = {
    url: this.state.photoPath,
    props: {
    }
  }
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
            backgroundColor: 'rgba(115,201,144,1)'
          },
          left: {
            backgroundColor: 'rgba(40,44,52,0.5)',
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
                color:"rgba(241,51,18,1)"
              }}
          >

          </Send>
      );
  }
get user() {
  return {
    _id: firebaseSvc.uid,
    r: global.receiverUid,
  };
}

render() {
  var renderKeyboardHeight;
    isRequest = "t"
    // IF THERE IS AT LEAST ONE isRequest = false, the conversation is a message
    if(this.state.messages != undefined){
      var msgs = this.state.messages
      if(msgs.length != 0 ){
        this.state.messages.forEach(message=>{
          if(message.isRequest == "f"){
            isRequest = "f"
          }
        })
        global.firstMessage = false
        lastMsg = this.state.messages[0]
      }

    }
    // IF THERE ARE NO MESSAGES, IT'S THE FIRST MESSAGE
    if(lastMsg == ""){
      global.firstMessage = true
    }
    else{     // IF THERE IS AT LEAST ONE isRequest = false, the conversation is a message
      global.lastMsg = lastMsg
      global.isRequest = isRequest
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
          style={{backgroundColor: "white", width: this.width, height: this.height, top: 0, flexDirection:"column"}}>

          <ModifiedStatusBar/>

          <ImageViewer
          imageUrls={images}
          onClick = {()=> Keyboard.dismiss()}/>

          <ChatSendImgTopBar/>

          <ChatSendImgBottomBar
            keyboardOpen = {this.state.keyboardOpen}
            keyboardHeight = {keyboardHeight}/>
          </View>
        )
    }
    else{
      if(global.firstMessage){
        if(Platform.OS === 'ios'){
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0}}>

            <ModifiedStatusBar/>

            <View
              style = {{ position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
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
            onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}
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
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>

            </View>
          )
        }
        else{
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0}}>

            <ModifiedStatusBar/>

            <KeyboardAvoidingView  behavior="padding"
              style = {{  position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
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
            onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}
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
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>
            </View>
          )
        }
      }
      else{
        if(Platform.OS === 'ios'){
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0}}>

            <ModifiedStatusBar/>

            <View
              style = {{ position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
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
            <Animated.Image source={{uri: 'loading'}}
              style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
            />

            <ChatHeader
            onPressBack = {()=> this.goBackOnPress()}
            onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}
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
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>
            </View>
          )
        }
        else{
          return(
            <View
            style={{backgroundColor: "white", width: this.width, height: this.height, top: 0}}>

            <ModifiedStatusBar/>

            <KeyboardAvoidingView  behavior="padding"
              style = {{  position: 'absolute', height: this.height-this.statusBarHeaderTotalHeight,
              width: this.width, bottom: 0, right: 0}}>
              <GiftedChat
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
            <Animated.Image source={{uri: 'loading'}}
              style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
            />

            <ChatHeader
            onPressBack = {()=> this.goBackOnPress()}
            onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}
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
            username = {global.receiverUsername}
            bio = {"\"Ne Ne bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunNe bakıyorsunbakıyorsun\""}
            onPressCancel = {()=>this.setState({photoPopUpIsVisible:false}) }
            imgSource = {global.receiverPhoto}/>
            </View>
          )
        }
      }
    }

  }

  async updateLastSeenFile(){
    var currentTime = "" + new Date().getTime();
    var key = firebase.auth().currentUser.uid + "" + global.receiverUid
    AsyncStorage.setItem(key + 'lastSeen', currentTime )

  }
async getLastLocalMessages(){
    messageArray = []
    messageArray.splice(0, messageArray.length)
    await AsyncStorage.getItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages')
      .then(req => JSON.parse(req))
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
    isRequest = "t"
    lastMsg = ""
    lastSeenInterval;
    localMessages = [];
    messageArray = [];
    localMessages.splice(0, localMessages.length)
    messageArray.splice(0, messageArray.length)
    firstTime = true
  }
}
