import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import { fromRight, zoomIn, zoomOut, flipX, flipY, fromBottom } from 'react-navigation-transitions'
import {decode, encode} from 'base-64'
import * as RNLocalize from "react-native-localize";
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigationRef } from './screens/RootNavigation';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground,
  View,
  Dimensions,
  Text,
  StatusBar,
  Platform,
  NativeModules,
  TouchableOpacity,
  Image
} from 'react-native';
import SplashScreen from './screens/Splash';
import MainScreen from './screens/Main';
import NewAccountScreen from './screens/NewAccount';
import ForgotPasswordScreen from './screens/ForgotPassword';
import ImageUploadScreen from './screens/ImageUpload';
import ChatScreen from './screens/Chat';
import GenderScreen from './screens/Gender';
import BioScreen from './screens/Bio';
import MessagesScreen from './screens/Messages';
import ProfileUploadScreen from './screens/ProfileUpload';
import BottomBar from './screens/components/BottomBar';
import HistoryScreen from './screens/History';
import DeleteOptionsScreen from './screens/DeleteOptions';
import SettingsScreen from './screens/Settings';
import AboutScreen from './screens/About';
import LibraryLicencesScreen from './screens/LibraryLicences';
import DisplayLicenceScreen from './screens/DisplayLicence';
import FavoriteUsersScreen from './screens/FavoriteUsers';
import BlockedUsersScreen from './screens/BlockedUsers';
import ThemeSettingsScreen from './screens/ThemeSettings';
import ProfileScreen from './screens/Profile';
import ProfileFavUserScreen from './screens/ProfileFavUser';
import ProfileBlockedUserScreen from './screens/ProfileBlockedUser';
import AsyncStorage from '@react-native-community/async-storage';
import themes from './screens/Themes';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }


  class Appp extends React.Component {

    constructor() {
      super();
      this.state = {
        loading: true,
        authenticated: false,
      };
    }

    async componentDidMount() {
      this._subscribe = this.props.navigation.addListener('focus', async () => {
        console.log("subscribe")
        const user = auth().currentUser;
        await this.setTheme(user)
        if (user) {
          this.setState({ loading: false, authenticated: true });

        } else {
          this.setState({ loading: false, authenticated: false });
        }
      })
    }

    async setTheme(user){
      // Theme color
      if(user){
        var themeColor = await AsyncStorage.getItem(auth().currentUser.uid + 'theme')
        console.log("STORAGEDAN GELEN THEME COLOR:", themeColor)
        if(themeColor == null || themeColor == undefined){
          themeColor = "Original"
        }
        global.themeColor = themes.getTheme(themeColor)
        global.themeForImages = themes.getThemeForImages(themeColor)
        var mode = await AsyncStorage.getItem(auth().currentUser.uid + 'mode')
        if(mode == null || mode == undefined){
          mode = "false"
        }
        if(mode == "true"){
          global.isDarkMode = true
        }
        else{
          global.isDarkMode = false
        }
        global.darkModeColors = ["rgba(21,32,43,1)", "rgba(25,39,52,1)", "rgba(37,51,65,1)", "rgba(255,255,255,1)"]
      }
      else{
        global.themeColor =  themes.getTheme("Original")
        global.themeForImages = themes.getThemeForImages("Original")
        global.isDarkMode = false
      }

    }

    render() {
      const {navigate} = this.props.navigation;
      if (this.state.loading) return (
        <ImageBackground
        source={{uri: 'flare'}}
        style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}>
        </ImageBackground>
      ); // Render loading/splash screen etc
      else{
        if(this.state.authenticated){
          var storageRef = storage().ref("Embeddings/" + auth().currentUser.uid + ".pickle")
          console.log("STORAGE REF: ", storageRef)
          storageRef.getDownloadURL().then(data =>{
            console.log("EMBEDDING VAR: ", auth().currentUser.uid)
            console.log("DATA: ", data)
            navigate("Tabs")
          }).catch(function(error) {
            console.log("EMBEDDING YOK: ", auth().currentUser.uid)
            navigate("Gender")
          });
        }
        else{
          navigate("Splash")
        }
        return (
          <ImageBackground
          source={{uri: 'flare'}}
          style={{width: this.width, height: this.height, flex:1, alignItems: 'center',}}>
          </ImageBackground>
        )
      }
    }
  }
