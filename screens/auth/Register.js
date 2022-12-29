import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'

import { globalStyles } from '../../utils/globalStyles'

export default function Register() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState()
    const [displayPicture, setDisplayPicture] = useState()
    const [hidePass, setHidePass] = useState(true);

    function onPickPicture() {
        launchImageLibrary({
            mediaType: 'photo',
        }, (data) => {
            if (data?.assets != undefined) {
                setDisplayPicture(data.assets[0].uri);
            }
            else setDisplayPicture(displayPicture);
        })
    }
    function onClickPicture() {
        launchCamera({
            mediaType: 'photo',
        }, (data) => {
            // console.log(data.assets[0].uri, " data")
            if (data?.assets != undefined) {
                // console.log("yessssss")
                setDisplayPicture(data.assets[0].uri);
            }
            else setDisplayPicture(displayPicture);
        })
    }

    async function onRegister() {
        if (!email && !password) {
            return
        }
        try {
            const { user: { uid } } = await auth().createUserWithEmailAndPassword(email, password)

            let downloadURL = null
            if (displayPicture) {
                const spiltPath = displayPicture.split('/')
                const imageName = spiltPath[spiltPath.length - 1]
                const reference = storage().ref(`${uid}/images/${imageName}`)
                const data = await reference.putFile(displayPicture)
                downloadURL = await storage().ref(data.metadata.fullPath).getDownloadURL()
            }
            else {
                downloadURL = "https://firebasestorage.googleapis.com/v0/b/blogapp-d3f10.appspot.com/o/Jjzt8MTbR5TLkVQ0cGtuEy1Wr9j1%2Fimages%2F22.png?alt=media&token=b1228a40-42f2-4e5b-a167-e30195876fe8"
            }

            firestore().collection('users')
                .doc(uid)
                .set({
                    email,
                    name,
                    displayPicture: downloadURL
                })
                .then(() => console.log('Done'))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: !displayPicture ? null : displayPicture }}
                style={styles.displayPicture}
            />
            <View style={styles.touchableContainer}>
                <TouchableOpacity onPress={onPickPicture}>
                    <Text>Pick Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClickPicture}>
                    <Text>Click Picture</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                value={name}
                placeholder='Name'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setName(text)}
            />

            <TextInput
                value={email}
                placeholder='Email'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                value={password}
                placeholder='Password'
                style={globalStyles.primaryInput}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={hidePass ? true : false} />
            <Icon style={{ marginBottom: 30 }} size={25} name={hidePass ? 'eye' : 'eye-slash'}
                onPress={() => setHidePass(!hidePass)} />

            <Button
                title='Register'
                onPress={onRegister}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1
    },
    touchableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%'
    },
    displayPicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',

    }
})