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
    var keyArray = []
    keyArray[0] = firebase.auth().currentUser.uid
    keyArray[1] = global.receiverUid
    keyArray.sort()
    var key = keyArray[0] + "" + keyArray[1]
    return firebase.database().ref('Messages/' + "" + key);
  }

  parse = async snapshot => {
    await AsyncStorage.getItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages')
      .then(req => JSON.parse(req))
      .then(json => localMessages = json)
    if(localMessages != null && localMessages.length != 0){
      var keyObj = localMessages[localMessages.length - 1]._id;
      console.log("LAST:", keyObj);
      console.log("SNAPSHOT KEY:", snapshot.key + "")
      var lastMsgKey = keyObj + ""
    }
    else{
      lastMsgKey = ""
    }
    if(lastMsgKey != (snapshot.key + "")){
      console.log("İÇERİ GİRDİ")
      const { c: numberStamp, i: isRequest, text, user } = snapshot.val();
      const { key: id } = snapshot;
      const { key: _id } = snapshot; //needed for giftedchat
      const createdAt = new Date(numberStamp);
      const image = "https://firebasestorage.googleapis.com/v0/b/twinizer-atc.appspot.com/o/Male%2FAlbania%2Faysalaytac97%40gmail.com%2F1.jpg?alt=media&token=770e262e-6a32-4954-b126-a399c8d379d1"
      const message = {
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
      console.log("KAYDEDİLEN LOCAL MESAJLAR:", localMessages)
      AsyncStorage.setItem(firebase.auth().currentUser.uid + global.receiverUid + '/messages', JSON.stringify(localMessages))
      firstTime = false
      return message;
    }

  };

  refOn = async callback => {
    this.ref
      .limitToLast(1)
      .on('child_added', async snapshot => await callback(await this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = async messages => {
    var isRequest;
    if(global.firstMessage){
      isRequest = "t"
      global.firstMessage = false
      var gender = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userGender')
      var username = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userName')
      var country = await AsyncStorage.getItem(firebase.auth().currentUser.uid + 'userCountry')
      if(country == null || gender == null || username == null){
        var informationRef = firebase.firestore().collection(firebase.auth().currentUser.email).doc("Information");
        await informationRef.get().then(doc => {
          gender = doc.data()["gender"]
          country = doc.data()["country"]
          username = doc.data()["username"]
       }).catch(function(error) {
         console.log("Error getting document:", error);
       });
     }
      var senderRef = firebase.firestore().collection(firebase.auth().currentUser.email).doc("MessageInformation");
      if(senderRef.exists){
        senderRef.update({
          UidArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUid),
          GenderArray: firebase.firestore.FieldValue.arrayUnion(global.receiverGender + "_" + global.receiverUid),
          CountryArray: firebase.firestore.FieldValue.arrayUnion(global.receiverCountry + "_" + global.receiverUid),
          UsernameArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUsername + "_" + global.receiverUid)
        })
      }
      else{
        senderRef.set({
          UidArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUid),
          GenderArray: firebase.firestore.FieldValue.arrayUnion(global.receiverGender + "_" + global.receiverUid),
          CountryArray: firebase.firestore.FieldValue.arrayUnion(global.receiverCountry + "_" + global.receiverUid),
          UsernameArray: firebase.firestore.FieldValue.arrayUnion(global.receiverUsername + "_" + global.receiverUid)
        }, {merge: true})
      }

      var receiverRef = firebase.firestore().collection(global.receiverMail).doc("MessageInformation");
      if(receiverRef.exists){
        receiverRef.update({
          UidArray: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid),
          GenderArray: firebase.firestore.FieldValue.arrayUnion(gender + "_" + firebase.auth().currentUser.uid),
          CountryArray: firebase.firestore.FieldValue.arrayUnion(country + "_" + firebase.auth().currentUser.uid),
          UsernameArray: firebase.firestore.FieldValue.arrayUnion(username + "_" + firebase.auth().currentUser.uid)
        })
      }
      else{
        receiverRef.set({
          UidArray: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid),
          GenderArray: firebase.firestore.FieldValue.arrayUnion(gender + "_" + firebase.auth().currentUser.uid),
          CountryArray: firebase.firestore.FieldValue.arrayUnion(country + "_" + firebase.auth().currentUser.uid),
          UsernameArray: firebase.firestore.FieldValue.arrayUnion(username + "_" + firebase.auth().currentUser.uid)
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
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        c: this.timestamp,
        i: isRequest
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
