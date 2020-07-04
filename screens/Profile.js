import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
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
import BottomBar from './components/BottomBar'
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

var ourBlue = 'rgba(77,120,204,1)'

export default class ProfileScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      isVisible: false,
      photo: {uri: "defaultavatar"},
      value: "Afghanistan",
      valueGender: "Male",
      bioOpacity: 1,
      defaultText: "lkfdslk lsfdk sşldfk sşldfk lşwekf şlwkef şlwekf şwlekf şwelk fşwle kfwşlek fqşlk qşlek qlşek feeqq",
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


  }

  componentDidMount(){
    Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
    this.setState({defaultText: "lkfdslk lsfdk sşldfk sşldfk lşwekf şlwkef şlwekf şwlekf şwelk fşwle kfwşlek fqşlk qşlek qlşek feeqq", bioLimit:this.state.defaultText.length})
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
  _keyboardDidShow = () => {
    if(this.state.bioOpacity == 1){
      this.setState({upperComponentsOpacity: 0, upperComponentsDisabled: true})
    }
  };
  onPressSave(){

  }
  onValueChange(value){
    this.setState({value: value})
  }
  onValueChangeGender(value){
    this.setState({valueGender: value})
  }
  valueChange(value){
    if(this.state.bioLimit <= 100){
      global.globalBio = value;
      this.setState({bioLimit: value.length});
    }
  }
  onBioFocus(){

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
    countries.changeTest("değiştir")
    console.log("SONUÇ: ", this.state.test)
  }
  library = () =>{
    ImagePicker.openPicker({
      width: 600,
      height: 700,
      cropping: true
    }).then(image => {
      this.setState({
        photo: {uri: image.path},
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
        photo: {uri: image.path},
        isVisible: false,
      });
  });
  };
  render(){
    const {navigate} = this.props.navigation;
    return(
      <TouchableOpacity
      onPress = {()=> this.onPressScreen()}
      activeOpacity = {1}
      style={{width: this.width, height: this.height, flex:1, flexDirection: "column", alignItems: "center"}}>
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
      onFocus = {()=>this.onBioFocus()}
      defaultText = {this.state.defaultText}
      onChangeText = {(text) => this.valueChange(text)}
      characterNo = {this.state.bioLimit}/>

      </KeyboardAvoidingView>

      <View
      style={{opacity: this.state.upperComponentsOpacity, width: this.width, height: (this.height-this.width/7 - headerHeight - getStatusBarHeight())/2, flexDirection: "row" }}>

      <View
      style={{opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>

      <Image
      style={{opacity: this.state.upperComponentsOpacity, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius:12, borderBottomRightRadius:12, width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)}}
      source = {this.state.photo}>
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
      style= {{fontSize: 18*(this.width/360), color: "blue"}}>
      Edit
      </Text>
      </TouchableOpacity>

      </View>

      <View
      style={{ opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>


      <TextInput
      defaultValue = {this.state.text}
      onBlur={() => {this.setState({selection: {start: 0,end: 0}})}}
      onFocus={() => {this.setState({bioOpacity: 0, selection: {start: this.state.text.length, end: this.state.text.length}}, () => {this.setState({ selection: null })})  }}
      selection={this.state.selection}
      numberOfLines={1}
      style={{opacity: this.state.upperComponentsOpacity, paddingTop: 0, paddingBottom: 0, paddingLeft: 12, paddingRight: 12, textAlign: "center", backgroundColor:"white", borderWidth: 0.4, borderColor:"gray",
      fontSize: 14*(this.width/360), width: this.width/2*(8/10), height:this.width/2*(8/10)*(7/6)/5 }}
      onChangeText={(text) => this.setState({text: text})}>
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
      value = {this.state.value}
      disabled = {this.state.upperComponentsDisabled}
      opacity = {this.state.upperComponentsOpacity}
      onOpen = {()=> this.onPressCountry()}
      onValueChange = {(value)=> this.onValueChange(value)}
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
      value = {this.state.valueGender}
      disabled = {this.state.upperComponentsDisabled}
      opacity = {this.state.upperComponentsOpacity}
      onOpen = {()=> this.onPressGender()}
      onValueChange = {(value)=> this.onValueChangeGender(value)}
      items = {[{label: global.langFilterMale, color: 'black', value: global.langFilterMale},
                  {label: global.langFilterFemale, color: 'black', value: global.langFilterFemale}]}
      label = {"label"}
      height = {this.width/2*(8/10)*(7/6)/5}
      width = {this.width/2*(8/10)}/>

      </View>

      </View>

      <TouchableOpacity
      activeOpacity = {1}
      style={{ top: "74%", position: "absolute", borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
      justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(43,120,228,0.2)', paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom:5}}
      onPress={()=> this.onPressSave()}>

      <Text style={{color: 'rgba(43,120,228,1)', fontSize: 15*(this.width/360)}}>
      SAVE
      </Text>
      </TouchableOpacity>

      <LogoutButton
      top = {"82%"}
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

      <BottomBar
        whichScreen = {"Profile"}
        settingsOnPress = {()=> this.props.navigation.goBack()}
        msgOnPress = {()=> navigate("Messages")}
        homeOnPress = {()=> navigate("Main")}
        historyOnPress = {()=> navigate("History")}/>
    </TouchableOpacity>

        );
  }}
