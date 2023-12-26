// HTTPService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

//Office IP
// export const BASE_URL = 'http://192.168.0.131:5000/';
//Server
export const BASE_URL = 'http://infer.studio/';
//Home IP
// export const BASE_URL = 'http://192.168.10.12:5000/';

const API_BASE_URL = BASE_URL + 'api/';

class HTTPService {
  constructor() {
    const instance = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add a request interceptor to include the userId in each request
    instance.interceptors.request.use(
      async config => {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          config.headers['X-User-Id'] = userId;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.instance = instance;
  }

  get(url, config = {}) {
    return this.instance.get(url, config);
  }

  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.instance.delete(url, config);
  }

  uploadImage(url, imageFile, config = {}) {
    const formData = new FormData();
    formData.append('image', {
      name: imageFile.fileName,
      type: imageFile.type,
      uri:
        Platform.OS === 'ios' && imageFile.uri.startsWith('file://')
          ? imageFile.uri.slice(7)
          : imageFile.uri,
    });
    console.log(imageFile);
    // console.log(formData.image.type);
    // console.log(formData.image.uri);
    return this.instance.put(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async downloadImage(url, imageName) {
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${imageName}.png`;

    return RNFS.downloadFile({
      fromUrl: url,
      toFile: localFilePath,
    })
      .promise.then(() => {
        // Return the local file path for further use
        return localFilePath;
      })
      .catch(error => {
        console.error('Image download failed:', error);
        throw error;
      });
  }

  getWeather(lat, lon) {
    const apiKey = '28629226243aed7721bacd5022236f8e';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log(url);
    return this.instance.get(url);
  }
}

const httpService = new HTTPService();

export default httpService;
