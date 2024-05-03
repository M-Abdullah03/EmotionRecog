import React from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';

const AboutScreen = () => {
    return (
        <ImageBackground source={require('../assets/favicon.png')} style={{ width: '100%', height: '100%' }}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>About This App</Text>
                    <Text style={styles.text}>
                        This is an app where you upload an image and it tries to guess your emotion.
                    </Text>
                    <Text style={styles.title}>Made By</Text>
                    <Text style={styles.text}>Muhammad Abdullah</Text>
                    <Text style={styles.text}>Muhammad Musa Haroon Satti</Text>
                    <Text style={styles.text}>Moiz Akhtar</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        color: '#fff',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        color: '#fff',
    },
});

export default AboutScreen;