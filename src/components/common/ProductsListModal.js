// ProductLinksModal.js
import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {truncate} from '../../utils/Utils';

const ProductLinksModal = ({isVisible, products, onClose}) => {
  const handleImagePress = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {products.map((product, index) => (
              <View key={index} style={styles.productContainer}>
                <TouchableOpacity onPress={() => handleImagePress(product.url)}>
                  <Image
                    source={{uri: product.img_url}}
                    style={styles.productImage}
                    onError={e => {
                      console.error(
                        'Failed to load image:',
                        e.nativeEvent.error,
                      );
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.productName}>
                  {truncate(product.title, 40)}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    maxWidth: '80%',
  },
  productContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    marginTop: 15,
  },
  closeButton: {
    padding: 10,
    marginTop: 20,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default ProductLinksModal;
