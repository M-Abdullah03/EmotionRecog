// CameraComponent.js

import React from 'react';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/Ionicons'; // Replace with the actual icon library you're using
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { useContext } from 'react';
import ImageContext from '../contexts/ImageContext';
import { Modal, View, TouchableOpacity, Image, Text, StatusBar } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PacmanIndicator } from 'react-native-indicators';
const Camera = ({ props }) => {
    const { setImageUri } = useContext(ImageContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const handleImageSelection = (result) => {
        if (!result?.cancelled) {
            console.log(result.assets[0].uri);
            setSelectedImage(result.assets[0].uri);
            setImageUri(result.assets[0].uri);
            setModalVisible(true);
        }
    };


    const openCamera = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        handleImageSelection(result);
    };

    const openGallery = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        handleImageSelection(result);
    };

    const onUpload = async () => {
        setModalVisible(false);

        let data = new FormData();
        data.append('file', {
            uri: selectedImage,
            type: 'image/jpeg', // or 'image/png' if your image is a png
            name: 'test.jpg', // you can replace 'test' with the actual file name
        });

        try {
            let response = await fetch('http://10.0.2.2:8000/predict', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            let responseJson = await response.json();
            console.log(responseJson);

            if (response.ok) {
                console.log('Navigating to the next screen');

                // Create a new object with the class probabilities in the desired order
                let orderedClassProbabilities = {
                    "surprise": responseJson.class_probabilities.surprise,
                    "happy": responseJson.class_probabilities.happy,
                    "neutral": responseJson.class_probabilities.neutral,
                    "sad": responseJson.class_probabilities.sad,
                    "angry": responseJson.class_probabilities.angry
                };

                // Replace the class_probabilities in the response with the ordered object
                responseJson.class_probabilities = orderedClassProbabilities;
                responseJson.filename = selectedImage;

                try {
                    let history = await AsyncStorage.getItem('history');
                    if (history === null) {
                        history = [];
                    } else {
                        history = JSON.parse(history);
                    }

                    history.push(responseJson);
                    console.log('History:', history);
                    console.log('Response:', responseJson);

                    await AsyncStorage.setItem('history', JSON.stringify(history));
                    console.log('Data saved to local storage');
                } catch (error) {
                    console.error('Error saving data to local storage:', error);
                }



                navigation.navigate('Statistics', { ...responseJson });
            } else {
                console.log('Error:', responseJson.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (

        <>
            <ActionButton
                buttonColor="#3DC7BC"
                position="center"
                radius={80}
            >
                <ActionButton.Item
                    buttonColor='transparent'
                >
                    <Icon name="camera-outline" style={{ fontSize: 20, height: 22, color: 'transparent' }} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor='#3DC7BC'
                    title="Camera"
                    onPress={openCamera}
                >
                    <Icon name="camera-outline" style={{ fontSize: 20, height: 22, color: 'white' }} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor='#497DB1'
                    title="Images"
                    onPress={openGallery}
                >
                    <Icon name="images-outline" style={{ fontSize: 20, height: 22, color: 'white' }} />
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor='transparent'
                >
                    <Icon name="images-outline" style={{ fontSize: 20, height: 22, color: 'transparent' }} />
                </ActionButton.Item>
            </ActionButton>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={styles.imageView}>
                            <Image source={{ uri: selectedImage }} resizeMode="contain" style={styles.imagePreview} />
                        </View>
                        {isLoading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <PacmanIndicator
                                    color="#0000ff" />
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.uploadBtn} onPress={onUpload}>
                                <Text style={styles.uploadBtnText}>Upload</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            <StatusBar backgroundColor={modalVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent'} />
        </>
    );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add this line
    },
    cancelBtn: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 5,
    },
    uploadBtn: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#35A2CD',
        position: 'absolute',
        bottom: 50,

        borderRadius: 5,
        width: '100%',
    },
    btnText: {
        color: '#497DB1',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    uploadBtnText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalView: {
        width: '100%',
        height: screenHeight * 0.8, // 80% of screen height
        backgroundColor: "white",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5, // increased from 0.25 to 0.5
        shadowRadius: 6, // increased from 3.84 to 6
        elevation: 10, // increased from 5 to 10
    },
    imagePreview: {
        paddingTop: 20,
        marginBottom: 15,
        borderRadius: 20,
        width: '100%',
        height: '100%',
    },
    imageView: {
        marginTop: 50,
        width: '100%',
        alignItems: 'center',
        height: screenHeight * 0.5, // 60% of screen height
    },
});


export default Camera;