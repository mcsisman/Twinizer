import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createAppContainer, navigation} from 'react-navigation';
import {createStackNavigator, Header} from 'react-navigation-stack';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import language from '../../../Utils/Languages/lang.json'
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

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var statusBarHeaderTotalHeight = getStatusBarHeight() + headerHeight
export default class CustomHeader extends Component {
   static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func,
    whichScreen: PropTypes.string,
    isFilterVisible: PropTypes.bool,
    editPressed: PropTypes.string,
  }
  render(){
    var lang = language[global.lang]
    var filterOpacity = 1;
    if(!this.props.isFilterVisible){
      filterOpacity = 0
    }
    var requestDisabled;
    var messageDisabled;
    var requestColor;
    var messageColor;
    if(this.props.title == lang.Messages){
      requestDisabled = false;
      messageDisabled = true;
      requestColor = "lockgray";
      messageColor = "comment" + global.themeForImages;

    }
    else{
      requestDisabled = true;
      messageDisabled = false;
      requestColor = "lock" + global.themeForImages;
      messageColor = "commentgray";
    }
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    if(this.props.whichScreen == "Messages"){
      if(this.props.editPressed == "Cancel"){
        return(
          <View
          style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight,
          width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>
          <Text style = {{fontSize: 24*this.width/360, color: global.themeColor, fontWeight: 'bold'}}>
          {this.props.title}
          </Text>
          </View>
        )
      }
      else{
        return(
          <View
          style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight, flexDirection: "row",
          width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)',}}>

          <View
          style={{width: this.width/5, height: "100%", justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', }}>
          <TouchableOpacity
          activeOpacity = {1}
          onPress = {this.props.onPress}
          disabled = {messageDisabled}
          style={{position: 'absolute',  width: Math.min(this.width/6, headerHeight*4/5), height: Math.min(this.width/6, headerHeight*4/5), justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', }}>
          <Image
          style={{position: 'absolute', width: '70%', height: '70%'}}
          source={{uri: messageColor}}>
          </Image>
          </TouchableOpacity>
          </View>

          <View
          style={{width: this.width*3/5, height: "100%", justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', }}>
          <Text style = {{fontSize: 24*this.width/360,color: global.themeColor, fontWeight: 'bold'}}>
          {this.props.title}
          </Text>
          </View>

          <View
          style={{width: this.width/5, height: "100%", justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', }}>
          <TouchableOpacity
          activeOpacity = {1}
          onPress = {this.props.onPress}
          disabled = {requestDisabled}
          style={{position: 'absolute',  width: Math.min(this.width/6, headerHeight*4/5), height: Math.min(this.width/6, headerHeight*4/5), justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', }}>
          <Image
          style={{position: 'absolute', width: '70%', height: '70%'}}
          source={{uri: requestColor}}>
          </Image>
          </TouchableOpacity>
          </View>
          </View>
        )
      }
    }
    else{
      if(this.props.whichScreen == "Main"){
        return(
          <View
          style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight,
          width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>

          <View
          style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight,
          width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>
          <Text style = {{fontSize: 30*this.width/360,color: global.themeColor, fontWeight: 'bold'}}>
          {this.props.title}
          </Text>
          </View>

          <View
          style={{opacity: filterOpacity, position: 'absolute', right: this.width*2/100, width: headerHeight*9/10*(196/211), height: headerHeight*9/10, justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)'}}>

          <TouchableOpacity
          activeOpacity = {1}
          onPress = {this.props.onPress}
          disabled = {!this.props.isFilterVisible}
          style={{opacity: filterOpacity, width: Math.min(this.width/6, headerHeight *4/5)*(196/211), height: Math.min(this.width/6, headerHeight *4/5), justifyContent: 'center', alignItems: 'center',
          backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)'}}>
          <Image
          style={{position: 'absolute', width: '70%', height: '70%'}}
          source={{uri: "filter" + global.themeForImages}}>
          </Image>
          </TouchableOpacity>
          </View>

          </View>
        )
      }
      else{
        if(this.props.whichScreen == "Settings" || this.props.whichScreen == "History" ){
          return(
            <View
            style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight,
            width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>
            <Text style = {{fontSize: 24*this.width/360,color: global.themeColor, fontWeight: 'bold'}}>
            {this.props.title}
            </Text>
            </View>
          )
        }
        else{
          return(
            <View
            style = {{ backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', height: headerHeight,
            width: this.width, right: 0, borderBottomWidth: 1.5, borderColor: 'rgba(181,181,181,0.5)', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
            activeOpacity = {0.3}
            onPress = {this.props.onPress}
            style={{position: 'absolute', left: this.width/25, width: this.width*(1/10), height: this.width*(1/10), top: (headerHeight - this.width*(1/10))/2, justifyContent: 'center', alignItems: 'center',
            backgroundColor: global.isDarkMode ? global.darkModeColors[1] : 'rgba(255,255,255,1)', borderTopLeftRadius: 64,borderTopRightRadius: 64,borderBottomLeftRadius: 64, borderBottomRightRadius: 64}}>
            <Image
            style={{position: 'absolute', width: '60%', height: '60%',
            borderBottomLeftRadius: 64, borderTopRightRadius: 64, borderTopLeftRadius: 64, borderBottomRightRadius: 64}}
            source={{uri: "backarrow" + global.themeForImages}}>
            </Image>
            </TouchableOpacity>

            <Text style = {{fontSize: 24*this.width/360,color: global.themeColor, fontWeight: 'bold'}}>
            {this.props.title}
            </Text>
            </View>
          )
        }

      }
    }
  }
}

export * from './CustomHeader';
