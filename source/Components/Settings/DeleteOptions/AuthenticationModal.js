import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import OneSignal from 'react-native-onesignal'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
import {
  Alert,
  View,
  Platform,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar
} from 'react-native';

email = ""
pw = ""
if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class AuthenticationModal extends Component {


  static propTypes = {
   isVisible: PropTypes.bool,
   onBackdropPress: PropTypes.func,
   onPressCancel: PropTypes.func,
   onPressEnter: PropTypes.func
 }
 static defaultProps = {
 }
 async deletePress(email, password){
   console.log("DELETE PRESS")
   this.setState({authenticationVisible: false})
   try{
     if(auth().currentUser.email == email){
       await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
          authenticated = true
          console.log("authenticated")
        })
        if (authenticated){
          await OneSignal.removeEventListener('received', this.onReceived);
          await OneSignal.removeEventListener('opened', this.onOpened);
          await OneSignal.removeEventListener('ids', this.onIds);
          // async storage remove
          await AsyncStorage.removeItem(auth().currentUser.uid + 'userGender')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'userCountry')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'userName')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'userBio')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'userPhotoCount')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'blockedUsers')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'favoriteUsers')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'noOfSearch')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'lastSearch')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'historyArray')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'favShowThisDialog')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'blockShowThisDialog')
          await AsyncStorage.removeItem(auth().currentUser.uid + "o")
          await AsyncStorage.removeItem(auth().currentUser.uid + 'playerId')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'message_uids')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'message_usernames')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'theme')
          await AsyncStorage.removeItem(auth().currentUser.uid + 'mode')
          var messageUidsArray = firestore().collection(auth().currentUser.uid).doc("MessageInformation")
          console.log("messageuidsarray: ", messageUidsArray)
          await messageUidsArray.get().then( async doc =>{
            console.log("firestore içi")
            if(doc.exists){
              var conversationUidArray = await doc.data()["UidArray"]
              for(let i = 0; i < conversationUidArray.length; i++){
                await AsyncStorage.removeItem(auth().currentUser.uid + conversationUidArray[i] + '/messages')
                await AsyncStorage.removeItem('IsRequest/' + auth().currentUser.uid + "/" + conversationUidArray[i])
                await AsyncStorage.removeItem('ShowMessageBox/' + auth().currentUser.uid + "/" + conversationUidArray[i])
                await AsyncStorage.removeItem(auth().currentUser.uid + "" + conversationUidArray[i] + 'lastSeen')
              }
            }
          })
          // firestore delete
          await firestore().collection(auth().currentUser.uid).doc('ModelResult').delete().then(() => {
            console.log('ModelResult deleted!');
          }).catch(error => {
            console.log(error)
          });
          await firestore().collection(auth().currentUser.uid).doc('Bios').delete().then(() => {
            console.log('Bİos deleted!');
          }).catch(error => {
            console.log(error)
          });
          await firestore().collection(auth().currentUser.uid).doc('Similarity').delete().then(() => {
            console.log('Similarity deleted!');
          }).catch(error => {
            console.log(error)
          });
          await firestore().collection(auth().currentUser.uid).doc('MessageInformation').delete().then(() => {
            console.log('MessageInformation deleted!');
          }).catch(error => {
            console.log(error)
          });
          await firestore().collection(auth().currentUser.uid).doc('Funcdone').delete().then(() => {
            console.log('Funcdone deleted!');
          })
          // storage delete
          await storage().ref("Photos/" + auth().currentUser.uid + "/SearchPhotos/search-photo.jpg").delete().then(() => {
            console.log('search-photo deleted');
          }).catch(error => {
            console.log(error)
          });
          await storage().ref("Photos/" + auth().currentUser.uid + "/SearchPhotos/vec.pickle").delete().then(() => {
            console.log('vec deleted!');
          }).catch(error => {
            console.log(error)
          });
          await storage().ref("Photos/" + auth().currentUser.uid + "/2.jpg").delete().then(() => {
            console.log('2 deleted!');
          })
          await storage().ref("Photos/" + auth().currentUser.uid + "/3.jpg").delete().then(() => {
            console.log('3 deleted!');
          })
          await storage().ref("Photos/" + auth().currentUser.uid + "/4.jpg").delete().then(() => {
            console.log('4 deleted!');
          })
          await storage().ref("Photos/" + auth().currentUser.uid + "/5.jpg").delete().then(() => {
            console.log('5 deleted!');
          })
          await storage().ref("Embeddings/" + auth().currentUser.uid + ".pickle").delete().then(() => {
            console.log('embeddings deleted!');
          })
          await storage().ref("Photos/" + auth().currentUser.uid + "/1.jpg").delete().then(() => {
            console.log('1 deleted!');
          })
          // realtime remove
          await database().ref('/PlayerIds/' + auth().currentUser.uid).remove().then(() => {
            console.log('playerId deleted!');
          })
          await database().ref('/Users/'+auth().currentUser.uid).remove().then(() => {
            console.log('user info deleted!');
          })
          // delete account from authentication
          await auth().currentUser.delete().then(function() {
            console.log("LOGOUT SUCCESSFUL")
            global.popUp()
          })
        }
     }
     else{
       Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
     }
   } catch (error) {
     console.log(error)
     Alert.alert(lang.PlsTryAgain, lang.ConnectionFailed)
   }
 }
  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return(
      <Modal /*BÜYÜTÜLMÜŞ FOTOĞRAF MODALI*/
        style = {{alignItems: 'center', justifyContent: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        hideModalContentWhileAnimating = {true}
        onBackdropPress = {this.props.onBackdropPress}
        animationIn = "flipInY"
        animationOut = "flipOutY"
        animationInTiming = {750}
        animationOutTiming = {750}
        isVisible={this.props.isVisible}
        >
        <View style={{
          borderBottomLeftRadius: 12, borderTopRightRadius: 12,
          borderTopLeftRadius: 12, borderBottomRightRadius: 12,
          backgroundColor: 'white',
          width: this.width*(8/10),
          flexDirection: 'column',
          paddingTop: 0,
          paddingBottom: 0
          }}>
          <ImageBackground source={{uri: "flare"}}
            style={{ alignItems: "center", borderBottomLeftRadius: 12, borderTopRightRadius: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12,
              width: this.width*(8/10), height: this.width*(12/10)}}>

              <TouchableOpacity
              activeOpacity = {1}
              style={{width: this.width*(8/10), height: this.width*(12/10), flex:1, alignItems: 'center',}}
               onPress={()=> Keyboard.dismiss() }>
              <View
              style = {{position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*55)/100,
               backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)'}}>
              <Text
              style = {{fontSize: 18*(this.width/360), color: 'white'}}>
              Verify your email and password to delete your account.
              </Text>
              </View>

                <TextInput
                placeholderTextColor="rgba(255,255,255,0.7)"
                placeholder={global.langEmail}
                keyboardType= "email-address"

                style={{fontSize: 16*(this.width/360),  position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*30)/100,
                 backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
                 onChangeText={(text) => email = text}>
              </TextInput>
              <TextInput
              placeholderTextColor="rgba(255,255,255,0.7)"
              placeholder={global.langPassword}
              secureTextEntry

              style={{fontSize: 16*(this.width/360),  position: 'absolute', width: this.width*(6/10), height: (this.height*6)/100, flex:1, bottom: (this.height*23)/100,
               backgroundColor: 'rgba(255,255,255,0)', borderColor: 'rgba(241,51,18,0)', borderBottomColor: 'white', borderBottomWidth: 1}}
               onChangeText={(text) => pw = text}>
            </TextInput>

            <TouchableOpacity
            activeOpacity = {1}
            style={{justifyContent: 'center', position: 'absolute',
              paddingLeft: 15, paddingRight: 15, height: (this.height*6)/100, flex:1, bottom: (this.height*15)/100}}
             onPress={() => {this.deletePress(email, pw)}}>
             <Text style={{textAlign: 'center', color: 'white',   fontSize: 18*(this.width/360)}}>
             Enter
            </Text>
            </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
            style={{width: this.width*(2/15), height: this.width*(2/15), right: 0, position:'absolute', top:0}}
             onPress={this.props.onPressCancel}>
             <Image source={{uri: 'cross' + global.themeForImages}}
               style={{width: '40%', height: '40%', right:'30%', bottom: '30%', position: 'absolute' }}
             />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Modal>
    )
  }
}

export * from './AuthenticationModal';
