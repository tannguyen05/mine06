import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import {
  View,
  Text
} from 'react-native'

import fire from '../Fire';
// This import loads the firebase namespace along with all its type information.
import { firebase } from '@firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

export default class Chat extends React.Component {
  static navigationOptions = {
      title: ' Globe Chat!',
  };
  constructor(props){
    super(props);
    this.state = {
      messages: [],
    }
    // reference realtime database
    this.ref = firebase.database().ref();

    //currentUser
    this.currentUser = firebase.auth().currentUser || {};
  }

  loadMessage = () => {
    this.ref.child('Messages')
      .limitToLast(20)
      .on('child_added', (snapshot) => {
        const data = snapshot.val();
        const message = {
          _id: snapshot.key,
          text: data.text,
          createdAt: new Date(data.createdAt),
          user: {
            _id: data.user._id,
            name: data.user.name,
          }
        };
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        })
      )
    })
  }

  // send the globe message to the database
  send = message => {
    for (let i = 0; i < message.length; i++) {
      var now = new Date().getTime();
      this.ref.child("Messages").push({
        text: message[i].text,
        user: message[i].user,
        createdAt: now
      })
    }
  }

  get user() {
    return {
      _id: this.currentUser.uid,
      name: this.currentUser.displayName,
      email: this.currentUser.email
    };
  }

  componentDidMount() {
    this.loadMessage();
  }

  componentWillMount() {
    this.ref.child("Messages").off();
  }


  render() {
    return (
        <GiftedChat
          messages={this.state.messages}
          onSend={message => {
            this.send(message);
          }}
          user={this.user}
        />

    )
  }
}
