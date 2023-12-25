// screens/GenderScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppStyles from '../styles/AppStyles';
import {BASE_URL} from '../services/HttpService';
import {clearAllData} from '../services/CacheService';
import HttpService from '../services/HttpService';

const SettingsScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTOS = () => {
    const url = BASE_URL + 'terms_of_service';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handlePP = () => {
    const url = BASE_URL + 'privacy_policy';
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleDeleteData = () => {
    Alert.prompt(
      'Completely Delete Data',
      "The deleted data can't be restored!!! Type 'DELETE' to confirm.",
      text => {
        if (text === 'DELETE') {
          deleteUserData(); // Call the async function
        }
      },
    );
  };

  const deleteUserData = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await HttpService.post('delete_user');
      console.log(response);
      if (response.status === 200) {
        clearAllData();
        navigation.reset({
          index: 0,
          routes: [{name: 'Loading'}],
        });
      } else {
        console.error('Failed to delete data');
      }
    } catch (error) {
      console.error('Failed to delete user data', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <View style={AppStyles.container}>
      {isLoading && (
        <View style={AppStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <TouchableOpacity style={AppStyles.button} onPress={handleTOS}>
        <Text style={AppStyles.buttonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handlePP}>
        <Text style={AppStyles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AppStyles.button} onPress={handleDeleteData}>
        <Text style={[AppStyles.buttonText, styles.deleteButtonText]}>
          Delete My Data
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButtonText: {
    color: 'red',
  },
});

export default SettingsScreen;
