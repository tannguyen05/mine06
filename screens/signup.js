/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import fire from '../Fire';
import { Container, Header, Content, Form, Item, Input, Label, Button, Spinner} from 'native-base';

import { firebase } from '@firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';


export default class Signup extends Component {
  static navigationOptions = {
    title: 'Register'
  }
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      name: '',
      email: '',
      password: ''
    }
    // reference realtime database
    this.ref = firebase.database().ref();
  }
  // add sign method to handle user press Login button
  onPressSignup = () => {
    this.setState({loading: true});
    // create new user with email and password
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(()=>{
      const currentUser = firebase.auth().currentUser || {};
      console.log( "currentUser: "+currentUser.uid);
      currentUser.updateProfile({displayName: this.state.name})
      .then(()=>{
        this.signupSuccess();
        // add user to friend list
        const friend = {
          name: this.state.name,
          uid: currentUser.uid,
          email: currentUser.email
        }
        this.ref.child('friends').push(friend);
      }).catch((err)=>{
        console.log(err.message);
      })
    }).catch((err)=>{
      this.setState({loading: false})
      alert(err.message);
    })
  };

  signupSuccess = () => {
    alert("sign up successfull!");
    this.setState({loading: false});
    this.props.navigation.navigate('Login', {
      email: this.state.email, password: this.state.password
    });
  }


  render() {
    return (
      <Container style={{flex: 1, flexDirection:'column', justifyContents: 'center'}}>
            {this.state.loading ? <Spinner /> : null}
            <Form>
              <Item floatingLabel>
                <Label>Name</Label>
                <Input
                  onChangeText={(name) => this.setState({name})}
                  value={this.state.name}
                />
              </Item>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input
                  onChangeText={(email) => this.setState({email})}
                  value={this.state.email}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Password</Label>
                <Input
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                  secureTextEntry = {true}
                />
              </Item>
            </Form>
            <Button block onPress={this.onPressSignup} style={{margin: 10}}>
              <Text style={{color: 'rgb(250, 246, 245)'}}>Signup</Text>
            </Button>

      </Container>
    );
  }
}
