export const GetAllCategory = async () => {
  try {
    let response = await fetch('http://api.input.com.tr:5060/api/Category/GetAllCategory');
    let responseJson = await response.json();

    return responseJson;
  } catch (error) {
    console.log(error);
  }
};
