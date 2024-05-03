import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, Icon, Text } from 'react-native-elements';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AppLoading from 'expo-app-loading';
import Statistics from './components/Statistics';
import TabNavigator from './components/TabNavigator';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import ImageContext from './contexts/ImageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
export default function App() {

  const [appIsReady, setAppIsReady] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const percentages = [0.5, 0.2, 0.1, 0.1, 0.1]; // Replace with your actual percentages
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
        'RalewayMedium': require('./assets/fonts/Raleway.ttf'), // Replace with the path to your font file
      });
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    // <SafeAreaProvider>
    <ImageContext.Provider value={{ imageUri, setImageUri }}>

      <NavigationContainer theme={{ colors: { background: 'transparent' } }}>

        <View style={styles.container}>
          <LinearGradient colors={['#497DB1', '#3DC7BC']} style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.header}>
              <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode='contain' />
              {/* <Text style={styles.headerText}>EmoCheck</Text> */}
            </View>
          </LinearGradient>
          {/* <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} /> */}

          {/* <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <Text style={styles.statHeading}> Choose an image</Text>
          <Card containerStyle={styles.cardContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <View style={styles.buttonContent}>
                  <Icon name="camera" size={50} style={styles.icon} />
                </View>
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={styles.uploadButton} >
              <View style={styles.buttonContent}>
                <Icon name="upload" size={50} style={styles.icon} />
                <Text style={styles.buttonText}>Upload</Text>
              </View>
            </TouchableOpacity>
          </Card>
          <Text style={styles.statHeading}> Statistics</Text>
          <Statistics percentages={percentages} />
        </ScrollView> */}
          <TabNavigator />
          <StatusBar style="dark" />

        </View>


      </NavigationContainer>
    </ImageContext.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#fff',

    // alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    width: '100%',
    // padding: 20,
    paddingTop: 30,
  },
  logo: {
    // position: 'absolute',
    // top:25,
    // left: 1,
    height: 70,
    padding: 0,
    margin: 0,
    width: '90%',

    marginRight: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'RalewayMedium',
    fontWeight: 'bold'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#2854C4',
    borderWidth: 3,
    margin: 10,
    width: '45%',
    padding: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  uploadButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#2854C4',
    borderWidth: 3,
    margin: 10,
    width: '100%',
    padding: 10,
    // height: ,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,


  },
  buttonText: {
    marginLeft: 10,
    color: '#2854C4',
    fontSize: 20,
    fontFamily: 'RalewayMedium',
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '90%',
    backgroundColor: 'rgba(211, 211, 211, 0.7)',
    borderRadius: 20,
    // padding: 30,
    paddingLeft: 0,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 0,
    elevation: 0,
  },
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
  statHeading: {
    fontFamily: 'RalewayMedium',
    fontWeight: 'bold',
    fontSize: 30,
    color: '#2854C3',


  },

});