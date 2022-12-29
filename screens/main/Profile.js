import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, Image, StatusBar, Dimensions, ScrollView, Button, View, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import auth from '@react-native-firebase/auth'
import { globalStyles } from '../../utils/globalStyles'
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'


const Tab = createMaterialTopTabNavigator()

export default function Profile({ navigation }) {
    useFocusEffect(() => {
        // This will run when component is `focused` or mounted.
        StatusBar.setHidden(false);

        // This will run when component is `blured` or unmounted.
        return () => {
            StatusBar.setHidden(false);
        }
    });
    const [userData, setUserData] = useState([])
    async function getUserData() {
        const user = await firestore().collection('users').doc(auth().currentUser.uid).get();
        const data = user._data;
        setUserData(data)
    }
    getUserData();
    function onLogout() {
        auth().signOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <SafeAreaView style={globalStyles.primaryContainer2}>
            {/* <ScrollView > */}
            <StatusBar hidden />
            <Image
                style={styles.image}
                source={{ uri: userData?.displayPicture }}
            />
            <Text
                style={{
                    ...globalStyles.headingText,
                    textAlign: 'center',
                    margin: 10
                }}
            >{userData?.name}</Text>
            <Text style={styles.content}>{userData?.email}</Text>
            <View style={styles.button}>
                <Button
                    title='Logout'
                    onPress={onLogout}
                />
            </View>

            {/* </ScrollView> */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('screen').width,
        height: 400,
        marginVertical: 20
    },
    content: {
        ...globalStyles.secondaryText,
        flex: 1,
        flexWrap: 'wrap',
        marginHorizontal: 10,
        textAlign: 'center'
    },
    button: {
        // position: 'absolute',
        marginVertical: 20,
        marginHorizontal: 30,
    }
})