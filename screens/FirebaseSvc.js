import * as firebase from "firebase";
import uuid from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';


var firstTime = true
var localMessages = []
var arrayLength = 0
class FirebaseSvc {

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({ message }) {
        console.log("Failed:" + message);
      }
    } else {
      console.log("Reusing auth...");
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('Messages/' + global.receiverUid + "/" + firebase.auth().currentUser.uid);
  }

  parse = async snapshot => {
    if(snapshot.val() != null){
      // remove k from snapshot data
      var snapVal = snapshot.val()
      delete snapVal["k"]
      if(Object.keys(snapVal).length != 0){
        var messageKey = Object.keys(snapVal)[0]
        await AsyncStorage.getItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages')
          .then(req => JSON.parse(req))
          .then(json => localMessages = json)

          const user = { _id: global.receiverUid, r: firebase.auth().currentUser.uid}
          const { p: p, c: numberStamp, i: isRequest, text} = snapVal[messageKey];
          const id = messageKey;
          const _id = messageKey; //needed for giftedchat
          const createdAt = new Date(numberStamp);
          const c = numberStamp

          var image ="";
          if(p == "t"){
            image = "file://" + RNFS.DocumentDirectoryPath + "/" + firebase.auth().currentUser.uid + "/" + messageKey + ".jpg"
          }

          var downloadURL;
          var storageRef = firebase.storage().ref("Photos/" + firebase.auth().currentUser.uid + "/MessagePhotos/" + messageKey + ".jpg")
          await storageRef.getDownloadURL().then(data =>{
            downloadURL = data
          })
          let dirs = RNFetchBlob.fs.dirs
          await RNFetchBlob
          .config({
            fileCache : true,
            appendExt : 'jpg',
            path: RNFS.DocumentDirectoryPath + "/" + firebase.auth().currentUser.uid + "/" + messageKey + ".jpg"
          })
          .fetch('GET', downloadURL, {
            //some headers ..
          })
          console.log(" RESİM LOCALE KAYDEDİLDİ PARSEDA: ", image)

          const message = {
            c,
            id,
            _id,
            createdAt,
            isRequest,
            text,
            user,
            image
          };

          if(localMessages == null || localMessages.length == 0){
            localMessages = [message]
          }
          else{
            localMessages.push(message)
          }
          firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + global.receiverUid + "/" + messageKey).remove()

          AsyncStorage.setItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMessages))
          firstTime = false
          return message;
      }
      else{
        return null
      }
    }
    else{
      return null
    }
  };

  refOn = async callback => {
    firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + global.receiverUid).orderByKey().endAt("A").startAt("-")
      .on('value', async snapshot => await callback(await this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = async (messages, p, images, index) => {
    console.log("SENDE GELEN MESSAGES:", messages)
    var isRequest;
    if(global.firstMessage){
      isRequest = "t"
      firebase.database().ref('Messages/' + global.receiverUid + "/" + firebase.auth().currentUser.uid).update({
        k:1
      })
      firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + global.receiverUid).update({
        k:1
      })
      global.firstMessage = false

      var gender = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userGender')
      var country = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userCountry')
      var username = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userName')
      var bio = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userBio')

      var senderRef = firebase.firestore().collection(firebase.auth().currentUser.uid).doc("MessageInformation");
      if(senderRef.exists){
        senderRef.update({
          UidArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUid),
        })
      }
      else{
        senderRef.set({
          UidArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUid),
        }, {merge: true})
      }

      var receiverRef = firebase.firestore().collection(global.receiverUid).doc("MessageInformation");
      if(receiverRef.exists){
        receiverRef.update({
          UidArray: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid),
        })
      }
      else{
        receiverRef.set({
          UidArray: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid),
        }, {merge: true})
      }

    }
    else{
      if(global.isRequest == "t" && global.lastMsg != undefined){
        if(global.lastMsg["user"]["r"] == firebase.auth().currentUser.uid){
          isRequest = "f"
        }
        else{
          isRequest = "t"
        }
      }
      else{
        isRequest = "f"
      }
    }

    for (let i = 0; i < messages.length; i++) {
      const { text, user1 } = messages[i];
      const message = {
        text,
        c: this.timestamp,
        i: isRequest,
        p: p
      };
      var pushedKey;
      pushedKey = this.ref.push(message).key;

      // RESİMLİ MESAJSA
      var image;
      if( p == "t" ){

        console.log("IMAGE:", images[index])
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var metadata = {
          contentType: 'image/jpeg',
        };

          const response = await fetch(images[index].url);
          const blob = await response.blob();
          var ref1 = storageRef.child("Photos/" + global.receiverUid+ "/MessagePhotos/" + pushedKey + ".jpg");
          ref1.put(blob).then(function(snapshot) {}).catch(function(error) {
            Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
          });;

          await RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + firebase.auth().currentUser.uid)
          await RNFS.copyFile(images[index].url, RNFS.DocumentDirectoryPath + "/" + firebase.auth().currentUser.uid + "/" + pushedKey + ".jpg");
          image = "file://" + RNFS.DocumentDirectoryPath + "/" + firebase.auth().currentUser.uid + "/" + pushedKey + ".jpg"
          console.log(" RESİM LOCALE KAYDEDİLDİ SENDDE: ", image)
      }

      const user = { _id: firebase.auth().currentUser.uid, r: global.receiverUid}
      const id = pushedKey;
      const _id = pushedKey; //needed for giftedchat
      var createdAt = new Date();
      var c = createdAt.getTime()
      const msg = {
        id,
        _id,
        c,
        createdAt,
        isRequest,
        text,
        user,
        image
      };
      global.msgToDisplay = msg
      var localMsgs = []
      await AsyncStorage.getItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages')
        .then(req => JSON.parse(req))
        .then(json => localMsgs = json)
        if(localMsgs == null || localMsgs.length == 0){
          localMsgs = [msg]
        }
        else{
          localMsgs.push(msg)
        }
        await AsyncStorage.setItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMsgs))
    }

  };

  refOff() {
    firebase.database().ref('Messages/' + firebase.auth().currentUser.uid + "/" + global.receiverUid).orderByKey().endAt("A").startAt("-").off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
