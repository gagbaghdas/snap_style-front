// screens/MainScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HttpService from '../services/HttpService'; // Adjust the import path as needed
import AppStyles from '../styles/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon component
import WeatherAndLocationComponent from '../components/WeatherAndLocationComponent';
import LocationService from '../services/LocationService';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import Product from '../data/Product';
import ProductLinksModal from '../components/common/ProductsListModal';
import {truncate} from '../utils/Utils';

const MainScreen = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [isLocationDataFetched, setLocationDataFetched] = useState(false);

  useEffect(() => {
    // Load the persisted image if it exists
    const loadImage = async () => {
      const imagePath = await AsyncStorage.getItem('imagePath');
      console.log(imagePath);
      if (imagePath) {
        setImage({uri: imagePath});
      }
    };

    loadImage();
  }, []);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const locationResponse = await LocationService.getCurrentPosition();
        const {latitude, longitude} = locationResponse.coords;
        const weatherResponse = await HttpService.getWeather(
          latitude,
          longitude,
        );

        if (weatherResponse.status === 200) {
          setCity(weatherResponse.data.name); // Name of the city from weather data
          setWeather(Math.ceil(weatherResponse.data.main.temp)); // Temperature data
        }
        setLocationDataFetched(true);
      } catch (error) {
        console.error('Error fetching location or weather data:', error);
        setLocationDataFetched(true);
      }
    };

    fetchLocationAndWeather();
  }, []);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        if (!isLocationDataFetched) {
          return;
        }
        const queryParams = new URLSearchParams({city, weather}).toString();

        const response = await HttpService.get(`get_prompts?${queryParams}`);
        if (response.status === 200) {
          setPrompts(response.data.prompts);
        } else {
          console.error('Failed to fetch prompts');
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, [city, weather, isLocationDataFetched]);

  const handleBuyOutfit = () => {
    if (!image) {
      Alert.alert(
        'Select an Image',
        'Select an Image and Generate Some Outfit First',
      );
      return;
    }
    console.log(products);
    if (products && products.length > 0) {
      setModalProducts(products);
      setShowModal(true);
    } else {
      Alert.alert('No Outfit', 'Generate Some Outfit First');
    }
  };

  const handleChoosePhoto = async () => {
    const options = {
      noData: true,
    };
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    ImagePicker.launchImageLibrary(options, async response => {
      if (response.assets?.[0]?.uri) {
        try {
          setIsLoading(true); // Start loading
          console.log('uploadResponse');
          const uploadResponse = await HttpService.uploadImage(
            /*'upload_main_image'*/'upload_main_avatar_image',
            response.assets?.[0],
          );
          console.log(uploadResponse);
          if (uploadResponse.status === 200) {
            // Persist the image path
            await AsyncStorage.setItem('imagePath', response.assets?.[0]?.uri);
            setImage(response.assets?.[0]);
          }
        } catch (error) {
          console.error('Image upload failed', error);
        } finally {
          setIsLoading(false); // Stop loading regardless of outcome
        }
      }
    });
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === PermissionsAndroid.RESULTS.GRANTED;
  };

  const selectPrompt = selectedPrompt => {
    setPrompt(selectedPrompt);
  };
  const handleSendPrompt = async () => {
    if (!prompt) {
      Alert.alert('Enter a Prompt', 'Enter a prompt and try again');
      return;
    }
    if (!image) {
      Alert.alert('Select an Image', 'Select an Image and try again');
      return;
    }
    setIsLoading(true); // Start loading
    try {
      const sendingData = {
        prompt,
        city,
        weather,
      };
      const response = await HttpService.post(/*'generate_outfit'*/'generate_avatar', sendingData);
      console.log(response);
      if (
        response.status === 201 &&
        response.data &&
        response.data.generated_image_url
      ) {
        const imageUri = response.data.generated_image_url;
        console.log(imageUri);
        const uniqueKey = `generated_image-${uuidv4()}`;
        setPrompt('');
        try {
          const localImagePath = await HttpService.downloadImage(
            imageUri,
            uniqueKey,
          );
          const newProduct = new Product(
            `file://${localImagePath}`,
            response.data.products,
          );
          setProducts(prevProducts => [...prevProducts, newProduct]);

          const productsList = await AsyncStorage.getItem('productsList');
          let productsArray = productsList ? JSON.parse(productsList) : [];
          productsArray.push(newProduct);
          await AsyncStorage.setItem(
            'productsList',
            JSON.stringify(productsArray),
          );
          setImage({uri: newProduct.imagePath});
          DeviceEventEmitter.emit('imageChanged');
        } catch (error) {
          console.error('Error downloading image:', error);
        }

        if (response.data.products) {
          setProducts(response.data.products);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false); // Stop loading regardless of outcome
        console.error('Failed to generate the image');
      }
    } catch (error) {
      setIsLoading(false); // Stop loading regardless of outcome
      console.error('Failed to send the prompt', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={AppStyles.container}>
      {isLoading && (
        <View style={AppStyles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
        </View>
      )}
      <ProductLinksModal
        isVisible={showModal}
        products={modalProducts}
        onClose={() => setShowModal(false)}
      />
      <View style={styles.header}>
        <Text style={AppStyles.title && styles.title}>FitMe</Text>
        <WeatherAndLocationComponent city={city} weather={weather} />
      </View>
      <ScrollView scrollEnabled={false}>
        {image ? (
          <TouchableOpacity
            onLongPress={handleChoosePhoto}
            activeOpacity={1}
            style={styles.imageContainer}>
            <Image
              source={{uri: image.uri}}
              style={styles.image}
              onLoadEnd={() => setIsLoading(false)}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={handleChoosePhoto}>
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.chatContainer}>
          <TextInput
            style={AppStyles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt here..."
            returnKeyType="send"
            onSubmitEditing={handleSendPrompt} // If you want to send on enter
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSendPrompt}>
            <Icon name="magic" size={24} color="purple" />
          </TouchableOpacity>
        </View>
        <View style={styles.promptsContainer}>
          {prompts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptButton}
              onPress={() => selectPrompt(item)}>
              <Text style={styles.promptButtonText}>{truncate(item, 40)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[AppStyles.button, styles.buyButton]}
          onPress={handleBuyOutfit}>
          <Text style={[AppStyles.buttonText, styles.buyButtonText]}>
            Buy This Outfit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginHorizontal: -30,
    marginTop: -30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    flex: 1,
  },

  iconButton: {
    padding: 20,
    backgroundColor: '#007bff00',
    position: 'absolute',
    alignSelf: 'center',
    right: 0,
  },
  imageContainer: {
    width: '100%', // Set the width you desire for your image container
    height: 300, // Set the height you desire for your image container
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    // flex: 1,
    // borderColor: 'gray',
    // borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    // flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1', // Placeholder background color
  },
  imagePlaceholderText: {
    color: 'grey',
    fontSize: 18,
  },
  chatContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  promptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  promptButton: {
    backgroundColor: '#e1e1e1', // Placeholder background color
    paddingVertical: 8,
    paddingHorizontal: 16, // Adjust padding as necessary for content to fit
    margin: 5,
    borderRadius: 10,
    width: '45%', // Approximate width for two items per row, adjust as necessary
    alignItems: 'center', // Center the text inside the button
  },
  promptButtonText: {
    color: 'grey',
    textAlign: 'center', // Center align the text
  },
  buyButton: {
    width: 200,
    backgroundColor: 'saddlebrown', // Transparent background
    borderWidth: 1, // Border width
    borderColor: 'saddlebrown', // Purple border color
    marginLeft: 45,
  },
  buyButtonText: {
    color: 'white',
  },
});

export default MainScreen;
