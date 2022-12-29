import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, Image, Button, StatusBar, Dimensions, ScrollView, View, Modal, FlatList, SafeAreaView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import ModalView from '../../components/ModalView'

import { globalStyles } from '../../utils/globalStyles'
import BlogCard from '../../components/BlogCard'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux';


export default function Myblog({ navigation }) {

    const bb = useSelector((store) => store.count.curruser);
    useFocusEffect(() => {
        // This will run when component is `focused` or mounted.
        StatusBar.setHidden(false);

        // This will run when component is `blured` or unmounted.
        return () => {
            StatusBar.setHidden(false);
        }
    });
    const [blogs, setBlogs] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedCardId, setSelectedCardId] = useState([])
    const [sortby, setsortby] = useState(1)

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
    async function getdata() {
        const citiesRef = firestore().collection('blogs');
        const snapshot = await citiesRef.get();
        var data = []
        snapshot.forEach(doc => {
            if (doc.data().userid == bb?.uid) {
                data.push({
                    ...doc.data(),
                    id: doc.id
                })
            }
        });
        data.sort(compare)
        setBlogs(data)
    }
    useEffect(() => {
        getdata()
    })
    // useEffect(() => {
    //     getdata()
    // })

    function renderItem({ item }) {
        return (
            <BlogCard
                blogData={item}
                moveToBlogScreen={moveToBlogScreen}
                onModalOpen={onModalOpen}
            />
        )
    }
    function sortby1() {
        console.log("sort by like")
        setsortby(1)
    }
    function sortby2() {
        console.log("sort by comment")
        setsortby(2)
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
        // setSelectedCardId(null)
        setModalOpen(false)
    }
    function onDeleteBlog() {
        setModalOpen(false)
        firestore().collection('blogs')
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
            <View style={styles.comment}>
                <Button title="Sort by Comments" onPress={sortby2} />
            </View>
            <Modal
                visible={modalOpen}
                animationType='fade'
                transparent={true}
            >
                <ModalView
                    onPressHandlers={{
                        onUpdateBlog,
                        onDeleteBlog,
                        onCloseModal
                    }}
                    onCloseModal={onCloseModal}
                />
            </Modal>
            <View style={styles.header}>
                <Text style={globalStyles.headingText}>My Blogs</Text>
            </View>
            <View style={styles.addIcon}>
                <Ionicons
                    name='add-circle-sharp'
                    size={54}
                    color='black'
                    onPress={() => navigation.navigate('CreateBlog')}
                />
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
        marginVertical: 10,
    },
    addIcon: {
        position: 'absolute',
        bottom: 20,
        left: '45%',
        zIndex: 1,
        elevation: 20,
    },

})