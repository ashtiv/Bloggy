import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, StatusBar, Modal, Button, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import ModalView from '../../components/ModalView'

import { globalStyles } from '../../utils/globalStyles'
import BlogCard from '../../components/BlogCard'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Myblog from './Myblog'
import Allblog from './Allblog'
import Profile from './Profile'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';


const Tab = createMaterialTopTabNavigator()

export default function Home({ navigation }) {
    const dispatch = useDispatch();
    // const user = useSelector((store) => store.count.blogs);
    useFocusEffect(() => {
        // This will run when component is `focused` or mounted.
        StatusBar.setHidden(false);

        // This will run when component is `blured` or unmounted.
        return () => {
            StatusBar.setHidden(false);
        }
    });
    async function onAuthStateChanged(user) {
        if (user) {
            dispatch({
                type: "SET_USER",
                user: auth().currentUser,
            });
        }
        else {

        }
    }
    useEffect(() => {
        const subscribe = auth().onAuthStateChanged(onAuthStateChanged)
        return subscribe
    }, [])

    return (


        <Tab.Navigator initialRouteName='My blog' style={{ flex: 1 }}>
            <Tab.Screen name='My blog' component={Myblog} />
            <Tab.Screen name='All blog' component={Allblog} />
            <Tab.Screen name='Profile' component={Profile} />
        </Tab.Navigator>


    )
}

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    addIcon: {
        position: 'absolute',
        bottom: 20,
        left: '45%',
        zIndex: 1,
        elevation: 20,
    }
})