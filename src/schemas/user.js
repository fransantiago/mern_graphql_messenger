import * as Yup from "yup";

export default Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label("Email"),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, {
      message: "Username must have at least one alphanumeric character"
    })
    .min(4)
    .max(30)
    .required()
    .label("Username"),
  name: Yup.string()
    .max(254)
    .required()
    .label("Name"),
  password: Yup.string()
    .min(8)
    .max(50)
    .matches(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/, {
      message:
        "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character.",
      excludeEmptyString: false
    })
    .label("Password")
});

export const signUp = Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label("Email"),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, {
      message: "Username must have at least one alphanumeric character"
    })
    .min(4)
    .max(30)
    .required()
    .label("Username"),
  name: Yup.string()
    .max(254)
    .required()
    .label("Name"),
  password: Yup.string()
    .min(8)
    .max(50)
    .matches(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/, {
      message:
        "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character.",
      excludeEmptyString: false
    })
    .label("Password")
});

export const signIn = Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label("Email"),
  password: Yup.string()
    .min(8)
    .max(50)
    .matches(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/, {
      message:
        "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character.",
      excludeEmptyString: false
    })
    .label("Password")
});
