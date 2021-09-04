import React, {Component} from 'react';
import RNFS from 'react-native-fs';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {createStackNavigator} from '@react-navigation/stack';
import {Header} from 'react-navigation-stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import {FAB} from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Alert,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

import MainScreen from '../Main/Main';

import CustomHeader from '../Components/Common/Header/CustomHeader';
import ModifiedStatusBar from '../Components/Common/StatusBar/ModifiedStatusBar';

import SearchButton from '../Components/Common/SearchButton/SearchButton';
import HistoryBox from '../Components/History/HistoryBox';
import EditBox from '../Components/Messaging/Messages/EditBox/EditBox';
import language from '../Utils/Languages/lang.json';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var lang = language[global.lang];
var ourBlue = 'rgba(77,120,204,1)';
var colorArray = [];
var doneColor = 'rgba(128,128,128,1)';
var isSelectedArray = [];
var noOfSearch = 0;
var uriArray = [];
var dateArray = [];
var loadingDone = false;
export default class HistoryScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    this.state = {
      allSelected: false,
      disabled: true,
      opacity: 0.4,
      historyBoxDisabled: false,
      doneDisabled: true,
      editPressed: false,
      cancelPressed: false,
      editText: 'Edit',
      reRender: 'ok',
    };
    this.leftAnimation = new Animated.Value(-this.width * (3 / 16));
    this.spinValue = new Animated.Value(0);
    loadingDone = false;
  }
  async componentDidMount() {
    this.initializeVars();
    lang = language[global.lang];
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      global.fromChat = false;
      this.spinAnimation();
      noOfSearch = await this.getNoOfSearch();
      await this.createUriArray();
      await this.createDateArray();
      isSelectedArray = [];
      this.initializeIsSelectedArray();
      loadingDone = true;
      this.setState({reRender: 'ok'});
    });
    this._subscribe = this.props.navigation.addListener('blur', async () => {
      isSelectedArray = [];
      this.historyBoxAnimation('reset');
      this.setState({
        disabled: true,
        opacity: 0.4,
        editPressed: false,
        cancelPressed: false,
        editText: 'Edit',
        messageBoxDisabled: false,
      });
    });
    console.log('COMPONENT DID MOUNT');
    this.setState({reRender: 'ok'});
  }
  static navigationOptions = {
    header: null,
  };
  spinAnimation() {
    this.spinValue = new Animated.Value(0);
    // First set up animation
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }
  updateState = () => {
    console.log('LAŞDSKGFLDŞAGKSDŞLKGLSŞDKG');
    this.setState({reRender: 'ok'});
    return 'TESTTTT';
  };
  initializeVars() {
    console.log('history initializeVars');
    ourBlue = 'rgba(77,120,204,1)';
    colorArray = [];
    doneColor = 'rgba(128,128,128,1)';
    isSelectedArray = [];
    noOfSearch = 0;
    uriArray = [];
    dateArray = [];
    loadingDone = false;
  }
  historyBoxAnimation(reset) {
    if (this.state.editText == 'Cancel' || reset == 'reset') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: -this.width * (3 / 16),
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else if (this.state.editText == 'Edit') {
      Animated.timing(this.leftAnimation, {
        duration: 100,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }
  async deleteHistory(indexArray) {
    var historyArray;
    historyArray = await this.getHistoryImageArray();
    console.log('SİLMEDEN ÖNCE: ', historyArray);
    for (i = 0; i < indexArray.length; i++) {
      RNFS.unlink(
        'file://' +
          RNFS.DocumentDirectoryPath +
          '/search-photos/' +
          historyArray[noOfSearch - indexArray[i] - 1][
            'lastSearch'
          ].toString() +
          '.jpg',
      )
        .then(() => {
          console.log(
            'Silinen path:',
            'file://' +
              RNFS.DocumentDirectoryPath +
              '/search-photos/' +
              historyArray[noOfSearch - indexArray[i] - 1][
                'lastSearch'
              ].toString() +
              '.jpg',
          );
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          console.log(err.message);
        });
      historyArray.splice(noOfSearch - indexArray[i] - 1, 1);
      uriArray.splice(noOfSearch - indexArray[i] - 1, 1);
    }
    console.log('SİLDİKTEN SONRA: ', historyArray);
    noOfSearch = noOfSearch - indexArray.length;

    colorArray = [];
    for (i = 0; i < noOfSearch; i++) {
      colorArray[i] = 'trashgray';
    }

    await EncryptedStorage.setItem(
      auth().currentUser.uid + 'noOfSearch',
      noOfSearch.toString(),
    );
    await EncryptedStorage.setItem(
      auth().currentUser.uid + 'historyArray',
      JSON.stringify(historyArray),
    );
    this.leftAnimation = new Animated.Value(-this.width * (3 / 16));
    this.setState({
      historyBoxDisabled: false,
      doneDisabled: true,
      editText: 'Edit',
      editPressed: false,
      cancelPressed: true,
    });
  }
  async onPressSearch() {
    var index = -1;
    for (i = 0; i < noOfSearch; i++) {
      if (isSelectedArray[i] == true) {
        index = noOfSearch - i - 1;
      }
    }
    global.fromHistorySearch = true;
    const {navigate} = this.props.navigation;
    global.historyPhotoUri = await this.getHistoryPhotoPath(index);
    navigate('Main');
  }
  donePress() {
    var lang = language[global.lang];
    var deleteCount = 0;
    var indexArray = [];
    for (i = 0; i < colorArray.length; i++) {
      if (colorArray[i] == 'trash' + global.themeForImages) {
        indexArray[deleteCount] = i;
        deleteCount++;
      }
    }
    var alertMsg = lang.HistoryDeleteAlert;
    Alert.alert(
      lang.Warning,
      alertMsg,
      [
        {
          text: lang.NO,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: lang.YES, onPress: () => this.deleteHistory(indexArray)},
      ],
      {cancelable: false},
    );
  }
  initializeIsSelectedArray() {
    for (i = 0; i < noOfSearch; i++) {
      isSelectedArray[i] = false;
    }
    console.log('history initializeIsSelectedArray', isSelectedArray);
    this.setState({reRender: 'ok'});
  }
  editButtonPressed() {
    for (i = 0; i < noOfSearch; i++) {
      isSelectedArray[i] = false;
      colorArray[i] = 'trashgray';
    }
    if (this.state.editText == 'Edit') {
      this.setState({
        allSelected: false,
        disabled: true,
        opacity: 0.4,
        historyBoxDisabled: true,
        doneDisabled: true,
        editText: 'Cancel',
        editPressed: true,
        cancelPressed: false,
      });
      this.historyBoxAnimation();
    } else {
      this.setState({
        allSelected: false,
        historyBoxDisabled: false,
        doneDisabled: true,
        editText: 'Edit',
        editPressed: false,
        cancelPressed: true,
      });
      this.historyBoxAnimation();
      doneColor = 'rgba(128,128,128,1)';
    }
  }
  arrangeDoneColor() {
    var flag1 = false;
    for (i = 0; i < colorArray.length; i++) {
      if (colorArray[i] == 'trash' + global.themeForImages) {
        flag1 = true;
        doneColor = global.themeColor;
        this.setState({doneDisabled: false});
        break;
      }
    }
    if (!flag1) {
      doneColor = 'rgba(128,128,128,1)';
      this.setState({doneDisabled: true});
    }
  }
  async trashButtonPressed(i) {
    if (colorArray[i] == 'trashgray') {
      colorArray[i] = 'trash' + global.themeForImages;
    } else {
      colorArray[i] = 'trashgray';
    }
    var trashGrayCount = 0;
    var trashColoredCount = 0;
    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i] == 'trashgray') {
        trashGrayCount++;
      } else {
        trashColoredCount++;
      }
    }
    if (trashColoredCount == colorArray.length) {
      this.setState({allSelected: true});
    }
    if (trashGrayCount == colorArray.length) {
      this.setState({allSelected: false});
    }
    this.arrangeDoneColor();
  }
  historyBoxPressed(whichBox) {
    for (i = 0; i < noOfSearch; i++) {
      if (i == whichBox) {
        if (isSelectedArray[i] == true) {
          isSelectedArray[i] = false;
          this.setState({disabled: true, opacity: 0.4});
        } else {
          isSelectedArray[i] = true;
          this.setState({disabled: false, opacity: 1});
        }
      } else {
        isSelectedArray[i] = false;
        this.setState({reRender: 'ok'});
      }
    }
  }
  async getNoOfSearch() {
    var noOfSearch;
    noOfSearch = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'noOfSearch',
    );
    if (noOfSearch == null) {
      noOfSearch = '0';
    }
    noOfSearch = parseInt(noOfSearch);
    console.log('history getNoOfSearch', noOfSearch);
    return noOfSearch;
  }

  async createUriArray() {
    for (i = 0; i < noOfSearch; i++) {
      uriArray[i] = await this.getHistoryPhotoPath(i);
    }
    console.log('history createUriArray', uriArray);
    this.setState({reRender: 'ok'});
  }
  async createDateArray() {
    for (i = 0; i < noOfSearch; i++) {
      dateArray[i] = await this.getHistoryDate(i);
    }
    console.log('history createDateArray', dateArray);
    this.setState({reRender: 'ok'});
  }

  async getLastSearchNo() {
    var lastSearch = null;
    lastSearch = await EncryptedStorage.getItem(
      auth().currentUser.uid + 'lastSearch',
    );
    if (lastSearch == null) {
      lastSearch = '0';
    }
    lastSearch = parseInt(lastSearch);
    return lastSearch;
  }
  async getHistoryImageArray() {
    var historyArray = [];
    await EncryptedStorage.getItem(auth().currentUser.uid + 'historyArray')
      .then((req) => {
        if (req) {
          return JSON.parse(req);
        } else {
          return null;
        }
      })
      .then((json) => (historyArray = json));
    if (historyArray == null) {
      historyArray = [];
    }
    console.log('HISTORY ARRAY:', historyArray);
    return historyArray;
  }
  async getHistoryPhotoPath(whichBox) {
    var historyArray = [];
    var photoName = '';
    historyArray = await this.getHistoryImageArray();
    photoName = historyArray[whichBox]['lastSearch'];
    var path =
      'file://' +
      RNFS.DocumentDirectoryPath +
      '/search-photos/' +
      photoName.toString() +
      '.jpg';
    return path;
  }
  async getHistoryDate(whichBox) {
    var historyArray = [];
    var historyDate = null;
    historyArray = await this.getHistoryImageArray();
    historyDate = historyArray[whichBox]['searchDate'];
    return historyDate;
  }
  selectAll() {
    if (this.state.allSelected) {
      for (i = 0; i < colorArray.length; i++) {
        colorArray[i] = 'trashgray';
      }
      this.setState({allSelected: !this.state.allSelected, doneDisabled: true});
    } else {
      for (i = 0; i < colorArray.length; i++) {
        colorArray[i] = 'trash' + global.themeForImages;
      }
      this.setState({
        allSelected: !this.state.allSelected,
        doneDisabled: false,
      });
    }
  }
  renderHistoryBoxes() {
    var scrollViewHeight =
      this.height -
      this.width / 7 -
      this.width / 9 -
      headerHeight -
      getStatusBarHeight();
    var boxes = [];
    if (noOfSearch == 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: this.width,
            height: scrollViewHeight,
          }}>
          <View
            style={{
              opacity: 0.7,
              alignItems: 'center',
              width: this.width,
              height: scrollViewHeight / 4,
            }}>
            <Text
              style={{
                fontSize: (20 * this.width) / 360,
                color: global.isDarkMode
                  ? global.darkModeColors[3]
                  : 'rgba(0,0,0,1)',
              }}>
              {lang.NoRecentActivity}
            </Text>
          </View>
        </View>
      );
    } else {
      console.log('resimler:', uriArray);
      for (i = 0; i < noOfSearch; i++) {
        const temp = i;
        boxes.push(
          <HistoryBox
            left={this.leftAnimation}
            color={colorArray[temp]}
            disabled={this.state.historyBoxDisabled}
            onPress={() => this.historyBoxPressed(temp)}
            isSelected={isSelectedArray[temp]}
            editPressed={this.state.editPressed}
            trashOnPress={() => this.trashButtonPressed(temp)}
            cancelPressed={this.state.cancelPressed}
            photoSource={uriArray[noOfSearch - temp - 1]}
            searchDate={dateArray[noOfSearch - temp - 1]}
            key={i}
          />,
        );
      }
    }

    return boxes;
  }
  render() {
    var lang = language[global.lang];
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    console.log('RENDER');
    const {navigate} = this.props.navigation;
    if (!loadingDone) {
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
            whichScreen={'History'}
            isFilterVisible={this.state.showFilter}
            title={lang.History}></CustomHeader>

          <Animated.Image
            source={{uri: 'loading' + global.themeForImages}}
            style={{
              transform: [{rotate: spin}],
              width: this.width * (1 / 15),
              height: this.width * (1 / 15),
              position: 'absolute',
              top: this.height / 3,
              left: this.width * (7 / 15),
              opacity: this.state.loadingOpacity,
            }}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: global.isDarkMode
              ? global.darkModeColors[1]
              : 'rgba(242,242,242,1)',
            backgroundColor: 'red',
          }}>
          <ModifiedStatusBar />

          <CustomHeader
            whichScreen={'History'}
            isFilterVisible={this.state.showFilter}
            title={lang.History}></CustomHeader>

          <EditBox
            editButtonPressed={() => this.editButtonPressed()}
            messageSelectAll={() => this.selectAll()}
            messageDoneDisabled={this.state.doneDisabled}
            messageDonePress={() => this.donePress()}
            editText={this.state.editText}
            allSelected={this.state.allSelected}
            messageArray={noOfSearch == 0 ? [] : [1]}
            whichScreen={'left'}
            editPressed={this.state.editPressed}
          />

          <FlatList
            style={{
              height:
                this.height -
                this.width / 7 -
                this.width / 9 -
                headerHeight -
                getStatusBarHeight(),
              width: this.width,
              right: 0,
              bottom: 0,
              position: 'absolute',
              flex: 1,
              flexDirection: 'column',
            }}
            renderItem={() => this.renderHistoryBoxes()}
            data={[{bos: 'boş', key: 'key'}]}
            refreshing={true}></FlatList>

          <View
            style={{
              opacity: this.state.editPressed || noOfSearch == 0 ? 0 : 1,
              width: this.width / 8.5,
              height: this.width / 8.5,
              bottom: this.width / 20,
              right: this.width / 20,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
            }}>
            <FAB
              style={{
                opacity: this.state.opacity,
                backgroundColor: global.themeColor,
                width: this.width / 8.5,
                height: this.width / 8.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              small
              icon={({size, color}) => (
                <Image
                  source={{uri: 'search'}}
                  style={{width: '55%', height: '55%'}}
                />
              )}
              animated={false}
              onPress={() => this.onPressSearch()}
              disabled={this.state.disabled}
            />
          </View>
        </SafeAreaView>
      );
    }
  }
}
