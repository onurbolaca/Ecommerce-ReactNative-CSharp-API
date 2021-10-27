import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';

import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import RNPickerSelect from 'react-native-picker-select';
import AnimatedLoader from 'react-native-animated-loader';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { GetAllCategory } from '../actions/CategoryActions';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class ProductInsert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Categories: [],
      CategoryListDropdown: [],
      SelectedCategory: '',
      ProductName: '',
      ProductDescription: '',
      UnitPrice: 0,
      StockAmount: 0,
      MiniumStockAmount: 0,
      VatRate: 0,
      image: [],
      checked: true,
      loader: false,
      User: {},
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      let categoryList = await GetAllCategory();
      this.setState({ Categories: categoryList._ObjectList });

      let DropdownListData = [];

      categoryList._ObjectList.map(function (item) {
        let category = {};
        category.label = item.CategoryName;
        category.value = item.ID;
        DropdownListData.push(category);
      });

      this.setState({ CategoryListDropdown: DropdownListData });
    });
  }

  getCameraRollPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      console.log('İzin Vermelisin');
    } else {
      this._pickImage();
    }
  };

  getCameraPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== 'granted') {
      console.log('İzin Vermelisin');
    } else {
      this._takePhoto();
    }
  };

  _takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      videoMaxDuration: 10,
    });

    if (!result.cancelled) {
      console.log(result.uri);

      this.setState({ image: this.state.image.concat([result.uri]) });
    }
  };

  _pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      console.log(result.uri);
      this.setState({ image: this.state.image.concat([result.uri]) });
    }
  };

  DeleteImage(index) {
    this.setState({ image: this.state.image.splice(index, 1) });
  }

  cleanPage = () => {};

  newProduct = async () => {
    try {
      let data = new FormData();
      data.append('ProductName', this.state.ProductName);
      data.append('Category', this.state.SelectedCategory);
      data.append('ProductDescription', this.state.ProductDescription);
      data.append('UnitPrice', this.state.UnitPrice);
      data.append('StockAmount', this.state.StockAmount);
      data.append('MiniumStockAmount', this.state.MiniumStockAmount);
      data.append('VatRate', this.state.VatRate);

      this.state.image.forEach((photo, index) => {
        data.append('Photos', {
          uri: photo,
          type: 'image/jpg',
          name: 'image' + index,
        });
      });

      let response = await fetch('http://api.input.com.tr:5060/api/Product/InsertNewProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });

      let result = await response.json();

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <ScrollView>
        <DismissKeyboard>
          <Block flex middle>
            <AnimatedLoader
              visible={this.state.loader}
              overlayColor="rgba(255,255,255,0.75)"
              source={require('../assets/loader/loader.json')}
              speed={1}
              animationStyle={styles.loaderstyle}
            />
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex space="evenly">
                  <Block flex={1} middle space="between">
                    <Block center flex={0.9}>
                      <Block flex space="between">
                        <Block center>
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <RNPickerSelect
                              placeholder={{
                                label: 'Lütfen Kategori Seçiniz',
                                value: null,
                              }}
                              items={this.state.CategoryListDropdown}
                              onValueChange={(value) => {
                                this.setState({ SelectedCategory: value });
                              }}
                              style={pickerStyle}
                              value={this.state.SelectedCategory}
                              Icon={() => {
                                return (
                                  <Icon
                                    size={16}
                                    color="black"
                                    name="minimal-down2x"
                                    family="NowExtra"
                                    style={styles.inputIcons1}
                                  ></Icon>
                                );
                              }}
                            />
                          </Block>
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <Input
                              placeholder="Ürün Adı"
                              style={styles.inputs}
                              value={this.state.ProductName}
                              onChangeText={(ProductName) => this.setState({ ProductName })}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="profile-circle"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                            />
                          </Block>
                          <Block width={width * 0.8}>
                            <Input
                              placeholder="Ürün Açıklaması"
                              style={styles.inputs}
                              value={this.state.ProductDescription}
                              onChangeText={(ProductDescription) =>
                                this.setState({ ProductDescription })
                              }
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="email-852x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                            />
                          </Block>
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <Input
                              placeholder="Birim Fiyat"
                              style={styles.inputs}
                              value={this.state.UnitPrice}
                              onChangeText={(UnitPrice) => this.setState({ UnitPrice })}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="key-252x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                            />
                          </Block>

                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <Input
                              placeholder="Stok Miktarı"
                              style={styles.inputs}
                              value={this.state.StockAmount}
                              onChangeText={(StockAmount) => this.setState({ StockAmount })}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="key-252x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                            />
                          </Block>
                        </Block>

                        <Block style={{ paddingBottom: -HeaderHeight * 2, paddingHorizontal: 15 }}>
                          <Block row space="between" style={{ flexWrap: 'wrap' }}>
                            {this.state.image.map((img, imgIndex) => (
                              <TouchableOpacity onLongPress={() => this.DeleteImage(imgIndex)}>
                                <Image
                                  source={{ uri: img }}
                                  key={imgIndex}
                                  resizeMode="cover"
                                  style={styles.thumb}
                                />
                              </TouchableOpacity>
                            ))}
                          </Block>
                        </Block>
                        <Block center>
                          <Block middle row>
                            <Button
                              color="primary"
                              round
                              style={styles.createButton1}
                              onPress={() => this.getCameraPermissionsAsync()}
                            >
                              <Text
                                style={{ fontFamily: 'montserrat-bold' }}
                                size={14}
                                color={nowTheme.COLORS.WHITE}
                              >
                                Kamera
                              </Text>
                            </Button>

                            <Button
                              color="primary"
                              round
                              style={styles.createButton1}
                              onPress={() => this.getCameraRollPermissionsAsync()}
                            >
                              <Text
                                style={{ fontFamily: 'montserrat-bold' }}
                                size={14}
                                color={nowTheme.COLORS.WHITE}
                              >
                                Galeri
                              </Text>
                            </Button>
                          </Block>
                        </Block>

                        <Block center>
                          <Button
                            color="primary"
                            round
                            style={styles.createButton}
                            onPress={() => this.newProduct()}
                          >
                            <Text
                              style={{ fontFamily: 'montserrat-bold' }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Ürün Ekle
                            </Text>
                          </Button>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </DismissKeyboard>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  loaderstyle: {
    width: 100,
    height: 100,
  },
  imageBackground: {
    width: width,
    height: height,
  },
  registerContainer: {
    marginTop: 10,
    width: width * 0.9,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT,
  },
  inputIcons1: {
    marginRight: 12,
    marginTop: 30,
    color: nowTheme.COLORS.ICON_INPUT,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
  },
  inputs1: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 21.5,
    width: 100,
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40,
  },
  createButton1: {
    width: width * 0.3,
    marginTop: 25,
    marginBottom: 40,
    marginLeft: 5,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
});

const pickerStyle = {
  inputIOS: {
    color: 'black',
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    marginTop: 20,
  },
  inputAndroid: {
    color: 'black',
    marginTop: 20,
  },
  placeholderColor: 'red',
  underline: { borderTopWidth: 0 },
  icon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 5,
    borderTopColor: '#00000099',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    top: 2,
    right: 15,
  },
};

export default ProductInsert;
