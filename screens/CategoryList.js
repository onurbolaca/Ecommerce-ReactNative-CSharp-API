import React from 'react';
import { StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { CategoryCard, Button } from '../components';
import articles from '../constants/articles';
import AnimatedLoader from 'react-native-animated-loader';
import { GetAllCategory } from '../actions/CategoryActions';
const { width } = Dimensions.get('screen');

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      visible: false,
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({ visible: true });

      await GetAllCategory().then((res) => {
        if (res != null) {
          this.setState({ Categories: res._ObjectList });
        }
      });

      this.setState({ visible: false });
    });
  }

  renderArticles = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articles}>
        <Block flex>
          <FlatList
            data={this.state.Categories}

            renderItem={({ item }) => <CategoryCard item={item}  />}
          />
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../assets/loader/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />

        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default CategoryList;
