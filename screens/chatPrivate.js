import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput
} from "react-native";

import { GiftedChat } from "react-native-gifted-chat";
import { firebase } from '@firebase/app';
import fire from '../Fire';
// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';

export default class ChatPrivate extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    //currentUser
    this.currentUser = firebase.auth().currentUser || {};
    console.log("User:" + this.currentUser.uid);

    // friend
    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    console.log("User friend:" + uid);
    //reference realtime database
    this.ref = firebase.database().ref();
    this.chatRef = this.ref.child("chat/" + this.generateChatId());
    this.conversations = this.ref.child("conversations/" + this.generateChatId());
  }

  //generate ChatId works cause when you are the user sending chat you take user.uid and your friend takes uid

  generateChatId() {
    if (this.currentUser.uid > uid) return `${this.currentUser.uid}-${uid}`;
    else return `${uid}-${this.currentUser.uid}`;
  }

  loadMessage = () => {
    this.chatRef.limitToLast(20).on('child_added', snapshot => {
      const data = snapshot.val();
      const message = {
        _id: snapshot.key,
        text: data.text,
        createdAt: new Date(data.createdAt),
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      };
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
        })
      )
    })
  }

  componentDidMount() {
    this.loadMessage();
  }

  componentWillUnmount() {
    this.chatRef.off();
  }

  onSend(messages = []) {
    messages.forEach(message => {
      //var message = message[0];
      let now = new Date().getTime();
      
      this.chatRef.push({
        text: message.text,
        createdAt: now,
        user: message.user,
        fuid: uid,
        fname: name,
      }).then(()=>{
        this.conversations.set({
          lastMessage: message.text,
          createdAt: now,
          order: -1*now,
          sender: {
            uid: message.user._id,
            name: message.user.name,
          },
          receiver: {
            uid: uid,
            name: name,
          }
        })
      })
    });
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.currentUser.uid,
          name: this.currentUser.displayName
        }}
      />
    );
  }
}
