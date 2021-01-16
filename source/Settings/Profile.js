import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ImagePicker from 'react-native-image-crop-picker';
import { createStackNavigator} from '@react-navigation/stack';
import { Header } from 'react-navigation-stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import OneSignal from 'react-native-onesignal'
import firestore from '@react-native-firebase/firestore';
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

import DeleteOptionsScreen from './DeleteOptions';

import CustomHeader from '../Components/Common/Header/CustomHeader'
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar'

import ProfileBioButton from '../Components/Settings/Profile/Bio/ProfileBioButton'
import CustomPicker from '../Components/Common/Pickers/CustomPicker'
import LogoutButton from '../Components/Settings/Common/LogoutButton'
import ImageUploadModal from '../Components/Common/ImageUpload/ImageUploadModal'
import ImageViewerModal from '../Components/Common/ImageViewer/ImageViewerModal'
import GoBackInfoModal from '../Components/Common/Info/GoBackInfoModal'
import InfoModal from '../Components/Common/Info/InfoModal'
import AuthenticationModal from '../Components/Settings/DeleteOptions/AuthenticationModal'
import countries from '../Utils/Countries';
import language from '../Utils/Languages/lang.json'

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
var updateImage;
var infoChanged = false;
var keyboardHeight;
var keyboardYcord;
var lang = language[global.lang]
export default class ProfileScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      authenticationVisible: false,
      whichInput: null,
      keyboardOpen: false,
      saveInfoModalVisible: false,
      imageViewerVisible: false,
      goBackInfoModalVisible: false,
      newPhoto: false,
      profilePhoto: "",
      loadingDone: false,
      loadingOpacity: 0,
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
    this.downloadURL = "";
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.spinValue = new Animated.Value(0)
  }

  async componentDidMount(){
    this.setState({loadingDone: false})
    this.spinAnimation()
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      infoChanged = false
      this.setState({loadingDone: false, goBackInfoModalVisible:false})
      this.spinAnimation()
      await this.checkIfUserDataExistsInLocalAndSaveIfNot()
      console.log("subscribe")
      this.setState({reRender: "ok", profilePhoto: this.state.profilePhoto + '?' + new Date()})
    })
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      infoChanged = false
      this.setState({loadingDone: false, goBackInfoModalVisible:false})
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
      this.setState({upperComponentsOpacity: 1, upperComponentsDisabled: false, keyboardOpen: false})
    }
    else{
      this.setState({bioOpacity: 1, keyboardOpen: false})
    }
  };
  _keyboardDidShow = (e) => {
    const { height, screenX, screenY, width } = e.endCoordinates
    console.log(height)
    console.log("y:", screenY)
    if(this.state.whichInput == "bio"){
      this.setState({keyboardOpen: true})
      if(this.state.bioOpacity == 1){
        this.setState({upperComponentsOpacity: 0, upperComponentsDisabled: true})
      }
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

    await AsyncStorage.getItem(auth().currentUser.uid + 'userGender').then( req => {
      currentUserGender = req
    })
    await AsyncStorage.getItem(auth().currentUser.uid + 'userCountry').then( req => {
      currentUserCountry = req
    })
    await AsyncStorage.getItem(auth().currentUser.uid + 'userName').then( req => {
      currentUserUsername = req
    })
    await AsyncStorage.getItem(auth().currentUser.uid + 'userBio').then( req => {
      currentUserBio = req
    })
    await AsyncStorage.getItem(auth().currentUser.uid + 'userPhotoCount')
      .then(req => {
        if(req){
           return JSON.parse(req)
        }
        else{
          return null
        }
      })
      .then(json => {
        currentUserPhotoCount = json
      })
    if(currentUserCountry == null || currentUserGender == null || currentUserUsername == null || currentUserBio == null || currentUserPhotoCount == null){
      var infoListener = database().ref('Users/' + auth().currentUser.uid + "/i");
      await infoListener.once('value').then(async snapshot => {
        this.setState({loadingDone: true, userGender: snapshot.val().g, userCountry: snapshot.val().c, userUsername: snapshot.val().u,
          userBio: snapshot.val().b,  bioLimit: snapshot.val().b.length, userPhotoCount: snapshot.val().p })
        await this.getImageURL()
        await this.downloadImages()
        AsyncStorage.setItem(auth().currentUser.uid + 'userGender', this.state.userGender)
        console.log("this.state.userGender: ", this.state.userGender)
        AsyncStorage.setItem(auth().currentUser.uid + 'userCountry', this.state.userCountry)
        AsyncStorage.setItem(auth().currentUser.uid + 'userName', this.state.userUsername)
        AsyncStorage.setItem(auth().currentUser.uid + 'userBio', this.state.userBio)
        await AsyncStorage.setItem(auth().currentUser.uid + 'userPhotoCount', JSON.stringify(this.state.userPhotoCount))
        this.setState({profilePhoto:  "file://" + RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "profile.jpg"})
      })
   }
   else{
     this.setState({ profilePhoto: "file://" + RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "profile.jpg", loadingDone: true, userGender: currentUserGender,
     userCountry: currentUserCountry, userUsername: currentUserUsername, userBio: currentUserBio, bioLimit: currentUserBio.length, userPhotoCount: currentUserPhotoCount })
   }
  }

  async getImageURL(){
    console.log("getImageURL")
      var storageRef = storage().ref("Photos/" + auth().currentUser.uid + "/1.jpg")
      await storageRef.getDownloadURL().then(data =>{
        this.downloadURL = data
        console.log("profil photo: ", data)
      }).catch(function(error) {
        // Handle any errors
      });
  }

  async downloadImages(){
      console.log("downloadImages")
      let dirs = RNFetchBlob.fs.dirs
      console.log(dirs.DocumentDir + "/" + auth().currentUser.uid + "profile.jpg")
      await RNFetchBlob
      .config({
        fileCache : true,
        appendExt : 'jpg',
        path: dirs.DocumentDir + "/" + auth().currentUser.uid + "profile.jpg"
      })
      .fetch('GET', this.downloadURL, {
        //some headers ..
      })
      .then((res) => {
        console.log('The file saved to ', res.path())
        this.setState({profilePhoto:  "file://" + res.path()})
      })
    }

  async onPressSave(){

    this.setState({loadingOpacity: 1})
    if(this.state.newPhoto){
      var uploadDone = false
      var storageRef = storage().ref();
      var metadata = {
        contentType: 'image/jpeg',
      };
      const response = await fetch(this.state.profilePhoto);
      const blob = await response.blob();
      var ref1 = storageRef.child("Photos/" + auth().currentUser.uid + "/1.jpg");
      await ref1.put(blob)
      RNFS.copyFile(this.state.profilePhoto, RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "profile.jpg");
      this.setState({profilePhoto: this.state.profilePhoto + '?' + new Date(), userPhotoCount: this.state.userPhotoCount + 1})
    }
    AsyncStorage.setItem(auth().currentUser.uid + 'userGender', this.state.userGender)
    AsyncStorage.setItem(auth().currentUser.uid + 'userCountry', this.state.userCountry)
    AsyncStorage.setItem(auth().currentUser.uid + 'userName', this.state.userUsername)
    AsyncStorage.setItem(auth().currentUser.uid + 'userBio', this.state.userBio)
    await AsyncStorage.setItem(auth().currentUser.uid + 'userPhotoCount', JSON.stringify(this.state.userPhotoCount))

    await database().ref('Users/' + auth().currentUser.uid + "/i").update({
      g: this.state.userGender,
      c: this.state.userCountry,
      b: this.state.userBio,
      u: this.state.userUsername,
      p: this.state.userPhotoCount
    }).then(() => {
      infoChanged = false
      this.setState({saveInfoModalVisible:true, loadingOpacity:0})
      this.spinValue = new Animated.Value(0)
    })
  }
  onCountryValueChange(value){
    if(this.state.userCountry != value.label){
      infoChanged = true
    }
    this.setState({userCountry: value.label})
  }
  onValueChangeGender(value){
    if(this.state.userGender != value.label){
      infoChanged = true
    }
    this.setState({userGender: value.label})
  }
  onValueChangeUsername(text){
    if(this.state.userUsername != text){
      infoChanged = true
    }
    this.setState({userUsername: text})
  }
  valueChange(value){
    if(this.state.userBio != value){
      infoChanged = true
    }
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

  onPressGoBack(){
    if(infoChanged){
      this.setState({goBackInfoModalVisible:true})
    }
    else{
      this.props.navigation.goBack()
    }
  }
  async deletePress(email, password){
    console.log("DELETE PRESS")
    this.setState({authenticationVisible: false})
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
  render(){
    var lang = language[global.lang]
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
        title = {lang.Profile}>
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
        onPress = {()=> this.onPressGoBack()}
        isFilterVisible = {this.state.showFilter}
        title = {lang.Profile}>
        </CustomHeader>

        <View
        style={{ bottom: this.state.keyboardOpen ? (this.height - headerHeight - getStatusBarHeight())/2 : 0, width: this.width, height: this.height - headerHeight - getStatusBarHeight(), flexDirection: "column", alignItems: "center" }}>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width, height: (this.height - headerHeight - getStatusBarHeight())/2, flexDirection: "row" }}>

        <View
        style={{opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity
        activeOpacity = {1}
        disabled = {this.state.upperComponentsDisabled}
        style={{opacity: this.state.upperComponentsOpacity, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius:12, borderBottomRightRadius:12, width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)}}
        onPress = {()=> this.setState({imageViewerVisible: true})}>

        <Image
        style={{opacity: this.state.upperComponentsOpacity, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius:12, borderBottomRightRadius:12, width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)}}
        source = {{uri:this.state.profilePhoto}}>
        </Image>

        </TouchableOpacity>

        <View
        style={{opacity: this.state.upperComponentsOpacity, top: this.width/2*(8/10)*(7/6) + ((this.height - headerHeight - getStatusBarHeight())/2 - this.width/2*(8/10)*(7/6))/2,
        position:"absolute", width: this.width/2, height: this.width/2*(8/10)*(1/6), justifyContent: "center", alignItems: "center"}}>

        <TouchableOpacity
        activeOpacity = {1}
        disabled = {this.state.upperComponentsDisabled}
        onPress = {()=> this.onPressEdit()}
        style={{opacity: this.state.upperComponentsOpacity, position:"absolute", width: "50%",
        height: "70%", justifyContent: "center", alignItems: "center"}}>

        <Text
        style= {{fontSize: 18*(this.width/360), color: global.themeColor}}>
        {lang.Edit}
        </Text>
        </TouchableOpacity>

        </View>
        </View>


        <View
        style={{ opacity: this.state.upperComponentsOpacity, width: this.width/2, height: "100%", justifyContent: "center", alignItems: "center"}}>


        <TextInput
        defaultValue = {this.state.userUsername}
        editable = {!this.state.upperComponentsDisabled}
        onBlur={() => {this.setState({selection: {start: 0,end: 0}})}}
        onFocus={() => {this.setState({whichInput: "username", selection: {start: this.state.userUsername.length, end:this.state.userUsername.length}}, () => {this.setState({ selection: null })})  }}
        selection={this.state.selection}
        numberOfLines={1}
        style={{color: global.isDarkMode ? global.darkModeColors[3] : "rgba(0,0,0,1)",opacity: this.state.upperComponentsOpacity, paddingTop: 0, paddingBottom: 0, paddingLeft: 12, paddingRight: 12, textAlign: "left",
        backgroundColor: global.isDarkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,1)", borderWidth: 0.4, borderColor:"gray",
        fontSize: 14*(this.width/360), width: this.width/2*(8/10), height:this.width/2*(8/10)*(7/6)/5 }}
        onChangeText={(text) => this.onValueChangeUsername(text)}>
        </TextInput>


        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <CustomPicker
        backgroundColor = {"white"}
        placeHolder = {false}
        borderWidth = {0.4}
        borderBottomWidth = {0.4}
        borderColor = {"gray"}
        borderBottomColor = {"gray"}
        selectedValue = {this.state.userCountry}
        disabled = {this.state.upperComponentsDisabled}
        opacity = {this.state.upperComponentsOpacity}
        onOpen = {()=> this.onPressCountry()}
        onValueChange = {(value)=> this.onCountryValueChange(value)}
        items = {countries.newGenderItems}
        label = {"label"}
        height = {this.width/2*(8/10)*(7/6)/5}
        width = {this.width/2*(8/10)}/>

        <View
        style={{width: this.width/2*(8/10), height: this.width/2*(8/10)*(7/6)/5.5, justifyContent: "center", alignItems: "center"}}>
        </View>

        <CustomPicker
        backgroundColor = {"white"}
        placeHolder = {false}
        borderWidth = {0.4}
        borderBottomWidth = {0.4}
        borderColor = {"gray"}
        borderBottomColor = {"gray"}
        selectedValue = {this.state.userGender}
        disabled = {this.state.upperComponentsDisabled}
        opacity = {this.state.upperComponentsOpacity}
        onOpen = {()=> this.onPressGender()}
        onValueChange = {(value)=> this.onValueChangeGender(value)}
        items = {[{label: global.langFilterMale, key: 1},
                    {label: global.langFilterFemale, key: 2}]}
        label = {"label"}
        height = {this.width/2*(8/10)*(7/6)/5}
        width = {this.width/2*(8/10)}/>

        </View>

        </View>

        <View
        style={{alignItems: "center", justifyContent: "flex-start", width: this.width,
        height: (this.height - headerHeight - getStatusBarHeight())/2, flexDirection: "column" }}>
        <View
        style = {{height: this.width/20}}/>
        <ProfileBioButton
        onFocus = { () => this.setState({whichInput: "bio", keyboardOpen: true, upperComponentsOpacity: 0, upperComponentsDisabled:true})}
        opacity = {this.state.bioOpacity}
        defaultText = {this.state.userBio}
        onChangeText = {(text) => this.valueChange(text)}
        characterNo = {this.state.bioLimit}/>

        <View
        style = {{height: this.width/20}}/>

        <TouchableOpacity
        activeOpacity = {1}
        style={{ borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
        justifyContent: 'center', alignItems: 'center', backgroundColor: backgroundColor, paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom:5}}
        onPress={()=> this.onPressSave()}>

        <Text style={{color: global.themeColor, fontSize: 15*(this.width/360)}}>
        {lang.Save}
        </Text>
        </TouchableOpacity>
        <View
        style = {{height: this.width/20}}/>

        <LogoutButton
        text = {lang.DeleteMyAccount}
        onPress = {()=>this.onPressDelete()}/>

        </View>

        </View>

        <AuthenticationModal
        isVisible = {this.state.authenticationVisible}
        onPressEnter = {() => {this.deletePress()}}
        onPressCancel = {() => {this.setState({authenticationVisible: false})}}
        onBackdropPress = {() => {
          this.setState({authenticationVisible: false})
        }}
        />

        <ImageUploadModal
        isVisible={this.state.isVisible}
        txtUploadPhoto = {lang.UploadAPhoto}
        txtCancel = {global.langCancel}
        txtTakePhoto = {lang.Camera}
        txtOpenLibrary = {lang.Library}
        onPressCancel = {()=>this.setState({isVisible: false}) }
        onPressCamera = {this.camera}
        onPressLibrary = {this.library}/>

        <ImageViewerModal
        isVisible = {this.state.imageViewerVisible}
        images = {this.state.profilePhoto}
        onCancel = {() => {
          this.setState({imageViewerVisible: false})
        }}/>

        <GoBackInfoModal
        isVisible = {this.state.goBackInfoModalVisible}
        txtAlert = {lang.DidntSave}
        txtOk = {lang.YES}
        txtSave = {lang.Save}
        txtCancel = {lang.Cancel}
        onPressOk = {()=>this.props.navigation.goBack()}
        onPressSave = {()=>{
          this.setState({goBackInfoModalVisible:false})
          this.onPressSave()
        }}
        onPressClose = {()=>this.setState({goBackInfoModalVisible:false}) }/>

        <InfoModal
        isVisible = {this.state.saveInfoModalVisible}
        txtAlert = {lang.YourChangesHaveBeenSaved}
        txtGotIt = {lang.GotIt}
        onPressClose = {()=>this.setState({saveInfoModalVisible:false}) }/>

        <Animated.Image source={{uri: 'loading' + global.themeForImages}}
          style={{transform: [{rotate: spin}] ,width: this.width*(1/15), height: this.width*(1/15),
          position: 'absolute', bottom: (this.height)*(20/100) - (getStatusBarHeight()) + (this.width*3/10*(7/6)) + this.width/30 - this.width/7,
          left: this.width*(7/15) , opacity: this.state.loadingOpacity}}/>


      </TouchableOpacity>

          );
    }


  }}