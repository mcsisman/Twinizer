import React, {Component} from 'react';
import {createAppContainer, navigation} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import RNPickerSelect from 'react-native-picker-select';
import * as firebase from "firebase";
import {Image,
   Text,
   View,
   Dimensions,
   TouchableOpacity,
   ImageBackground,
   StatusBar,
   SafeAreaView,
   ScrollView
  } from 'react-native';
import MainScreen from './Main';
import SplashScreen from './Splash';
import ImageUploadScreen from './ImageUpload';
import ProfileUploadScreen from './ProfileUpload';
import CountryScreen from './Country';
import MessageBox from './components/MessageBox'
import ChatScreen from './Chat';

export default class MessagesScreen extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      splashOver : false,
      email: "",
      color: 'rgba(0,0,0,0.4)',
      buttonOpacity: 'rgba(241,51,18,0.4)',
      disabled: true,
      femaleText: 'rgba(241,51,18,1)',
      maleText: 'rgba(241,51,18,1)',
      maleBG: "white",
      femaleBG: "white",
      gender: ""
    }
    this.navigateToChat = this.navigateToChat.bind(this);
    this.dataArray = []
    this.noOfConversations;
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    global.globalGender = "";
    this.statusBarHeaderTotalHeight = getStatusBarHeight() + global.headerHeight
    this.props.navigation.setParams({ otherParam: global.langCompleteYourProfile })
  }
componentDidMount(){

};
static navigationOptions = ({navigation}) => {
    return {
      title: "Mesajlar",
      headerTintColor: 'rgba(244,92,66,1)',
      headerTitleStyle: {
      fontFamily: "Candara",
      color: 'rgba(244,92,66,1)'
    },
      headerStyle: {
      marginTop: getStatusBarHeight(),
      backgroundColor: 'white'
    },
    };

};
navigateToChat(receiverEmail){
  const {navigate} = this.props.navigation;
  global.receiverMail = receiverEmail
  this.props.navigation.navigate("Chat")
}

renderMessageBoxes(){

  var timeArray = []
  var receiverArray = []
  var messages = [];
  var count = 0;
  while( count < global.noOfConversations){
    let unix_timestamp = global.dataArray[count].createdAt

    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    timeArray[count] = hours + ':' + minutes.substr(-2);
    if( global.dataArray[count].user.toWho == firebase.auth().currentUser.email){
      receiverArray[count] = global.dataArray[count].user.email
    }
    else{
      receiverArray[count] = global.dataArray[count].user.toWho
    }

    count++;
  }
  count = 0
    while( count < global.noOfConversations){
      const temp = count
      messages.push(
        <MessageBox
        onPress = {()=>this.navigateToChat(receiverArray[temp])}
        senderName = {receiverArray[count]}
        lastMsg = {global.dataArray[count].text}
        lastMsgTime = {timeArray[count]}
        avatarSource = {'defaultavatar'}/>
      )
      count = count + 1;
  }
  return messages;
}

  render(){

    return(

      <View
      style={{width: this.width, height: this.height, top: -this.statusBarHeaderTotalHeight, flex:1, alignItems: 'center',}}>

      <StatusBar translucent backgroundColor="transparent" />
      <View style={{position: 'absolute',width: this.width, height:getStatusBarHeight(), top: 0, backgroundColor: 'rgba(244,92,66,1)' }}>
      </View>

      <ScrollView
        style = {{ position: 'absolute', backgroundColor: 'white', height: this.height-this.statusBarHeaderTotalHeight-this.height/12 ,
        width: this.width, top: this.statusBarHeaderTotalHeight, right: 0, flex: 1, flexDirection: 'column'}}>
        {this.renderMessageBoxes() }
      </ScrollView>

      <View
      style = {{position: 'absolute',width: this.width, height:this.height/16, bottom: -this.statusBarHeaderTotalHeight}}>
      <TouchableOpacity
      style={{position: 'absolute', left: this.width/9*1,width: this.width/9*3, height:this.height/16,bottom: 0, justifyContent: 'center',
      backgroundColor: 'white' ,borderTopLeftRadius: 16,borderTopRightRadius: 16, borderWidth: 2, borderColor: 'rgba(244,92,66,1)',borderBottomWidth: 0}}
      >
      <Text style={{textAlign: 'center', color: 'black', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>
        Incoming Messages
      </Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={{position: 'absolute', left: this.width/9*5, width: this.width/9*3,height: this.height/16,bottom: 0, justifyContent: 'center',
      backgroundColor: 'white', borderTopLeftRadius: 16,borderTopRightRadius: 16, borderWidth: 2, borderColor: 'rgba(244,92,66,1)' ,borderBottomWidth: 0}}
      >
      <Text style={{textAlign: 'center', color: 'black', fontFamily: "Candara", fontSize: 18*(this.width/360)}}>
        Outgoing Messages
      </Text>
      </TouchableOpacity>
      </View>
    </View>



        );
  }
}
export * from './components/MessageBox';
