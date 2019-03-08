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

export default class Login extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      email: 'test@gmail.com',
      password: '12345aA',
      name: ''
    }
  }
  // this method method handle user press Login button
  onPressLogin = () => {
    this.setState({loading: true});
    // log in firebase with email and password
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(()=>{
      let user = firebase.auth().currentUser || {};
      this.loginSuccess(user);
    }).catch((err)=>{
      alert(err.message);
    })
  };

  loginSuccess = (user) => {
    this.setState({loading: false, name: user.displayName == undefined ? "you to chat" : user.displayName})
    this.props.navigation.navigate('Home', {name: this.state.name});
  };

  goSignUp = ()=>{
    this.props.navigation.navigate('Signup');
  }

  render() {
    return (
      <Container style={{flex: 1, flexDirection:'column', justifyContents: 'center'}}>
            {this.state.loading ? <Spinner /> : null}
            <Form>
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
            <Button block onPress={this.onPressLogin} style={{margin: 10}}>
              <Text style={{color: 'rgb(250, 246, 245)'}}>Login</Text>
            </Button>
            <Button block onPress={this.goSignUp} style={{margin: 10, backgroundColor: 'rgb(68, 170, 227)'}}>
              <Text style={{color: 'rgb(250, 246, 245)'}}>Signup</Text>
            </Button>

      </Container>
    );
  }
}
