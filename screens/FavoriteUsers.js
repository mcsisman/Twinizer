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
import ProfileFavUserScreen from './ProfileFavUser';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileInfo from './components/ProfileInfo'
import SettingsButton from './components/SettingsButton'
import FavoriteUserBox from './components/FavoriteUserBox'
import LogoutButton from './components/LogoutButton'
import ThemeSettingsScreen from './ThemeSettings';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var favoriteUserUids = [];
var favoriteUserUsernames = []
var usernameListener = []
var noOfFavUsers;
var imageUrls = [];
var colorArray = []
var focusedtoThisScreen = false;
export default class FavoriteUsersScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      loadingDone: false,
      editPressed: false,
      favoriteBoxDisabled: false,
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
    console.log("component did mount in favorite users")
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.spinAnimation()
      console.log("focused on favorite users")
      focusedtoThisScreen = true
      if(global.selectedFavUserIndex != null){
        await usernameListener[global.selectedFavUserIndex].on('value',
        async snap => await this.listenerFunc(snap, global.selectedFavUserIndex, favoriteUserUids[global.selectedFavUserIndex]));
      }
      await this.initializeFavoriteUsersScreen()
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
  favoriteBoxAnimation(){
    if(this.state.editText == "Cancel"){
      Animated.timing(this.leftAnimation, {
        duration: 200,
        toValue: -this.width*(2/16),
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start()
    }
    if(this.state.editText == "Edit"){
      Animated.timing(this.leftAnimation, {
        duration: 200,
        toValue: 0,
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start()
    }
  }
  editButtonPressed(){

    for( let i = 0; i < noOfFavUsers; i++){
      colorArray[i] = "trashgray"
    }
    console.log("edit button pressed")
    if(this.state.editText == "Edit"){
      this.setState({favoriteBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
      this.favoriteBoxAnimation()
    }
    else{
      this.setState({favoriteBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
      this.favoriteBoxAnimation()
      }
    }

async initializeFavoriteUsersScreen(){
  await this.getFavoriteUserUids()
  if(!global.favoriteUsersListeners){
    await this.createUsernameArray()
  }
}

  async getFavoriteUserUids(){
    await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'favoriteUsers')
      .then(req => JSON.parse(req))
      .then(json => {
        favoriteUserUids = json
        if(favoriteUserUids == null || favoriteUserUids == undefined){
          noOfFavUsers = 0
        }
        else{
          noOfFavUsers = favoriteUserUids.length
        }
      })
    console.log("favUsers: ", favoriteUserUids)
    console.log("noOfFavUsers: ", noOfFavUsers)
    this.setState({loadingDone: true})
  }
  async createUsernameArray(){
    console.log("noOfFavUsers in createUsernameArray: ", noOfFavUsers)
    for(let i = 0; i < noOfFavUsers; i++){
      console.log("inside for iteration: ", i)
      await this.getImageURL(favoriteUserUids[i], i)
      await this.getUsernameOfTheUid(favoriteUserUids[i], i)
    }
    global.favoriteUsersListeners = true
  }

  async getUsernameOfTheUid(uid, i){
    console.log("inside getUsernameOfTheUid: ", uid)
    usernameListener[i] = firebase.database().ref('Users/' + uid + "/i/u")
    await usernameListener[i].on('value', async snap => await this.listenerFunc(snap, i, uid));
  }
listenerFunc = async (snap, i, conversationUid) => {
    console.log("FavoriteUsers Listener")
    favoriteUserUsernames[i] = snap.val()
    if(focusedtoThisScreen){
      this.setState({reRender: !this.state.reRender})
    }
  }

  async getImageURL(uid, i){
      var storageRef = firebase.storage().ref("Photos/" + uid + "/1.jpg")
      await storageRef.getDownloadURL().then(data =>{
        imageUrls[i] = data
      }).catch(function(error) {
        // Handle any errors
      });
  }

  renderFavoriteUserBoxes(){
      var scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
      var boxes = [];
      if(noOfFavUsers == 0){
        return(
          <View style = {{flex: 1, flexDirection: "column", width: this.width, height: scrollViewHeight}}>

          <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, top: scrollViewHeight/4,  height: scrollViewHeight/4}}>
          <Text
            style = {{fontSize: 25, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
            No favorite users
          </Text>
          </View>
          </View>
        )
      }
      else{
        for( let i = 0; i < noOfFavUsers; i++){

          const temp = i
          console.log("FAVORITE USERNAME ARRAY:", favoriteUserUsernames[temp])
          boxes.push(
            <FavoriteUserBox
            left = {this.leftAnimation}
            trashImage = {colorArray[temp]}
            trashOnPress = {()=> this.trashButtonPressed(temp)}
            photoSource = {imageUrls[temp]}
            disabled = {this.state.favoriteBoxDisabled}
            text = {favoriteUserUsernames[temp]}
            onPress = {()=>this.select(imageUrls[temp], favoriteUserUids[temp], usernameListener[temp], temp)}
            key={i}/>
          )
        }
      }
      return boxes;
}

donePress(){
  for(let i = 0; i < noOfFavUsers; i++){
    if(colorArray[i] == "trash" + global.themeForImages){
      imageUrls.splice(i,1)
      favoriteUserUids.splice(i,1)
      usernameListener[i].off()
      usernameListener.splice(i,1)
      favoriteUserUsernames.splice(i,1)
      noOfFavUsers = noOfFavUsers - 1
    }
  }
  for( let i = 0; i < noOfFavUsers; i++){
    colorArray[i] = "trashgray"
  }
  this.setState({favoriteBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
  this.favoriteBoxAnimation()
  AsyncStorage.setItem(firebase.auth().currentUser.uid + 'favoriteUsers', JSON.stringify(favoriteUserUids))
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

goBack(){
  focusedtoThisScreen = false
  global.selectedFavUserIndex = null
  this.props.navigation.navigate("Settings")
}
select(url, uid, listener, index){
  listener.off()
  global.selectedFavUserUid = uid
  global.selectedFavUserUrl = url
  global.selectedFavUserIndex = index
  navigate("ProfileFavUser")
}

  render(){
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const {navigate} = this.props.navigation;

    console.log("EDIT PRESSED?", this.state.editPressed)
    if(!this.state.loadingDone){
      return(
        <View
        style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"FavoriteUsers"}
        onPress = {()=> this.goBack()}
        isFilterVisible = {this.state.showFilter}
        title = {"Favorite Users"}>
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
          whichScreen = {"FavoriteUsers"}
          onPress = {()=> this.goBack()}
          isFilterVisible = {this.state.showFilter}
          title = {"Favorite Users"}>
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
            renderItem = {()=>this.renderFavoriteUserBoxes()}
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
          whichScreen = {"FavoriteUsers"}
          isFilterVisible = {this.state.showFilter}
          onPress = {()=> this.goBack()}
          title = {"Favorite Users"}>
          </CustomHeader>

          <View style = {{opacity: favoriteUserUids.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
            onPress={()=>this.editButtonPressed()}
            disabled = {noOfFavUsers == 0 ? true : false}>
          <Text style = {{fontSize: 20, color: global.themeColor}}>
          {this.state.editText}
          </Text>
          </TouchableOpacity>
          </View>

          <FlatList
            style = {{ height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(),
            width: this.width,flex: 1, flexDirection: 'column'}}
            renderItem = {()=>this.renderFavoriteUserBoxes()}
            data = { [{bos:"boş", key: "key"}]}
            refreshing = {true}>
          </FlatList>

        </View>

        );
      }
    }
  }}
