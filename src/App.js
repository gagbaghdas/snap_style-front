// App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GenderScreen from './screens/GenderScreen';
import AgeScreen from './screens/AgeScreen';
import StyleScreen from './screens/StyleScreen';
import MainScreen from './screens/MainScreen';
import LoadingScreen from './screens/LoadingScreen';
import GalleryScreen from './screens/GalleryScreen';
import SettingsScreen from './screens/SettingsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const getTabBarIcon = (route, focused, color, size) => {
  let iconName;

  if (route.name === 'Main') {
    iconName = focused ? 'home' : 'home';
  } else if (route.name === 'Gallery') {
    iconName = focused ? 'image' : 'image';
  } else if (route.name === 'Settings') {
    iconName = focused ? 'cog' : 'cog';
  }

  // You can return any component that you like here!
  return <Icon name={iconName} size={size} color={color} />;
};

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: '#f5e8e1',
          // other styles if needed
        },
        tabBarIcon: ({focused, color, size}) =>
          getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Style" component={StyleScreen} />
        <Stack.Screen name="Main" component={MainTabScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
