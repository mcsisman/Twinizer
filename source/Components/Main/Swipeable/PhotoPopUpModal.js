import React, {Component} from 'react';
import {createStackNavigator, Header} from 'react-navigation-stack';
import Modal from 'react-native-modal';
import BlockUserButton from '../../Common/FavBlockMsg/BlockUserButton';
import FavoriteUserButton from '../../Common/FavBlockMsg/FavoriteUserButton';
import SendMsgButton from '../../Common/FavBlockMsg/SendMsgButton';
import FavBlockModal from '../FavBlock/FavBlockModal';

import PropTypes from 'prop-types';
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
export default class PhotoPopUpModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onBackdropPress: PropTypes.func,
    username: PropTypes.string,
    bio: PropTypes.string,
    onPressCancel: PropTypes.func,
    imgSource: PropTypes.string,
    onPressSendMsg: PropTypes.func,
    onPressFav: PropTypes.func,
    onPressBlock: PropTypes.func,
    onPressImage: PropTypes.func,
    isFavorite: PropTypes.bool,
    isBlocked: PropTypes.bool,

    favBcancel: PropTypes.string,
    favBdialog: PropTypes.string,
    favBtickIsVisible: PropTypes.bool,
    favBonPressTick: PropTypes.func,
    favBisVisible: PropTypes.bool,
    favBimage: PropTypes.string,
    favBtxtAlert: PropTypes.string,
    favBonPressAdd: PropTypes.func,
    favBonPressClose: PropTypes.func,

    blockBcancel: PropTypes.string,
    blockBdialog: PropTypes.string,
    blockBtickIsVisible: PropTypes.bool,
    blockBonPressTick: PropTypes.func,
    blockBisVisible: PropTypes.bool,
    blockBimage: PropTypes.string,
    blockBtxtAlert: PropTypes.string,
    blockBonPressAdd: PropTypes.func,
    blockBonPressClose: PropTypes.func,
  };
  static defaultProps = {
    gotItFontSize: 15,
    alertFontSize: 15,
    animationInTiming: 500,
    animationOutTiming: 500,
    animationIn: 'zoomInUp',
    animationOut: 'zoomOutUp',
    backdropOpacity: 0.4,
    onPressImage: null,
    isFavorite: false,
    isBlocked: false,
  };
  render() {
    this.height = Math.round(Dimensions.get('screen').height);
    this.width = Math.round(Dimensions.get('screen').width);
    return (
      <Modal /*BÜYÜTÜLMÜŞ FOTOĞRAF MODALI*/
        style={{alignItems: 'center', justifyContent: 'center'}}
        backdropOpacity={0.4}
        coverScreen={false}
        deviceHeight={this.height}
        deviceWidth={this.width}
        hideModalContentWhileAnimating={true}
        onBackdropPress={this.props.onBackdropPress}
        animationIn="flipInY"
        animationOut="flipOutY"
        animationInTiming={750}
        animationOutTiming={750}
        isVisible={this.props.isVisible}>
        <View
          style={{
            borderBottomLeftRadius: 12,
            borderTopRightRadius: 12,
            borderColor: 'rgba(0,0,0,4)',
            borderTopLeftRadius: 12,
            borderBottomRightRadius: 12,
            backgroundColor: 'white',
            width: this.width * (8 / 10),
            flexDirection: 'column',
            paddingTop: 0,
            paddingBottom: 0,
          }}>
          <View
            style={{
              backgroundColor: global.isDarkMode
                ? global.darkModeColors[1]
                : 'rgba(242,242,242,1)',
              justifyContent: 'center',
              alignItems: 'center',
              width: this.width * (8 / 10),
              height: this.width * (8 / 10) * (1 / 6),
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
            <Text
              style={{
                fontFamily: global.fontFam,
                textAlign: 'center',
                color: global.themeColor,
                fontSize: this.width * (1 / 18),
              }}>
              {this.props.username}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                width: this.width * (2 / 15),
                height: this.width * (2 / 15),
                right: 0,
                position: 'absolute',
                top: 0,
              }}
              onPress={this.props.onPressCancel}>
              <Image
                source={{uri: 'cross' + global.themeForImages}}
                style={{
                  width: '40%',
                  height: '40%',
                  right: '30%',
                  bottom: '30%',
                  position: 'absolute',
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: global.isDarkMode
                ? global.darkModeColors[1]
                : 'rgba(242,242,242,1)',
            }}>
            <Text
              style={{
                fontStyle: 'italic',
                fontFamily: global.fontFam,
                textAlign: 'left',
                color: global.themeColor,
                fontSize: this.width * (1 / 25),
              }}>
              "{this.props.bio}"
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: this.width * (9 / 10),
              height: this.width * (8 / 10) * (7 / 6),
            }}
            onPress={this.props.onPressImage}>
            <Image
              source={{uri: this.props.imgSource}}
              style={{
                width: this.width * (8 / 10),
                height: this.width * (8 / 10) * (7 / 6),
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              opacity: 1,
              backgroundColor: global.isDarkMode
                ? global.darkModeColors[1]
                : 'rgba(242,242,242,1)',
              flexDirection: 'row',
              width: this.width * (8 / 10),
              height: this.width * (8 / 10) * (1 / 6),
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}>
            <FavoriteUserButton
              disabled={false}
              borderBottomLeftRadius={12}
              borderTopLeftRadius={0}
              isSelected={this.props.isFavorite}
              width={this.width * (8 / 30)}
              height={this.width * (8 / 10) * (1 / 6)}
              onPress={this.props.onPressFav}
              opacity={1}
            />
            <SendMsgButton
              disabled={false}
              width={this.width * (8 / 30)}
              height={this.width * (8 / 10) * (1 / 6)}
              onPress={this.props.onPressSendMsg}
              opacity={1}
            />
            <BlockUserButton
              disabled={false}
              borderBottomRightRadius={12}
              borderTopRightRadius={0}
              isSelected={this.props.isBlocked}
              width={this.width * (8 / 30)}
              height={this.width * (8 / 10) * (1 / 6)}
              onPress={this.props.onPressBlock}
              opacity={1}
            />
          </View>
        </View>

        <FavBlockModal
          cancel={this.props.favBcancel}
          dialog={this.props.favBdialog}
          tickIsVisible={this.props.favBtickIsVisible}
          onPressTick={this.props.favBonPressTick}
          isVisible={this.props.favBisVisible}
          image={this.props.favBimage}
          txtAlert={this.props.favBtxtAlert}
          onPressAdd={this.props.favBonPressAdd}
          onPressClose={this.props.favBonPressClose}
        />

        <FavBlockModal
          cancel={this.props.blockBcancel}
          dialog={this.props.blockBdialog}
          tickIsVisible={this.props.blockBtickIsVisible}
          onPressTick={this.props.blockBonPressTick}
          isVisible={this.props.blockBisVisible}
          image={this.props.blockBimage}
          txtAlert={this.props.blockBtxtAlert}
          onPressAdd={this.props.blockBonPressAdd}
          onPressClose={this.props.blockBonPressClose}
        />
      </Modal>
    );
  }
}

export * from './PhotoPopUpModal';
