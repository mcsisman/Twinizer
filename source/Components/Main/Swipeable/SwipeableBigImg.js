import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

import {
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  Animated,
} from 'react-native';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);
var opacity = 0;
const adUnitId =
  Platform.OS === 'android'
    ? 'ca-app-pub-5851216250959661/4367546266'
    : 'ca-app-pub-5851216250959661/3449216268';
//const adUnitId = Platform.OS === 'android' ? 'ca-app-pub-5851216250959661/4367546266' : "ca-app-pub-5851216250959661/3449216268";

export default class SwipeableBigImg extends Component {
  static propTypes = {
    isFavorite: PropTypes.number,
    isBlocked: PropTypes.number,
    imgSource: PropTypes.string,
    width: PropTypes.object,
    height: PropTypes.object,
    top: PropTypes.object,
    right: PropTypes.number,
    onPress: PropTypes.func,
    backgroundOpacity: PropTypes.number,
    disabled: PropTypes.bool,
    showAd: PropTypes.bool,
    sadfaceOpacity: PropTypes.number,
  };

  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    var bannerHeight = Math.round((this.width / 2) * (7 / 6));
    var bannerWidth = Math.round(this.width / 2);
    var size = bannerWidth.toString() + 'x' + bannerHeight.toString();

    if (
      global.swipeCount % 6 == 0 &&
      global.swipeCount != 0 &&
      this.props.showAd
    ) {
      return (
        <Animated.View
          style={{
            opacity:
              global.isDarkMode && this.props.backgroundOpacity !== 0 ? 0.2 : 1,
            backgroundColor: 'rgba(244,92,66,0)',
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            right: this.props.right,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}>
          <BannerAd
            unitId={adUnitId}
            size={size}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => {
              //console.log('Advert loaded');
            }}
            onAdFailedToLoad={(error) => {
              console.error('Advert failed to load: ', error);
            }}
          />
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,

            elevation: 10,
            opacity:
              global.isDarkMode && this.props.backgroundOpacity !== 0 ? 0.2 : 1,
            backgroundColor: 'rgba(244,92,66,0)',
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            right: this.props.right,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              opacity: this.props.sadfaceOpacity,
              flex: 1,
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '56%',
                height: '70%',
              }}>
              <Image
                source={{uri: 'sadface' + global.themeForImages}}
                style={{width: '100%', height: '100%', opacity: 0.4}}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                opacity: 0.7,
                alignItems: 'center',
                width: '100%',
                height: '10%',
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                opacity: 0.7,
                alignItems: 'center',
                width: '100%',
                height: '20%',
              }}>
              <Text
                style={{
                  fontFamily: global.fontFam,
                  fontSize: (20 * this.width) / 360,
                  color: global.isDarkMode
                    ? global.darkModeColors[3]
                    : 'rgba(0,0,0,1)',
                }}>
                No results.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={this.props.disabled}
            activeOpacity={1}
            style={{
              width: '100%',
              height: '100%',
              borderBottomLeftRadius: 16,
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              borderBottomRightRadius: 16,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
            }}
            onPress={this.props.onPress}>
            <Image
              source={{
                uri:
                  this.props.backgroundOpacity === 0
                    ? this.props.imgSource
                    : 'ground',
              }}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                borderBottomLeftRadius: 16,
                borderTopRightRadius: 16,
                borderTopLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              opacity: this.props.isFavorite,
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              alignItems: 'center',
              width: '24%',
              height: '16%',
              backgroundColor: 'rgba(128,128,128,0.5)',
              borderTopLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
            onPress={this.props.onPress}
            disabled={this.props.disabled}>
            <Image
              source={{uri: 'star'}}
              style={{height: '50%', width: '40%'}}
            />
          </View>
          <View
            style={{
              opacity: this.props.isBlocked,
              justifyContent: 'center',
              position: 'absolute',
              alignItems: 'center',
              top: 0,
              left: '76%',
              width: '24%',
              height: '16%',
              backgroundColor: 'rgba(128,128,128,0.5)',
              borderTopRightRadius: 16,
              borderBottomLeftRadius: 16,
            }}
            onPress={this.props.onPress}
            disabled={this.props.disabled}>
            <Image
              source={{uri: 'block'}}
              style={{height: '50%', width: '40%'}}
            />
          </View>
        </Animated.View>
      );
    }
  }
}

export * from './SwipeableBigImg';
