export const GetProductsByCategoryID = async (CategoryID) => {
  try {
    let response = await fetch(
      'http://api.input.com.tr:5060/api/Category/GetProductByCategoryID/' + CategoryID
    );

    let productJson = await response.json();
    return productJson;
  } catch (error) {
      console.log(error)
  }
};
