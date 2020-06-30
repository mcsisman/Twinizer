import React, {Component} from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import * as firebase from "firebase";
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
import Swipeable from 'react-native-swipeable';
import RNFetchBlob from 'rn-fetch-blob'
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
  } from 'react-native';

import SplashScreen from './Splash';
import ImageUploadScreen from './ImageUpload';
import ProfileUploadScreen from './ProfileUpload';
import CountryScreen from './Country';
import ChatScreen from './Chat';
var distanceArray = [];
var emailArray = [];
var genderArray = [];
var countryArray = [];
var dict = {};
var photoArray = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]
var hepsi = true;

export default class MainScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      email: "",
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: 'rgba(241,51,18,0.4)',
      borderOpacity: 'rgba(241,51,18,1)',
      disabled: true,
      opacity: 0.4,
      searchOnIsVisible: false,
      notifIsVisible: false,
      isVisible1: false,
      isVisible2: false,
      country: null,
      gender: null,
      disabledSearch: true,
      searchButtonOpacity: 'rgba(241,51,18,0.4)',
      placeHolder1: global.langCountry,
      placeHolder2: global.langGender,
      center: 0,
      imagePath: null,
      backgroundOpacity: 0.2,
      swipeCount: 0,
      swipeableDisabled: true,
      photoHeight0: global.width*(2/10)*(7/6),
      photoHeight1: global.width*(2/10)*(7/6),
      photoHeight2: global.width*(5/10)*(7/6),
      photoHeight3: global.width*(2/10)*(7/6),
      photoHeight4: global.width*(2/10)*(7/6),

      photoWidth0: global.width*(2/10),
      photoWidth1: global.width*(2/10),
      photoWidth2: global.width*(5/10),
      photoWidth3: global.width*(2/10),
      photoWidth4: global.width*(2/10),
      test: global.width*((12.5+2490)/10),
      photoRight0: global.width*((24+2490)/10),
      photoRight1: global.width*((19+2490)/10),
      photoRight2: global.width*((12.5+2490)/10),
      photoRight3: global.width*((9+2490)/10),
      photoRight4: global.width*((4+2490)/10),
      photoTop0: global.width*(7/40),
      photoTop1: global.width*(7/40),
      photoTop2: 0,
      photoTop3: global.width*(7/40),
      photoTop4: global.width*(7/40),
      deactivate: null,
      deactivateLeft: null,
      deactivateRight: null,
      distanceLeft: global.width*(2.5/10),
      distanceRight: global.width*(2.5/10),
      uri0: null,
      uri1: null,
      uri2: null,
      uri3: null,
      uri4: null,
      uri2_gender: "",
      uri2_country: "",
      swipeable: -global.width,
      complete: false,
      releasedAfterRightD2: false,
      releasedAfterLeftD2: false,
      deactivationRightDistance: global.width*(2.5/10),
      rightActionCount: 0,
      deactivationLeftDistance: global.width*(2.5/10),
      leftActionCount: 0,
    }
    this.doesExist = false,
    this.searchNumForDownload = 0;
    this.probabilityDoneCheck = false;
    this.downloadURL = "";
    this.url = "",
    this.center = 0
    this.countries = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Deps",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Central African Rep",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Congo Democratic Rep",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland {Republic}",
      "Israel",
      "Italy",
      "Ivory Coast",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea North",
      "Korea South",
      "Kosovo",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macedonia",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar, {Burma}",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russian Federation",
      "Rwanda",
      "St Kitts & Nevis",
      "St Lucia",
      "Saint Vincent & the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome & Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trinidad & Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe"];
    this.welcome = {uri: 'welcome'}
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.globalGender = "";
    this.photoRes = 7/6
    this.bigPhotoWidth = this.width*(5/10);
    this.bigPhotoHeight = this.bigPhotoWidth*this.photoRes;
    this.smallPhotoWidth = this.width*(2/10);
    this.smallPhotoHeight = this.smallPhotoWidth*this.photoRes
    this.bottomPhotoWidth = this.width*(3/10);
    this.bottomPhotoHeight = this.bottomPhotoWidth*this.photoRes;

    this.similarity_ref = firebase.firestore().collection(firebase.auth().currentUser.email).doc("Similarity")
    this.widthAnimation = new Animated.Value(global.width*(5/10))
    this.heightAnimation = new Animated.Value(global.width*(5/10)*(7/6))
    this.topAnimation = new Animated.Value(0)
    var test = "xxx"
  }

  componentDidMount(){
    this.welcome = {uri: 'twinizermain'}
    this.started_check()
    this.printMessagesData()
  };

static navigationOptions = {
    header: null,
};

// MESSAGE FUNCTIONS__________________________VE COMPONENT DID MOUNTA PRINT MESSAGES DATA EKLENDİ____________________________________________________________________________________________________
async getMessagesData(currentUserMail, otherUserMail){
  var data1 ;
  var data2 ;
  var et = currentUserMail + "" + otherUserMail
  var database1 = firebase.database().ref('Messages').orderByChild("user/et").equalTo(et);
  await database1.once('value', function(snapshot1) {
  snapshot1.forEach(function(childSnapshot1) {
    data1 = childSnapshot1.val()
  });
  });

  var database2 = firebase.database().ref('Messages').orderByChild("user/te").equalTo(et);
  await database2.once('value', function(snapshot2) {
  snapshot2.forEach(function(childSnapshot2) {
    data2 = childSnapshot2.val()
  });
});
  if(data2 == undefined && data1 != undefined){
    return data1
  }
  if(data1 == undefined && data2 != undefined){
    return data2
  }
  if(data1["createdAt"] > data2["createdAt"]){
    return data1
  }else{
    return data2
  }
}

sortByProperty(property){
   return function(a,b){
      if(a[property] > b[property])
         return 1;
      else if(a[property] < b[property])
         return -1;

      return 0;
   }
}

