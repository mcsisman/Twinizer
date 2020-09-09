import uuid from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

var firstTime = true
var localMessages = []
var arrayLength = 0
class FirebaseSvc {

  observeAuth = () =>
    auth().onAuthStateChanged(this.onAuthStateChanged);

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
    return (auth().currentUser || {}).uid;
  }

  get ref() {
    return database().ref('Messages/' + global.receiverUid + "/" + auth().currentUser.uid);
  }

  removeListener = async snapshot => {
    console.log("K SİLİNDİ!!!!!!!!!!!!!!")
    await AsyncStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
      .then(req => JSON.parse(req))
      .then(json => localMessages = json)

    localMessages.concat(global.messageBuffer)

    return localMessages
  };
  removeOn = async callback => {
    console.log("REMOVE LİSTENERI AÇILDI!!!!!")
      database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid).orderByKey().equalTo("k")
        .on('child_removed', async snapshot => await this.removeListener(snapshot));
    }

  parse = async snapshot => {
    if(snapshot.val() != null){
      console.log("PARSE SNAPSHOT:", snapshot.val())
      // remove k from snapshot data
      var snapVal = snapshot.val()
      delete snapVal["k"]
      if(Object.keys(snapVal).length != 0){
        var messageKey = Object.keys(snapVal)[Object.keys(snapVal).length - 1]
        await AsyncStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
          .then(req => JSON.parse(req))
          .then(json => localMessages = json)

          const user = { _id: global.receiverUid, r: auth().currentUser.uid}
          const { p: p, c: numberStamp, text} = snapVal[messageKey];
          const id = messageKey;
          const _id = messageKey; //needed for giftedchat
          const createdAt = new Date(numberStamp);
          const c = numberStamp

          var image ="";
          if(p == "t"){
            image = "file://" + RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + messageKey + ".jpg"
            var downloadURL;
            var storageRef = storage().ref("Photos/" + auth().currentUser.uid + "/MessagePhotos/" + messageKey + ".jpg")
            var fileExists = false
            console.log("WHILE ÖNCESİ")
            while(!fileExists){
              console.log("WHILEIN BAŞI")
              await storageRef.getDownloadURL().then(data =>{
                console.log("THENİN İÇİ")
                downloadURL = data
                fileExists = true
              }).catch(function (error) {
                console.log("ERROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOR")
                console.log(error)
              })
            }

            console.log("ERRORU GEÇTİK")
            let dirs = RNFetchBlob.fs.dirs
            await RNFetchBlob
            .config({
              fileCache : true,
              appendExt : 'jpg',
              path: RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + messageKey + ".jpg"
            })
            .fetch('GET', downloadURL, {
              //some headers ..
            })
            console.log(" RESİM LOCALE KAYDEDİLDİ PARSEDA: ", image)
          }

          const message = {
            c,
            id,
            _id,
            createdAt,
            text,
            user,
            image
          };
          database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid + "/" + messageKey).remove()
          firstTime = false

          if(!global.currentProcessUidArray[global.receiverUid]){
            if(localMessages == null || localMessages.length == 0){
              localMessages = [message]
            }
            else{
              localMessages.push(message)
            }
            AsyncStorage.setItem(auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMessages))

            return message;
          }
          else{
            global.messageBuffer.push(message)
            return null
          }
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
    database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid).orderByKey().endAt("A").startAt("-").limitToLast(1)
      .on('value', async snapshot => await callback(await this.parse(snapshot)));
  }

  get timestamp() {
    return database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = async (messages, p, images, index) => {
    AsyncStorage.setItem('IsRequest/' + auth().currentUser.uid + "/" + global.receiverUid, "false")
    database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid).update({
      k:1
    })
    console.log("SENDE GELEN MESSAGES:", messages)
    if(global.firstMessage){
      var kExists = false
      var kListener = database().ref('Messages/' + global.receiverUid + "/" + auth().currentUser.uid + "/k");
      await kListener.once('value').then(async snapshot => {
        if(snapshot.val() != null){
          kExists = true
        }
      })
      if(!kExists){
        database().ref('Messages/' + global.receiverUid + "/" + auth().currentUser.uid).update({
          k: 0
        })
        global.firstMessage = false

        var senderRef = firestore().collection(auth().currentUser.uid).doc("MessageInformation");
        if(senderRef.exists){
          senderRef.update({
            UidArray: firestore.FieldValue.arrayUnion(global.receiverUid),
          })
        }
        else{
          senderRef.set({
            UidArray: firestore.FieldValue.arrayUnion(global.receiverUid),
          }, {merge: true})
        }

        var receiverRef = firestore().collection(global.receiverUid).doc("MessageInformation");
        if(receiverRef.exists){
          receiverRef.update({
            UidArray: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
          })
        }
        else{
          receiverRef.set({
            UidArray: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
          }, {merge: true})
        }
      }

    }

    for (let i = 0; i < messages.length; i++) {
      const { text, user1 } = messages[i];
      fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"app_id": "7af3b2d1-d4fe-418d-a096-4f57f2c384c8",
               "include_player_ids": [global.playerIdArray[global.receiverUid]], //global.playerIdArray[global.receiverUid]
               "contents": {"en": global.receiverUsername + ": " + text}})
      }).then((response) => {
        console.log(response)
      });
      const message = {
        text,
        c: this.timestamp,
        p: p
      };

      var pushedKey;
      pushedKey = this.ref.push(message).key;

      // RESİMLİ MESAJSA
      var image;
      if( p == "t" ){
        console.log("IMAGE:", images[index])
        var storageRef = storage().ref();
        var metadata = {
          contentType: 'image/jpeg',
        };

          const response = await fetch(images[index].url);
          const blob = await response.blob();
          var ref1 = storageRef.child("Photos/" + global.receiverUid+ "/MessagePhotos/" + pushedKey + ".jpg");
          ref1.put(blob).then(function(snapshot) {}).catch(function(error) {
            Alert.alert("Upload Failed", "Couldn't upload the image. Try Again.." )
          });;

          await RNFS.mkdir(RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid)
          await RNFS.copyFile(images[index].url, RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + pushedKey + ".jpg");
          image = "file://" + RNFS.DocumentDirectoryPath + "/" + auth().currentUser.uid + "/" + pushedKey + ".jpg"
          console.log(" RESİM LOCALE KAYDEDİLDİ SENDDE: ", image)
      }

      const user = { _id: auth().currentUser.uid, r: global.receiverUid}
      const id = pushedKey;
      const _id = pushedKey; //needed for giftedchat
      var createdAt = new Date();
      var c = createdAt.getTime()
      const msg = {
        id,
        _id,
        c,
        createdAt,
        text,
        user,
        image
      };
      global.msgToDisplay = msg
      if(!global.currentProcessUidArray[global.receiverUid]){
        var localMsgs = []
        await AsyncStorage.getItem(auth().currentUser.uid + global.receiverUid + '/messages')
          .then(req => JSON.parse(req))
          .then(json => localMsgs = json)
          if(localMsgs == null || localMsgs.length == 0){
            localMsgs = [msg]
          }
          else{
            localMsgs.push(msg)
          }
          await AsyncStorage.setItem(auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMsgs))
      }
      else{
        global.messageBuffer.push(msg)
      }

    }
  };

  removeOff(){
    database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid).orderByKey().equalTo("k").off()
  }
  refOff() {
    database().ref('Messages/' + auth().currentUser.uid + "/" + global.receiverUid).orderByKey().endAt("A").startAt("-").off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
