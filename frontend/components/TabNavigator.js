import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
// import { AboutScreen, CameraScreen, HistoryScreen } from './screens'; // Import your screen components
function AboutScreen() {
    return (
        <View>
            <Text>About</Text>
        </View>
    );
}

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
            <Text>History</Text>
        </View>
    );
}
const Tab = createBottomTabNavigator();

export default function App() {
    return (
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

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="About" component={AboutScreen} />
            <Tab.Screen
                name="Camera"
                component={CameraScreen}
                options={{
                    tabBarButton: (props) => (
                        <View style={{ position: 'absolute', bottom: 20, }}>
                            <TouchableOpacity {...props} style={{ top: -30, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="camera" size={60} color="#000" style={{ backgroundColor: '#fff', borderRadius: 30 }} />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
    );
}
