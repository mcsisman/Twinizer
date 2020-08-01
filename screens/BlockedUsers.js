import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import {navigate, route} from './RootNavigation'
import * as firebase from "firebase";
import AsyncStorage from '@react-native-community/async-storage';

import {Image,
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
   FlatList
  } from 'react-native';

import MessagesScreen from './Messages';
import MainScreen from './Main';
import HistoryScreen from './History';
import ProfileScreen from './Profile';
import ProfileBlockedUserScreen from './ProfileBlockedUser';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'
import BlockedUserBox from './components/BlockedUserBox'
import LogoutButton from './components/LogoutButton'
import ThemeSettingsScreen from './ThemeSettings';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var blockedUserUids = [];
var blockedUserUsernames = []
var usernameListener = []
var noOfBlockedUsers;
var colorArray = [];
var imageUrls = [];
var focusedtoThisScreen = false;
export default class BlockedUsersScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      loadingDone: false,
      editPressed: false,
      blockedBoxDisabled: false,
      doneDisabled: true,
      editText: "Edit",
      editPressed: false,
      cancelPressed: true,
      reRender: false
    }
    this.spinValue = new Animated.Value(0)
    this.leftAnimation = new Animated.Value(-this.width/8)
  }
  static navigationOptions = {
      header: null,
  };
  componentDidMount(){
    this.setState({loadingDone: false})
    this.spinAnimation()
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.spinAnimation()
      focusedtoThisScreen = true
      if(global.selectedBlockedUserIndex != null && !global.removeFromBlockedUser){
        await usernameListener[global.selectedBlockedUserIndex].on('value',
        async snap => await this.listenerFunc(snap, global.selectedBlockedUserIndex, blockedUserUids[global.selectedBlockedUserIndex]));
      }
      if(global.removeFromBlockedUser){
        this.removeFromUser()
      }
      await this.initializeBlockedUsersScreen()
      this.leftAnimation = new Animated.Value(-this.width/8)
      this.setState({reRender: "ok"})
    })
  }
  updateState = () =>{
    this.setState({reRender: "ok"})
    return "TESTTTT"
  }
  spinAnimation(){
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
  blockedBoxAnimation(){
    if(this.state.editText == "Cancel"){
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: -this.width*(2/16),
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
  editButtonPressed(){

    for( i = 0; i < noOfSearch; i++){
      colorArray[i] = "trashgray"
    }
    if(this.state.editText == "Edit"){
      this.setState({blockedBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
      this.historyBoxAnimation()
    }
    else{
      this.setState({blockedBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
      this.historyBoxAnimation()
      }
    }

async initializeBlockedUsersScreen(){
  await this.getBlockedUserUids()
  if(global.blockedUsersListeners < noOfBlockedUsers){
    await this.createUsernameArray()
  }
}

  async getBlockedUserUids(){

    await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'blockedUsers')
      .then(req => JSON.parse(req))
      .then(json => {
        blockedUserUids = json
        if(blockedUserUids == null || blockedUserUids == undefined){
          noOfBlockedUsers = 0
        }
        else{
          noOfBlockedUsers = blockedUserUids.length
        }
      })
    this.setState({loadingDone: true})
  }
  async createUsernameArray(){
    for( let i = global.blockedUsersListeners; i < noOfBlockedUsers; i++){
      await this.getUsernameOfTheUid(blockedUserUids[i], i)
    }
    global.blockedUsersListeners = noOfBlockedUsers
  }

  async getUsernameOfTheUid(uid, i){
    usernameListener[i] = firebase.database().ref('Users/' + uid + "/i/u")
    const firstTotalblocks = noOfBlockedUsers
    await usernameListener[i].on('value', async snap => await this.listenerFunc(snap, i, uid,  firstTotalblocks));
  }
listenerFunc = async (snap, i, conversationUid, firstTotal) => {
    console.log("LISTENER")
    var diff = firstTotal - noOfBlockedUsers
    blockedUserUsernames[i-diff] = snap.val()
    if(focusedtoThisScreen){
      this.setState({reRender: !this.state.reRender})
    }
  }

  renderBlockedUserBoxes(){
      var scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
      var boxes = [];
      if(noOfBlockedUsers == 0){
        return(
          <View style = {{flex: 1, flexDirection: "column", width: this.width, height: scrollViewHeight}}>

          <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, top: scrollViewHeight/4,  height: scrollViewHeight/4}}>
          <Text
            style = {{fontSize: 25, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
            No blocked users
          </Text>
          </View>
          </View>
        )
      }
      else{
        for( let i = 0; i < noOfBlockedUsers; i++){

          const temp = i
          boxes.push(
            <BlockedUserBox
            left = {this.leftAnimation}
            trashImage = {colorArray[temp]}
            trashOnPress = {()=> this.trashButtonPressed(temp)}
            photoSource = {imageUrls[temp]}
            disabled = {this.state.blockedBoxDisabled}
            text = {blockedUserUsernames[temp]}
            onPress = {()=>this.select(imageUrls[temp], blockedUserUids[temp], usernameListener[temp], temp)}
            key={i}/>
          )
        }
      }
      return boxes;
}

editButtonPressed(){
  for( let i = 0; i < noOfBlockedUsers; i++){
    colorArray[i] = "trashgray"
  }
  if(this.state.editText == "Edit"){
    this.setState({blockedBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
    this.blockedBoxAnimation()
  }
  else{
    this.setState({blockedBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
    this.blockedBoxAnimation()
    }
}
donePress(){
  var limit = noOfBlockedUsers
  for(let i = limit-1; i >= 0; i--){
    if(colorArray[i] == "trash" + global.themeForImages){
      imageUrls.splice(i,1)
      blockedUserUids.splice(i,1)
      usernameListener[i].off()
      usernameListener.splice(i,1)
      blockedUserUsernames.splice(i,1)
      noOfBlockedUsers = noOfBlockedUsers - 1
    }
  }
  for( let i = 0; i < noOfBlockedUsers; i++){
    colorArray[i] = "trashgray"
  }
  this.setState({blockedBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
  this.blockedBoxAnimation()
  AsyncStorage.setItem(firebase.auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUserUids))
}

arrangeDoneColor(){
    var flag1 = false
    for(let i = 0; i < colorArray.length; i++){
      if( colorArray[i] == "trash" + global.themeForImages){
        flag1 = true
        doneColor = global.themeColor
        this.setState({doneDisabled: false})
        break
      }
    }
    if(!flag1){
      doneColor = 'rgba(128,128,128,1)'
      this.setState({doneDisabled: true})
    }
  }
async trashButtonPressed(i){
  if(colorArray[i] == "trashgray"){
    colorArray[i] = "trash" + global.themeForImages
  }
  else{
    colorArray[i] = "trashgray"
  }
  this.arrangeDoneColor()
}

select(url, uid, listener, index){
  listener.off()
  global.selectedBlockedUserUid = uid
  global.selectedBlockedUserUrl = url
  global.selectedBlockedUserIndex = index
  navigate("ProfileBlockedUser")
}

goBack(){
  focusedtoThisScreen = false
  global.selectedBlockedUserIndex = null
  this.props.navigation.navigate("Settings")
}

removeFromUser(){
  imageUrls.splice(global.selectedBlockedUserIndex,1)
  blockedUserUids.splice(global.selectedBlockedUserIndex,1)
  usernameListener.splice(global.selectedBlockedUserIndex,1)
  blockedUserUsernames.splice(global.selectedBlockedUserIndex,1)
  noOfBlockedUsers = noOfBlockedUsers - 1
  global.removeFromBlockedUser = false
  global.blockedUsersListeners = global.blockedUsersListeners - 1
  this.setState({reRender: !this.state.reRender})
  AsyncStorage.setItem(firebase.auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUserUids))
}

  render(){
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const {navigate} = this.props.navigation;

    if(!this.state.loadingDone){
      return(
        <View
        style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"BlockedUsers"}
        onPress = {()=> this.goBack()}
        isFilterVisible = {this.state.showFilter}
        title = {"Blocked Users"}>
        </CustomHeader>

        <Animated.Image source={{uri: 'loading' + global.themeForImages}}
          style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15),
          position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
        />
        </View>
      )
    }
    else{
      if(this.state.editPressed){
        return(
          <View
          style={{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)" ,width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
          <ModifiedStatusBar/>

          <CustomHeader
          whichScreen = {"BlockedUsers"}
          onPress = {()=> this.goBack()}
          isFilterVisible = {this.state.showFilter}
          title = {"Blocked Users"}>
          </CustomHeader>
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
            disabled = {this.state.doneDisabled}
            style={{opacity: this.state.doneDisabled ? 0 : 1, position: "absolute", right: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
            onPress = {()=> this.donePress()}>
          <Text style = {{fontSize: 20, color: global.themeColor}}>
          Done
          </Text>
          </TouchableOpacity>

          </View>

          <FlatList
            style = {{ height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(),
            width: this.width, flex: 1, flexDirection: 'column'}}
            renderItem = {()=>this.renderBlockedUserBoxes()}
            data = { [{bos:"boş", key: "key"}]}
            refreshing = {true}>
          </FlatList>


        </View>

      );
      }
      else{
        return(
          <View
          style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
          <ModifiedStatusBar/>

          <CustomHeader
          whichScreen = {"BlockedUsers"}
          isFilterVisible = {this.state.showFilter}
          onPress = {()=> this.goBack()}
          title = {"Blocked Users"}>
          </CustomHeader>

          <View style = {{opacity: blockedUserUids.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
            onPress={()=>this.editButtonPressed()}
            disabled = {noOfBlockedUsers == 0 ? true : false}>
          <Text style = {{fontSize: 20, color: global.themeColor}}>
          {this.state.editText}
          </Text>
          </TouchableOpacity>
          </View>

          <FlatList
            style = {{ height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(),
            width: this.width,flex: 1, flexDirection: 'column'}}
            renderItem = {()=>this.renderBlockedUserBoxes()}
            data = { [{bos:"boş", key: "key"}]}
            refreshing = {true}>
          </FlatList>

        </View>

        );
      }
    }
  }}
