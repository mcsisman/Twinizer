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
   Alert
  } from 'react-native';

import MessagesScreen from './Messages';
import MainScreen from './Main';
import ProfileScreen from './Profile';
import BottomBar from './components/BottomBar'
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
export default class HistoryScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      disabled: true,
      buttonOpacity: 'rgba(244,92,66,0.4)',
      historyBoxDisabled: false,
      doneDisabled: true,
      editPressed: false,
      cancelPressed: false,
      editText: "Edit",
      reRender: "ok"
    }

  }
async componentDidMount(){
  noOfSearch = await this.getNoOfSearch()
  await this.createUriArray()
  await this.createDateArray()
  isSelectedArray = []
  this.initializeIsSelectedArray()
}
  static navigationOptions = {
      header: null,
  };

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
onPressSearch(){
}
donePress(){
    var deleteCount = 0
    var indexArray = []
    for( i = 0; i < colorArray.length; i++){
      if(colorArray[i] == "trashblue"){
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
    this.setState({disabled: true, buttonOpacity: 'rgba(244,92,66,0.4)', historyBoxDisabled: true, doneDisabled: true, editText: "Cancel", editPressed: true, cancelPressed: false})
  }
  else{
    this.setState({historyBoxDisabled: false, doneDisabled: true, editText: "Edit", editPressed: false, cancelPressed: true})
    doneColor = 'rgba(128,128,128,1)'
    }
  }
arrangeDoneColor(){
    var flag1 = false
    for( i = 0; i < colorArray.length; i++){
      if( colorArray[i] == "trashblue"){
        flag1 = true
        doneColor = ourBlue
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
    colorArray[i] = "trashblue"
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
          this.setState({disabled: true, buttonOpacity: 'rgba(244,92,66,0.4)'})
        }
        else{
          isSelectedArray[i] = true
          this.setState({disabled: false, buttonOpacity: 'rgba(244,92,66,1)'})
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
  return historyArray
}
async getHistoryPhotoPath(whichBox){
  var historyArray = []
  var photoName;
  historyArray = await this.getHistoryImageArray()
  console.log("WHICH BOX: ", whichBox)
  console.log("HISTORY ARRAY: ", historyArray)
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
renderHistoryBoxes(){
    var boxes = [];
    if(noOfSearch == 0){
      return(
        <View style = {{width: "100%", height: "100%"}}>
        </View>
      )
    }
    else{
      for( i = 0; i < noOfSearch; i++){
        const temp = i
        boxes.push(
          <HistoryBox
          color = {colorArray[temp]}
          disabled = {this.state.historyBoxDisabled}
          onPress = {()=> this.historyBoxPressed(temp)}
          isSelected = {isSelectedArray[temp]}
          editPressed = {this.state.editPressed}
          trashOnPress = {()=> this.trashButtonPressed(temp)}
          cancelPressed = {this.state.cancelPressed}
          photoSource = {uriArray[noOfSearch-temp-1]}
          searchDate = {dateArray[noOfSearch-temp-1]}
          onPressSearch = {this.onPressSearch(temp)}
          key={i}/>
        )
      }
    }

    return boxes;
  }
render(){
  const {navigate} = this.props.navigation;
  if(this.state.editPressed){
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"History"}
      isFilterVisible = {this.state.showFilter}
      title = {"History"}>
      </CustomHeader>
      <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
      <TouchableOpacity
        activeOpacity = {1}
        style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
        onPress={()=>this.editButtonPressed()}
        disabled = {false}>

      <Text style = {{fontSize: 20, color: ourBlue}}>
      {this.state.editText}
      </Text>
      </TouchableOpacity>
      </View>

      <ScrollView
        style = {{height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
          {this.renderHistoryBoxes() }
      </ScrollView>

      <View
      style = {{ borderColor: 'rgba(188,188,188,0.6)', borderTopWidth: 1, backgroundColor: 'rgba(209,192,188,0.6)', height: this.width/7,
      width: this.width, bottom: 0, left:0, position:"absolute", justifyContent: "center", alignItems:"center"}}>
      <TouchableOpacity
      style = {{justifyContent: 'center', position: 'absolute', backgroundColor: doneColor, height: this.width*(0.8/10), paddingLeft: 15, paddingRight: 15,
      borderBottomLeftRadius: 24, borderTopRightRadius: 24, borderTopLeftRadius: 24, borderBottomRightRadius: 24}}
      disabled = {this.state.doneDisabled}
      onPress = {()=> this.donePress()}>
      <Text style = {{fontSize: 21, fontFamily: 'Candara', color: "white"}}>
      Done
      </Text>
      </TouchableOpacity>
      </View>

    </View>

  );
  }
  else{
    return(
      <View
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column"}}>
      <ModifiedStatusBar/>

      <CustomHeader
      whichScreen = {"History"}
      isFilterVisible = {this.state.showFilter}
      title = {"History"}>
      </CustomHeader>
      <View style = {{backgroundColor: 'rgba(181,181,181,0.1)', borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
      <TouchableOpacity
        activeOpacity = {1}
        style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
        onPress={()=>this.editButtonPressed()}
        disabled = {false}>

      <Text style = {{fontSize: 20, color: ourBlue}}>
      {this.state.editText}
      </Text>
      </TouchableOpacity>
      </View>

      <ScrollView
        style = {{height: this.height-this.width/7 - this.width/9 - headerHeight - getStatusBarHeight(), width: this.width, right: 0, bottom: this.width/7,  position: 'absolute', flex: 1, flexDirection: 'column'}}>
          {this.renderHistoryBoxes() }
      </ScrollView>

      <View
      style= {{width: this.width/7, height:this.width/7, bottom: this.width/7 + this.width/20, borderBottomLeftRadius: 555, borderTopRightRadius: 555,
      borderTopLeftRadius: 555, borderBottomRightRadius: 555, right: this.width/20, backgroundColor: "white", flex: 1, alignItems:'center',
      justifyContent: 'center', position: 'absolute',}}>
      <SearchButton
      onPress={()=>this.searchDone()}
      disabled = {this.state.disabled}
      width = {this.width/7}
      height ={this.width/7}
      backgroundColor = {this.state.buttonOpacity}/>
      </View>
      <BottomBar
      whichScreen = {"History"}
      msgOnPress = {()=> navigate("Messages")}
      homeOnPress = {()=> navigate("Main")}
      profileOnPress = {()=> navigate("Profile")}/>
    </View>

    );
  }
}}
