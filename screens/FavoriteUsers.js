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
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.spinAnimation()
      focusedtoThisScreen = true
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
  editButtonPressed(){
/*
    for( i = 0; i < noOfSearch; i++){
      isSelectedArray[i] = false
      colorArray[i] = "trashgray"
    }*/
    if(this.state.editText == "Edit"){
      this.setState({favoriteBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
      this.historyBoxAnimation()
    }
    else{
      this.setState({favoriteBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
      this.historyBoxAnimation()
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
      .then(json => favoriteUserUids = json)
    if(favoriteUserUids == null || favoriteUserUids == undefined){
      noOfFavUsers = 0
    }
    else{
      noOfFavUsers = favoriteUserUids.length
    }
    console.log("favUsers: ", favoriteUserUids)
    this.setState({loadingDone: true})
  }
  async createUsernameArray(){
    for( i = 0; i < noOfFavUsers; i++){
      await this.getImageURL(favoriteUserUids[i], i)
      await this.getUsernameOfTheUid(favoriteUserUids[i], i)
    }
    global.favoriteUsersListeners = true
  }

  async getUsernameOfTheUid(uid, i){
    usernameListener[i] = firebase.database().ref('Users/' + uid + "/i/u")
    await usernameListener[i].on('value', async snap => await this.listenerFunc(snap, i, uid));
  }
listenerFunc = async (snap, i, conversationUid) => {
    console.log("UIDS:", conversationUid)
    console.log("SNAPSHOT VAL:", snap.val())
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
        for( i = 0; i < noOfFavUsers; i++){

          const temp = i
          console.log("FAVORITE USERNAME ARRAY:", favoriteUserUsernames[temp])
          boxes.push(
            <FavoriteUserBox
            left = {this.leftAnimation}
            photoSource = {imageUrls[temp]}
            disabled = {this.state.favoriteBoxDisabled}
            text = {favoriteUserUsernames[temp]}
            onPress = {()=>console.log("BASTİ")}
            key={i}/>
          )
        }
      }
      return boxes;
}

editButtonPressed(){

}
donePress(){

}
goBack(){
  focusedtoThisScreen = false
  this.props.navigation.goBack()
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
            width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
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
