// screens/GenderScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import AppStyles from '../styles/AppStyles';

const GenderScreen = ({navigation}) => {
  const [gender, setGender] = useState('');

  const handleContinue = () => {
    if (gender === '') {
      Alert.alert("Gender can't be empty", 'Plese specify your Gender');
      return;
    }
    navigation.navigate('Age', {gender});
  };

  return (
    <SafeAreaView style={AppStyles.container}>
      <View style={styles.content}>
        <Text style={AppStyles.title}>Please select your gender</Text>
        <TouchableOpacity
          style={[
            AppStyles.button,
            gender === 'Female' && styles.genderSelected,
          ]}
          onPress={() => setGender('Female')}>
          <Text style={AppStyles.buttonText}>Female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[AppStyles.button, gender === 'Male' && styles.genderSelected]}
          onPress={() => setGender('Male')}>
          <Text style={AppStyles.buttonText}>Male</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[AppStyles.button, AppStyles.continueButton]}
        onPress={handleContinue}>
        <Text style={AppStyles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderSelected: {
    backgroundColor: '#D09CD9', // You can change this to match your app's theme
  },
});

export default GenderScreen;
