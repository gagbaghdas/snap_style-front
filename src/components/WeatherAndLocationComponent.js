// WeatherAndLocationComponent.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const WeatherAndLocationComponent = ({city, weather}) => {
  if (!city || !weather) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherText}>{weather}°C</Text>
      <Text style={styles.weatherText}>{city}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    alignItems: 'flex-end',
  },
  weatherText: {
    fontSize: 16,
  },
});

export default WeatherAndLocationComponent;
