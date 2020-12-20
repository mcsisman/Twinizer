import React, {Component} from 'react';
import RNFS from "react-native-fs"
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal'
import AsyncStorage from '@react-native-community/async-storage';
import {Image,
   Text,
   View,
   Dimensions,
   TouchableOpacity,
   KeyboardAvoidingView,
   StatusBar,
   Platform,
   ScrollView,
   Alert,
   FlatList,
   Animated,
   Easing
  } from 'react-native';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'
import OvalButton from '../Components/Common/OvalButton/OvalButton'
import DeleteOptionsBox from '../Components/Settings/DeleteOptions/DeleteOptionsBox'
import AuthenticationModal from '../Components/Settings/DeleteOptions/AuthenticationModal'

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}

var ourBlue = 'rgba(77,120,204,1)'
var colorArray = []
var doneColor = 'rgba(128,128,128,1)'
var isSelectedArray = []
var textArray = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
]
var loadingDone = false
var authenticated = false
export default class DeleteOptionsScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      allSelected: false,
      disabled: true,
      opacity: 0.4,
      historyBoxDisabled: false,
      doneDisabled: true,
      editPressed: false,
      cancelPressed: false,
      editText: "Edit",
      reRender: "ok",
      authenticationVisible: false
    }
    this.leftAnimation = new Animated.Value(-this.width*(3/16))
    this.spinValue = new Animated.Value(0)
    loadingDone = false
  }
async componentDidMount(){
  this._subscribe = this.props.navigation.addListener('focus', async () => {
    this.props.navigation.setOptions({tabBarVisible: false})
    this.setState({reRender: "ok"})
  })
  this._subscribe = this.props.navigation.addListener('blur', async () => {
    this.setState({editPressed: false, cancelPressed: false, editText: "Edit", messageBoxDisabled: false})
  })
  console.log("COMPONENT DID MOUNT")
  this.spinAnimation()
  isSelectedArray = []
  this.initializeIsSelectedArray()
  loadingDone = true
  this.setState({reRender: "ok"})
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
  updateState = () =>{
    console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: "ok"})
    return "TESTTTT"
  }
onReceived(notification) {
  console.log("Notification received: ", notification);
}

onOpened(openResult) {
  console.log('Message: ', openResult.notification.payload.body);
  console.log('Data: ', openResult.notification.payload.additionalData);
  console.log('isActive: ', openResult.notification.isAppInFocus);
  console.log('openResult: ', openResult);
}

onIds(device) {
  console.log('Device info: ', device);
}
onPressDelete(){
    Alert.alert(
    '',
    "Are you sure you want to delete your account?" ,
    [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => this.setState({authenticationVisible: true})},
    ],
    {cancelable: true},
  );
}
async deletePress(email, password){
  if(auth().currentUser.email == global.deleteAuthEmail){
    await auth()
     .signInWithEmailAndPassword(email, password)
     .then(async () => {
       authenticated = true
       console.log("authenticated")
     }).catch(error => {
       Alert.alert(global.langPlsTryAgain, global.langWrongEmailPassword)
     })
     if (authenticated){
       OneSignal.removeEventListener('received', this.onReceived);
       OneSignal.removeEventListener('opened', this.onOpened);
       OneSignal.removeEventListener('ids', this.onIds);
       // async storage remove
       AsyncStorage.removeItem(auth().currentUser.uid + 'userGender')
       AsyncStorage.removeItem(auth().currentUser.uid + 'userCountry')
       AsyncStorage.removeItem(auth().currentUser.uid + 'userName')
       AsyncStorage.removeItem(auth().currentUser.uid + 'userBio')
       AsyncStorage.removeItem(auth().currentUser.uid + 'userPhotoCount')
       AsyncStorage.removeItem(auth().currentUser.uid + 'blockedUsers')
       AsyncStorage.removeItem(auth().currentUser.uid + 'favoriteUsers')
       AsyncStorage.removeItem(auth().currentUser.uid + 'noOfSearch')
       AsyncStorage.removeItem(auth().currentUser.uid + 'lastSearch')
       AsyncStorage.removeItem(auth().currentUser.uid + 'historyArray')
       AsyncStorage.removeItem(auth().currentUser.uid + 'favShowThisDialog')
       AsyncStorage.removeItem(auth().currentUser.uid + 'blockShowThisDialog')
       AsyncStorage.removeItem(auth().currentUser.uid + "o")
       AsyncStorage.removeItem(auth().currentUser.uid + 'playerId')
       AsyncStorage.removeItem(auth().currentUser.uid + 'message_uids')
       AsyncStorage.removeItem(auth().currentUser.uid + 'message_usernames')
       AsyncStorage.removeItem(auth().currentUser.uid + 'theme')
       AsyncStorage.removeItem(auth().currentUser.uid + 'mode')
       var messageUidsArray = firestore().collection(auth().currentUser.uid).doc("MessageInformation")
       console.log("messageuidsarray: ", messageUidsArray)
       messageUidsArray.get().then( async doc =>{
         console.log("firestore içi")
         if(doc.exists){
           var conversationUidArray = await doc.data()["UidArray"]
           for(let i = 0; i < conversationUidArray.length; i++){
             AsyncStorage.removeItem(auth().currentUser.uid + conversationUidArray[i] + '/messages')
             AsyncStorage.removeItem('IsRequest/' + auth().currentUser.uid + "/" + conversationUidArray[i])
             AsyncStorage.removeItem('ShowMessageBox/' + auth().currentUser.uid + "/" + conversationUidArray[i])
             AsyncStorage.removeItem(auth().currentUser.uid + "" + conversationUidArray[i] + 'lastSeen')
             // firestore delete
             firestore().collection(auth().currentUser.uid).doc('MessageInformation').delete().then(() => {
               console.log('MessageInformation deleted!');
             });
             firestore().collection(auth().currentUser.uid).doc('Bios').delete().then(() => {
               console.log('Bİos deleted!');
             });
             firestore().collection(auth().currentUser.uid).doc('Similarity').delete().then(() => {
               console.log('Similarity deleted!');
             });
           }
         }
       })
       // realtime remove
       database().ref('/PlayerIds/' + auth().currentUser.uid).remove()
       database().ref('/Users/'+auth().currentUser.uid).remove()
       // storage delete
       storage().ref("Embeddings/" + auth().currentUser.uid + ".pickle").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/1.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/2.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/3.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/4.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/5.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/SearchPhotos/search-photo.jpg").delete()
       storage().ref("Photos/" + auth().currentUser.uid + "/SearchPhotos/vec.pickle").delete()

       auth().currentUser.delete().then(function() {
         console.log("LOGOUT SUCCESSFUL")
         this.props.navigation.dispatch(StackActions.popToTop());
       })
     }
  }
  else{
    Alert.alert(global.langPlsTryAgain, global.langWrongEmailPassword)
  }
}
initializeIsSelectedArray(){
  global.selectedOption = null
  for(i = 0; i < textArray.length; i++){
    isSelectedArray[i] = false
  }
    this.setState({reRender: "ok"})
}

