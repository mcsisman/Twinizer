import * as firebase from "firebase";
import uuid from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
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
    console.log("PARSE A GİRDİ:", snapshot.val())
    if(snapshot.val() != null){
      // remove k from snapshot data
      var snapVal = snapshot.val()
      delete snapVal["k"]
      console.log("KEYS LENGTH: ", Object.keys(snapVal).length)
      if(Object.keys(snapVal).length != 0){
        var messageKey = Object.keys(snapVal)[0]
        console.log("SNAP VAL: ", snapVal)
        await AsyncStorage.getItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages')
          .then(req => JSON.parse(req))
          .then(json => localMessages = json)

          const user = { _id: global.receiverUid, r: firebase.auth().currentUser.uid}
          const { c: numberStamp, i: isRequest, text} = snapVal[messageKey];
          const id = messageKey;
          const _id = messageKey; //needed for giftedchat
          const createdAt = new Date(numberStamp);
          const c = numberStamp
          const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
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
  send = async messages => {
    console.log("SEND IN FIREBASE SVC")
    var isRequest;
    if(global.firstMessage){
      isRequest = "t"
      console.log("GİRDİ GİRDİ")
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
        i: isRequest
      };

      var pushedKey;
      pushedKey = this.ref.push(message).key;

      const user = { _id: firebase.auth().currentUser.uid, r: global.receiverUid}
      const id = pushedKey;
      const _id = pushedKey; //needed for giftedchat
      var createdAt = new Date();
      var c = createdAt.getTime()
      const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
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
        AsyncStorage.setItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMsgs))


    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
