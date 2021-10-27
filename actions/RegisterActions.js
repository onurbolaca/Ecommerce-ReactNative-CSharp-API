export const RegisterUser = async (Name, Surname, EMail, Password) => {
  console.log(Name);
  console.log(Surname);
  console.log(EMail);
  console.log(Password);

  try {
    //axios
    let response = await fetch('http://api.input.com.tr:5060/api/User/RegisterNewUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: Name,
        Surname : Surname,
        Password:Password,
        PasswordRepeat:Password,
        EMail:EMail,
        UserType:1
      }),
    });

    let userResponse = await response.json()
    return userResponse;

  } catch (error) {
    console.log(error)
  }
};
