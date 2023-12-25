import React, {useEffect} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearAllData} from '../services/CacheService';

const LoadingScreen = ({navigation}) => {
  useEffect(() => {
    const checkUserData = async () => {
      //USE THIS TO CLEAR ALL DATA
      //clearAllData();
      const user_id = await AsyncStorage.getItem('user_id');
      if (user_id) {
        navigation.replace('Main');
      } else {
        navigation.replace('Gender');
      }
    };

    checkUserData();
  }, [navigation]); // Added 'navigation' to the dependency array

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')} // Update the path to where your image is located
        style={styles.backgroundImage}
        resizeMode="cover" // This will cover the whole screen without stretching the image
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%', // These dimensions will stretch the image to cover the entire screen
  },
});

export default LoadingScreen;
