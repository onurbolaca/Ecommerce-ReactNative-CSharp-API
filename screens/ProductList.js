import React from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { articles, nowTheme } from '../constants/';
import { Card, ProductCard } from '../components/';
import { GetProductsByCategoryID } from '../actions/ProductActions';

export default class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Products: [],
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      let ProductList = await GetProductsByCategoryID(this.props.route.params.CategoryID);

      console.log(ProductList._ObjectList);

      this.setState({ Products: ProductList._ObjectList });
    });
  }

  renderCards = () => {
    return (
      <Block style={styles.container}>
        <Text size={16} style={styles.title}>
          Ürünler
        </Text>

        <FlatList
          data={this.state.Products}
          renderItem={({ item }) => (
            <ProductCard item={item} style={{ marginRight: theme.SIZES.BASE }} />
          )}
          keyExtractor={(item) => item.ID}
        />
      </Block>
    );
  };

  render() {
    return (
      <Block flex>
        <ScrollView showsVerticalScrollIndicator={false}>{this.renderCards()}</ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
  },
  title: {
    fontFamily: 'montserrat-bold',
    paddingBottom: theme.SIZES.BASE,
    marginTop: 44,
    color: nowTheme.COLORS.HEADER,
  },
});
