import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing
} from 'react-native';
import language from '../../../../Utils/Languages/lang.json'
var leftAnim = new Animated.Value(-this.width*(3/16))
export default class EditBox extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
      header: null,
  };
   static propTypes = {
    editButtonPressed: PropTypes.func,
    messageSelectAll: PropTypes.func,
    messageDoneDisabled: PropTypes.bool,
    messageDonePress: PropTypes.func,
    editText: PropTypes.string,
    allSelected: PropTypes.bool,
    requestSelectAll: PropTypes.func,
    requestDoneDisabled: PropTypes.bool,
    requestDonePress: PropTypes.func,
    messageArray: PropTypes.array,
    requestArray: PropTypes.array,
    whichScreen: PropTypes.string,
    editPressed: PropTypes.bool,
  }


  render(){
    var theColor;
    var lang = language[global.lang]
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    var messageText
    if (this.props.isPhoto && this.props.lastMsg == " ") {
      messageText = lang.Photo
    }
    else{
      messageText = this.props.lastMsg
    }
    this.msgBoxHeight = this.width/4
    this.avatarSize = this.msgBoxHeight*3/5

    if(this.props.editPressed){
      if(this.props.whichScreen == "left"){
        return(
          <View style = {{borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, flexDirection: "row"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{justifyContent: 'center', alignItems: 'center', width: this.width/4}}
            onPress={this.props.editButtonPressed}
            disabled = {false}>

          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.editText == "Edit" ? lang.Edit : lang.Cancel}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity = {1}
            style={{width: this.width/2, justifyContent: 'center', alignItems: 'center',}}
            onPress = {this.props.messageSelectAll}>
          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.allSelected ? lang.DeselectAll : lang.SelectAll}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity = {1}
            disabled = {this.props.messageDoneDisabled}
            style={{opacity: this.props.messageDoneDisabled ? 0 : 1, justifyContent: 'center', alignItems: 'center', width: this.width/4}}
            onPress = {this.props.messageDonePress}>
          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {lang.Done}
          </Text>
          </TouchableOpacity>
          </View>
        )
      }
      else{
        return(
          <View style = {{borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center", flexDirection: "row"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{justifyContent: 'center', alignItems: 'center', width: this.width/4}}
            onPress={this.props.editButtonPressed}
            disabled = {false}>

          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.editText == "Edit" ? lang.Edit : lang.Cancel}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity = {1}
            style={{ width: this.width/2, justifyContent: 'center', alignItems: 'center'}}
            onPress = {this.props.requestSelectAll}>
          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.allSelected ? lang.DeselectAll : lang.SelectAll}
          </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity = {1}
            disabled = {this.props.requestDoneDisabled}
            style={{opacity: this.props.requestDoneDisabled ? 0 : 1, justifyContent: 'center', alignItems: 'center', width: this.width/4}}
            onPress = {this.props.requestDonePress}>
          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {lang.Done}
          </Text>
          </TouchableOpacity>

          </View>
        )
      }

    }
    else{
      if(this.props.whichScreen == "left"){
        return(
          <View style = {{opacity: this.props.messageArray.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
            onPress={this.props.editButtonPressed}
            disabled = {this.props.messageArray.length == 0 ? true : false}>

          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.editText == "Edit" ? lang.Edit : lang.Cancel}
          </Text>
          </TouchableOpacity>
          </View>
        )
      }
      else{
        return(
          <View style = {{opacity: this.props.requestArray.length == 0 ? 0 : 1, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', height: this.width/9, width: this.width, justifyContent: "center"}}>
          <TouchableOpacity
            activeOpacity = {1}
            style={{position: "absolute", left: 0, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, paddingRight: 15,}}
            onPress={this.props.editButtonPressed}
            disabled = {this.props.requestArray.length == 0 ? true : false}>

          <Text style = {{fontSize: 17*this.width/360, color: global.themeColor}}>
          {this.props.editText == "Edit" ? lang.Edit : lang.Cancel}
          </Text>
          </TouchableOpacity>
          </View>
        )
      }
    }
  }
}

export * from './EditBox';