async retrieveMessageMails(){
  var conversationEmailArray = []
  var count = 1;
  var data;
  var noOfConversations;
  var db = firebase.firestore();
  var docRef = db.collection(firebase.auth().currentUser.email).doc("MessageInformation");
  await docRef.get().then(function(doc) {
    noOfConversations = doc.data()['noOfConversations']
  data = doc.data()
  }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  while(count <= noOfConversations){
    conversationEmailArray.push(data[count])
    count = count+1;
  }
  this.noOfConversations = noOfConversations
  return conversationEmailArray
}

async printMessagesData(){

  var emailArray = await this.retrieveMessageMails()
  var count = 0;
  var dataArray = []
  var noOfConversations = emailArray.length;
  while(count < noOfConversations){

    dataArray.push(await this.getMessagesData(firebase.auth().currentUser.email, emailArray[count]))
    count++;
  }
  dataArray.sort(this.sortByProperty("createdAt"));
  dataArray.reverse()
  global.dataArray = dataArray
  global.noOfConversations = noOfConversations

}
//MESSAGE FUNCTION_______________________________________________________________________________________________________________________________

search = () =>{
    this.setState({isVisible2: true})
};

noLeft(){
  if(this.state.swipeCount == 0){
    return null
  }
  else{
    return <Text></Text>
  }

}
noRight(){
  if(this.state.swipeCount == photoArray.length+1){ // this.state.swipeableDisabled
    return null
  }
  else{
    return <Text></Text>
  }

}

started_check(){
  var started_check_ref = firebase.firestore().collection(firebase.auth().currentUser.email).doc("SearchInformation");
   started_check_ref.get().then(doc => {
    if (doc.exists) {
      if(doc.data()["startedBoolean"]){
        this.checkFunction();
        this.setState({searchOnIsVisible: true, gender: doc.data()["searchGender"], country: doc.data()["searchCountry"]});
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
}

valueChangeCountry(value){
  this.setState({country: value, placeHolder1: value})
  if(this.state.gender != null && value != null ){
    this.setState({ disabledSearch: false, searchButtonOpacity: 'rgba(241,51,18,1)'})
  }
}
valueChangeGender(value){
  this.setState({placeHolder2: value})
  if(value == "Erkek"){
    value = "Male"
    this.setState({gender: "Male"})
  }
  if(value == "Kadın"){
    value = "Female"
    this.setState({gender: "Female"})
  }
  if( value == "Tüm Cinsiyetler"){
    value == "All Genders"
    this.setState({gender: "All Genders"})
  }
  this.setState({gender: value})
  if(this.state.country != null && value != null ){
    this.setState({disabledSearch: false, searchButtonOpacity: 'rgba(241,51,18,1)'})
  }
}

async createEmailDistanceArrays(){
  await firebase.firestore().collection(firebase.auth().currentUser.email).doc("Similarity").get().then( async function(doc) {
    dict = doc.data();
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });
  var items = Object.keys(dict).map(function(key) {
     return [key, dict[key]];
   });
   // Sort the array based on the second element
   items.sort(function(first, second) {
     return second[1] - first[1];
   });
   var length = Object.keys(dict).length;
   console.log(length);
   for(let i = 0; i < length; i++){
     emailArray.push(items[i][0]);
     distanceArray.push(items[i][1]);
   }
   console.log(items);
   console.log(emailArray);
   console.log(distanceArray);
   //console.log(distanceArray);
}

async createCountryArray(imageIndex){
  console.log(this.state.country);
  console.log(this.state.gender);
  if(this.state.country == "All Countries" || this.state.gender == "All Genders"){
    hepsi = true;
  }else {
    hepsi = false;
  }
  console.log(hepsi);
  console.log(emailArray[imageIndex]);
  if (hepsi){
      var docRef = firebase.firestore().collection(emailArray[imageIndex]).doc("Information");

      await docRef.get().then(function(doc) {
        if (doc.exists) {
          genderArray.push(doc.data()["gender"])
          countryArray.push(doc.data()["country"])
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
  }else {
      genderArray.push(this.state.gender)
      countryArray.push(this.state.country)
  }
  console.log(genderArray);
  console.log(genderArray.length);
  console.log(countryArray);
  console.log("test");
}

async downloadImages(imageIndex){
  let dirs = RNFetchBlob.fs.dirs
  await RNFetchBlob
  .fs.unlink("file:///data/user/0/com.twinizer/files" + '/' + this.searchNumForDownload + "/" + imageIndex + '.jpg') // photoArray[imageIndex]
 .then(() => {console.log("FILE DELETED")})
 .catch((err) => {console.log("unlink olmadi")})
  await RNFetchBlob
  .config({
    fileCache : true,
    appendExt : 'jpg',
    path: dirs.DocumentDir + '/' + this.searchNumForDownload + "/" + imageIndex + '.jpg'
  })
  .fetch('GET', this.downloadURL, {
    //some headers ..
  })
  .then((res) => {
    console.log('The file saved to ', res.path())
    this.setState({imagePath:  "file://" + res.path()})
    while(this.doesExist){
      RNFetchBlob.fs.exists(res.path())
      .then((exist) => {
        console.log(exist)
        this.doesExist = !exist
      })
      .catch(() => { })
    }
  })
  photoArray[imageIndex] = this.state.imagePath
}
async getImageURL(imageIndex){
  console.log("getImageURL");
    var storageRef = firebase.storage().ref(genderArray[imageIndex] + "/" + countryArray[imageIndex] + "/" + emailArray[imageIndex] + "/1.jpg")
    console.log(genderArray[imageIndex] + "/" + countryArray[imageIndex] + "/" + emailArray[imageIndex] + "/1.jpg");
    await storageRef.getDownloadURL().then(data =>{
      console.log("data: ", data)
      this.downloadURL = data
    }).catch(function(error) {
      // Handle any errors
    });
}

 async checkFunction(){
   console.log("test1");
    var docRef1 = firebase.firestore().collection(firebase.auth().currentUser.email).doc("Similarity").onSnapshot(async doc =>{
      if(doc.exists){
        console.log("doctest");
        if (this.probabilityDoneCheck) {
          // createEmailDistanceArrays KISMI ////////////////////////////////////////
          await this.createEmailDistanceArrays();
          ////////////////////////////////////////////////////////////////////////////////
          this.searchNumForDownload = this.searchNumForDownload + 1;
          for(let i = 0; i < 10; i++){
            // createGenderandCountryArray KISMI ////////////////////////////////////////
            await this.createCountryArray(i);
            // resim indirme KISMI /////////////////////////////////////////////////
            await this.getImageURL(i);
            await this.downloadImages(i);
          }
          console.log("biyere geldik")
          this.setState({
            uri0: null,
            uri1: null,
            uri2: photoArray[0],
            uri3: photoArray[1],
            uri4: photoArray[2],
            uri2_gender: genderArray[0],
            uri2_country: countryArray[0],
            backgroundOpacity: 0,
            swipeableDisabled: false,
          })
          console.log(photoArray)
          console.log(emailArray)
          console.log(genderArray)
          console.log(countryArray)
          console.log(distanceArray)
        }
        this.probabilityDoneCheck = true;
      }
      console.log(this.state.uri2);
    });
}
async filterDone(value){
  emailArray = [];
  countryArray = [];
  genderArray = [];
  distanceArray = [];
  photoArray = [];
  dict = {};
  console.log("EMAIL ARRAY LENGTH ", emailArray.length);
  this.doesExist = false;
  //this.probabilityDoneCheck = false;
  this.downloadURL = "";
  this.url = "";
  const searchRef = firebase.firestore().collection(firebase.auth().currentUser.email).doc('SearchInformation');
  searchRef.update({
    searchGender: this.state.gender,
    searchCountry: this.state.country,
    started: firebase.firestore.FieldValue.increment(1),
    startedBoolean: true
  })
  const updateRef = firebase.firestore().collection('Users').doc('User2');
  updateRef.set({
    name: firebase.auth().currentUser.email
  })
  this.setState({
    isVisible2: false,
    uri0: null,
    uri1: null,
    uri2: null,
    uri3: null,
    uri4: null,
    notifIsVisible: true,
    swipeCount: 0,
    imagePath: null,
    swipeableDisabled: true,
    uri2_gender: "",
    uri2_country: "",
    complete: false,
    releasedAfterRightD2: false,
    releasedAfterLeftD2: false,
    deactivationRightDistance: global.width*(2.5/10),
    rightActionCount: 0,
    deactivationLeftDistance: global.width*(2.5/10),
    deactivate: null,
    deactivateLeft: null,
    deactivateRight: null,
    leftActionCount: 0
  });
  if (this.probabilityDoneCheck == false){
    this.checkFunction();
  }
  console.log("aaaaaa")

}
library = () =>{
  ImagePicker.openPicker({
    width: 600,
    height: 700,
    cropping: true
  }).then(image => {
    global.welcomeOpacity = 0;
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 'rgba(66,66,255,0)',
      opacity: 0,
      isVisible1: false,
      disabled: false,
      buttonOpacity: 'rgba(241,51,18,1)'
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
    global.welcomeOpacity = 0;
    this.setState({
      photo: {uri: image.path},
      borderOpacity: 'rgba(66,66,255,0)',
      opacity: 0,
      isVisible1: false,
      disabled: false,
      buttonOpacity: 'rgba(241,51,18,1)'
    });
});
};

  render(){
    const {navigate} = this.props.navigation;
    return(
      <View
      style={{width: this.width, height: this.height, flex:1}}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={{position: 'absolute',width: this.width, height:getStatusBarHeight(), flex:1, backgroundColor: 'rgba(244,92,66,1)' }}>
      </View>

      <Swipeable style = {{position: 'absolute',width: this.width*501, left: -this.width*250, backgroundColor: 'rgba(241,51,18,0.1)', height: this.bigPhotoHeight, top: (this.height)*(20/100) + (getStatusBarHeight()) }}

        disabled = {this.state.swipeableDisabled}
        rightContent={this.noRight()}
        leftContent={this.noLeft()}

        swipeStartMinDistance = {3}
        swipeReleaseAnimationConfig = {{
          toValue: {x: this.state.center, y: 0},
          duration: 200,
          easing: Easing.elastic(0.5)
        }}

        onSwipeStart = {()=> {
          if(!this.state.swipeableDisabled){
            this.widthAnimation.setValue(global.width*(5/10))
            this.heightAnimation.setValue(global.width*(5/10)*(7/6))
            this.topAnimation.setValue(0)
            Animated.parallel([
                Animated.timing(this.widthAnimation, {
                  duration: 200,
                  toValue: global.width*(2/10),
                  easing: Easing.elastic(0.5)
                }
              ),
                Animated.timing(this.heightAnimation, {
                  duration: 200,
                  toValue: global.width*(2/10)*(7/6),
                  easing: Easing.elastic(0.5)
                }
              ),
                Animated.timing(this.topAnimation, {
                  duration: 200,
                  toValue: global.width*(7/40),
                  easing: Easing.elastic(0.5)
              }
            )

          ]).start(),
            this.setState({
          photoRight2: this.state.photoRight3 + this.width*(5/10)})
          }
      }}
        onSwipeRelease = {()=>{
          if(!this.state.swipeableDisabled){
            if(!this.state.complete || this.state.deactivate){
              if(!this.state.releasedAfterRightD2 || !this.state.releasedAfterLeftD2){
                console.log("OnSwipeRelease")
                this.setState({
                  photoRight2: this.state.test,
                  complete: false})

                  this.widthAnimation.setValue(global.width*(2/10))
                  this.heightAnimation.setValue(global.width*(2/10)*(7/6))
                  this.topAnimation.setValue(global.width*(7/40))
                  Animated.parallel([
                      Animated.timing(this.widthAnimation, {
                        duration: 300,
                        toValue: global.width*(5/10),
                        easing: Easing.elastic(0.5)
                      }
                    ),
                      Animated.timing(this.heightAnimation, {
                        duration: 300,
                        toValue: global.width*(5/10)*(7/6),
                        easing: Easing.elastic(0.5)
                      }
                    ),
                      Animated.timing(this.topAnimation, {
                        duration: 300,
                        toValue: 0,
                        easing: Easing.elastic(0.5)
                    }
                  )

                  ]).start()
                }
            }
          }
        }}

        onLeftActionActivate = {()=> {
            this.setState({ swipeCount: this.state.swipeCount - 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, leftActionCount: this.state.leftActionCount + 1, distanceLeft: this.state.distanceLeft + this.width*(5/10),
              deactivateLeft: true, deactivate: false, center: this.state.center + this.width*(5/10), complete: true}), console.log("left activate1")
          }}
        onRightActionActivate = {()=> {
            this.setState({ swipeCount: this.state.swipeCount + 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, rightActionCount: this.state.rightActionCount + 1, distanceRight: this.state.distanceRight + this.width*(5/10),
              deactivateRight: true, deactivate: false, center: this.state.center-this.width*(5/10), complete: true}), console.log("right activate1")
          }}

        onLeftActionActivate2 = {()=> {
            this.setState({ swipeCount: this.state.swipeCount - 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, deactivationLeftDistance: this.state.deactivationLeftDistance + this.width*(5/10),
              leftActionCount: this.state.leftActionCount + 1, distanceLeft: this.state.distanceLeft + this.width*(5/10),
              deactivateLeft: true, deactivate: false, center: this.state.center + this.width*(5/10), complete: true}), console.log("left activate2")
          }}
        onRightActionActivate2 = {()=> {
            this.setState({ swipeCount: this.state.swipeCount + 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, deactivationRightDistance: this.state.deactivationRightDistance + this.width*(5/10),
              rightActionCount: this.state.rightActionCount + 1, distanceRight: this.state.distanceRight + this.width*(5/10),
              deactivateRight: true, deactivate: false, center: this.state.center-this.width*(5/10), complete: true}), console.log("right activate2")
          }}

        onLeftActionDeactivate= {()=>{
              if(this.state.deactivateLeft){
              {this.setState({ swipeCount: this.state.swipeCount + 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, leftActionCount: this.state.leftActionCount - 1, distanceLeft: this.state.distanceLeft - this.width*(5/10),
                deactivate: true, center: this.state.center - this.width*(5/10)}), console.log("left deactivate1")}
            }
        }}
        onRightActionDeactivate= {()=>{
              if(this.state.deactivateRight){
                  {this.setState({  swipeCount: this.state.swipeCount - 1, releasedAfterLeftD2: false, releasedAfterRightD2: false, rightActionCount: this.state.rightActionCount - 1, distanceRight: this.state.distanceRight - this.width*(5/10),
                    deactivate: true, center: this.state.center + this.width*(5/10)}), console.log("right deactivate1")}
                }
      }}

        onLeftActionDeactivate2= {()=>{
              if(this.state.deactivateLeft){
              {this.setState({ swipeCount: this.state.swipeCount + 1, releasedAfterRightD2: false, releasedAfterLeftD2: true, deactivationLeftDistance: this.state.deactivationLeftDistance - this.width*(5/10), leftActionCount: this.state.leftActionCount - 1,
                distanceLeft: this.state.distanceLeft - this.width*(5/10), deactivate: true, center: this.state.center - this.width*(5/10)}), console.log("left deactivate2")}
            }
        }}
        onRightActionDeactivate2 = {()=>{
            if(this.state.deactivateRight){
                {this.setState({ swipeCount: this.state.swipeCount - 1, releasedAfterLeftD2: false, releasedAfterRightD2: true, deactivationRightDistance: this.state.deactivationRightDistance - this.width*(5/10), rightActionCount: this.state.rightActionCount - 1,
                  distanceRight: this.state.distanceRight - this.width*(5/10), deactivate: true, center: this.state.center + this.width*(5/10)}), console.log("right deactivate2")}
              }
    }}

        leftActionActivationDistance = {this.state.distanceLeft}
        rightActionActivationDistance = {this.state.distanceRight}

        leftActionDeactivationDistance = {this.state.deactivationLeftDistance}
        rightActionDeactivationDistance = {this.state.deactivationRightDistance}

        onLeftActionComplete = {()=> {

          global.leftD2beforeA1 = 0;
          this.widthAnimation.setValue(global.width*(2/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          this.topAnimation.setValue(global.width*(7/40))
          Animated.parallel([
              Animated.timing(this.widthAnimation, {
                duration: 200,
                toValue: global.width*(5/10),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.heightAnimation, {
                duration: 200,
                toValue: global.width*(5/10)*(7/6),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.topAnimation, {
                duration: 200,
                toValue: 0,
                easing: Easing.elastic(0.5)
            }
          )

          ]).start()
          console.log("Swipe Count:", this.state.swipeCount)
          if(this.state.leftActionCount == 2){
            this.setState({
            deactivateLeft: false,
            photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
            deactivationLeftDistance: this.state.deactivationLeftDistance + this.width*(5/10),
            test: this.state.test + this.width*(10/10),
            photoRight0: this.state.photoRight0 + this.width*(10/10),
            photoRight1: this.state.photoRight1 + this.width*(10/10),
            photoRight2: this.state.test  + this.width*(10/10),
            photoRight3: this.state.photoRight3 + this.width*(10/10),
            photoRight4: this.state.photoRight4 + this.width*(10/10),
            distanceRight: this.state.distanceRight - this.width*(10/10),
            deactivationRightDistance: this.state.deactivationRightDistance - this.width*(10/10),
            uri4: this.state.uri2,
            uri3: this.state.uri1,
            uri2: this.state.uri0,
            uri1: photoArray[this.state.swipeCount - 1],
            uri0: photoArray[this.state.swipeCount - 2],
            uri2_gender: genderArray[this.state.swipeCount],
            uri2_country:countryArray[this.state.swipeCount],
            complete:false,
            leftActionCount: 0,
            releasedAfterLeftD2: false,
            releasedAfterRightD2: false
          })

          }
            else{
              this.setState({
              deactivateLeft: false,
              deactivationLeftDistance: this.state.deactivationLeftDistance + this.width*(5/10),
              photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
              test: this.state.test + this.width*(5/10),
              photoRight0: this.state.photoRight0 + this.width*(5/10),
              photoRight1: this.state.photoRight1 + this.width*(5/10),
              photoRight2: this.state.test  + this.width*(5/10),
              photoRight3: this.state.photoRight3 + this.width*(5/10),
              photoRight4: this.state.photoRight4 + this.width*(5/10),
              distanceRight: this.state.distanceRight - this.width*(5/10),
              deactivationRightDistance: this.state.deactivationRightDistance - this.width*(5/10),
              uri4: this.state.uri3,
              uri3: this.state.uri2,
              uri2: this.state.uri1,
              uri1: this.state.uri0,
              uri0: photoArray[this.state.swipeCount - 2],
              uri2_gender: genderArray[this.state.swipeCount],
              uri2_country:countryArray[this.state.swipeCount],
              complete:false,
              leftActionCount: 0,
              releasedAfterLeftD2: false,
              releasedAfterRightD2: false,
              })
            }
            console.log("LeftActionCompleted",)}}
        onRightActionComplete = { async ()=> {
          console.log("Swipe Count:", this.state.swipeCount)
          global.rightD2beforeA1 = 0;
          this.widthAnimation.setValue(global.width*(2/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          this.topAnimation.setValue(global.width*(7/40))
          Animated.parallel([
              Animated.timing(this.widthAnimation, {
                duration: 200,
                toValue: global.width*(5/10),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.heightAnimation, {
                duration: 200,
                toValue: global.width*(5/10)*(7/6),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.topAnimation, {
                duration: 200,
                toValue: 0,
                easing: Easing.elastic(0.5)
            }
          )

          ]).start()
          if(this.state.rightActionCount == 2){
            this.setState({
            deactivateRight: false,
            photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
            deactivationRightDistance: this.state.deactivationRightDistance + this.width*(5/10),
            test: this.state.test - this.width*(10/10),
            photoRight0: this.state.photoRight0 - this.width*(10/10),
            photoRight1: this.state.photoRight1 - this.width*(10/10),
            photoRight2: this.state.test - this.width*(10/10),
            photoRight3: this.state.photoRight3 - this.width*(10/10),
            photoRight4: this.state.photoRight4 - this.width*(10/10),
            distanceLeft: this.state.distanceLeft - this.width*(10/10),
            deactivationLeftDistance: this.state.deactivationLeftDistance - this.width*(10/10),
            uri0: this.state.uri2,
            uri1: this.state.uri3,
            uri2: this.state.uri4,
            uri3: photoArray[this.state.swipeCount + 1],
            uri4: photoArray[this.state.swipeCount + 2],
            uri2_gender: genderArray[this.state.swipeCount],
            uri2_country:countryArray[this.state.swipeCount],
            complete: false,
            rightActionCount: 0,
            releasedAfterLeftD2: false,
            releasedAfterRightD2: false
          })
          if (genderArray.length < emailArray.length){
            await this.createCountryArray(genderArray.length)
            await this.getImageURL(genderArray.length-1)
            await this.downloadImages(genderArray.length-1)
            await this.createCountryArray(genderArray.length)
            await this.getImageURL(genderArray.length-1)
            await this.downloadImages(genderArray.length-1)
          }
          console.log("RightActionCompleted çift")
          }
          else{
            this.setState({
            deactivateRight: false,
            deactivationRightDistance: this.state.deactivationRightDistance + this.width*(5/10),
            photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
            test: this.state.test - this.width*(5/10),
            photoRight0: this.state.photoRight0 - this.width*(5/10),
            photoRight1: this.state.photoRight1 - this.width*(5/10),
            photoRight2: this.state.test - this.width*(5/10),
            photoRight3: this.state.photoRight3 - this.width*(5/10),
            photoRight4: this.state.photoRight4 - this.width*(5/10),
            distanceLeft: this.state.distanceLeft - this.width*(5/10),
            deactivationLeftDistance: this.state.deactivationLeftDistance - this.width*(5/10),
            uri0: this.state.uri1,
            uri1: this.state.uri2,
            uri2: this.state.uri3,
            uri3: this.state.uri4,
            uri4: photoArray[this.state.swipeCount + 2],
            uri2_gender: genderArray[this.state.swipeCount],
            uri2_country:countryArray[this.state.swipeCount],
            complete: false,
            rightActionCount: 0,
            releasedAfterLeftD2: false,
            releasedAfterRightD2: false,
          })
          if (genderArray.length < emailArray.length){
            await this.createCountryArray(genderArray.length)
            await this.getImageURL(genderArray.length-1)
            await this.downloadImages(genderArray.length-1)
          }
          console.log("uri2:", this.state.uri2)
          console.log("RightActionCompleted tek")
          }
      }}

        onLeftActionIncomplete = {()=>{

        if(this.state.releasedAfterLeftD2){
          this.widthAnimation.setValue(global.width*(2/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          this.topAnimation.setValue(global.width*(7/40))
          Animated.parallel([
              Animated.timing(this.widthAnimation, {
                duration: 200,
                toValue: global.width*(5/10),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.heightAnimation, {
                duration: 200,
                toValue: global.width*(5/10)*(7/6),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.topAnimation, {
                duration: 200,
                toValue: 0,
                easing: Easing.elastic(0.5)
            }
          )

        ]).start(),
          this.setState({
          deactivateLeft: false,
          deactivationLeftDistance: this.state.deactivationLeftDistance + this.width*(5/10),
          photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
          test: this.state.test + this.width*(5/10),
          photoRight0: this.state.photoRight0 + this.width*(5/10),
          photoRight1: this.state.photoRight1 + this.width*(5/10),
          photoRight2: this.state.test  + this.width*(5/10),
          photoRight3: this.state.photoRight3 + this.width*(5/10),
          photoRight4: this.state.photoRight4 + this.width*(5/10),
          distanceRight: this.state.distanceRight - this.width*(5/10),
          deactivationRightDistance: this.state.deactivationRightDistance - this.width*(5/10),
          uri4: this.state.uri3,
          uri3: this.state.uri2,
          uri2: this.state.uri1,
          uri1: this.state.uri0,
          uri0: photoArray[this.state.swipeCount - 2],
          uri2_gender: genderArray[this.state.swipeCount],
          uri2_country:countryArray[this.state.swipeCount],
          complete:false,
          leftActionCount: 0,
          releasedAfterLeftD2: false,
          releasedAfterRightD2: false,
        }),
        console.log("LeftActionIncomplete")
        }
    }}
        onRightActionIncomplete = {()=> {

        if(this.state.releasedAfterRightD2 ){
          this.widthAnimation.setValue(global.width*(2/10))
          this.heightAnimation.setValue(global.width*(2/10)*(7/6))
          this.topAnimation.setValue(global.width*(7/40))
          Animated.parallel([
              Animated.timing(this.widthAnimation, {
                duration: 200,
                toValue: global.width*(5/10),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.heightAnimation, {
                duration: 200,
                toValue: global.width*(5/10)*(7/6),
                easing: Easing.elastic(0.5)
              }
            ),
              Animated.timing(this.topAnimation, {
                duration: 200,
                toValue: 0,
                easing: Easing.elastic(0.5)
            }
          )

        ]).start(),
          this.setState({
          deactivateRight: false,
          deactivationRightDistance: this.state.deactivationRightDistance + this.width*(5/10),
          photoWidth2: global.width*(5/10), photoHeight2: global.width*(5/10)*(7/6), photoTop2: 0,
          test: this.state.test - this.width*(5/10),
          photoRight0: this.state.photoRight0 - this.width*(5/10),
          photoRight1: this.state.photoRight1 - this.width*(5/10),
          photoRight2: this.state.test - this.width*(5/10),
          photoRight3: this.state.photoRight3 - this.width*(5/10),
          photoRight4: this.state.photoRight4 - this.width*(5/10),
          distanceLeft: this.state.distanceLeft - this.width*(5/10),
          deactivationLeftDistance: this.state.deactivationLeftDistance - this.width*(5/10),
          uri0: this.state.uri1,
          uri1: this.state.uri2,
          uri2: this.state.uri3,
          uri3: this.state.uri4,
          uri4: photoArray[this.state.swipeCount - 2],
          uri2_gender: genderArray[this.state.swipeCount],
          uri2_country:countryArray[this.state.swipeCount],
          complete: false,
          rightActionCount: 0,
          releasedAfterRightD2: false,
          releasedAfterLeftD2: false,
        }),
        console.log("RightActionIncomplete")
        }
      }}
      >

      <View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)', opacity: 1,
       width: this.state.photoWidth0, height: this.state.photoHeight0, top: this.state.photoTop0, right: this.state.photoRight0, borderBottomLeftRadius: 8, borderTopRightRadius: 8,
       borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
       <Image source={{uri: this.state.uri0}}
         style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       <View
         style={{  width: '100%', height: '100%', backgroundColor: "black",  position: 'absolute', opacity: this.state.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
      </View>


      <View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)', opacity: 1,
       width: this.state.photoWidth1, height: this.state.photoHeight1, top: this.state.photoTop1, right: this.state.photoRight1, borderBottomLeftRadius: 8, borderTopRightRadius: 8,
       borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
       <Image source={{uri: this.state.uri1}}
         style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       <View
         style={{  width: '100%', height: '100%', backgroundColor: "black",  position: 'absolute', opacity: this.state.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
      </View>


      <Animated.View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)',
       width: this.widthAnimation, height: this.heightAnimation, top: this.topAnimation, right: this.state.photoRight2 , borderBottomLeftRadius: 16, borderTopRightRadius: 16,
       borderTopLeftRadius: 16, borderBottomRightRadius: 16}}>
       <TouchableOpacity
       activeOpacity = {1}
       style = {{width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
       borderTopLeftRadius: 16, borderBottomRightRadius: 16, flex:1, justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>

       <Image source={{uri: this.state.uri2}}
         style={{  width: '100%', height: '100%', position: 'absolute', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />

       <View
         style={{  width: '100%', height: '100%', position: 'absolute', backgroundColor: "black", opacity: this.state.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       </TouchableOpacity>


      </Animated.View>

      <View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)', opacity: 1,
       width: this.state.photoWidth3, height: this.state.photoHeight3, top: this.state.photoTop3, right: this.state.photoRight3, borderBottomLeftRadius: 8, borderTopRightRadius: 8,
       borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
       <Image source={{uri: this.state.uri3}}
         style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       <View
         style={{  width: '100%', height: '100%', backgroundColor: "black", position: 'absolute', opacity: this.state.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
      </View>

      <View
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(244,92,66,0)', opacity: 1,
       width: this.state.photoWidth4, height: this.state.photoHeight4, top: this.state.photoTop4, right: this.state.photoRight4, borderBottomLeftRadius: 8, borderTopRightRadius: 8,
       borderTopLeftRadius: 8, borderBottomRightRadius: 8}}>
       <Image source={{uri: this.state.uri4}}
         style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
       <View
         style={{  width: '100%', height: '100%', backgroundColor: "black", position: 'absolute', opacity: this.state.backgroundOpacity, borderBottomLeftRadius: 16, borderTopRightRadius: 16,
         borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}
       />
      </View>
      </Swipeable>

      <View style={{justifyContent: 'center', alignItems: 'center', top: getStatusBarHeight(), position: 'absolute',width: this.width, height: this.width*(15/100), flex:1, backgroundColor: 'rgba(244,92,66,1)' }}>

      <Image source={{uri: 'twinizermain'}}
        style={{width: this.width*(40/100), height: (this.width*(40/100)*(52/337)),position: 'absolute',  backgroundColor: 'rgba(244,92,66,1)'}}
      />
      <Image source={{uri: global.welcomePhoto}  }
        style={{opacity: global.welcomeOpacity, width: this.width*(40/100), height: (this.width*(40/100)*(52/337)),position: 'absolute',  backgroundColor: 'rgba(244,92,66,1)'}}
      />

      <TouchableOpacity
      style={{ width: this.width*(6/100), height: this.width*(6/100), right: this.width*(5/100),  position: 'absolute' }}>
      <Image source={{uri: 'settings' }}
        style={{ width: '100%', height: '100%',position: 'absolute' }}
      />
      </TouchableOpacity>

      <TouchableOpacity
      style={{ width: this.width*(6/100)*(4/3), height: this.width*(6/100), left: this.width*(5/100), position: 'absolute'}}
      onPress={()=>navigate("Messages")}>
      <Image source={{uri: 'messages' }}
        style={{ width: '100%', height: '100%',position: 'absolute' }}
      />
      </TouchableOpacity>

      </View>

      <View style={{alignItems: 'center', fontSize: 18*(this.width/360), fontFamily: "Candara", position: 'absolute', width: this.width*(75/100), height: (this.height*5)/100, flex:1, top: (this.height*11/100)+ (getStatusBarHeight()), right: this.width*(12.5/100),
       backgroundColor: 'rgba(255,255,255,0)',  }}>

      <Text style={{ color: "black" ,fontFamily: "Candara", fontSize: 22*(this.width/360)}}>
        {global.langSearchPhoto}
        </Text>
      </View>

      <TouchableOpacity
      activeOpacity = {1}
      style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'rgba(66,66,255,0)',
       width: this.bottomPhotoWidth, height: this.bottomPhotoHeight,   bottom: (this.height)*(18/100) - (getStatusBarHeight()), right: this.width*(3.5/10), borderBottomLeftRadius: 16, borderTopRightRadius: 16,
       borderTopLeftRadius: 16, borderBottomRightRadius: 16, borderColor: this.state.borderOpacity, borderWidth: 2}}
       onPress={()=>this.setState({ isVisible1: true})}>

       <Image source={this.state.photo} style={{  width: '100%', height: '100%', borderBottomLeftRadius: 16, borderTopRightRadius: 16, borderTopLeftRadius: 16, borderBottomRightRadius: 16 }}/>

       <View style={{alignItems: 'center', position: 'absolute',width: this.bottomPhotoWidth, height: this.bottomPhotoHeight, flex:1, backgroundColor: 'rgba(0,0,0,0)' }}>

       <Text style={{bottom: '60%',opacity: this.state.opacity, position: 'absolute',textAlign: 'center', color: 'rgba(0,0,0,1)' ,fontFamily: "Candara", fontSize: 14*(this.width/360)}}>
         {global.langTapHere}
       </Text>

       <Image source={{uri: 'camera'}} style={{bottom: '30%', width: this.bottomPhotoWidth*(19/100), height: this.bottomPhotoWidth*(16/100),  position: 'absolute',  opacity: this.state.opacity, flex:1 }}/>

       </View>
      </TouchableOpacity>

      <TouchableOpacity
      activeOpacity = {1}
      style={{ alignItems:'center', justifyContent: 'center', position: 'absolute', backgroundColor: this.state.buttonOpacity,
       width: this.width*(1.2/10), height: this.width*(1.2/10),   bottom: (this.height*4)/100, right: this.width*(4.4/10), borderBottomLeftRadius: 65, borderTopRightRadius: 65,
       borderTopLeftRadius: 65, borderBottomRightRadius: 65}}
       disabled = {this.state.disabled}
       onPress={this.search }>
       <Image source={{uri: 'search'}}
       style={{width: '50%', height: '50%',  position: 'absolute', flex:1 }}/>
      </TouchableOpacity>



      <View style={{alignItems: 'center', fontSize: 18*(this.width/360), fontFamily: "Candara", position: 'absolute', width: this.width*(75/100), height: (this.height*5)/100, flex:1, top: this.bigPhotoHeight + (this.height)*(25/100) + (getStatusBarHeight()), right: this.width*(12.5/100),
       backgroundColor: 'rgba(255,255,255,0)',  }}>

      <Text style={{ color: "black" ,fontFamily: "Candara", fontSize: 22*(this.width/360)}}>
        {this.state.uri2_gender}
        </Text>
      </View>
      <View style={{alignItems: 'center', fontSize: 18*(this.width/360), fontFamily: "Candara", position: 'absolute', width: this.width*(75/100), height: (this.height*5)/100, flex:1, top: this.bigPhotoHeight + (this.height)*(20/100) + (getStatusBarHeight()), right: this.width*(12.5/100),
       backgroundColor: 'rgba(255,255,255,0)',  }}>

      <Text style={{ color: "black" ,fontFamily: "Candara", fontSize: 22*(this.width/360)}}>
        {this.state.uri2_country}
        </Text>
      </View>

      <Modal /*SEARCH DEVAM EDIYOR MODALI*/
        style = {{alignItems: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        animationIn = "zoomInUp"
        animationOut = "zoomOutUp"
        animationInTiming = {500}
        animationOutTiming = {500}
        isVisible={this.state.searchOnIsVisible}
        >
        <View style={{
          borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8  ,
          backgroundColor: 'white',
          width: this.width*(6.5/10),
          height: this.width*(4/10),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: this.height*(1/10)}}>

          <View style={{position: 'absolute', height: this.width*(4/10), width: this.width*(5.5/10), flexDirection: 'column', top: '7%', flex:1
           }}>

           <Text style={{ color: 'black' ,fontFamily: "Candara", fontSize: 15*(this.width/360)}}>
              Search didn't Finish
              </Text>
          </View>

          <TouchableOpacity
          activeOpacity = {1}
          style={{ borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8, justifyContent: 'center',  alignItems: 'center', backgroundColor: 'rgba(43,120,228,0.2)',
           width: this.width*(2.5/10), height: this.width*(1/10),   bottom: '5%', position: 'absolute'}}
           onPress={()=>this.setState({searchOnIsVisible:false}) }>

          <Text style={{color: 'rgba(43,120,228,1)' ,fontFamily: "Candara", fontSize: 17*(this.width/360)}}>
            {global.langGotIt}
          </Text>
          </TouchableOpacity>

        </View>
      </Modal>

      <Modal /*BİLGİLENDİRME MODALI*/
        style = {{alignItems: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        animationIn = "zoomInUp"
        animationOut = "zoomOutUp"
        animationInTiming = {500}
        animationOutTiming = {500}
        isVisible={this.state.notifIsVisible}
        >
        <View style={{
          borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8  ,
          backgroundColor: 'white',
          width: this.width*(6.5/10),
          height: this.width*(4/10),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: this.height*(1/10)}}>

          <View style={{position: 'absolute', height: this.width*(4/10), width: this.width*(5.5/10), flexDirection: 'column', top: '7%', flex:1
           }}>

           <Text style={{ color: 'black' ,fontFamily: "Candara", fontSize: 15*(this.width/360)}}>
              Search Basladi, Biz Size Bildirim Gondercez
              </Text>
          </View>

          <TouchableOpacity
          activeOpacity = {1}
          style={{ borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8, justifyContent: 'center',  alignItems: 'center', backgroundColor: 'rgba(43,120,228,0.2)',
           width: this.width*(2.5/10), height: this.width*(1/10),   bottom: '5%', position: 'absolute'}}
           onPress={()=>this.setState({notifIsVisible:false}) }>

          <Text style={{color: 'rgba(43,120,228,1)' ,fontFamily: "Candara", fontSize: 17*(this.width/360)}}>
            {global.langGotIt}
          </Text>
          </TouchableOpacity>

        </View>
      </Modal>

      <Modal /*RESİM MODALI*/
        style = {{alignItems: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        deviceHeight = {this.height}
        deviceWidth = {this.width}
        animationIn = "bounce"
        animationInTiming = {500}
        animationOutTiming = {500}
        isVisible={this.state.isVisible1}
        >
        <View style={{
          borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8,
          backgroundColor: 'white',
          width: this.width*(6/10),
          height: this.width*(4.5/10),
          justifyContent: 'center',
          alignItems: 'center'}}>

          <Text style={{height: this.width*(1/10), width: this.width*(6/10), textAlign: 'center', color: 'rgba(241,51,18,1)' , fontFamily: 'Candara',
          fontSize: 17*(this.width/360), top: '7%', position: 'absolute'}}>
            {global.langUploadPhoto}
          </Text>

          <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(0,0,0,0)',
           width: this.width*(3/10), height: this.width*(1/10),   bottom: '0%', borderTopLeftRadius: 8, borderTopRightRadius: 8}}
           onPress={()=>this.setState({ isVisible1: false}) }>
          <Text style={{textAlign: 'center', color: 'blue' ,fontFamily: "Candara", fontSize: 17*(this.width/360)}}>
            {global.langCancel}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity = {1}
          style={{ justifyContent: 'center', position: 'absolute', backgroundColor: 'white',
           width: this.width*(6/10), height: this.width*(1/10),   bottom: '50%' }}
           onPress={this.camera}>

          <Text style={{left: this.width*(0.5/10), color: 'black' ,fontFamily: "Candara", fontSize: 17*(this.width/360)}}>
            {global.langTakePhoto}
          </Text>
          </TouchableOpacity>
          <TouchableOpacity
          activeOpacity = {1}
          style={{ justifyContent: 'center', position: 'absolute', backgroundColor: 'white',
           width: this.width*(6/10), height: this.width*(1/10),   bottom: '24%'}}
           onPress={this.library}>
          <Text style={{color: 'black' ,fontFamily: "Candara", fontSize: 17*(this.width/360),  left: this.width*(0.5/10)}}>
            {global.langLibrary}
          </Text>
          </TouchableOpacity>


          <View style={{position: 'absolute', backgroundColor: "gray", width: this.width*(6/10), height: this.width*(0.2/100), bottom: this.width*(3.25/10) }}>
          </View>

          <View style={{position: 'absolute', backgroundColor: "gray", width: this.width*(6/10), height: this.width*(0.2/100), bottom: '49%' }}>
          </View>

          <View style={{position: 'absolute', backgroundColor: "gray", width: this.width*(6/10), height: this.width*(0.2/100), bottom: '23.5%' }}>
          </View>

        </View>
      </Modal>

      <Modal /*SEARCH MODALI*/
        style = {{alignItems: 'center'}}
        backdropOpacity = {0.4}
        coverScreen = {false}
        onBackdropPress = {()=> this.setState({isVisible2: false})}
        animationIn = "slideInUp"
        animationOut = "slideOutDown"
        animationInTiming = {500}
        animationOutTiming = {500}
        isVisible={this.state.isVisible2}
        >
        <View style={{
          backgroundColor: 'white',
          width: this.width,
          height: this.height*(22/100),
          justifyContent: 'center',
          alignItems: 'center',
          position:'absolute',
          bottom: -getStatusBarHeight()}}>

          <Text style={{height: this.width*(1/10), width: this.width*(6/10), textAlign: 'center', color: 'black' , fontFamily: 'Candara',
          fontSize: 14*(this.width/360), top: '7%', position: 'absolute'}}>
            {global.langFilters}
          </Text>

          <View style = {{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)', borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8, width: this.width*(45/100), height: this.height*(5/100), position: 'absolute',
          right: this.width*(2.5/100), top: this.height*(7/100), borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2 }} >
          <RNPickerSelect

            placeholder={{
              label: this.state.placeHolder1,
              value: null,
              color: 'white',
            }}
              placeholderTextColor="black"
              onValueChange={(value) => this.valueChangeCountry(value)}
              items={[    { label: "All Countries", color: 'red', value: "All Countries" },
                          { label: this.countries[0], color: 'black', value: this.countries[0] },
                          { label: this.countries[1], color: 'black', value: this.countries[1] },
                          { label: this.countries[2], color: 'black', value: this.countries[2] },
                          { label: this.countries[3], color: 'black', value: this.countries[3] },
                          { label: this.countries[4], color: 'black', value: this.countries[4] },
                          { label: this.countries[5], color: 'black', value: this.countries[5] },
                          { label: this.countries[6], color: 'black', value: this.countries[6] },
                          { label: this.countries[7], color: 'black', value: this.countries[7] },
                          { label: this.countries[8], color: 'black', value: this.countries[8] },
                          { label: this.countries[9], color: 'black', value: this.countries[9] },
                          { label: this.countries[10], color: 'black', value: this.countries[10] },
                          { label: this.countries[11], color: 'black', value: this.countries[11] },
                          { label: this.countries[12], color: 'black', value: this.countries[12] },
                          { label: this.countries[13], color: 'black', value: this.countries[13] },
                          { label: this.countries[14], color: 'black', value: this.countries[14] },
                          { label: this.countries[15], color: 'black', value: this.countries[15] },
                          { label: this.countries[16], color: 'black', value: this.countries[16] },
                          { label: this.countries[17], color: 'black', value: this.countries[17] },
                          { label: this.countries[18], color: 'black', value: this.countries[18] },
                          { label: this.countries[19], color: 'black', value: this.countries[19] },
                          { label: this.countries[20], color: 'black', value: this.countries[20] },
                          { label: this.countries[21], color: 'black', value: this.countries[21] },
                          { label: this.countries[22], color: 'black', value: this.countries[22] },
                          { label: this.countries[23], color: 'black', value: this.countries[23] },
                          { label: this.countries[24], color: 'black', value: this.countries[24] },
                          { label: this.countries[25], color: 'black', value: this.countries[25] },
                          { label: this.countries[26], color: 'black', value: this.countries[26] },
                          { label: this.countries[27], color: 'black', value: this.countries[27] },
                          { label: this.countries[28], color: 'black', value: this.countries[28] },
                          { label: this.countries[29], color: 'black', value: this.countries[29] },
                          { label: this.countries[30], color: 'black', value: this.countries[30] },
                          { label: this.countries[31], color: 'black', value: this.countries[31] },
                          { label: this.countries[32], color: 'black', value: this.countries[32] },
                          { label: this.countries[33], color: 'black', value: this.countries[33] },
                          { label: this.countries[34], color: 'black', value: this.countries[34] },
                          { label: this.countries[35], color: 'black', value: this.countries[35] },
                          { label: this.countries[36], color: 'black', value: this.countries[36] },
                          { label: this.countries[37], color: 'black', value: this.countries[37] },
                          { label: this.countries[38], color: 'black', value: this.countries[38] },
                          { label: this.countries[39], color: 'black', value: this.countries[39] },
                          { label: this.countries[40], color: 'black', value: this.countries[40] },
                          { label: this.countries[41], color: 'black', value: this.countries[41] },
                          { label: this.countries[42], color: 'black', value: this.countries[42] },
                          { label: this.countries[43], color: 'black', value: this.countries[43] },
                          { label: this.countries[44], color: 'black', value: this.countries[44] },
                          { label: this.countries[45], color: 'black', value: this.countries[45] },
                          { label: this.countries[46], color: 'black', value: this.countries[46] },
                          { label: this.countries[47], color: 'black', value: this.countries[47] },
                          { label: this.countries[48], color: 'black', value: this.countries[48] },
                          { label: this.countries[49], color: 'black', value: this.countries[49] },
                          { label: this.countries[50], color: 'black', value: this.countries[50] },
                          { label: this.countries[51], color: 'black', value: this.countries[51] },
                          { label: this.countries[52], color: 'black', value: this.countries[52] },
                          { label: this.countries[53], color: 'black', value: this.countries[53] },
                          { label: this.countries[54], color: 'black', value: this.countries[54] },
                          { label: this.countries[55], color: 'black', value: this.countries[55] },
                          { label: this.countries[56], color: 'black', value: this.countries[56] },
                          { label: this.countries[57], color: 'black', value: this.countries[57] },
                          { label: this.countries[58], color: 'black', value: this.countries[58] },
                          { label: this.countries[59], color: 'black', value: this.countries[59] },
                          { label: this.countries[60], color: 'black', value: this.countries[60] },
                          { label: this.countries[61], color: 'black', value: this.countries[61] },
                          { label: this.countries[62], color: 'black', value: this.countries[62] },
                          { label: this.countries[63], color: 'black', value: this.countries[63] },
                          { label: this.countries[64], color: 'black', value: this.countries[64] },
                          { label: this.countries[65], color: 'black', value: this.countries[65] },
                          { label: this.countries[66], color: 'black', value: this.countries[66] },
                          { label: this.countries[67], color: 'black', value: this.countries[67] },
                          { label: this.countries[68], color: 'black', value: this.countries[68] },
                          { label: this.countries[69], color: 'black', value: this.countries[69] },
                          { label: this.countries[70], color: 'black', value: this.countries[70] },
                          { label: this.countries[71], color: 'black', value: this.countries[71] },
                          { label: this.countries[72], color: 'black', value: this.countries[72] },
                          { label: this.countries[73], color: 'black', value: this.countries[73] },
                          { label: this.countries[74], color: 'black', value: this.countries[74] },
                          { label: this.countries[75], color: 'black', value: this.countries[75] },
                          { label: this.countries[76], color: 'black', value: this.countries[76] },
                          { label: this.countries[77], color: 'black', value: this.countries[77] },
                          { label: this.countries[78], color: 'black', value: this.countries[78] },
                          { label: this.countries[79], color: 'black', value: this.countries[79] },
                          { label: this.countries[80], color: 'black', value: this.countries[80] },
                          { label: this.countries[81], color: 'black', value: this.countries[81] },
                          { label: this.countries[82], color: 'black', value: this.countries[82] },
                          { label: this.countries[83], color: 'black', value: this.countries[83] },
                          { label: this.countries[84], color: 'black', value: this.countries[84] },
                          { label: this.countries[85], color: 'black', value: this.countries[85] },
                          { label: this.countries[86], color: 'black', value: this.countries[86] },
                          { label: this.countries[87], color: 'black', value: this.countries[87] },
                          { label: this.countries[88], color: 'black', value: this.countries[88] },
                          { label: this.countries[89], color: 'black', value: this.countries[89] },
                          { label: this.countries[90], color: 'black', value: this.countries[90] },
                          { label: this.countries[91], color: 'black', value: this.countries[91] },
                          { label: this.countries[92], color: 'black', value: this.countries[92] },
                          { label: this.countries[93], color: 'black', value: this.countries[93] },
                          { label: this.countries[94], color: 'black', value: this.countries[94] },
                          { label: this.countries[95], color: 'black', value: this.countries[95] },
                          { label: this.countries[96], color: 'black', value: this.countries[96] },
                          { label: this.countries[97], color: 'black', value: this.countries[97] },
                          { label: this.countries[98], color: 'black', value: this.countries[98] },
                          { label: this.countries[99], color: 'black', value: this.countries[99] },
                          { label: this.countries[100], color: 'black', value: this.countries[100] },
                          { label: this.countries[101], color: 'black', value: this.countries[101] },
                          { label: this.countries[102], color: 'black', value: this.countries[102] },
                          { label: this.countries[103], color: 'black', value: this.countries[103] },
                          { label: this.countries[104], color: 'black', value: this.countries[104] },
                          { label: this.countries[105], color: 'black', value: this.countries[105] },
                          { label: this.countries[106], color: 'black', value: this.countries[106] },
                          { label: this.countries[107], color: 'black', value: this.countries[107] },
                          { label: this.countries[108], color: 'black', value: this.countries[108] },
                          { label: this.countries[109], color: 'black', value: this.countries[109] },
                          { label: this.countries[110], color: 'black', value: this.countries[110] },
                          { label: this.countries[111], color: 'black', value: this.countries[111] },
                          { label: this.countries[112], color: 'black', value: this.countries[112] },
                          { label: this.countries[113], color: 'black', value: this.countries[113] },
                          { label: this.countries[114], color: 'black', value: this.countries[114] },
                          { label: this.countries[115], color: 'black', value: this.countries[115] },
                          { label: this.countries[116], color: 'black', value: this.countries[116] },
                          { label: this.countries[117], color: 'black', value: this.countries[117] },
                          { label: this.countries[118], color: 'black', value: this.countries[118] },
                          { label: this.countries[119], color: 'black', value: this.countries[119] },
                          { label: this.countries[120], color: 'black', value: this.countries[120] },
                          { label: this.countries[121], color: 'black', value: this.countries[121] },
                          { label: this.countries[122], color: 'black', value: this.countries[122] },
                          { label: this.countries[123], color: 'black', value: this.countries[123] },
                          { label: this.countries[124], color: 'black', value: this.countries[124] },
                          { label: this.countries[125], color: 'black', value: this.countries[125] },
                          { label: this.countries[126], color: 'black', value: this.countries[126] },
                          { label: this.countries[127], color: 'black', value: this.countries[127] },
                          { label: this.countries[128], color: 'black', value: this.countries[128] },
                          { label: this.countries[129], color: 'black', value: this.countries[129] },
                          { label: this.countries[130], color: 'black', value: this.countries[130] },
                          { label: this.countries[131], color: 'black', value: this.countries[131] },
                          { label: this.countries[132], color: 'black', value: this.countries[132] },
                          { label: this.countries[133], color: 'black', value: this.countries[133] },
                          { label: this.countries[134], color: 'black', value: this.countries[134] },
                          { label: this.countries[135], color: 'black', value: this.countries[135] },
                          { label: this.countries[136], color: 'black', value: this.countries[136] },
                          { label: this.countries[137], color: 'black', value: this.countries[137] },
                          { label: this.countries[138], color: 'black', value: this.countries[138] },
                          { label: this.countries[139], color: 'black', value: this.countries[139] },
                          { label: this.countries[140], color: 'black', value: this.countries[140] },
                          { label: this.countries[141], color: 'black', value: this.countries[141] },
                          { label: this.countries[142], color: 'black', value: this.countries[142] },
                          { label: this.countries[143], color: 'black', value: this.countries[143] },
                          { label: this.countries[144], color: 'black', value: this.countries[144] },
                          { label: this.countries[145], color: 'black', value: this.countries[145] },
                          { label: this.countries[146], color: 'black', value: this.countries[146] },
                          { label: this.countries[147], color: 'black', value: this.countries[147] },
                          { label: this.countries[148], color: 'black', value: this.countries[148] },
                          { label: this.countries[149], color: 'black', value: this.countries[149] },
                          { label: this.countries[150], color: 'black', value: this.countries[150] },
                          { label: this.countries[151], color: 'black', value: this.countries[151] },
                          { label: this.countries[152], color: 'black', value: this.countries[152] },
                          { label: this.countries[153], color: 'black', value: this.countries[153] },
                          { label: this.countries[154], color: 'black', value: this.countries[154] },
                          { label: this.countries[155], color: 'black', value: this.countries[155] },
                          { label: this.countries[156], color: 'black', value: this.countries[156] },
                          { label: this.countries[157], color: 'black', value: this.countries[157] },
                          { label: this.countries[158], color: 'black', value: this.countries[158] },
                          { label: this.countries[159], color: 'black', value: this.countries[159] },
                          { label: this.countries[160], color: 'black', value: this.countries[160] },
                          { label: this.countries[161], color: 'black', value: this.countries[161] },
                          { label: this.countries[162], color: 'black', value: this.countries[162] },
                          { label: this.countries[163], color: 'black', value: this.countries[163] },
                          { label: this.countries[164], color: 'black', value: this.countries[164] },
                          { label: this.countries[165], color: 'black', value: this.countries[165] },
                          { label: this.countries[166], color: 'black', value: this.countries[166] },
                          { label: this.countries[167], color: 'black', value: this.countries[167] },
                          { label: this.countries[168], color: 'black', value: this.countries[168] },
                          { label: this.countries[169], color: 'black', value: this.countries[169] },
                          { label: this.countries[170], color: 'black', value: this.countries[170] },
                          { label: this.countries[171], color: 'black', value: this.countries[171] },
                          { label: this.countries[172], color: 'black', value: this.countries[172] },
                          { label: this.countries[173], color: 'black', value: this.countries[173] },
                          { label: this.countries[174], color: 'black', value: this.countries[174] },
                          { label: this.countries[175], color: 'black', value: this.countries[175] },
                          { label: this.countries[176], color: 'black', value: this.countries[176] },
                          { label: this.countries[177], color: 'black', value: this.countries[177] },
                          { label: this.countries[178], color: 'black', value: this.countries[178] },
                          { label: this.countries[179], color: 'black', value: this.countries[179] },
                          { label: this.countries[180], color: 'black', value: this.countries[180] },
                          { label: this.countries[181], color: 'black', value: this.countries[181] },
                          { label: this.countries[182], color: 'black', value: this.countries[182] },
                          { label: this.countries[183], color: 'black', value: this.countries[183] },
                          { label: this.countries[184], color: 'black', value: this.countries[184] },
                          { label: this.countries[185], color: 'black', value: this.countries[185] },
                          { label: this.countries[186], color: 'black', value: this.countries[186] },
                          { label: this.countries[187], color: 'black', value: this.countries[187] },
                          { label: this.countries[188], color: 'black', value: this.countries[188] },
                          { label: this.countries[189], color: 'black', value: this.countries[189] },
                          { label: this.countries[190], color: 'black', value: this.countries[190] },
                          { label: this.countries[191], color: 'black', value: this.countries[191] },
                          { label: this.countries[192], color: 'black', value: this.countries[192] },
                          { label: this.countries[193], color: 'black', value: this.countries[193] },
                          { label: this.countries[194], color: 'black', value: this.countries[194] },
                          { label: this.countries[195], color: 'black', value: this.countries[195] }



                      ]}
                  />
          </View>

          <View style = {{justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)', borderBottomLeftRadius: 8, borderTopRightRadius: 8,
          borderTopLeftRadius: 8, borderBottomRightRadius: 8, width: this.width*(45/100), height: this.height*(5/100), position: 'absolute',
          left: this.width*(2.5/100), top: this.height*(7/100), borderBottomColor: 'rgba(241,51,18,1)', borderBottomWidth: 2 }} >
          <RNPickerSelect

            placeholder={{
              label: this.state.placeHolder2,
              value: null,
              color: 'white',
            }}
              placeholderTextColor="black"
              onValueChange={(value) => this.valueChangeGender(value)}
              items={[
                          { label: global.langAllGenders, color: 'red', value: global.langAllGenders },
                          { label: global.langFilterMale, color: 'black', value: global.langFilterMale },
                          { label: global.langFilterFemale, color: 'black', value: global.langFilterFemale }
                      ]}
                  />
          </View>

          <TouchableOpacity
          activeOpacity = {1}
          style={{ justifyContent: 'center', position: 'absolute', backgroundColor: 'white',
           width: this.width*(2.5/10), height: this.width*(8/100),   bottom: this.height*(2/100), right: this.width*(3.75/10), borderBottomLeftRadius: 24, borderTopRightRadius: 24,
           borderTopLeftRadius: 24, borderBottomRightRadius: 24, borderColor: this.state.searchButtonOpacity, borderWidth: 1.5}}
           disabled={this.state.disabledSearch}
           onPress={()=>this.filterDone() }>

          <Text style={{textAlign: 'center', color: this.state.searchButtonOpacity ,fontFamily: "Candara", fontSize: 17*(this.width/360)}}>
            {global.langSearch}
          </Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>

        );
  }
}
