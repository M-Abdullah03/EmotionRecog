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


export default function Statistics({ percentages }) {
    const emotions = ['Happy', 'Sad', 'Angry', 'Surprise', 'Neutral'];
    const icons = [happyIcon, sadIcon, angryIcon, surpriseIcon, neutralIcon];
    const iconBorderColors = ['#A1DE3A', '#fe7c1c', '#FF3814', '#22B527', '#FED41C'];
    const [appIsReady, setAppIsReady] = useState(false);
    useEffect(() => {
        async function prepare() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                // Preload fonts
                await loadFonts();
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        async function loadFonts() {
            await Font.loadAsync({
                'LatoMedium': require('../assets/fonts/Lato-Medium.ttf'), // Replace with the path to your font file
            });
            await SplashScreen.hideAsync();
        }

        prepare();
    }, []);
    return (
        <View style={styles.statsContainer}>
            {emotions.map((emotion, index) => (
                <Card key={index} containerStyle={{ borderColor: iconBorderColors[index], ...styles.card }}>

                    <View style={{ ...styles.cardContent }}>
                        {/* <Icon name={icons[index]} type='material-community' size={48} /> */}
                        <Image source={icons[index]} style={styles.logo} />

                        <Text style={styles.text}>{emotion}</Text>
                        <AnimatedCircularProgress
                            size={70} // can be changed
                            width={5} // can be changed
                            fill={percentages[index] * 100} // percentage
                            tintColor={iconBorderColors[index]} // can be changed
                            backgroundColor="#ededed" // can be changed
                        >
                            {(fill) => (
                                <Text style={styles.percentageText}>
                                    {Math.round(fill)}%
                                </Text>
                            )}
                        </AnimatedCircularProgress>
                    </View>
                </Card>
            ))
            }
        </View >
    );
}


const styles = StyleSheet.create({
    cardTitle: {
        color: '#2854C3',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'LatoMedium',
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        borderRadius: 50,
        borderWidth: 1.5,
        width: '90%',
        // borderColor: '#2854C3',
        flexDirection: 'row', // Add this
    },
    emoji: {
        fontSize: 30,
    },
    text: {
        fontFamily: 'LatoMedium',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
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
        fontFamily: 'LatoMedium',
        fontSize: 15,
        fontWeight: 'bold',

        // flex: 1,
    },
});