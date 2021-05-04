import React, { Component } from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from "react-native-modal";
import PropTypes from 'prop-types';
import language from '../../../Utils/Languages/lang.json'
import ImgModalOvalButton from '../../Common/ImageUpload/ImgModalOvalButton'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar
} from 'react-native';

if(Platform.OS === 'android'){
  var headerHeight = Header.HEIGHT
}
if(Platform.OS === 'ios'){
  var headerHeight = Header.HEIGHT
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
export default class DatePickerIOSModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: new Date(),
      dateSet: false,
    }
  }

  static propTypes = {
    updateDateState: PropTypes.func,
    maxDate: PropTypes.string,
    isVisible: PropTypes.bool,
    onPressClose: PropTypes.func,
 }
 static defaultProps = {
 }

 updateState(dateSet, date){
   this.props.updateDateState(dateSet, date);
   this.props.onPressClose
 }
  render(){
    var lang = language[global.lang]
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    console.log("render date picker ios modal")

    return(

      <Modal /*BİLGİLENDİRME MODALI*/
      style = {{alignItems: 'center'}}
      onBackdropPress = {this.props.onPressClose}
      backdropOpacity = {0.4}
      coverScreen = {false}
      deviceHeight = {screenHeight}
      deviceWidth = {screenWidth}
      animationInTiming = {500}
      animationOutTiming = {500}
      isVisible={this.props.isVisible}>
      <View style={{
      borderRadius: 8, borderWidth: 0.3, borderColor: "rgba(0,0,0,4)",
      backgroundColor: global.isDarkMode ? global.darkModeColors[1] : "rgba(255,255,255,1)",
      width: screenWidth*(8/10),
      paddingTop: 10,
      paddingBottom: 15,
      alignItems: 'center',
      position: 'absolute',
      flexDirection: 'column',
      bottom: screenHeight*(1/10)}}>

      <DateTimePicker
      textColor = {global.themeColor}
      style = {{ width: screenWidth*(8/10), opacity: 1, height:screenWidth*(6/10)}}
        value={this.state.date}
        display = "spinner"
        minimumDate= {new Date("1921-01-01")}
        maximumDate={new Date(this.props.maxDate)}
        onChange={(event, date) => {
          this.setState({dateSet: true, date: date, })
          console.log("________________SEÇİLEN TARİH______________", this.state.date)
        }}
      />

      <View

      style={{ flexDirection: 'row', width: screenWidth*(78/10), height:screenWidth*(1.5/10), justifyContent: 'center',
      paddingLeft: 15, paddingRight: 15}}>

      <View
      style={{ width: screenWidth*(4/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {lang.Cancel}
      textColor = {global.themeColor}
      onPress = {()=>this.updateState(this.state.dateSet, this.state.date)}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {20*(screenWidth/360)}
      borderWidth = {0}/>
      </View>

      <View
      style={{width: screenWidth*(4/10), height:screenWidth*(1.5/10), justifyContent: 'center', alignItems:'center'}}>
      <ImgModalOvalButton
      activeOpacity = {0.7}
      title = {lang.OK}
      textColor = {global.themeColor}
      onPress = {()=>this.updateState(this.state.dateSet, this.state.date)}
      borderColor = {'rgba(241,51,18,0)'}
      borderRadius = {0}
      textFontSize = {20*(screenWidth/360)}
      borderWidth = {0}/>
      </View>

      </View>

      </View>
      </Modal>
    )
  }
}

export * from './DatePickerIOSModal';
