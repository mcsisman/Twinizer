import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import language from '../../../Utils/Languages/lang.json';
import BlockUserButton from '../../Common/FavBlockMsg/BlockUserButton';
import FavoriteUserButton from '../../Common/FavBlockMsg/FavoriteUserButton';
import SendMsgButton from '../../Common/FavBlockMsg/SendMsgButton';
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
} from 'react-native';

if (Platform.OS === 'android') {
  var headerHeight = Header.HEIGHT;
}
if (Platform.OS === 'ios') {
  var headerHeight = Header.HEIGHT;
}
var screenHeight = Math.round(Dimensions.get('screen').height);
var screenWidth = Math.round(Dimensions.get('screen').width);

const adUnitId =
  Platform.OS === 'android'
    ? 'ca-app-pub-5851216250959661/4367546266'
    : 'ca-app-pub-5851216250959661/3449216268';

export default class CarouselItem extends Component {
  static propTypes = {
    index: PropTypes.number,
    image: PropTypes.string,
    onPressSendMsg: PropTypes.func,
    onPressFav: PropTypes.func,
    onPressBlock: PropTypes.func,
    isFavorite: PropTypes.array,
    isBlocked: PropTypes.array,
    country: PropTypes.string,
    username: PropTypes.string,
    onPressImage: PropTypes.func,
  };
  static defaultProps = {};
  render() {
    var lang = language[global.lang];
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);

    var bannerHeight = Math.round((this.width / 2) * (8.25 / 6));
    var bannerWidth = Math.round(this.width / 2);
    var size = bannerWidth.toString() + 'x' + bannerHeight.toString();

    return (
      <View
        style={{
          aspectRatio: 6 / 10,
          width: (this.width * 5) / 10,
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          backgroundColor: global.isDarkMode
            ? 'rgba(0,0,0,0.1)'
            : 'rgba(255,255,255,1)',
          elevation: 6,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 5,
        }}>
        <View
          style={{
            flex: 1.75,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                color: global.isDarkMode ? 'white' : '#333333',
                fontSize: (this.width / 360) * 15,
              }}>
              {this.props.username}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                color: global.isDarkMode ? 'white' : '#333333',
                fontSize: (this.width / 360) * 13,
              }}>
              {this.props.country}
            </Text>
          </View>
        </View>
        {this.props.username != lang.Advertisement && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.props.onPressImage}
            style={{
              flex: 7,
            }}>
            <Image source={{uri: this.props.image}} style={{flex: 1}} />
          </TouchableOpacity>
        )}

        {this.props.username == lang.Advertisement && (
          <View
            style={{
              opacity:
                global.isDarkMode && this.props.backgroundOpacity !== 0
                  ? 0.2
                  : 1,
              backgroundColor: 'rgba(244,92,66,0)',
              flex: 7,
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
          </View>
        )}
        <View
          style={{
            flex: 1.25,
            flexDirection: 'row',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          {this.props.username != lang.Advertisement && (
            <FavoriteUserButton
              disabled={false}
              borderBottomLeftRadius={8}
              borderTopLeftRadius={0}
              isSelected={this.props.isFavorite[this.props.index]}
              onPress={this.props.onPressFav}
              opacity={1}
            />
          )}
          {this.props.username != lang.Advertisement && (
            <SendMsgButton
              disabled={false}
              onPress={this.props.onPressSendMsg}
              opacity={1}
            />
          )}
          {this.props.username != lang.Advertisement && (
            <BlockUserButton
              disabled={false}
              borderBottomRightRadius={8}
              borderTopRightRadius={0}
              isSelected={this.props.isBlocked[this.props.index]}
              onPress={this.props.onPressBlock}
              opacity={1}
            />
          )}
        </View>
      </View>
    );
  }
}

export * from './CarouselItem';
