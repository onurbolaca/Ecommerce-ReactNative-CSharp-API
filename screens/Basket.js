import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { Button, Input } from '../components';
import { nowTheme } from '../constants';
import { GetCurrentBasket } from '../actions/BasketActions';

const { width } = Dimensions.get('screen');

export default class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      let basket = await GetCurrentBasket();

      console.log(basket);

      if (basket != null) {
        this.setState({ cart: JSON.parse(basket) });
      }
    });
  }

  handleQuantity = (id, qty) => {
    const { cart } = this.state;

    const UpdatedCart = cart.map((product) => {
      if (product.id == id) product.qty = qty;
      return product;
    });

    this.setState({ cart: UpdatedCart });
  };

  handleDelete = async (id) => {

  };

  handleAdd = (item) => {

    
  };

  renderProduct = ({ item }) => {
    const { navigation } = this.props;
    return (
      <Block>
        <Block card shadow style={styles.product}>
          <Block flex row>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Product', { product: item })}
            >
              <Block style={styles.imageHorizontal}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    height: nowTheme.SIZES.BASE * 5,
                  }}
                />
              </Block>
            </TouchableWithoutFeedback>
            <Block flex style={styles.productDescription}>
              <Text size={14} style={styles.productTitle} color={nowTheme.COLORS.TEXT}>
                {item.title}
              </Text>
              <Text size={14} style={styles.productTitle} color={nowTheme.COLORS.TEXT}>
                Toplam Sepette {item.qty} adet {item.title} bulunmakta
              </Text>

              <Block flex row space="between">
                <Block bottom>
                  <Text
                    style={{ fontFamily: 'montserrat-regular' }}
                    size={theme.SIZES.BASE * 0.75}
                    color={nowTheme.COLORS[item.stock ? 'SUCCESS' : 'ERROR']}
                  >
                    {item.stock ? 'Stokta Var' : 'Stokta Yok'}
                  </Text>
                </Block>
                <Block bottom>
                  <Text
                    style={{ fontFamily: 'montserrat-regular' }}
                    size={theme.SIZES.BASE * 0.75}
                    color={nowTheme.COLORS.ACTIVE}
                  >
                    {item.price * item.qty} TL
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
          <Block flex row space="between" style={styles.options}>
            <Input
              placeholder="Miktar"
              onChangeText={(itemValue) => this.handleQuantity(item.id, itemValue)}
              value={10}
              style={{ width: 200 }}
              editable={item.stock}
              type="numeric"
            />
            <Button
              center
              shadowless
              color="default"
              textStyle={styles.optionsButtonText}
              style={styles.optionsButton}
              onPress={() => this.handleDelete(item.id)}
            >
              Sil
            </Button>
          </Block>
        </Block>
      </Block>
    );
  };

  confirmBasket = () => {
    Alert.alert('Bilgilendirme', 'Siparişi Onaylıyor musunuz ?', []);
  };

  renderHeader = () => {
    const { navigation } = this.props;
    const { cart } = this.state;
    const productsQty = cart.length;
    const total = cart && cart.reduce((prev, product) => prev + product.price * product.qty, 0);

    return (
      <Block flex style={styles.header}>
        <Block style={{ marginBottom: theme.SIZES.BASE * 2 }}>
          <Text style={{ fontFamily: 'montserrat-regular' }} color={nowTheme.COLORS.TEXT}>
            Toplam Fiyat ({productsQty} adet ürün):{' '}
            <Text
              style={{ fontFamily: 'montserrat-regular', fontWeight: '500' }}
              color={nowTheme.COLORS.ERROR}
            >
              {total} TL
            </Text>
          </Text>
        </Block>
        <Block center>
          <Button
            flex
            center
            style={styles.checkout}
            color="active"
            onPress={() => this.confirmBasket()}
          >
            Sipariş Ver
          </Button>
        </Block>
      </Block>
    );
  };

  renderEmpty() {
    return (
      <Text style={{ fontFamily: 'montserrat-regular' }} color={nowTheme.COLORS.ERROR}>
        Sepette Ürün Bulunmamakta
      </Text>
    );
  }

  render() {
    return (
      <Block flex center style={styles.cart}>
        <FlatList
          data={this.state.cart}
          renderItem={this.renderProduct}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}-${item.title}`}
          ListEmptyComponent={this.renderEmpty()}
          ListHeaderComponent={this.renderHeader()}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  cart: {
    width: width,
  },
  header: {
    paddingVertical: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE * 2,
    marginHorizontal: theme.SIZES.BASE,
  },
  footer: {
    marginBottom: theme.SIZES.BASE * 2,
  },
  divider: {
    height: 1,
    backgroundColor: nowTheme.COLORS.INPUT,
    marginVertical: theme.SIZES.BASE,
  },
  checkoutWrapper: {
    paddingTop: theme.SIZES.BASE * 2,
    margin: theme.SIZES.BASE,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: nowTheme.COLORS.INPUT,
  },
  products: {
    minHeight: '100%',
  },
  product: {
    width: width * 0.9,
    borderWidth: 0,
    marginVertical: theme.SIZES.BASE * 1.5,
    marginHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 0.1,
    borderRadius: 3,
  },
  productTitle: {
    fontFamily: 'montserrat-regular',
    flex: 1,
    flexWrap: 'wrap',
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageHorizontal: {
    width: nowTheme.SIZES.BASE * 5,
    margin: nowTheme.SIZES.BASE / 2,
  },
  options: {
    padding: theme.SIZES.BASE / 2,
  },
  qty: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: theme.SIZES.BASE * 6.25,
    backgroundColor: nowTheme.COLORS.INPUT,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    borderRadius: 3,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  optionsButtonText: {
    fontFamily: 'montserrat-regular',
    fontSize: theme.SIZES.BASE * 0.75,
    color: theme.COLORS.WHITE,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: -0.29,
  },
  optionsButton: {
    width: 'auto',
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
    borderRadius: 3,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  checkout: {
    height: theme.SIZES.BASE * 3,
    fontSize: 14,
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE / 6,
  },
  productVertical: {
    height: theme.SIZES.BASE * 10.75,
    width: theme.SIZES.BASE * 8.125,
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: 3,
    marginBottom: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: theme.SIZES.BASE / 4,
    shadowOpacity: 1,
  },
});
