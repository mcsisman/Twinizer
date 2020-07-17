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
var currentUserPhotoCount;
export default class ProfileScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      newPhoto: false,
      profilePhoto: "",
      loadingDone: false,
      userUsername: "",
      userGender: "",
      userCountry: "",
      userBio: "",
      userPhotoCount: 0,
      isVisible: false,
      bioOpacity: 1,
      bioLimit: 0,
      upperComponentsOpacity: 1,
      upperComponentsDisabled: false,
      test: "TEST",
      text: 'Aemil Şişmannnnnnnnn',
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
      this.setState({loadingDone: false})
      this.spinAnimation()
      await this.checkIfUserDataExistsInLocalAndSaveIfNot()
      console.log("subscribe")
      this.setState({reRender: "ok"})
    })
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      this.setState({loadingDone: false})
      this.spinAnimation()
    })
    console.log("PROFİL COMP")
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);

  }

componentWillUnmount(){
  console.log("PROFİL COMP UN")
  Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
  Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
}
static navigationOptions = {
      header: null,
  };
  _keyboardDidHide = () => {
    if(this.state.bioOpacity == 1){
      this.setState({upperComponentsOpacity: 1, upperComponentsDisabled: false})
    }
    else{
      this.setState({bioOpacity: 1})
    }
  };
  _keyboardDidShow = (e) => {
    const { height, screenX, screenY, width } = e.endCoordinates
    console.log(height)
    console.log("y:", screenY)
    if(this.state.bioOpacity == 1){
      this.setState({upperComponentsOpacity: 0, upperComponentsDisabled: true})
    }
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
  async checkIfUserDataExistsInLocalAndSaveIfNot(){
    // from asyncstorage part

    currentUserGender = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userGender')
    currentUserCountry = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userCountry')
    currentUserUsername = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userName')
    currentUserBio = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userBio')
    await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userPhotoCount')
      .then(req => JSON.parse(req))
      .then(json => currentUserPhotoCount = json)

    if(currentUserCountry == null || currentUserGender == null || currentUserUsername == null || currentUserBio == null || currentUserPhotoCount == null){
      var infoListener = firebase.database().ref('Users/' + firebase.auth().currentUser.uid + "/i");
      await infoListener.once('value').then(async snapshot => {
        this.setState({ profilePhoto: "file://" + RNFS.DocumentDirectoryPath + firebase.auth().currentUser.uid + "profile.jpg", loadingDone: true,
        userGender: snapshot.val().g, userCountry: snapshot.val().c, userUsername: snapshot.val().u, userBio: snapshot.val().b,  bioLimit: snapshot.val().b.length, userPhotoCount: snapshot.val().p })
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userGender', this.state.userGender)
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userCountry', this.state.userCountry)
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userName', this.state.userUsername)
        AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userBio', this.state.userBio)
        await AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userPhotoCount', JSON.stringify(this.state.userPhotoCount))
      })
   }
   else{
     this.setState({ profilePhoto: "file://" + RNFS.DocumentDirectoryPath + firebase.auth().currentUser.uid + "profile.jpg", loadingDone: true, userGender: currentUserGender,
     userCountry: currentUserCountry, userUsername: currentUserUsername, userBio: currentUserBio, bioLimit: currentUserBio.length, userPhotoCount: currentUserPhotoCount })
   }
  }

  async onPressSave(){
    if(this.state.newPhoto){
      var uploadDone = false
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var metadata = {
        contentType: 'image/jpeg',
      };
      const response = await fetch(this.state.profilePhoto);
      const blob = await response.blob();
      var ref1 = storageRef.child("Photos/" + firebase.auth().currentUser.uid + "/1.jpg");
      await ref1.put(blob)
      RNFS.copyFile(this.state.profilePhoto, RNFS.DocumentDirectoryPath + firebase.auth().currentUser.uid + "profile.jpg");
      this.setState({userPhotoCount: this.state.userPhotoCount + 1})
    }
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userGender', this.state.userGender)
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userCountry', this.state.userCountry)
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userName', this.state.userUsername)
    AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userBio', this.state.userBio)
    await AsyncStorage.setItem(firebase.auth().currentUser.uid + 'userPhotoCount', JSON.stringify(this.state.userPhotoCount))

    var database = firebase.database();
    await firebase.database().ref('Users/' + firebase.auth().currentUser.uid + "/i").update({
      g: this.state.userGender,
      c: this.state.userCountry,
      b: this.state.userBio,
      u: this.state.userUsername,
      p: this.state.userPhotoCount
    })
  }
  onCountryValueChange(value){
    this.setState({userCountry: value})
  }
  onValueChangeGender(value){
    this.setState({userGender: value})
  }
  valueChange(value){
    if(this.state.bioLimit <= 100){
      this.setState({userBio: value})
      global.globalBio = value;
      this.setState({bioLimit: value.length});
    }
  }

  onPressCountry(){
    Keyboard.dismiss()
    this.setState({bioOpacity: 1})
  }
  onPressGender(){
    Keyboard.dismiss()
    this.setState({bioOpacity: 1})
  }
  onPressEdit(){
    Keyboard.dismiss()
    this.setState({bioOpacity: 1, isVisible: true})
  }
  onPressScreen(){
    Keyboard.dismiss()
  }
  library = () =>{
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      this.setState({
        newPhoto: true,
        profilePhoto: image.path,
        isVisible: false,
      });
    });
  };
  camera = () => {
    ImagePicker.openCamera({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      console.log(image);
      this.setState({
        newPhoto: true,
        profilePhoto: image.path,
        isVisible: false,
      });
  });
  };
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
        <TouchableOpacity
        onPress = {()=> this.onPressScreen()}
        activeOpacity = {1}
        style={{backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)", width: this.width, height: this.height, flex:1, flexDirection: "column", alignItems: "center"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"Profile"}
        onPress = {()=> this.props.navigation.goBack()}
        isFilterVisible = {this.state.showFilter}
        title = "Edit Profile">
        </CustomHeader>

        <KeyboardAvoidingView
        behavior= "height"
        keyboardVerticalOffset = {(this.height*20)/100}
        style={{justifyContent: "center", alignItems: "center", width: this.width, position:"absolute", top: headerHeight + getStatusBarHeight(),
        height: (this.height-this.width/7 - headerHeight - getStatusBarHeight()), flexDirection: "row" }}>

        <ProfileBioButton
        opacity = {this.state.bioOpacity}
        defaultText = {this.state.userBio}
        onChangeText = {(text) => this.valueChange(text)}
        characterNo = {this.state.bioLimit}/>

        </KeyboardAvoidingView>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width, height: (this.height-this.width/7 - headerHeight - getStatusBarHeight())/2, flexDirection: "row" }}>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>

        <Image
        style={{opacity: this.state.upperComponentsOpacity, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius:12, borderBottomRightRadius:12, width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)}}
        source = {{uri:this.state.profilePhoto + '?' + new Date()}}>
        </Image>

        </View>

        <View
        style={{opacity: this.state.upperComponentsOpacity, bottom: 0, position:"absolute", width: this.width/2,
        height: (this.height-this.width/7 - headerHeight - getStatusBarHeight())/4 - this.width/2*(8/10)*(7/6)/2, justifyContent: "center", alignItems: "center"}}>

        <TouchableOpacity
        activeOpacity = {1}
        disabled = {this.state.upperComponentsDisabled}
        onPress = {()=> this.onPressEdit()}
        style={{opacity: this.state.upperComponentsOpacity, position:"absolute", width: "50%",
        height: "70%", justifyContent: "center", alignItems: "center"}}>

        <Text
        style= {{fontSize: 18*(this.width/360), color: global.themeColor}}>
        Edit
        </Text>
        </TouchableOpacity>

        </View>

        <View
        style={{ opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>


        <TextInput
        defaultValue = {this.state.userUsername}
        onBlur={() => {this.setState({selection: {start: 0,end: 0}})}}
        onFocus={() => {this.setState({bioOpacity: 0, selection: {start: this.state.userUsername.length, end:this.state.userUsername.length}}, () => {this.setState({ selection: null })})  }}
        selection={this.state.selection}
        numberOfLines={1}
        style={{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)",opacity: this.state.upperComponentsOpacity, paddingTop: 0, paddingBottom: 0, paddingLeft: 12, paddingRight: 12, textAlign: "left",
        backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)", borderWidth: 0.4, borderColor:"gray",
        fontSize: 14*(this.width/360), width: this.width/2*(8/10), height:this.width/2*(8/10)*(7/6)/5 }}
        onChangeText={(text) => this.setState({userUsername: text})}>
        </TextInput>


        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <CountryPicker
        backgroundColor = {"white"}
        placeHolder = {false}
        borderWidth = {0.4}
        borderBottomWidth = {0.4}
        borderColor = {"gray"}
        borderBottomColor = {"gray"}
        value = {this.state.userCountry}
        disabled = {this.state.upperComponentsDisabled}
        opacity = {this.state.upperComponentsOpacity}
        onOpen = {()=> this.onPressCountry()}
        onValueChange = {(value)=> this.onCountryValueChange(value)}
        items = {countries.genderItems}
        label = {"label"}
        height = {this.width/2*(8/10)*(7/6)/5}
        width = {this.width/2*(8/10)}/>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <CountryPicker
        backgroundColor = {"white"}
        placeHolder = {false}
        borderWidth = {0.4}
        borderBottomWidth = {0.4}
        borderColor = {"gray"}
        borderBottomColor = {"gray"}
        value = {this.state.userGender}
        disabled = {this.state.upperComponentsDisabled}
        opacity = {this.state.upperComponentsOpacity}
        onOpen = {()=> this.onPressGender()}
        onValueChange = {(value)=> this.onValueChangeGender(value)}
        items = {[{label: global.langFilterMale, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)", value: global.langFilterMale},
                    {label: global.langFilterFemale, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)", value: global.langFilterFemale}]}
        label = {"label"}
        height = {this.width/2*(8/10)*(7/6)/5}
        width = {this.width/2*(8/10)}/>

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

        <LogoutButton
        top = {"88%"}
        text = {"Delete My Account"}
        position = {"absolute"}/>

        <ImageUploadModal
        isVisible={this.state.isVisible}
        txtUploadPhoto = {global.langUploadPhoto}
        txtCancel = {global.langCancel}
        txtTakePhoto = {global.langTakePhoto}
        txtOpenLibrary = {global.langLibrary}
        onPressCancel = {()=>this.setState({isVisible: false}) }
        onPressCamera = {this.camera}
        onPressLibrary = {this.library}/>

      </TouchableOpacity>

          );
    }


  }}
