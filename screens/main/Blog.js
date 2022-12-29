// import React from 'react'
import { FirebaseStorageTypes } from '@react-native-firebase/storage'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, StyleSheet, Image, StatusBar, Dimensions, ScrollView } from 'react-native'
import auth from '@react-native-firebase/auth'

import { globalStyles } from '../../utils/globalStyles'
import firestore from '@react-native-firebase/firestore'


export default function Blog({ route, navigation }) {

    var { id, title, content, coverImage } = route.params.blogData
    const [isliked, setisliked] = useState("Like")
    var likedby = []
    useEffect(() => {
        var docRef = firestore().collection("blogs").doc(id);
        docRef.get().then((doc) => {
            likedby = doc.data().likedby
            var ff = 1
            likedby.map((uu) => {
                if (uu == auth().currentUser.uid) {
                    ff = 0;
                    setisliked("Liked" + " (" + likedby.length + ")")
                }
            })
            if (ff) {
                setisliked("Like" + " (" + likedby.length + ")")
            }
        })
    })
    function likePost() {
        console.log(likedby, " sbsepehlaaa")
        if (isliked == "Like" + " (" + likedby.length + ")") {
            likedby.push(auth().currentUser.uid)
            firestore().collection('blogs')
                .doc(id)
                .update({
                    likedby: likedby
                }).then(() => {
                    var blogData = {};
                    blogData.id = id;
                    blogData.title = title;
                    blogData.content = content;
                    blogData.coverImage = coverImage;
                    navigation.navigate('Blog', { blogData })
                })
            // setisliked("Liked" + " (" + likedby.length + ")")

        }
        else {
            likedby = likedby.filter(function (item) {
                return item != auth().currentUser.uid
            })
            firestore().collection('blogs')
                .doc(id)
                .update({
                    likedby: likedby
                }).then(() => {
                    var blogData = {};
                    blogData.id = id;
                    blogData.title = title;
                    blogData.content = content;
                    blogData.coverImage = coverImage;
                    navigation.navigate('Blog', { blogData })
                })
            // setisliked("Like" + " (" + likedby.length + ")")

        }
    }
    function gotoComments() {
        navigation.navigate('Comments', { id })
    }

    return (
        <ScrollView style={globalStyles.primaryContainer2}>
            <StatusBar />
            {
                coverImage ?
                    <Image
                        style={styles.image}
                        source={{ uri: coverImage }}
                    />
                    : null
            }
            <Text
                style={{
                    ...globalStyles.headingText,
                    textAlign: 'center',
                    margin: 10
                }}
            >{title}</Text>
            <View style={styles.like}>
                <Button title={isliked} color="green" onPress={likePost} />
            </View>
            <View style={styles.like}>
                <Button title="Comments" onPress={gotoComments} />
            </View>
            <Text style={styles.content}>{content}</Text>
        </ScrollView>
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
    like: {
        width: 200,
        paddingLeft: 20
    }
})