// screens/AgeScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import AppStyles from '../styles/AppStyles'; // Adjust the path to where your AppStyles file is located

const AgeScreen = ({navigation, route}) => {
  const [age, setAge] = useState('');

  const handleContinue = () => {
    if (age === '') {
      Alert.alert('Age is required', 'Please enter your age');
      return;
    } else if (age < 17) {
      Alert.alert('Sorry', 'This app is only for users over 17 years old');
      return;
    } else if (age > 90) {
      Alert.alert('Wrong Age', 'Please enter a valid age');
      return;
    }
    const {gender} = route.params;
    navigation.navigate('Style', {age, gender}); // Replace with your next screen name
  };

  return (
    <SafeAreaView style={AppStyles.container}>
      <View style={styles.content}>
        <Text style={AppStyles.title}>Please enter your age</Text>
        <TextInput
          style={AppStyles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          keyboardType="numeric"
        />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AgeScreen;
