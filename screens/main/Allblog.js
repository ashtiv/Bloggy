import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Modal, Button, SafeAreaView, StatusBar } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import ModalView from '../../components/ModalView'

import { globalStyles } from '../../utils/globalStyles'
import BlogCard2 from '../../components/BlogCard2'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux';


export default function Allblog({ navigation }) {
    const bb = useSelector((store) => store.count.curruser);
    useFocusEffect(() => {
        StatusBar.setHidden(false);
        return () => {
            StatusBar.setHidden(false);
        }
    });

    const [blogs, setBlogs] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedCardId, setSelectedCardId] = useState([])
    const [sortby, setsortby] = useState(1)

    async function getBlogData() {
        const citiesRef = firestore().collection('blogs');
        const snapshot = await citiesRef.get();
        var data = []
        snapshot.forEach(doc => {
            data.push({
                ...doc.data(),
                id: doc.id
            })
        });
        data.sort(compare)
        setBlogs(data)
    }
    function compare(a, b) {
        if (sortby == 1) {
            if (a.likedby.length < b.likedby.length) {
                return 1;
            }
            if (a.likedby.length > b.likedby.length) {
                return -1;
            }
            return 0;
        }
        else {
            if (a.comments.length < b.comments.length) {
                return 1;
            }
            if (a.comments.length > b.comments.length) {
                return -1;
            }
            return 0;
        }
    }
    useEffect(() => {
        getBlogData()
    })
    function sortby1() {
        console.log("sort by like")
        setsortby(1)
    }
    function sortby2() {
        console.log("sort by comment")
        setsortby(2)
    }
    function renderItem({ item }) {
        return (
            <BlogCard2
                blogData={item}
                moveToBlogScreen={moveToBlogScreen}
                onModalOpen={onModalOpen}
            />
        )
    }

    function onModalOpen(cardId) {
        setModalOpen(true)
        setSelectedCardId(cardId)
    }
    function onCloseModal() {
        setModalOpen(false)
        setSelectedCardId(null)
    }

    function moveToBlogScreen(blogData) {
        navigation.navigate('Blog', {
            blogData
        })
    }

    function onUpdateBlog() {
        navigation.navigate('CreateBlog', { id: selectedCardId })
        setSelectedCardId(null)
        setModalOpen(false)
    }
    function onDeleteBlog() {
        setModalOpen(false)
        firestore().collection('usersBlog')
            .doc(auth().currentUser.uid)
            .collection('blogs')
            .doc(selectedCardId)
            .delete()
            .catch((error) => console.log(error))
        setSelectedCardId(null)
    }

    return (

        <SafeAreaView style={globalStyles.primaryContainer}>
            <View style={{ margin: 7 }}>
                <Button title="Sort by like" onPress={sortby1} />
            </View>
            <View>
                <Button title="Sort by Comments" onPress={sortby2} />
            </View>
            <Modal
                visible={modalOpen}
                animationType='fade'
                transparent={true}
            >
                <ModalView
                    onCloseModal={onCloseModal}
                />
            </Modal>
            <View style={styles.header}>
                <Text style={globalStyles.headingText}>All Blogs</Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 180 }}>
                <FlatList
                    data={blogs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        </SafeAreaView>
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
    },
    comment: {
        backgroundColor: 'yellow'
    }
})