import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import happyIcon from '../assets/icons/happy.png';
import sadIcon from '../assets/icons/sad.png';
import angryIcon from '../assets/icons/angry.png';
import surpriseIcon from '../assets/icons/surprised.png';
import neutralIcon from '../assets/icons/neutral.png';
const HistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const icons = {
        'surprise': surpriseIcon,
        'happy': happyIcon,
        'neutral': neutralIcon,
        'sad': sadIcon,
        'angry': angryIcon,

    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                let history = await AsyncStorage.getItem('history');
                if (history !== null) {
                    setHistory(JSON.parse(history));
                }
            } catch (error) {
                console.error('Error fetching data from local storage:', error);
            }
        };

        if (isFocused) {
            fetchHistory();
        }
    }, [isFocused]);

    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Storage successfully cleared!');
        } catch (e) {
            console.error('Failed to clear the async storage.');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, { flexDirection: 'column', justifyContent: 'space-between' }]} onPress={() => navigation.navigate('Statistics', item)}>
            <Image source={{ uri: item.filename }} style={styles.image} />
            <View style={{ alignSelf: 'flex-end', elevation: 25, position: 'absolute', bottom: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 10, padding: 5 }}>
                <Image source={icons[item.predicted_class]} style={styles.emotion} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}></Text>
                <TouchableOpacity onPress={clearStorage} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear History</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 15,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    emotion: {
        width: 50,
        height: 50,
        // elevation: 25,

    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    title: {
        fontSize: 20,
    },
    clearButton: {
        backgroundColor: '#f00',
        padding: 10,
        borderRadius: 5,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HistoryScreen;