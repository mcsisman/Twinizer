import React, {Component} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, navigation } from '@react-navigation/native';
import * as firebase from "firebase";
import 'firebase/firestore';
import { fromRight, zoomIn, zoomOut, flipX, flipY, fromBottom } from 'react-navigation-transitions'
import {decode, encode} from 'base-64'
import * as RNLocalize from "react-native-localize";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
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
import SettingsScreen from './screens/Settings';
import ThemeSettingsScreen from './screens/ThemeSettings';
import ProfileScreen from './screens/Profile';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

var firebaseConfig = {
  apiKey: "AIzaSyCA_BGwxwWUMeKmJA_zl2br9Cdg2C_6k0c",
  authDomain: "twinizer-atc.firebaseapp.com",
  databaseURL: "https://twinizer-atc.firebaseio.com",
  projectId: "twinizer-atc",
  storageBucket: "twinizer-atc.appspot.com",
  messagingSenderId: "507482022642",
  appId: "1:507482022642:web:8ad756e90c9fe4171de66b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var user = firebase.auth().currentUser;

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
    global.langImageAlert = "Lütfen sadece sizin yüzünüzün olduğu bir fotoğraf yükleyin. Bu fotoğraflar sadece mesaj isteği gönderdiğiniz kişiler tarafından görüntülenebilir.\nFotoğraflarınız profilinizin modelini oluşturmak için kullanılacaktır. Bu model, profilinizin diğer kullanıcıların yaptığı aramalarda görülmesini sağlar."
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
    global.langImageAlert = "Please make sure to choose photos that include your face only. These photos will only be visible to the users that you send a message requests to.\nYour photos will be used to create a model of your profile. This model will allow your profile to appear in other users' search results."
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

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(188,192,204,0.5)' }}>
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
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const imgArray1 = ["homered", "msgred", "historyred", "settingsred" ]
        const imgArray2 = ["homegray", "msggray", "historygray", "settingsgray" ]

        var widthArray = ["40%", "32%", "40%", "28%" ]
        var heightArray = ["70%", "56%", "56%", "49%" ]
        return (
          <TouchableOpacity
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

            <Text style = {{bottom: '5%', position: 'absolute', color: isFocused ? 'rgba(241,51,18,1)' : 'rgba(128,128,128,1)' , fontSize: 12*(this.width/360) }}>
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
      <NavigationContainer>
      <Stack.Navigator
        headerMode = {"none"}>

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
      </Stack.Navigator>
      </NavigationContainer>
    );
  }


export default App;
