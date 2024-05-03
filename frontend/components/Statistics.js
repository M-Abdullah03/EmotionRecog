import React from 'react';
import { View, Text } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

import happyIcon from '../assets/icons/happy.png';
import sadIcon from '../assets/icons/sad.png';
import angryIcon from '../assets/icons/angry.png';
import surpriseIcon from '../assets/icons/surprised.png';
import neutralIcon from '../assets/icons/neutral.png';
import TabNavigator from './TabNavigator';
import { ScrollView } from 'react-native';


export default function Statistics({ route }) {
    const emotions = ['Surprised', 'Happy', 'Neutral', 'Sad', 'Angry'];
    const icons = [surpriseIcon, happyIcon, neutralIcon, sadIcon, angryIcon];
    const iconBorderColors = ['#22B527', '#A1DE3A', '#FED41C', '#fe7c1c', '#FF3814'];
    const [appIsReady, setAppIsReady] = useState(false);
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Preload fonts
                await loadFonts();
                // Parse route params
                const { filename, date, predicted_class, class_probabilities } = route.params;
                console.log(route.params);
                const image = `${filename}`;
                const emotion = predicted_class[0].toUpperCase() + predicted_class.slice(1);
                const percentages = Object.values(class_probabilities).map(prob => prob * 100);
                setImageData({ image, date, emotion, percentages });
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        async function loadFonts() {
            await Font.loadAsync({
                'RalewayMedium': require('../assets/fonts/Raleway.ttf'), // Replace with the path to your font file
            });
            await SplashScreen.hideAsync();
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return null;
    }


    return (
        <ScrollView contentContainerStyle={styles.statsContainer}>
            <Card containerStyle={styles.topCard}>
                <View style={styles.topCardContent}>
                    <View style={styles.imageView}>
                        <Image source={{ uri: imageData.image }} style={styles.image} resizeMode='contain' />
                    </View>
                    <View>
                        <Text style={styles.dateText}>{imageData.date}</Text>
                        <Text style={styles.emotionText}>State: {imageData.emotion}</Text>
                    </View>
                </View>
            </Card>
            {emotions.map((emotion, index) => (
                <Card key={index} containerStyle={{ borderColor: iconBorderColors[index], ...styles.card }}>
                    <View style={{ ...styles.cardContent }}>
                        <Image source={icons[index]} style={styles.logo} />
                        <Text style={styles.text}>{emotion}</Text>
                        <AnimatedCircularProgress
                            size={50}
                            width={5}
                            fill={imageData.percentages[index]}
                            tintColor={iconBorderColors[index]}
                            backgroundColor="#ededed"
                        >
                            {(fill) => (
                                <Text style={styles.percentageText}>
                                    {Math.round(fill)}%
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>
                </Card>
            ))}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    cardTitle: {
        color: '#2854C3',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'RalewayMedium',
        textAlign: 'left',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    icon: {
        marginRight: 10, // Add this
        color: '#2854C3'
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    statsContainer: {
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'white',
        // flex: 1,
    },
    card: {
        display: 'flex',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: 70,
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: 1.5,
        margin: 12,
        marginLeft: 20,
        // paddingBottom: 20,
        width: '90%',
        flexDirection: 'row', // Add this
    },
    emoji: {
        fontSize: 30,
    },
    text: {
        fontFamily: 'RalewayMedium',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        // flex: 1,
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        flex: 1,

    },
    percentageText: {
        fontFamily: 'RalewayMedium',
        fontSize: 15,
        fontWeight: 'bold',

        // flex: 1,
    },
    topCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 15,
        borderRadius: 10,
    },
    topCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emotionText: {
        fontSize: 14,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    imageView: {
        marginRight: 10,
        width: 100,
        height: 100,
    },
});