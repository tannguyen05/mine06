/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, TouchableHighlight} from 'react-native';
// This import loads the firebase namespace along with all its type information.
import { firebase } from '@firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
import {Fab, Icon, Thumbnail} from 'native-base';
import fire from '../Fire';
import { Button } from 'native-base';
import moment from 'moment';


export default class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Welcome to chat, ' + navigation.state.params.name.split(' ').slice(-1).join(' '),
      headerLeft: null,
      headerRight: (
          <TouchableOpacity onPress={()=>navigation.navigate("Setting")}>
            <Text style={{padding: 10, color: "rgb(66, 87, 195)"}}>Setting</Text>
          </TouchableOpacity>
      ),
    };
  };

  constructor(props){
    super(props);
    this.state = {
      friends: [],
      conversations: []
    }
    //reference realtime database
    this.ref = firebase.database().ref();
    //currentUser
    this.currentUser = firebase.auth().currentUser || {};
    console.log("currentUser: "+this.currentUser.uid)
  }

  //get list friends
  listFriends = () => {
    this.ref.child("friends")
    .on('value', (snapshot) => {
      let items = [];
      snapshot.forEach(child => {
        if (child.val().uid != this.currentUser.uid){
          items.push({
            name: child.val().name,
            uid: child.val().uid,
            email: child.val().email
          });
        }
      })
      this.setState({friends: items});
    })
  }

  // load conversations
  conversations = () => {
    this.ref.child('conversations').orderByChild('order')
    .on('value', (snapshot) => {
      var items = [];
      snapshot.forEach(child => {
        if(child.key.indexOf(this.currentUser.uid) != -1){
          items.push({
            key: child.key,
            message: child.val().lastMessage,
            createdAt: new Date(child.val().createdAt),
            sender: child.val().sender,
            receiver: child.val().receiver
          });
        }
      })
      this.setState({conversations: items})
    })
  }
  componentDidMount(){
    this.listFriends();
    this.conversations();
  }

  componentWillUnmount(){
    this.ref.child('friends').off();
    this.ref.child('conversations').off();
  }

  goRoom = () => {
    this.props.navigation.navigate("Chat");
  }

  goPrivateRoom = (user) => {
    this.props.navigation.navigate("ChatPrivate",{
      name: user.name,
      uid: user.uid
    });
  }

  signOut = ()=>{
    firebase.auth().signOut()
    .then(()=>{
      this.props.navigation.navigate('Login');
    })
  }


  render() {
    return (
      <View style={{flex: 1}}>
          <Button block onPress={this.signOut} style={{margin: 10, backgroundColor: 'rgb(148, 147, 140)'}}>
            <Icon name="logout" type="AntDesign"/>
          </Button>
          <View>
            <FlatList
              data={this.state.friends}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              renderItem={({item, index}) =>
                  <TouchableHighlight onPress={() => this.goPrivateRoom(item)} underlayColor='rgb(241, 235, 238)'>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{width: 50, height: 50, margin: 10, padding: 20, backgroundColor: 'rgb(202, 247, 216)', borderRadius: 25}}></View>
                        <Text>{item.name.split(' ').slice(-1).join(' ')}</Text>
                    </View>
                  </TouchableHighlight>
              }
              horizontal={true}
            />
          </View>
          <View>
            <FlatList
              data={this.state.conversations}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
              renderItem={({item, index}) => {
                  let obj = item.sender.uid == this.currentUser.uid ? {name: item.receiver.name, uid: item.receiver.uid} : {name: item.sender.name, uid: item.sender.uid};
                  return(
                  <TouchableHighlight onPress={() => this.goPrivateRoom(obj)} underlayColor='rgb(196, 227, 204)'
                    style={{margin: 5, padding: 10}}
                  >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View style={{flex: 1}}>
                        <Thumbnail source={{ uri: 'https://www.yourfirstpatient.com/assets/default-user-avatar-thumbnail@2x-ad6390912469759cda3106088905fa5bfbadc41532fbaa28237209b1aa976fc9.png' }} />
                      </View>
                      <View style={{flex: 5, justifyContent: 'center', paddingLeft: 10}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{obj.name}</Text>
                        <Text>{item.sender.uid == this.currentUser.uid ? "you: " + item.message : item.message}</Text>
                      </View>
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 12}}>{moment(moment.utc(item.createdAt).toDate()).local().format('DD/MM/YYYY HH:mm')}</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                  )
                }
              }

            />
          </View>
          <Fab
            position="bottomRight"
            style={{ backgroundColor: '#5067FF' }}
            onPress={this.goRoom}>
            <Icon name="globe" />
          </Fab>

      </View>
    );
  }
}
