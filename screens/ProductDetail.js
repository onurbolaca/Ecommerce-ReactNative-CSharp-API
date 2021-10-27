import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Platform,
} from 'react-native';

import { Block, Text, Button, theme } from 'galio-framework';
import nowTheme from '../constants/Theme';
import { iPhoneX, HeaderHeight } from '../constants/utils';
import { AddOrUpdateBasket } from '../actions/BasketActions';

const { height, width } = Dimensions.get('window');

export default class Product extends React.Component {
  state = {
    selectedSize: null,
  };

  scrollX = new Animated.Value(0);

  renderGallery = () => {
    const { navigation, route } = this.props;
    const product = route.params?.product;
    const productImages = product.ProductImages;

    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }])}
      >
        {productImages.map((image, index) => (
          <Image
            resizeMode="cover"
            source={{ uri: 'http://api.input.com.tr:5060/Product/' + image.ProductImageUrl }}
            style={{ width, height: iPhoneX ? width + 32 : width }}
          />
        ))}
      </ScrollView>
    );
  };

  renderProgress = () => {
    const position = Animated.divide(this.scrollX, width);

    const { navigation, route } = this.props;

    const product = route.params?.product;

    const productImages = product.ProductImages;

    return (
      <Block row>
        {productImages.map((_, i) => {
          const opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          const width = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [40, 40, 40],
            extrapolate: 'clamp',
          });

          return <Animated.View key={i} style={[styles.dots, { opacity, width }]} />;
        })}
      </Block>
    );
  };

  render() {
    const { navigation, route } = this.props;

    const product = route.params?.product;

    return (
      <Block flex style={styles.product}>
        <Block flex style={{ position: 'relative' }}>
          {this.renderGallery()}
          <Block center style={styles.dotsContainer}>
            {this.renderProgress()}
          </Block>
        </Block>
        <Block flex style={styles.options}>
          <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
            <Block
              style={{
                paddingHorizontal: theme.SIZES.BASE,
                paddingTop: theme.SIZES.BASE * 2,
              }}
            >
              <Text
                size={28}
                style={{ paddingBottom: 24, fontFamily: 'montserrat-regular', fontWeight: '500' }}
                color={nowTheme.COLORS.TEXT}
              >
                {product.ProductName}
              </Text>
              <Block row space="between">
                <Block row>
                  <Block style={{ marginTop: 2 }}>
                    <Text
                      style={{ fontFamily: 'montserrat-bold' }}
                      size={14}
                      color={nowTheme.COLORS.TEXT}
                    >
                      Stok Miktarı : {product.StockAmount}
                    </Text>
                  </Block>
                </Block>
                <Text
                  style={{ fontFamily: 'montserrat-regular', fontWeight: '500' }}
                  size={18}
                  color={nowTheme.COLORS.TEXT}
                >
                  {product.UnitPrice} TL
                </Text>
              </Block>
            </Block>
            <Block style={{ padding: theme.SIZES.BASE }}>
              <Text
                style={{ fontFamily: 'montserrat-regular', fontWeight: '400' }}
                size={16}
                color={nowTheme.COLORS.TEXT}
              >
                Ürün Açıklaması
              </Text>
              <Block style={{ marginTop: 16 }}>
                <Text
                  style={{ fontFamily: 'montserrat-bold' }}
                  size={14}
                  color={nowTheme.COLORS.TEXT}
                  style={{ fontWeight: '100' }}
                >
                  {product.ProductDescription}
                </Text>
              </Block>
              <Button
                shadowless
                style={styles.addToCart}
                color={nowTheme.COLORS.PRIMARY}
                onPress={() => AddOrUpdateBasket(product)}
              >
                <Text
                  style={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                  color={nowTheme.COLORS.WHITE}
                >
                  Sepete Ekle
                </Text>
              </Button>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  product: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  options: {
    position: 'relative',
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 2,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  galleryImage: {
    width: width,
    height: 'auto',
  },
  dots: {
    height: theme.SIZES.BASE / 6,
    margin: theme.SIZES.BASE / 4,
    backgroundColor: theme.COLORS.WHITE,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    left: 0,
    right: 0,
    bottom: height / 10,
  },
  addToCart: {
    width: width - theme.SIZES.BASE * 4,
    marginTop: theme.SIZES.BASE * 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
    marginRight: 8,
  },
  chat: {
    width: 56,
    height: 56,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
  chatContainer: {
    top: -28,
    right: theme.SIZES.BASE,
    zIndex: 2,
    position: 'absolute',
  },
  size: {
    height: theme.SIZES.BASE * 3,
    width: (width - theme.SIZES.BASE * 2) / 3,
    borderBottomWidth: 0.5,
    borderBottomColor: nowTheme.COLORS.BORDER_COLOR,
    overflow: 'hidden',
  },
  sizeButton: {
    height: theme.SIZES.BASE * 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: nowTheme.COLORS.PRIMARY,
  },
  roundTopLeft: {
    borderTopLeftRadius: 4,
    borderRightColor: nowTheme.COLORS.BORDER_COLOR,
    borderRightWidth: 0.5,
  },
  roundBottomLeft: {
    borderBottomLeftRadius: 4,
    borderRightColor: nowTheme.COLORS.BORDER_COLOR,
    borderRightWidth: 0.5,
    borderBottomWidth: 0,
  },
  roundTopRight: {
    borderTopRightRadius: 4,
    borderLeftColor: nowTheme.COLORS.BORDER_COLOR,
    borderLeftWidth: 0.5,
  },
  roundBottomRight: {
    borderBottomRightRadius: 4,
    borderLeftColor: nowTheme.COLORS.BORDER_COLOR,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0,
  },
});
