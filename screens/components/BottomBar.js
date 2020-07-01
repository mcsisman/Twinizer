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

export default class BottomBar extends Component {

  componentDidMount(){
  }
  static navigationOptions = {
      header: null,
  };
   static propTypes = {
    homeOnPress: PropTypes.func,
    msgOnPress: PropTypes.func,
    historyOnPress: PropTypes.func,
    settingsOnPress: PropTypes.func,
    whichScreen: PropTypes.string
  }

  render(){
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var homeColor;
    var msgColor;
    var historyColor;
    var settingsColor;
    var homeDisabled;
    var msgDisabled;
    var historyDisabled;
    var settingsDisabled;
    var homeTextColor;
    var msgTextColor;
    var historyTextColor;
    var settingsTextColor;
    if(this.props.whichScreen == "Main"){
      homeColor = "homeorange";
      msgColor = "msggray";
      historyColor = "historygray";
      settingsColor = "settingsgray";
      homeDisabled = true;
      msgDisabled = false;
      historyDisabled = false;
      settingsDisabled = false;
      homeTextColor = 'rgba(211,126,63,1)';
      msgTextColor = 'rgba(128,128,128,1)';
      historyTextColor = 'rgba(128,128,128,1)';
      settingsTextColor = 'rgba(128,128,128,1)';
    }
    if(this.props.whichScreen == "Messages"){
      homeColor = "homegray";
      msgColor = "msgorange";
      historyColor = "historygray";
      settingsColor = "settingsgray";
      homeDisabled = false;
      msgDisabled = true;
      historyDisabled = false;
      settingsDisabled = false;
      homeTextColor = 'rgba(128,128,128,1)';
      msgTextColor = 'rgba(211,126,63,1)';
      historyTextColor = 'rgba(128,128,128,1)';
      settingsTextColor = 'rgba(128,128,128,1)';
    }
    if(this.props.whichScreen == "History"){
      homeColor = "homegray";
      msgColor = "msggray";
      historyColor = "historyorange";
      settingsColor = "settingsgray";
      homeDisabled = false;
      msgDisabled = false;
      historyDisabled = true;
      settingsDisabled = false;
      homeTextColor = 'rgba(128,128,128,1)';
      msgTextColor = 'rgba(128,128,128,1)';
      historyTextColor = 'rgba(211,126,63,1)';
      settingsTextColor = 'rgba(128,128,128,1)';
    }
    if(this.props.whichScreen == "Settings"){
      homeColor = "homegray";
      msgColor = "msggray";
      historyColor = "historygray";
      settingsColor = "settingsorange";
      homeDisabled = false;
      msgDisabled = false;
      historyDisabled = false;
      settingsDisabled = true;
      homeTextColor = 'rgba(128,128,128,1)';
      msgTextColor = 'rgba(128,128,128,1)';
      historyTextColor = 'rgba(128,128,128,1)';
      settingsTextColor = 'rgba(211,126,63,1)';
    }

    return(
      <View
        style = {{height: this.width/7, width:this.width, position: "absolute", bottom: 0, left: 0, flexDirection: "row",
        flex: 1, borderColor: 'rgba(188,188,188,0.6)', borderTopWidth: 1, backgroundColor: 'rgba(188,192,204,0.5)'}}>

        <TouchableOpacity
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width/4, height: this.width/7}}
        activeOpacity = {1}
        disabled = {homeDisabled}
        onPress = {this.props.homeOnPress}>
          <Image
          style={{top: '5%', position: 'absolute', width: "40%", height: "70%"}}
          source = {{uri: homeColor}}>
          </Image>
          <Text
          style = {{bottom: '5%', position: 'absolute', color: homeTextColor, fontSize: 12*(this.width/360) }}>
          Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width/4, height: this.width/7}}
        activeOpacity = {1}
        disabled = {msgDisabled}
        onPress = {this.props.msgOnPress}>
          <Image
          style={{top: '5%', position: 'absolute', width: "32%", height: "56%"}}
          source = {{uri: msgColor}}>
          </Image>
          <Text
          style = {{bottom: '5%', position: 'absolute', color: msgTextColor, fontSize: 12*(this.width/360) }}>
          Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width/4, height: this.width/7}}
        activeOpacity = {1}
        disabled = {historyDisabled}
        onPress = {this.props.historyOnPress}>
          <Image
          style={{top: '5%', position: 'absolute', width: "40%", height: "56%"}}
          source = {{uri: historyColor}}>
          </Image>
          <Text
          style = {{bottom: '5%', position: 'absolute', color: historyTextColor, fontSize: 12*(this.width/360) }}>
          History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style = {{alignItems: 'center', justifyContent: 'center', width: this.width/4, height: this.width/7}}
        activeOpacity = {1}
        disabled = {settingsDisabled}
        onPress = {this.props.settingsOnPress}>
          <Image
          style={{top: '10%', position: 'absolute', width: "28%", height: "49%"}}
          source = {{uri: settingsColor}}>
          </Image>
          <Text
          style = {{bottom: '5%', position: 'absolute', color: settingsTextColor, fontSize: 12*(this.width/360) }}>
          Settings
          </Text>
        </TouchableOpacity>

      </View>
    )
  }
}

export * from './BottomBar';
