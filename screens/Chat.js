import firebase from 'firebase';
import React from 'react';
import { Bubble, Time, GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from './FirebaseSvc';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { Header } from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ChatHeader from './components/ChatHeader'
import ChatterInfo from './components/ChatterInfo'
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
   Platform
  } from 'react-native';
var isRequest = "t"
var lastMsg = ""
var lastSeenInterval;
var localMessages = [];
var messageArray = [];
var firstTime = true
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
    this.state = {
      test: "",
      photoPopUpIsVisible: false,
    }
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.spinValue = new Animated.Value(0)
    firstTime = true
  }

  static navigationOptions = {
      header: null,
  };

  state = {
    messages: [],
  };

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

    this.props.navigation.goBack()
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
  get user() {
    return {
      _id: firebaseSvc.uid,
      r: global.receiverUid,
    };
  }

  render() {
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
              onSend={firebaseSvc.send}
              user={this.user}
              loadEarlier = {true}
              renderTime = {this.renderTime}
              renderBubble={this.renderBubble}
              renderAvatar={null}
            />
          </View>

          <ChatHeader
          onPressBack = {()=> this.goBackOnPress()}
          onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}/>

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
              onSend={firebaseSvc.send}
              user={this.user}
              loadEarlier = {true}
              renderTime = {this.renderTime}
              renderBubble={this.renderBubble}
              renderAvatar={null}
            />
          </KeyboardAvoidingView>

          <ChatHeader
          onPressBack = {()=> this.goBackOnPress()}
          onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}/>

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
              onSend={firebaseSvc.send}
              user={this.user}
              loadEarlier = {true}
              renderTime = {this.renderTime}
              renderBubble={this.renderBubble}
              renderAvatar={null}
            />
          </View>
          <Animated.Image source={{uri: 'loading'}}
            style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
          />

          <ChatHeader
          onPressBack = {()=> this.goBackOnPress()}
          onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}/>

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
              onSend={firebaseSvc.send}
              user={this.user}
              loadEarlier = {true}
              renderTime = {this.renderTime}
              renderBubble={this.renderBubble}
              renderAvatar={null}
            />
          </KeyboardAvoidingView>
          <Animated.Image source={{uri: 'loading'}}
            style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15), position: 'absolute', bottom: this.height/2, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
          />

          <ChatHeader
          onPressBack = {()=> this.goBackOnPress()}
          onPressInfo = {()=> this.setState({photoPopUpIsVisible: true})}/>

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
  componentDidMount() {

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
    })
  }

  componentWillUnmount() {
    clearInterval(lastSeenInterval)
    firebaseSvc.refOff();
  }
}