deleteOptionsBoxPressed(whichBox){
    for( i = 0; i < textArray.length; i++){
      if(i == whichBox){
        if(isSelectedArray[i] == true){
          isSelectedArray[i] = false
          global.selectedOption = null
          this.setState({reRender: "ok"})
        }
        else{
          isSelectedArray[i] = true
          global.selectedOption = whichBox
          this.setState({reRender: "ok"})
        }
      }
      else{
        isSelectedArray[i] = false
        this.setState({reRender: "ok"})
      }
  }
}

renderOptionBoxes(){
    var boxes = [];
      for( i = 0; i < textArray.length; i++){
        const temp = i
        boxes.push(
          <DeleteOptionsBox
          onPress = {()=> this.deleteOptionsBoxPressed(temp)}
          isSelected = {isSelectedArray[temp]}
          text = {textArray[temp]}
          key={i}/>
        )
      }
    return boxes;
  }
render(){
  const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })
  console.log("RENDER")
  const {navigate} = this.props.navigation;
  if(!loadingDone){
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"Profile"}
      isFilterVisible = {this.state.showFilter}
      title = {"Delete Account"}>
      </CustomHeader>

      <Animated.Image source={{uri: 'loading' + global.themeForImages}}
        style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height:this.width*(1/15),
        position: 'absolute', top: this.height/3, left: this.width*(7/15) , opacity: this.state.loadingOpacity}}
      />
      </View>
    )
  }
  else{
      return(
        <View
        style={{alignItems: "center", width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"Profile"}
        isFilterVisible = {this.state.showFilter}
        onPress = {()=> this.props.navigation.goBack()}
        title = {"Delete Account"}>
        </CustomHeader>

        <View
        style = {{left: 0 ,alignItems: 'center', paddingTop: 5, paddingBottom: 5, width: this.width,
        backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)", flex: 1}}>
        <Text
        style = {{fontSize: 22, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
        Why are you leaving Twinizer?
        </Text>
        </View>

        <FlatList
          style = {{ height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight() - this.height*(2/16),
          width: this.width, right: 0, bottom: this.height*(2/16),  position: 'absolute', flex: 1, flexDirection: 'column'}}
          renderItem = {()=>this.renderOptionBoxes()}
          data = { [{bos:"boş", key: "key"}]}
          refreshing = {true}>
        </FlatList>

        <OvalButton
        opacity = {1}
        backgroundColor = {global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)"}
        bottom = {this.height*(1/16)}
        title = {"Delete"}
        textColor = {global.themeColor}
        onPress = { ()=> this.onPressDelete()}
        borderColor = {global.themeColor}/>

        <AuthenticationModal
        isVisible = {this.state.authenticationVisible}
        onPressEnter = {async () => {
          this.setState({authenticationVisible: false})
          await this.deletePress()
        }}
        onPressCancel = {() => {this.setState({authenticationVisible: false})}}
        onBackdropPress = {() => {
          this.setState({authenticationVisible: false})
        }}
        />

      </View>
    );
  }
}
}
