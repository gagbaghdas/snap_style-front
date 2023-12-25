import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStyles from '../styles/AppStyles';
import ProductLinksModal from '../components/common/ProductsListModal';

const numColumns = 2;
const size = Dimensions.get('window').width / numColumns;

const GalleryScreen = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);

  const openProductModal = productData => {
    setModalProducts(productData);
    setShowModal(true);
  };
  const fetchProducts = async () => {
    try {
      const productsList = await AsyncStorage.getItem('productsList');

      const productsArray = productsList ? JSON.parse(productsList) : [];
      console.log(productsList);
      setProducts(productsArray);
    } catch (e) {
      console.error('Failed to load products', e);
    }
  };

  useEffect(() => {
    fetchProducts();

    const subscription = DeviceEventEmitter.addListener(
      'imageChanged',
      fetchProducts,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => openProductModal(item.productData)}>
      <Image source={{uri: item.imagePath}} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={[AppStyles.container, styles.container]}>
      <ProductLinksModal
        isVisible={showModal}
        products={modalProducts}
        onClose={() => setShowModal(false)}
      />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.imagePath}
        numColumns={numColumns}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: size * 0.6,
    height: size * 0.9,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default GalleryScreen;
