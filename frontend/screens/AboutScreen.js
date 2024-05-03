import React from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';

import { Card } from 'react-native-elements';

const AboutScreen = () => {
    return (
        <View style={styles.overlay}>
            <Card containerStyle={{ borderRadius: 10, elevation: 15 }}>
                <Card.Title style={styles.title}>About This App</Card.Title>
                <Card.Divider />
                <Text style={styles.text}>
                    EmoCheck is a cutting-edge emotion recognition application that empowers users to explore their inner emotional landscape.
                </Text>
                <Card.Title style={styles.title}>How It Works</Card.Title>
                <Card.Divider />
                <Text style={styles.text}>
                    EmoCheck uses advanced machine learning algorithms to analyze facial expressions in real-time. Simply take a selfie or upload a photo, and EmoCheck will provide you with a detailed breakdown of your emotions.
                </Text>
                <Card.Title style={styles.title}>Made By</Card.Title>
                <Card.Divider />
                <Text style={styles.text}>Muhammad Abdullah</Text>
                <Text style={styles.text}>Muhammad Musa Haroon Satti</Text>
                <Text style={styles.text}>Moiz Akhtar</Text>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        // backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: '#000',
    },
});

export default AboutScreen;