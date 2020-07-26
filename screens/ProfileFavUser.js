import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs'
import * as firebase from "firebase";

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
export default class ProfileFavUserScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      profilePhoto: global.selectedFavUserUrl,
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
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({loadingDone: true})
      //this.spinAnimation()
      await this.checkIfUserDataExistsInLocalAndSaveIfNot()
      console.log("subscribe")
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
        onPress = {()=> this.props.navigation.goBack()}
        isFilterVisible = {this.state.showFilter}
        title = "Profile">
        </CustomHeader>

        <View
        style={{justifyContent: "center", alignItems: "center", width: this.width, position:"absolute", top: headerHeight + getStatusBarHeight(),
        height: (this.height-this.width/7 - headerHeight - getStatusBarHeight()), flexDirection: "row" }}>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        bio
        </Text>
        </View>

        </View>

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
        style={{ opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        username
        </Text>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        country
        </Text>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5, justifyContent: "center", alignItems: "center"}}>
        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        gender
        </Text>
        </View>

        </View>

        </View>

        <TouchableOpacity
        activeOpacity = {1}
        style={{ top: "80%", position: "absolute", borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
        justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom:5}}
        onPress={()=> this.onPressSave()}>

        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        SAVE
        </Text>
        </TouchableOpacity>

      </View>

          );
    }


  }}
