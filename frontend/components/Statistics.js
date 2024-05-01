import React from 'react';
import { View, Text } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { StyleSheet } from 'react-native';

export default function Statistics({ percentages }) {
    const emotions = ['Happy', 'Sad', 'Angry', 'Surprise', 'Neutral'];
    const icons = ['emoticon-happy', 'emoticon-sad', 'emoticon-angry', 'emoticon-angry', 'emoticon-neutral']; // Replace with your actual icons

    return (
        <View style={styles.statsContainer}>
            {emotions.map((emotion, index) => (
                <Card key={index} containerStyle={styles.card}>
                    <View style={styles.cardContent}>
                        <Icon name={icons[index]} type='material-community' size={48} />
                        <Text style={styles.text}>{emotion}</Text>
                        <AnimatedCircularProgress
                            size={70} // can be changed
                            width={5} // can be changed
                            fill={percentages[index] * 100} // percentage
                            tintColor="#2854c3" // can be changed
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
            ))}
        </View>
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
    
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '95%',
    },
    card: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '100%',
        borderColor: '#2854C3',
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
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',

    },
    percentageText: {
        fontFamily: 'LatoMedium',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2854C3',
    },
});