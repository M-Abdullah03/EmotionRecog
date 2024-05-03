import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';
// import RadialMenu from 'react-native-radial-menu';
// import PieMenu, {Slice as PieSlice} from 'react-pie-menu';
import ActionButton from 'react-native-circular-action-menu';
import Camera from './Camera';
import { LogBox } from 'react-native';
import AboutScreen from '../screens/AboutScreen';
import { useNavigation } from '@react-navigation/native';

LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

// import { AboutScreen, CameraScreen, HistoryScreen } from './screens'; // Import your screen components
import { createStackNavigator } from '@react-navigation/stack';
import Statistics from './Statistics';

// Create a new StackNavigator
const CameraStack = createStackNavigator();

// Define the StackNavigator
const CameraStackNavigator = () => (
    <CameraStack.Navigator>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <CameraStack.Screen name="Statistics" component={Statistics} />
    </CameraStack.Navigator>
);

function CameraScreen() {
    return (
        <View>
            <Text>Camera</Text>
        </View>
    );
}

function HistoryScreen() {
    return (
        <View>
            <Text>History fdgsdgdfsgdsdsfgfgsdf</Text>
        </View>
    );
}
const Tab = createBottomTabNavigator();

export default function TabNavigator( ) {
    return (
        // <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent', paddingBottom: 70 }}>
        // <View style={{ width: '80%', backgroundColor: 'transparent' }}>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'About') {
                        iconName = focused ? 'information-circle' : 'information-circle-outline';
                    } else if (route.name === 'Camera') {
                        iconName = focused ? 'camera' : 'camera-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    }

                    return <Icon name={iconName} size={30} color={color} />;
                },
                tabBarActiveTintColor: '#497DB1',
                tabBarInactiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: 'white', // This makes the tab bar transparent
                    borderRadius: 25,
                    elevation: 10,
                    zIndex: 10,
                    position: 'absolute',
                    left: '10%',
                    right: '10%',
                    bottom: 30,
                },
                sceneContainerStyle: {
                    backgroundColor: 'transparent',
                },
                tabBarLabel: () => null,
                headerShown: false,
            })}
        >
            <Tab.Screen name="About" component={AboutScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen
                name="Camera"
                component={CameraStackNavigator}
                options={{
                    tabBarButton: (props) => {
                        return <Camera {...props} />;
                    },
                }}
            />
            <Tab.Screen
                name="Statistics"
                component={Statistics}
                options={{ tabBarButton: () => null }}


            />
        </Tab.Navigator>
        // </View>
        // </View>
    );
}