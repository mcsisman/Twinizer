import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

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
   Keyboard
  } from 'react-native';

import MessagesScreen from './Messages';
import MainScreen from './Main';
import HistoryScreen from './History';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import ProfileCountryGenderButton from './components/ProfileCountryGenderButton'
import ProfileBioButton from './components/ProfileBioButton'
import CountryPicker from './components/CountryPicker'
import LogoutButton from './components/LogoutButton'
import ImageUploadModal from './components/ImageUploadModal'
import FavBlockedUsersButtonModal from './components/FavBlockedUsersButtonModal'
import SendMsgButton from './components/SendMsgButton'
import BlockUserButton from './components/BlockUserButton'
import FavoriteUserButton from './components/FavoriteUserButton'
import countries from './Countries'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var currentUserGender;
var currentUserCountry;
var currentUserUsername;
var currentUserBio;
var listener;
export default class ProfileFavUserScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      removeModalVisible: false,
      blockModalVisible: false,
      profilePhoto: "",
      loadingDone: false,
      userUsername: "",
      userGender: "",
      userCountry: "",
      userBio: "",
      upperComponentsOpacity: 1,
      upperComponentsDisabled: false,
        selection: {
            start: 0,
            end: 0
        }
    }
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.spinValue = new Animated.Value(0)
  }

  async componentDidMount(){
    this.setState({loadingDone: false})
    this.spinAnimation()
    console.log("comp did mount")
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({loadingDone: true, profilePhoto: global.selectedFavUserUrl})
      //this.spinAnimation()
      console.log("subscribe")
      await this.initializeFavoriteUsersScreen()
      this.setState({reRender: "ok"})
    })
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      this.setState({loadingDone: false})
      this.spinAnimation()
    })
  }

static navigationOptions = {
      header: null,
  };

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

  async initializeFavoriteUsersScreen(){
    listener = database().ref('Users/' + global.selectedFavUserUid + "/i")
    await listener.on('value', async snap => await this.listenerFunc(snap));
  }

  listenerFunc = async (snap) => {
      this.setState({userUsername: snap.val().u, userGender: snap.val().g, userCountry: snap.val().c, userBio: snap.val().b})
      console.log("ProfileFavUser Listener")
    }

    goBack(){
      listener.off()
      this.props.navigation.navigate("FavoriteUsers")
    }
  remove(){
    listener.off()
    global.removeFromFavUser = true
    this.props.navigation.navigate("FavoriteUsers")
  }
  async block(){
    listener.off()
    global.removeFromFavUser = true
    await AsyncStorage.getItem(auth().currentUser.uid + 'blockedUsers')
      .then(req => JSON.parse(req))
      .then(json => blockedUsers = json)
    blockedUsers.push(global.selectedFavUserUid)
    AsyncStorage.setItem(auth().currentUser.uid + 'blockedUsers', JSON.stringify(blockedUsers))
    this.props.navigation.navigate("FavoriteUsers")
  }
  sendMsg(){
    global.receiverUid = "pg7bdvxZS0XvAzL4YcU7Tzc3Xpk2"
    global.receiverMail = "cemil.sisman@ug.bilkent.edu.tr"
    global.receiverGender = "Male"
    global.receiverCountry = "Azerbaijan"
    global.receiverUsername = "cemil ug"
    //global.firstMessage = true
    this.props.navigation.navigate("Chat")
  }

  async buttonClicked(whichButton){
    if(whichButton == "block"){
      await this.block()
    }
    if(whichButton == "remove"){
      this.remove()
    }
    this.setState({removeModalVisible:false, blockModalVisible: false})
  }

  render(){
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    var backgroundColor = global.themeColor
    backgroundColor = backgroundColor.slice(0, -2)
    backgroundColor = backgroundColor + "0.2)"
    const {navigate} = this.props.navigation;
    if(!this.state.loadingDone){
      return(
        <View
        style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"Profile"}
        isFilterVisible = {this.state.showFilter}
        title = {"Profile"}>
        </CustomHeader>

        <Animated.Image source={{uri: 'loading' + global.themeForImages}}
          style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15),
          position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingDone ? 0 : 1}}
        />
        </View>
      )
    }
    else{
      return(
        <View
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)", width: this.width, height: this.height, flex:1, flexDirection: "column", alignItems: "center"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"Profile"}
        onPress = {()=> this.goBack()}
        isFilterVisible = {this.state.showFilter}
        title = "Profile">
        </CustomHeader>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width, height: (this.height-this.width/7 - headerHeight - getStatusBarHeight())/2, flexDirection: "row" }}>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>

        <Image
        style={{opacity: this.state.upperComponentsOpacity, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius:12, borderBottomRightRadius:12, width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)}}
        source = {{uri:this.state.profilePhoto}}>
        </Image>

        </View>

        <View
        style={{opacity: this.state.upperComponentsOpacity, bottom: 0, position:"absolute", width: this.width/2,
        height: (this.height-this.width/7 - headerHeight - getStatusBarHeight())/4 - this.width/2*(8/10)*(7/6)/2, justifyContent: "center", alignItems: "center"}}>

        </View>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center", borderWidth: 0.9, borderColor:"gray"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        {this.state.userUsername}
        </Text>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center", borderWidth: 0.9, borderColor:"gray"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        {this.state.userCountry}
        </Text>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center", borderWidth: 0.9, borderColor:"gray"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        {this.state.userGender}
        </Text>
        </View>

        </View>

        </View>

        <View
        style={{width: this.width*4/6, height: this.height*2/10,  borderWidth: 0.9, borderColor:"gray"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        {this.state.userBio}
        </Text>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <View
        style = {{opacity: 1, backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.2)" : "rgba(181,181,181,0.6)" , flexDirection: "row", width: this.width/2, height: this.width/10,
        borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16}}>
        <FavoriteUserButton
        disabled = {false}
        image = {"trashyellow"}
        onPress = {()=> this.setState({removeModalVisible:true})}
        opacity = {1}/>
        <SendMsgButton
        disabled = {false}
        onPress = {async ()=> await this.sendMsg()}
        opacity = {1}/>
        <BlockUserButton
        disabled = {false}
        onPress = {()=>this.setState({blockModalVisible:true})}
        opacity = {1}/>
        </View>

        <FavBlockedUsersButtonModal
        isVisible = {this.state.removeModalVisible}
        txtButton = {"REMOVE"}
        txtAlert= {"You are removing this user from favorites. Are you sure?"}
        onPressAdd= {async ()=> await this.buttonClicked("remove")}
        onPressClose = {()=>this.setState({removeModalVisible:false})}/>

        <FavBlockedUsersButtonModal
        isVisible = {this.state.blockModalVisible}
        txtButton = {"BLOCK"}
        txtAlert= {"You are blocking this user. Are you sure?"}
        onPressAdd= {async ()=> await this.buttonClicked("block")}
        onPressClose = {()=>this.setState({blockModalVisible:false})}/>

      </View>

          );
    }


  }}
