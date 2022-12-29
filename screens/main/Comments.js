// import React from 'react'
import { FirebaseStorageTypes } from '@react-native-firebase/storage'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, ListItem, StyleSheet, FlatList, Image, StatusBar, Dimensions, ScrollView, TextInput, ListView } from 'react-native'
import auth from '@react-native-firebase/auth'

import { globalStyles } from '../../utils/globalStyles'
import firestore from '@react-native-firebase/firestore'
import BlogCard2 from '../../components/BlogCard2'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';


export default function Comments({ route, navigation }) {
    const bb = useSelector((store) => store.count.curruser);
    var id = route.params.id
    // const [comms, setcomms] = useState([])
    const [comms, setcomms] = useState([])
    const [comval, setcomval] = useState("")
    const [name, setname] = useState("")
    const renderItem = ({ item }) => (
        <Item title={item.value} />
    );

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
    var likedby = [];
    useEffect(() => {
        var docRef = firestore().collection("blogs").doc(id);
        docRef.get().then((doc) => {
            likedby = doc.data().comments
            setcomms(likedby)
        })
        docRef = firestore().collection("users").doc(bb.uid);
        docRef.get().then((doc) => {
            setname(doc.data().name)
        })
    }, [])
    function compic() {
        var data = comms
        var a1 = Math.floor(100000 + Math.random() * 900000)
        var a2 = Math.floor(100000 + Math.random() * 900000)
        data.push({ id: a2 + name + " : " + comval + a1, value: name + " : " + comval })
        firestore().collection('blogs')
            .doc(id)
            .update({
                comments: data
            }).then(() => {
                navigation.navigate('Comments', { id })
            }).then(() => {
                setcomval("")
            })
    }
    return (
        <SafeAreaView style={globalStyles.primaryContainer}>
            <View style={{ padding: 5 }}>
                <Text style={globalStyles.headingText}>Comments</Text>
            </View>
            <FlatList
                data={comms}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={2}
                    value={comval}
                    onChangeText={(text) => setcomval(text)}
                />
            </View>

            <View style={styles.comment}>
                <Button title="Comment" onPress={compic} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('screen').width,
        height: 200
    },
    content: {
        ...globalStyles.secondaryText,
        flex: 1,
        flexWrap: 'wrap',
        marginHorizontal: 10
    },
    comment: {
        width: 200,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
        marginBottom: 7
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderBottomColor: 'black',
        borderstyle: 'solid',
        borderBottomWidth: 5,
        borderRadius: 10,
        width: 3.2 * Dimensions.get('screen').width / 4
    },
    title: {
        fontSize: 17,
        borderColor: 'black',
        borderStyle: 'solid'
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 4,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 16,
        width: Dimensions.get('screen').width - 10

    }
})