import firebase from 'firebase';
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebaseSvc from './FirebaseSvc';
import MainScreen from './Main';
type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};

export default class ChatScreen extends React.Component<Props> {

  constructor(props) {
    super(props);

  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Scv Chat!',
  });

  state = {
    messages: [],
  };

  get user() {
    return {
      name: global.receiverMail,
      email: firebase.auth().currentUser.email,
      _id: firebaseSvc.uid,
      toWho: global.receiverMail,
      et: firebase.auth().currentUser.email + "" + global.receiverMail,
      te: global.receiverMail + "" + firebase.auth().currentUser.email
    };
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.user}
        loadEarlier = {true}
      />
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message => {if( (message.user.toWho == global.receiverMail && message.user.email == firebase.auth().currentUser.email) || (message.user.toWho == firebase.auth().currentUser.email && message.user.email == global.receiverMail)){
      this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
    }}

      );

  }
  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}
