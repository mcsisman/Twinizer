import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, navigation} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducer from './source/Redux/Reducer';
import SplashScreen from 'react-native-splash-screen';
import {
  fromRight,
  zoomIn,
  zoomOut,
  flipX,
  flipY,
  fromBottom,
} from 'react-navigation-transitions';
import {decode, encode} from 'base-64';
import * as RNLocalize from 'react-native-localize';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigationRef} from './source/RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  StyleSheet,
  Animated,
  ScrollView,
  ImageBackground,
  View,
  Dimensions,
  Text,
  StatusBar,
  Platform,
  NativeModules,
  TouchableOpacity,
  Image,
} from 'react-native';
import LoginScreen from './source/Login/Login';
import NewAccountScreen from './source/Login/NewAccount';
import ForgotPasswordScreen from './source/Login/ForgotPassword';
import MainScreen from './source/Main/Main';
import ImageUploadScreen from './source/ProfileSteps/ImageUpload';
import ChatScreen from './source/Messaging/Chat';
import UserInfoScreen from './source/ProfileSteps/UserInfo';
import BioScreen from './source/ProfileSteps/Bio';
import MessagesScreen from './source/Messaging/Messages';
import ProfileUploadScreen from './source/ProfileSteps/ProfileUpload';
import HistoryScreen from './source/History/History';
import DeleteOptionsScreen from './source/Settings/DeleteOptions';
import SettingsScreen from './source/Settings/Settings';
import AboutScreen from './source/Settings/About';
import LibraryLicencesScreen from './source/Settings/LibraryLicences';
import DisplayLicenceScreen from './source/Settings/DisplayLicence';
import DisplayPrivacyScreen from './source/Settings/DisplayPrivacy';
import DisplayTermsScreen from './source/Settings/DisplayTerms';
import FavoriteUsersScreen from './source/Settings/FavoriteUsers';
import BlockedUsersScreen from './source/Settings/BlockedUsers';
import ThemeSettingsScreen from './source/Settings/ThemeSettings';
import ProfileScreen from './source/Settings/Profile';
import ProfileFavUserScreen from './source/Settings/ProfileFavUser';
import ProfileBlockedUserScreen from './source/Settings/ProfileBlockedUser';
import themes from './source/Settings/Themes';
import language from './source/Utils/Languages/lang.json';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
  useSafeAreaFrame,
} from 'react-native-safe-area-context';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
class Appp extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      authenticated: false,
    };
  }

  async componentDidMount() {
    if (Platform.OS == 'android') {
      global.fontFam = '';
    }
    this._subscribe = this.props.navigation.addListener('focus', async () => {
      this.initializeGlobalVariables();
      global.keyboardHeight = await EncryptedStorage.getItem('keyboardHeight');
      //console.log('APPJSTE KEYBOARD1:', global.keyboardHeight);
      if (global.keyboardHeight != undefined && global.keyboardHeight != null) {
        //console.log('APPJSTE KEYBOARD:', global.keyboardHeight);
        global.keyboardHeight = parseInt(global.keyboardHeight);
      }

      this.getLocalLang();

      //console.log('subscribe');

      const user = auth().currentUser;
      if (user) {
        this.setState({loading: false, authenticated: true});
      } else {
        this.setState({loading: false, authenticated: false});
      }
    });
  }
  async getLocalLang() {
    var lang = RNLocalize.getLocales();
    if (lang[0]['languageCode'] == 'tr') {
      global.lang = 'langTR';
    } else {
      global.lang = 'langEN';
    }

    //console.log('LOCAL:');
  }
  initializeGlobalVariables() {
    global.isFavListUpdated = false;
    global.isBlockListUpdated = false;
    global.imageSizeLimit = 20000000;
    global.fromChat = false;
    global.emailArrayLength = 0;
    global.addedMsgs = {};
    global.favUsersListenersOpened = false;
    global.darkModeColors = [
      '#2f3136',
      '#202225',
      '#1b1d23',
      'rgba(255,255,255,1)',
    ];
    global.functionNumber = -1;
    global.messages = [];
    global.usernameListeners = {};
    global.changedFavInMain = false;
    global.changedBlockInMain = false;
    global.msgFromMain = false;
    global.playerIdArray = {};
    global.removeFromFavUser = false;
    global.removeFromBlockedUser = false;
    global.removedFromBlockedList = false;
    global.removedFromFavList = false;
    global.selectedFavUserIndex = null;
    global.selectedBlockedUserIndex = null;
    global.favoriteUsersListeners = 0;
    global.blockedUsersListeners = 0;
    global.messagesFirstTime = true;
    global.fromHistorySearch = false;
    global.flag1 = true;
    global.flag2 = true;
    global.flag3 = true;
    global.flag4 = true;
    global.flag5 = true;
    global.flag6 = true;
    global.flag7 = true;
    global.flag8 = true;
    global.welcomeOpacity = 0;
    global.width = Math.round(Dimensions.get('screen').width);
    global.height = Math.round(Dimensions.get('screen').height);
  }
  async setTheme(user) {
    // Theme color
    if (user) {
      var themeColor = await EncryptedStorage.getItem(
        auth().currentUser.uid + 'theme',
      );
      //console.log('STORAGEDAN GELEN THEME COLOR:', themeColor);
      if (themeColor == null || themeColor == undefined) {
        themeColor = 'Original';
      }
      global.themeColor = themes.getTheme(themeColor);
      global.themeForImages = themes.getThemeForImages(themeColor);
      var mode = await EncryptedStorage.getItem(
        auth().currentUser.uid + 'mode',
      );
      if (mode == null || mode == undefined) {
        mode = 'false';
      }
      if (mode == 'true') {
        global.isDarkMode = true;
      } else {
        global.isDarkMode = false;
      }
      global.darkModeColors = [
        '#2f3136',
        '#202225',
        '#1b1d23',
        'rgba(255,255,255,1)',
      ];
    } else {
      global.themeColor = themes.getTheme('Original');
      global.themeForImages = themes.getThemeForImages('Original');
      global.isDarkMode = false;
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    if (this.state.loading)
      return (
        <ImageBackground
          source={{uri: 'splash'}}
          style={{
            width: this.width,
            height: this.height,
            flex: 1,
            alignItems: 'center',
          }}></ImageBackground>
      );
    // Render loading/splash screen etc
    else {
      if (this.state.authenticated) {
        var storageRef = storage().ref(
          'Embeddings/' + auth().currentUser.uid + '.pickle',
        );
        ////console.log("STORAGE REF: ", storageRef)
        storageRef
          .getDownloadURL()
          .then(async (data) => {
            //console.log('EMBEDDING VAR: ', auth().currentUser.uid);
            //console.log('DATA: ', data);
            await this.setTheme(true);
            navigate('Tabs');
          })
          .catch(async (error) => {
            //console.log('EMBEDDING YOK: ', auth().currentUser.uid);
            if (auth().currentUser.emailVerified && error.message == "[storage/object-not-found] No object exists at the desired reference.") {
              await this.setTheme(true);
              navigate('UserInfo');
            }
            else{
              await this.setTheme(false);
              navigate('Login');
            }
          });
      } else {
        this.setTheme(false);
        navigate('Login');
      }
      return (
        <ImageBackground
          source={{uri: 'splash'}}
          style={{
            width: this.width,
            height: this.height,
            flex: 1,
            alignItems: 'center',
          }}></ImageBackground>
      );
    }
  }
}
console.disableYellowBox = true;

