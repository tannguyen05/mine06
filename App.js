/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Login from './screens/login';
import Signup from './screens/signup';
import Chat from './screens/chat';
import Home from './screens/home';
import ChatPrivate from './screens/chatPrivate';
import Profile from './screens/setting'
import {createStackNavigator, createAppContainer} from 'react-navigation';

import ignoreWarnings from 'react-native-ignore-warnings';
// hide warning 'Setting a timer for a long period of time, i.e. multiple minutes ' from real-time database
ignoreWarnings('Setting a timer');

const AppNavigator = createStackNavigator(
  {
    Login: Login,
    Chat: Chat,
    Signup: Signup,
    Home: Home,
    ChatPrivate: ChatPrivate,
    Setting: Profile
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);
