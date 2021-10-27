import AsyncStorage from '@react-native-community/async-storage';

export const IsLogin = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('IsLogin').then((res) => {
      if (res != null) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }).catch((error) => {
    reject(error);
  });
};
 
export const OnLogout = () => {
  AsyncStorage.removeItem('user');
  AsyncStorage.removeItem('IsLogin');

  // Ne Var Ne Yok Temizler
  //AsyncStorage.clear();
};

export const GetCurrentUser = async () => {
  let user = await AsyncStorage.getItem('user');

  if (user != null) {
    let convertedUser = JSON.parse(user);
    return convertedUser;
  } else {
    return null;
  }
};

export const SetUserAsyncStorage = async (user) => {
  if (user != null || user != undefined) {
    AsyncStorage.setItem('user', JSON.stringify(user));
    AsyncStorage.setItem('IsLogin', 'true');
  }
};

export const OnLogin = async (EMail, Password) => {
  try {
    let response = await fetch('http://api.input.com.tr:5060/api/User/Login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EMail: EMail,
        Password: Password,
      }),
    });

    let jsonUser = await response.json();
    

    return jsonUser;
  } catch (error) {
    console.log(error);
  }
};
