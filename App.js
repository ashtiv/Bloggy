/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './screens/auth/Login'
import Register from './screens/auth/Register'
import Home from './screens/main/Home'
import CreateBlog from './screens/main/CreateBlog'
import Blog from './screens/main/Blog'
import Comments from './screens/main/Comments'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  async function onAuthStateChanged(user) {
    if (user) {
      setLoggedIn(true)
    }
    else {
      setLoggedIn(false)
    }
    if (loading) setLoading(false)
  }
  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(onAuthStateChanged)
    return subscribe
  }, [])


  if (loading) {
    return (
      <ActivityIndicator
        size={32}
        color='gray'
      />
    )
  }
  StatusBar.setHidden(false);
  if (!loggedIn) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Login'>
            <Tab.Screen name='Login' component={Login} />
            <Tab.Screen name='Register' component={Register} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>

    );
  }
  return (
    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='CreateBlog' component={CreateBlog} />
          <Stack.Screen name='Blog' component={Blog} />
          <Stack.Screen name='Comments' component={Comments} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

