import React, {Component} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import {navigate, route} from './RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';

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
  FlatList,
} from 'react-native';

import licences from './Licences';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}

export default class LibraryLicencesScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      reRender: 'o',
    };
    this.licences = licences.licences;
  }
  static navigationOptions = {
    header: null,
  };
  componentDidMount() {
    //console.log("LibraryLicences COMPONENT DID MOUNT")
    this._subscribe = this.props.navigation.addListener('focus', () => {
      //console.log("subscribe")
      this.setState({reRender: 'ok'});
    });
  }
  updateState = () => {
    //console.log("LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG")
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };

  select(licence) {
    global.selectedLicence = licence.replace('/', '_');
    this.props.navigation.navigate('DisplayLicence');
  }

  renderLicenceBoxes() {
    var scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    var boxes = [];
    for (let i = 0; i < licences.length; i++) {
      const temp = i;
      boxes.push(
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingTop: 5,
            paddingBottom: 5,
            width: this.width,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: global.isDarkMode
              ? global.darkModeColors[2]
              : 'rgba(128,128,128,0.3)',
            backgroundColor: global.isDarkMode
              ? 'rgba(0,0,0,0.1)'
              : 'rgba(255,255,255,1)',
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
          }}
          onPress={() => this.select(this.licences[temp])}>
          <View
            style={{
              justifyContent: 'center',
              width: (this.width * 7) / 8,
              height: this.width / 8,
              bottom: 0,
              left: 0,
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(88,88,88,1)',
                fontSize: (15 * this.width) / 360,
              }}>
              {this.licences[temp]}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              width: this.width / 8,
              height: this.width / 8,
              bottom: 0,
              right: 0,
            }}>
            <Image
              source={{uri: 'settingsarrow' + global.themeForImages}}
              style={{
                opacity: 0.5,
                width: (this.width / 8) * (4 / 10) * (61 / 110),
                height: (this.width / 8) * (4 / 10),
              }}
            />
          </View>
        </TouchableOpacity>,
      );
    }
    return boxes;
  }

  render() {
    var lang = language[global.lang];
    const {navigate} = this.props.navigation;
    return (
      <View
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
          whichScreen={'LibraryLicences'}
          isFilterVisible={this.state.showFilter}
          onPress={() => this.props.navigation.navigate('About')}
          title={lang.Licences}></CustomHeader>

        <FlatList
          style={{
            height:
              this.height -
              this.width / 7 -
              this.width / 9 -
              headerHeight -
              getStatusBarHeight(),
            width: this.width,
            flex: 1,
            flexDirection: 'column',
          }}
          renderItem={() => this.renderLicenceBoxes()}
          data={[{bos: 'boş', key: 'key'}]}
          refreshing={true}></FlatList>
      </View>
    );
  }
}
