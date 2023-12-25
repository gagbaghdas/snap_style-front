// screens/StyleScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AppStyles from '../styles/AppStyles';
import HttpService from '../services/HttpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const stylesData = [
  {key: '1', text: 'Classic'},
  {key: '2', text: 'Modern'},
  {key: '3', text: 'Streetwear'},
  {key: '4', text: 'Casual'},
  // ... add more styles as needed
];

const StyleScreen = ({navigation, route}) => {
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectStyle = style => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleContinue = () => {
    const {gender, age} = route.params;
    const userData = {gender: gender, age: age, styles: selectedStyles};
    setIsLoading(true); // Start loading
    HttpService.post('create_user', userData)
      .then(response => {
        try {
          console.log(response.data.user_id);
          AsyncStorage.setItem('user_id', response.data.user_id);
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        } catch (error) {
          // Error saving data
          console.log(error);
        } finally {
          setIsLoading(false); // Stop loading regardless of outcome
        }
      })
      .catch(error => {
        setIsLoading(false); // Stop loading regardless of outcome
        console.log(error);
      });
  };

  return (
    <SafeAreaView style={AppStyles.container}>
      {isLoading && (
        <View style={AppStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View style={AppStyles.content}>
        <Text style={AppStyles.title}>Check the Styles You Like</Text>
        <ScrollView>
          {stylesData.map(style => (
            <TouchableOpacity
              key={style.key}
              style={[
                styles.option,
                selectedStyles.includes(style.text) && styles.optionSelected,
              ]}
              onPress={() => handleSelectStyle(style.text)}>
              <Text style={styles.optionText}>{style.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={[AppStyles.button, AppStyles.continueButton]}
          onPress={handleContinue}>
          <Text style={AppStyles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray', // You can change this to match your app's theme
    borderRadius: 5,
  },
  optionSelected: {
    backgroundColor: 'lightblue', // You can change this to match your app's theme
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StyleScreen;
