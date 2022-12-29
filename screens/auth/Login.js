import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, Button, } from 'react-native'
import auth from '@react-native-firebase/auth'
import { useSelector, useDispatch } from 'react-redux';
import { logindis } from '../../redux/actions/countAction';
import { globalStyles } from '../../utils/globalStyles'

export default function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState()
    const [displayPicture, setDisplayPicture] = useState()

    function onLogin() {
        auth().signInWithEmailAndPassword(email, password)
        dispatch({ type: 'LOGIN' })
    }

    return (
        <View style={styles.container}>

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
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />

            <Button
                title='Login'
                onPress={onLogin}
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
        backgroundColor: 'gray'
    }
})