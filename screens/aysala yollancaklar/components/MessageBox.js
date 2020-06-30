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
  Image
} from 'react-native';

export default class MessageBox extends Component {
   static propTypes = {
    senderName: PropTypes.string,
    lastMsg: PropTypes.string,
    lastMsgTime: PropTypes.string,
    avatarSource: PropTypes.string,
    onPress: PropTypes.func
  }

  render(){

    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    this.msgBoxHeight = this.height/6
    this.avatarSize = this.msgBoxHeight*3/5
    return(

      <TouchableOpacity
        style = {{ alignItems: 'center',height: this.height/6,width: this.width,
        borderBottomWidth: 1,borderColor: 'gray', backgroundColor: 'white'}}
        onPress = {this.props.onPress}
        >
      <View
        style = {{ alignItems: 'center',height: this.height/6,width: this.width,
        borderBottomWidth: 1,borderColor: 'gray', backgroundColor: 'white'}}

        >

      <Image
      style={{position: 'absolute', width: this.width*(2/10), height: this.width*(2/10)*(7/6), top: (this.msgBoxHeight - this.width*(2/10)*(7/6))/2, left: this.width*(6/100),
      borderBottomLeftRadius: 16, borderTopRightRadius: 16, borderTopLeftRadius: 16, borderBottomRightRadius: 16}}
      source = {{uri: this.props.avatarSource}}>
      </Image>

        <Text
        style = {{fontSize: 18, top: this.msgBoxHeight/8, position: 'absolute', left: this.width/3}}>
          {this.props.senderName}
        </Text>

        <View
        style = {{height: this.msgBoxHeight/2, width: this.width*3/5, top: this.msgBoxHeight*4/10,position: 'absolute', left: this.width/3, justifyContent: 'center'}}>
        <Text
        style = {{fontSize: 15,  color: 'gray'}}>
          {this.props.lastMsg}
        </Text>
        </View>



        <Text
        style = {{fontSize: 15, top: this.width*2/100, color: 'gray', position: 'absolute', right: this.width*2/100}}>
          {this.props.lastMsgTime}
        </Text>
      </View>
      </TouchableOpacity>
    )
  }
}

export * from './MessageBox';
