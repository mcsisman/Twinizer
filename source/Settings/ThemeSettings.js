import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import themes from './Themes';
import {navigate, route} from './RootNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Switch, Colors} from 'react-native-ui-lib'; //eslint-disable-line
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

import SettingsScreen from './Settings';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';

import ThemeSample from '../Components/Settings/ThemeSettings/ThemeSample';
import OvalButton from '../Components/Common/OvalButton/OvalButton';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var lang = language[global.lang];
export default class ThemeSettingsScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      darkMode: global.isDarkMode,
      tickVisible: global.isDarkMode,
      themeColor: global.themeColor,
    };
  }
  async componentDidMount() {
    console.log('THEME SETTINGS COMPONENT DID MOUNT');
    await this.getSelectedTheme();
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      console.log('subscribe');
      this.setState({reRender: 'ok'});
    });
  }
  static navigationOptions = {
    header: null,
  };
  async onPress(selectedIndex) {
    await this.setState({
      selected1: selectedIndex == 1 ? true : false,
      selected2: selectedIndex == 2 ? true : false,
      selected3: selectedIndex == 3 ? true : false,
      selected4: selectedIndex == 4 ? true : false,
    });

    this.applyColorTheme();
  }
  async getSelectedTheme() {
    var themeColor = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'theme',
    );
    var mode = await EncryptedStorage.getItem(auth().currentUser.uid + 'mode');

    if (themeColor == null || themeColor == undefined) {
      themeColor = 'Original';
    }
    if (mode == null || mode == undefined) {
      mode = 'false';
    }
    if (mode == 'true') {
      mode = true;
    } else {
      mode = false;
    }
    if (themeColor == 'Original') {
      this.setState({
        selected1: true,
        selected2: false,
        selected3: false,
        selected4: false,
        tickVisible: mode,
      });
    }
    if (themeColor == 'Blue') {
      this.setState({
        selected1: false,
        selected2: false,
        selected3: true,
        selected4: false,
        tickVisible: mode,
      });
    }
    if (themeColor == 'Green') {
      this.setState({
        selected1: false,
        selected2: false,
        selected3: false,
        selected4: true,
        tickVisible: mode,
      });
    }
    if (themeColor == 'Yellow') {
      this.setState({
        selected1: false,
        selected2: true,
        selected3: false,
        selected4: false,
        tickVisible: mode,
      });
    }
  }
  applyColorTheme() {
    var themeColor;
    if (this.state.selected1) {
      themeColor = 'Original';
    }
    if (this.state.selected2) {
      themeColor = 'Yellow';
    }
    if (this.state.selected3) {
      themeColor = 'Blue';
    }
    if (this.state.selected4) {
      themeColor = 'Green';
    }
    console.log('THEME COLOR:', themeColor);
    global.themeColor = themes.getTheme(themeColor);
    global.themeForImages = themes.getThemeForImages(themeColor);
    this.setState({reRender: 'ok', themeColor: global.themeColor});
    this.props.route.params.update();
    EncryptedStorage.setItem(auth().currentUser.uid + 'theme', themeColor);
  }
  darkModeChanged() {
    var mode;
    if (this.state.darkMode) {
      global.isDarkMode = true;
      mode = 'true';
    } else {
      global.isDarkMode = false;
      mode = 'false';
    }
    global.themeColor = themes.getTheme(themeColor);
    global.themeForImages = themes.getThemeForImages(themeColor);
    return mode;
  }
  async applyModeTheme() {
    var mode;
    if (this.state.darkMode) {
      global.isDarkMode = true;
      mode = 'true';
    } else {
      global.isDarkMode = false;
      mode = 'false';
    }
    this.setState({reRender: 'ok'});
    this.props.route.params.update();
    EncryptedStorage.setItem(auth().currentUser.uid + 'mode', mode);
  }
  render() {
    var lang = language[global.lang];
    var emptyScreenHeight =
      this.height -
      headerHeight -
      getStatusBarHeight() -
      this.width * 0.7 -
      this.width / 8 -
      (this.width * 12) / 100;
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView
        style={{
          width: this.width,
          height: this.height,
          flex: 1,
          flexDirection: 'column',
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(242,242,242,1)',
        }}>
        <ModifiedStatusBar />
        <CustomHeader
          whichScreen={'Theme Settings'}
          onPress={() => this.props.navigation.navigate('Settings')}
          isFilterVisible={false}
          title={lang.ThemeSettings}></CustomHeader>

        <View
          style={{
            height: this.height - headerHeight - getStatusBarHeight(),
            width: this.width,
            right: 0,
            bottom: 0,
            position: 'absolute',
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <View style={{height: emptyScreenHeight / 4}} />

          <View
            style={{
              height: this.width * 0.7,
              width: this.width * 0.7,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            <ThemeSample
              selected={this.state.selected1}
              disabled={this.state.selected1 ? true : false}
              onPress={() => this.onPress(1)}
              borderRightWidth={0.5}
              borderBottomWidth={0.5}
              borderTopLeftRadius={12}
              color={'rgba(242,119,97,1)'}
              whichTheme={lang.Original}
              bottom={this.width * 0.35}
              right={this.width * 0.35}
            />

            <ThemeSample
              selected={this.state.selected2}
              disabled={this.state.selected2 ? true : false}
              onPress={() => this.onPress(2)}
              borderLeftWidth={0.5}
              borderTopWidth={0.5}
              borderBottomRightRadius={12}
              color={'rgba(228,186,51,1)'}
              whichTheme={lang.Yellow}
              bottom={0}
              right={0}
            />

            <ThemeSample
              selected={this.state.selected3}
              disabled={this.state.selected3 ? true : false}
              onPress={() => this.onPress(3)}
              borderLeftWidth={0.5}
              borderBottomWidth={0.5}
              borderTopRightRadius={12}
              color={'rgba(77,120,204,1)'}
              whichTheme={lang.Blue}
              bottom={this.width * 0.35}
              right={0}
            />

            <ThemeSample
              selected={this.state.selected4}
              disabled={this.state.selected4 ? true : false}
              onPress={() => this.onPress(4)}
              borderTopWidth={0.5}
              borderRightWidth={0.5}
              borderBottomLeftRadius={12}
              color={'rgba(115,201,144,1)'}
              whichTheme={lang.Green}
              bottom={0}
              right={this.width * 0.35}
            />
          </View>

          <View style={{height: emptyScreenHeight / 4}} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: this.width,
              height: this.width / 8,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '5%',
                paddingRight: '5%',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: global.isDarkMode
                    ? global.darkModeColors[3]
                    : 'rgba(88,88,88,1)',
                  fontSize: (16 * this.width) / 360,
                }}>
                {lang.EnableDarkMode}
              </Text>

              <Switch
                style={{marginLeft: '10%'}}
                onColor={global.darkModeColors[0]}
                offColor={Colors.dark60}
                thumbColor={Colors.dark20}
                width={this.width / 7}
                height={((this.width / 7) * 30) / 60}
                thumbSize={((this.width / 7) * 23) / 60}
                value={this.state.darkMode}
                onValueChange={async () => {
                  await this.setState({darkMode: !this.state.darkMode});
                  this.applyModeTheme();
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
