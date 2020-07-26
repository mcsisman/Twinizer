import React, {Component} from 'react';
import RNFS from "react-native-fs"
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import * as firebase from "firebase";
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

import MessagesScreen from './Messages';
import MainScreen from './Main';
import SettingsScreen from './Settings';
import CustomHeader from './components/CustomHeader'
import ModifiedStatusBar from './components/ModifiedStatusBar'
import SearchButton from './components/SearchButton'
import HistoryBox from './components/HistoryBox'

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
var noOfSearch = 0;
var uriArray = []
var dateArray = []
var loadingDone = false
export default class HistoryScreen extends Component<{}>{
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
      reRender: "ok"
    }
    this.leftAnimation = new Animated.Value(-this.width*(3/16))
    this.spinValue = new Animated.Value(0)
    loadingDone = false
  }
async componentDidMount(){
  this._subscribe = this.props.navigation.addListener('focus', async () => {
    this.leftAnimation = new Animated.Value(-this.width*(3/16))
    this.setState({reRender: "ok"})
  })
  this._subscribe = this.props.navigation.addListener('blur', async () => {
    this.setState({editPressed: false, cancelPressed: false, editText: "Edit", messageBoxDisabled: false})
  })
  console.log("COMPONENT DID MOUNT")
  this.spinAnimation()
  noOfSearch = await this.getNoOfSearch()
  await this.createUriArray()
  await this.createDateArray()
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
  historyBoxAnimation(){
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
async deleteHistory(indexArray){
  var historyArray;
  historyArray = await this.getHistoryImageArray()
  console.log("SİLMEDEN ÖNCE: ", historyArray)
  for( i = 0; i < indexArray.length; i++){
    RNFS.unlink("file://" + RNFS.DocumentDirectoryPath + "/search-photos/" + historyArray[noOfSearch-indexArray[i]-1]["lastSearch"].toString() +".jpg")
  .then(() => {
    console.log('FILE DELETED');
  })
  // `unlink` will throw an error, if the item to unlink does not exist
  .catch((err) => {
    console.log(err.message);
  });
    historyArray.splice(noOfSearch-indexArray[i]-1,1)
  }
  console.log("SİLDİKTEN SONRA: ", historyArray)
  noOfSearch = noOfSearch - indexArray.length

  await AsyncStorage.setItem('noOfSearch', noOfSearch.toString())
  await AsyncStorage.setItem('historyArray', JSON.stringify(historyArray))
  this.setState({historyBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
}
async onPressSearch(){
  var index = -1;
  for( i = 0; i < noOfSearch; i++){
    if( isSelectedArray[i] == true ){
      index = noOfSearch-i-1
    }
  }
  global.fromHistorySearch = true
  const {navigate} = this.props.navigation;
  global.historyPhotoUri = await this.getHistoryPhotoPath(index)
  navigate("Main")
}
donePress(){
    var deleteCount = 0
    var indexArray = []
    for( i = 0; i < colorArray.length; i++){
      if(colorArray[i] == "trash" + global.themeForImages){
        indexArray[deleteCount] = i
        deleteCount++;
      }
    }
    var alertMsg;
    if(deleteCount == 1){
      alertMsg = "If you proceed to delete this conversation, you can't access it until you receive a new message request."
    }
    else{
      alertMsg = "If you proceed to delete these " + deleteCount + " conversations, you can't access them until you receive a new message request. "
    }
    Alert.alert(
    'Warning!',
    alertMsg ,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete Anyways', onPress: () => this.deleteHistory(indexArray)},
    ],
    {cancelable: false},
  );
  }
initializeIsSelectedArray(){
  for(i = 0; i < noOfSearch; i++){
    isSelectedArray[i] = false
  }
    this.setState({reRender: "ok"})
}
editButtonPressed(){

  for( i = 0; i < noOfSearch; i++){
    isSelectedArray[i] = false
    colorArray[i] = "trashgray"
  }
  if(this.state.editText == "Edit"){
    this.setState({allSelected: false, disabled: true, opacity: 0.4, historyBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
    this.historyBoxAnimation()
  }
  else{
    this.setState({allSelected: false, historyBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
    this.historyBoxAnimation()
    doneColor = 'rgba(128,128,128,1)'
    }
  }
arrangeDoneColor(){
    var flag1 = false
    for( i = 0; i < colorArray.length; i++){
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
historyBoxPressed(whichBox){
    for( i = 0; i < noOfSearch; i++){
      if(i == whichBox){
        if(isSelectedArray[i] == true){
          isSelectedArray[i] = false
          this.setState({disabled: true, opacity: 0.4})
        }
        else{
          isSelectedArray[i] = true
          this.setState({disabled: false, opacity: 1})
        }
      }
      else{
        isSelectedArray[i] = false
        this.setState({reRender: "ok"})
      }
  }
}
async getNoOfSearch(){
  var noOfSearch;
  noOfSearch = await AsyncStorage.getItem('noOfSearch')
  if(noOfSearch == null){
    noOfSearch = "0";
  }
  noOfSearch = parseInt(noOfSearch)
  return noOfSearch
}

async createUriArray(){
  for( i = 0; i < noOfSearch; i++){
    uriArray[i] = await this.getHistoryPhotoPath(i)
  }
  this.setState({reRender: "ok"})
}
async createDateArray(){
  for( i = 0; i < noOfSearch; i++){
    dateArray[i] = await this.getHistoryDate(i)
  }
  this.setState({reRender: "ok"})
}

async getLastSearchNo(){
  var lastSearch;
  lastSearch = await AsyncStorage.getItem('lastSearch')
  if(lastSearch == null){
    lastSearch = "0";
  }
  lastSearch = parseInt(lastSearch)
  return lastSearch
}
async getHistoryImageArray(){
  var historyArray = []
  await AsyncStorage.getItem('historyArray')
    .then(req => JSON.parse(req))
    .then(json => historyArray = json)
  if(historyArray == null){
    historyArray = []
  }
  console.log("HISTORY ARRAY:", historyArray)
  return historyArray
}
async getHistoryPhotoPath(whichBox){
  var historyArray = []
  var photoName;
  historyArray = await this.getHistoryImageArray()
  photoName = historyArray[whichBox]["lastSearch"]
  var path = "file://" + RNFS.DocumentDirectoryPath + "/search-photos/" + photoName.toString() +".jpg"
  return path
}
async getHistoryDate(whichBox){
  var historyArray = []
  var historyDate;
  historyArray = await this.getHistoryImageArray()
  date = historyArray[whichBox]["searchDate"]
  return date;
}
selectAll(){
  if(this.state.allSelected){
    for( i = 0; i < colorArray.length; i++){
      colorArray[i] = "trashgray"
    }
      this.setState({allSelected: !this.state.allSelected, doneDisabled : true})
  }
  else{
    for( i = 0; i < colorArray.length; i++){
      colorArray[i] = "trash" + global.themeForImages
    }
      this.setState({allSelected: !this.state.allSelected, doneDisabled : false})
  }

}
renderHistoryBoxes(){
    var scrollViewHeight = this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight();
    var boxes = [];
    if(noOfSearch == 0){
      return(
        <View style = {{flex: 1, flexDirection: "column", width: this.width, height: scrollViewHeight}}>
        <View style = {{opacity: 0.7, alignItems: 'center', width: this.width, height: scrollViewHeight/4}}>
        <Text
          style = {{fontSize: 25, color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)"}}>
          No recent activity
        </Text>
        </View>
        </View>
      )
    }
    else{
      for( i = 0; i < noOfSearch; i++){
        const temp = i
        boxes.push(
          <HistoryBox
          left = {this.leftAnimation}
          color = {colorArray[temp]}
          disabled = {this.state.historyBoxDisabled}
          onPress = {()=> this.historyBoxPressed(temp)}
          isSelected = {isSelectedArray[temp]}
          editPressed = {this.state.editPressed}
          trashOnPress = {()=> this.trashButtonPressed(temp)}
          cancelPressed = {this.state.cancelPressed}
          photoSource = {uriArray[noOfSearch-temp-1]}
          searchDate = {dateArray[noOfSearch-temp-1]}
          key={i}/>
        )
      }
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
      whichScreen = {"History"}
      isFilterVisible = {this.state.showFilter}
      title = {"History"}>
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
        style={{width: this.width, height: this.height, flex:1, flexDirection: "column", backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(242,242,242,1)"}}>
        <ModifiedStatusBar/>

        <CustomHeader
        whichScreen = {"History"}
        isFilterVisible = {this.state.showFilter}
        title = {"History"}>
        </CustomHeader>

        <View style = {{opacity: noOfSearch == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
        <TouchableOpacity
          activeOpacity = {1}
          style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
          onPress={()=>this.editButtonPressed()}
          disabled = {noOfSearch == 0 ? true : false}>

        <Text style = {{fontSize: 20, color: global.themeColor}}>
        {this.state.editText}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity = {1}
          style={{width: this.width/3,  left: this.width/3, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
          onPress = {()=> this.selectAll()}>
        <Text style = {{fontSize: 20, color: global.themeColor}}>
        {this.state.allSelected ? "Deselect All" : "Select All"}
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
          renderItem = {()=>this.renderHistoryBoxes()}
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
        whichScreen = {"History"}
        isFilterVisible = {this.state.showFilter}
        title = {"History"}>
        </CustomHeader>

        <View style = {{opacity: noOfSearch == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
        <TouchableOpacity
          activeOpacity = {1}
          style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
          onPress={()=>this.editButtonPressed()}
          disabled = {noOfSearch == 0 ? true : false}>

        <Text style = {{fontSize: 20, color: global.themeColor}}>
        {this.state.editText}
        </Text>
        </TouchableOpacity>

        </View>

        <FlatList
          style = {{ height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(),
          width: this.width, right: 0, bottom: 0,  position: 'absolute', flex: 1, flexDirection: 'column'}}
          renderItem = {()=>this.renderHistoryBoxes()}
          data = { [{bos:"boş", key: "key"}]}
          refreshing = {true}>
        </FlatList>

        <View
        style= {{width: this.width/7, height:this.width/7, bottom: this.width/20, borderBottomLeftRadius: 555, borderTopRightRadius: 555,
        borderTopLeftRadius: 555, borderBottomRightRadius: 555, right: this.width/20, backgroundColor: "white", flex: 1, alignItems:'center',
        justifyContent: 'center', position: 'absolute',}}>
        <SearchButton
        opacity = {this.state.opacity}
        onPress={()=>this.onPressSearch()}
        disabled = {this.state.disabled}
        width = {this.width/7}
        height ={this.width/7}
        backgroundColor = {global.themeColor}/>
        </View>

      </View>

      );
    }
  }


}}
