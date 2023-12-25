// LocationService.js
import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

async function requestLocationPermission() {
  let permissionCheck = '';
  if (Platform.OS === 'ios') {
    permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }

  if (permissionCheck === RESULTS.DENIED) {
    const permissionRequest = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    permissionCheck = permissionRequest;
  }

  return permissionCheck === RESULTS.GRANTED;
}

class LocationService {
  static async getCurrentPosition() {
    const granted = await requestLocationPermission();
    if (!granted) {
      console.log('Location permission denied');
      throw new Error('Location permission denied');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    });
  }
}

export default LocationService;