const config = {
  animation: 'timing',
  config: {
    duration: 0,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
const config2 = {
  animation: 'spring',
  config: {
    duration: 1000,
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};
export function forHorizontalModal({
  current,
  next,
  inverted,
  layouts: {screen},
}: StackCardInterpolationProps): StackCardInterpolatedStyle {
  const translateFocused = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [screen.width, 0],
      extrapolate: 'clamp',
    }),
    inverted,
  );

  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: 'clamp',
  });

  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        {translateX: translateFocused},
        // Translation for the animation of the card in back
        {translateX: 0},
      ],
    },
    overlayStyle: {opacity: overlayOpacity},
    shadowStyle: {shadowOpacity},
  };
}
function MyTabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  global.insets = useSafeAreaInsets();
  global.obj = useSafeAreaFrame();
  //console.log('safe area:', global.obj);
  //console.log('INSETS:', global.insets);
  if (focusedOptions.tabBarVisible === false || state.index == 4) {
    return null;
  }
  //console.log('GLOBAL INSET:', global.insets);
  return (
    <View
      style={{
        bottom: Platform.OS === 'android' ? 0 : global.insets.bottom,
        flexDirection: 'row',
        backgroundColor: global.isDarkMode
          ? global.darkModeColors[0]
          : 'rgba(188,192,204,0.5)',
      }}>
      <View
        style={{
          height: global.insets.bottom,
          width: this.width,
          position: 'absolute',
          bottom: -global.insets.bottom,
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[1]
            : 'rgba(242,242,242,1)',
        }}
      />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {update: this.updateState});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const imgArray1 = [
          'home' + global.themeForImages,
          'msg' + global.themeForImages,
          'history' + global.themeForImages,
          'settings' + global.themeForImages,
        ];
        const imgArray2 = [
          'homegray',
          'msggray',
          'historygray',
          'settingsgray',
        ];

        var widthArray = ['40%', '32%', '40%', '28%'];
        var heightArray = ['70%', '56%', '56%', '49%'];
        return (
          <TouchableOpacity
            key={index}
            disabled={isFocused ? true : false}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              opacity: 0.8,
              alignItems: 'center',
              justifyContent: 'center',
              width: this.width / 4,
              height: this.width / 7,
            }}>
            <Image
              style={{
                top: index == 3 ? '10%' : '5%',
                position: 'absolute',
                width: widthArray[index],
                height: heightArray[index],
              }}
              source={{
                uri: isFocused ? imgArray1[index] : imgArray2[index],
              }}></Image>

            <Text
              style={{
                fontFamily: global.fontFam,
                bottom: '5%',
                position: 'absolute',
                color: isFocused ? global.themeColor : 'rgba(128,128,128,1)',
                fontSize: 12 * (this.width / 360),
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View
        style={{
          position: 'absolute',
          height: global.insets.bottom,
          width: this.width,
          bottom: -global.insets.bottom,
          backgroundColor: global.isDarkMode
            ? global.darkModeColors[0]
            : 'rgba(188,192,204,0.5)',
        }}
      />
    </View>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  var lang = language[global.lang];
  global.insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      headerMode={'none'}
      initialRouteName="Main"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}>
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: lang.Home,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: lang.Messages,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: lang.History,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: lang.Settings,
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
Stack.navigationOptions = ({navigation}) => {
  let tabBarVisible;
  tabBarVisible = false;
  return {
    tabBarVisible,
  };
};

const store = createStore(reducer, {
  update: false,
});
function App({navigation}) {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator headerMode={'none'}>
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="Appp"
              component={Appp}
            />

            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
              }}
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="Tabs"
              component={MyTabs}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="ThemeSettings"
              component={ThemeSettingsScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
              }}
              name="NewAccount"
              component={NewAccountScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="Profile"
              component={ProfileScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="DeleteOptions"
              component={DeleteOptionsScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="ProfileFavUser"
              component={ProfileFavUserScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="ProfileBlockedUser"
              component={ProfileBlockedUserScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="Bio"
              component={BioScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="UserInfo"
              component={UserInfoScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="Chat"
              component={ChatScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="ProfileUpload"
              component={ProfileUploadScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: false,
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
              name="ImageUpload"
              component={ImageUploadScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="FavoriteUsers"
              component={FavoriteUsersScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="BlockedUsers"
              component={BlockedUsersScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="About"
              component={AboutScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="LibraryLicences"
              component={LibraryLicencesScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="DisplayLicence"
              component={DisplayLicenceScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="DisplayPrivacy"
              component={DisplayPrivacyScreen}
            />
            <Stack.Screen
              options={{
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                cardStyleInterpolator: forHorizontalModal,
                transitionSpec: {
                  open: config2,
                  close: config2,
                },
              }}
              name="DisplayTerms"
              component={DisplayTermsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
