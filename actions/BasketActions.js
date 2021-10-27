import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export const GetCurrentBasket = async () => {
  return await AsyncStorage.getItem('Basket');
};

export const DeleteProductBasket = async (id) => {
  let basket = await AsyncStorage.getItem('Basket');

  if (basket != null) {
    let currentBasket = JSON.parse(basket);

    let cleanBasket = currentBasket.filter((product) => product.id != id);

    await AsyncStorage.setItem('Basket', JSON.stringify(cleanBasket));
  }
};

export const AddOrUpdateBasket = async (product) => {
  let basket = await AsyncStorage.getItem('Basket');

  if (basket == null) {
    let newBasket = [];

    let newProduct = {
      id: product.ID,
      title: product.ProductName,
      price: product.UnitPrice,
      stock: true,
      qty: 1,
      image: 'http://api.input.com.tr:5060/Product/' + product.ProductImages[0].ProductImageUrl,
    };

    newBasket.push(newProduct);

    await AsyncStorage.setItem('Basket', JSON.stringify(newBasket));
  } else {
    let currentBasket = JSON.parse(basket);

    let productExist = currentBasket.find((p) => p.id == product.ID);

    if (productExist == undefined || productExist == null) {
      let newProduct = {
        id: product.ID,
        title: product.ProductName,
        price: product.UnitPrice,
        stock: true,
        qty: 1,
        image: 'http://api.input.com.tr:5060/Product/' + product.ProductImages[0].ProductImageUrl,
      };
      currentBasket.push(newProduct);

      await AsyncStorage.setItem('Basket', JSON.stringify(currentBasket));
    } else {
      productExist.qty = productExist.qty + 1;
      await AsyncStorage.setItem('Basket', JSON.stringify(currentBasket));
    }
  }

  Alert.alert('Bilgi', 'Ürün Başarıyla Eklendi');
};