console.disableYellowBox = true;
  global.messages = []
  global.playerIdArray = {}
  global.removeFromFavUser = false
  global.removeFromBlockedUser = false
  global.selectedFavUserIndex = null
  global.selectedBlockedUserIndex = null
  global.favoriteUsersListeners = 0
  global.blockedUsersListeners = 0
  global.messagesFirstTime = true
  global.fromHistorySearch = false
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


  if(global.language == "tr_TR"){
    global.countries = []
    //Splash
    global.langLogin = "Giriş Yap"
    global.langForgotPassword = "Şifremi Unuttum"
    global.langSignUp = "Kaydol"
    global.langEmail = "e-posta"
    global.langPassword = "şifre"
    //Sign Up
    global.langUsername = "Kullanıcı Adı"
    global.langConfirmPassword = "Şifreni Doğrula"
    global.langCreate = "ÜYE OL"
    //Forgot Password
    global.langSendEmail = "E-POSTA GÖNDER"
    //Country
    global.langCompleteYourProfile = "Profilini Tamamla"
    global.langSelectCountry = "Lütfen Ülkeni Seç."
    global.langCountry = "Ülke"
    global.langNext = "İLERİ"
    //Gender
    global.langSelectGender = "Lütfen Cinsiyetini Seç."
    global.langMale = "ERKEK"
    global.langFemale = "KADIN"
    //ProfileUpload
    global.langProfileScreen = "Lütfen bir Profil Fotoğrafı Yükleyin."
    global.langProfileAlert = "Lütfen sadece sizin yüzünüzün olduğu bir fotoğraf yükleyin. Bu profil fotoğrafı diğer kullanıcılar tarafından görülebilir."
    global.langGotIt = "ANLADIM!"
    global.langTapHere = "Buraya Dokun"
    global.langUploadPhoto = "Bir Fotoğraf Yükle"
    global.langTakePhoto = "Fotoğraf Çek..."
    global.langLibrary = "Kütüphaneden Seç..."
    global.langCancel = "İptal"
    //ImageUpload
    global.langImageUploadScreen = "Lütfen Dört Fotoğraf Yükleyin."
    global.langImageAlert = "Lütfen sadece sizin yüzünüzün olduğu bir fotoğraf yükleyin. Bu fotoğraflar diğer kullanıcılar tarafından görüntülenemez.\nFotoğraflarınız profilinizin modelini oluşturmak için kullanılacaktır. Bu model, profilinizin diğer kullanıcıların yaptığı aramalarda görülmesini sağlar."
    global.langDone = "BİTİR"
    //Main
    global.langSearchPhoto = "Bir fotoğraf ile arayın"
    global.langGender = "Cinsiyet"
    global.langFilters = "Filtreler"
    global.langSearch = "ARA"
    global.langAllGenders = "Tüm Cinsiyetler"
    global.langFilterMale = "Erkek"
    global.langFilterFemale = "Kadın"
    //Alerts
    global.langEmailNotVerified = "Bu e-posta henüz doğrulanmamış."
    global.langPlsTryAgain = "Lütfen Tekrar Deneyin."
    global.langWrongEmailPassword = "Yanlış e-posta veya şifre!"
    global.langVerificationSent = 'Doğrulama maili gönderildi.'
    global.langInvalidEmail = 'E-posta adresi geçerli değil.'
    global.langEmailAlready = 'Bu e-posta adresi zaten kullanılıyor.'
    global.langPlsEnterEmailUsername = 'Lütfen e-posta ve kullanıcı adı giriniz.'
    global.langPlsEnterUsername = 'Lütfen kullanıcı adınızı giriniz.'
    global.langPlsEnterEmail = 'Lütfen e-posta adresinizi giriniz.'
    global.langPasswordCharacter = 'Şifre en az 6 karakter barındırmalı.'
    global.langPasswordMatch = 'Şifreniz ve doğrulama şifreniz eşleşmiyor.'
    global.langPlsCheckEmail = 'Lütfen e-posta adresinizi kontrol edin.'
    global.langEmailNotRegistered = "Bu e-posta adresi kayıtlı değil."
    //Welcome photo
    global.welcomePhoto = 'hosgeldin'

  }
  else{
    //Splash
    global.langLogin = "Login"
    global.langForgotPassword = "Forgot Password?"
    global.langSignUp = "Sign Up"
    global.langEmail = "email"
    global.langPassword = "password"
    //Sign Up
    global.langUsername = "Username"
    global.langConfirmPassword = "Confirm Password"
    global.langCreate = "CREATE"
    //Forgot Password
    global.langSendEmail = "SEND EMAIL"
    //Country
    global.langCompleteYourProfile = "Complete Your Profile"
    global.langSelectCountry = "Please Select Your Country"
    global.langCountry = "Country"
    global.langNext = "NEXT"
    //Gender
    global.langSelectGender = "Please Select Your Gender."
    global.langMale = "MALE"
    global.langFemale = "FEMALE"
    //ProfileUpload
    global.langProfileScreen = "Please Upload a Profile Photo."
    global.langProfileAlert = "Please make sure to choose a photo that includes your face only. Your profile photo can be seen by other users."
    global.langGotIt = "GOT IT!"
    global.langTapHere = "Tap Here"
    global.langUploadPhoto = "Upload a Photo"
    global.langTakePhoto = "Camera"
    global.langLibrary = "Library"
    global.langCancel = "Cancel"
    //ImageUpload
    global.langImageUploadScreen = "Please Upload Four Photos."
    global.langImageAlert = "Please make sure to choose photos that include your face only. These photos will not be visible to any user.\nYour photos will be used to create a model of your profile. This model will allow your profile to appear in other users' search results."
    global.langDone = "DONE"
    //Main
    global.langSearchPhoto = "Search with a photo"
    global.langGender = "Gender"
    global.langFilters = "Filters"
    global.langSearch = "SEARCH"
    global.langAllGenders = "All Genders"
    global.langFilterMale = "Male"
    global.langFilterFemale = "Female"
    //Alerts
    global.langEmailNotVerified = "This email is not verified."
    global.langPlsTryAgain = "Please Try Again."
    global.langWrongEmailPassword = "Wrong email or password!"
    global.langVerificationSent = 'Verification email sent.'
    global.langInvalidEmail = 'The email address is invalid.'
    global.langEmailAlready = 'This email has already been registered.'
    global.langPlsEnterEmailUsername = 'Please enter your email and username.'
    global.langPlsEnterUsername = 'Please enter your username.'
    global.langPlsEnterEmail = 'Please enter your email.'
    global.langPasswordCharacter = 'Password must be at least 6 characters.'
    global.langPasswordMatch = 'Your password and confirmation password does not match.'
    global.langPlsCheckEmail = 'Please check your email...'
    global.langEmailNotRegistered = "This email is not registered."
    //Welcome photo
    global.welcomePhoto = 'welcome'

  }

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
function MyTabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false || state.index == 4) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', backgroundColor: global.isDarkMode ? global.darkModeColors[0] : 'rgba(188,192,204,0.5)' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
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
        const imgArray1 = ["home" + global.themeForImages, "msg" + global.themeForImages, "history" + global.themeForImages, "settings" + global.themeForImages ]
        const imgArray2 = ["homegray", "msggray", "historygray", "settingsgray" ]

        var widthArray = ["40%", "32%", "40%", "28%" ]
        var heightArray = ["70%", "56%", "56%", "49%" ]
        return (
          <TouchableOpacity
            key = {index}
            disabled = {isFocused ? true : false}
            activeOpacity = {0.8}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style = {{opacity: 0.8, alignItems: 'center', justifyContent: 'center', width: this.width/4, height: this.width/7}}
          >
            <Image
              style={{top: index == 3 ? '10%': '5%', position: 'absolute', width: widthArray[index], height: heightArray[index]}}
              source = {{uri: isFocused ? imgArray1[index] : imgArray2[index]}}>
            </Image>

            <Text style = {{bottom: '5%', position: 'absolute', color: isFocused ? global.themeColor : 'rgba(128,128,128,1)' , fontSize: 12*(this.width/360) }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}
      headerMode = {"none"}
      initialRouteName="Main"
      tabBarOptions={{
        activeTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
      />
      <Tab.Screen
        name="LibraryLicences"
        component={LibraryLicencesScreen}
      />
      <Tab.Screen
        name="DeleteOptions"
        component={DeleteOptionsScreen}
      />
      <Tab.Screen
        name="DisplayLicence"
        component={DisplayLicenceScreen}
      />
      <Tab.Screen
        name="FavoriteUsers"
        component={FavoriteUsersScreen}
      />
      <Tab.Screen
        name="BlockedUsers"
        component={BlockedUsersScreen}
      />
      <Tab.Screen
        name="ProfileFavUser"
        component={ProfileFavUserScreen}
      />
      <Tab.Screen
        name="ProfileBlockedUser"
        component={ProfileBlockedUserScreen}
      />
    </Tab.Navigator>
  );
}

  const Stack = createStackNavigator();
  Stack.navigationOptions = ({ navigation }) => {
    let tabBarVisible;
    tabBarVisible = false
    return {
      tabBarVisible
    };
  };
 function App({navigation}) {

    return (
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        headerMode = {"none"}>

        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Appp" component={Appp} />

        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Splash" component={SplashScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Tabs" component={MyTabs} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ThemeSettings" component={ThemeSettingsScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="NewAccount" component={NewAccountScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Profile" component={ProfileScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="DeleteOptions" component={DeleteOptionsScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ProfileFavUser" component={ProfileFavUserScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ProfileBlockedUser" component={ProfileBlockedUserScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Bio" component={BioScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Gender" component={GenderScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="Chat" component={ChatScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ProfileUpload" component={ProfileUploadScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="ImageUpload" component={ImageUploadScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="FavoriteUsers" component={FavoriteUsersScreen} />
        <Stack.Screen options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
        name="BlockedUsers" component={BlockedUsersScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    );
  }


export default App;
