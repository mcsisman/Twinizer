import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {navigate, route} from './RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  Image,
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
  Platform,
  ScrollView,
} from 'react-native';

import licences from './Licences';
import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import language from '../Utils/Languages/lang.json';
import texts from '../termsAndPrivacy.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}

export default class DisplayPrivacyScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      reRender: 'o',
      text: '',
    };
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    //console.log("privacy COMPONENT DID MOUNT")
    this._subscribe = this.props.navigation.addListener('focus', () => {
      //console.log("subscribe")
      //this.setState({text: licences.licence})
      this.setState({reRender: 'ok'});
    });
  }
  updateState = () => {
    //console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };

  render() {
    var lang = language[global.lang];
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView
        style={{
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(242,242,242,1)',
          width: this.width,
          height: this.height,
          flex: 1,
          flexDirection: 'column',
        }}>
        <ModifiedStatusBar />

        <CustomHeader
          whichScreen={'DisplayPrivacy'}
          isFilterVisible={this.state.showFilter}
          onPress={() => this.props.navigation.navigate('About')}
          title={lang.PrivacyPolicy}></CustomHeader>

        <ScrollView
          style={{
            height:
              this.height -
              this.width / 7 -
              headerHeight -
              getStatusBarHeight(),
            width: this.width,
            flex: 1,
            flexDirection: 'column',
          }}>
          <View style={{height: this.width / 25}} />

          <View style={{alignItems: 'center', height: this.width / 20}}></View>

          <Text
            style={{
              fontFamily: global.fontFam,
              paddingLeft: 10,
              paddingRight: 10,
              fontSize: 15,
              color: global.isDarkMode
                ? global.darkModeColors[3]
                : 'rgba(0,0,0,1)',
            }}>
            {texts['privacy']}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
