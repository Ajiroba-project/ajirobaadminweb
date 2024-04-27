import * as Yup from 'yup';

export const SignUpValidationSchema = Yup.object().shape({
  first_name: Yup.string().required("Full Name is required"),
  last_name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
      "Valid email is required"
    )
    .required("Email is required"),
  phone: Yup.string().required("Mobile number should be a string"),
  password: Yup.string().required().min(6, "Password Must be atleast 6 characters"),
  address: Yup.string().required("Address should be a string"),
  city: Yup.string().required("City should be a string"),
});

export const SignInValidationSchema = Yup.object().shape({
        email_or_phone: Yup.string().matches(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
                "Valid email is required",
            )
            .required("Email is required"),

        password: Yup.string().required("Password is required").min(6, "Can't be lesser than 6 digits"),
    });

export const EmailSchema = Yup.object().shape({
        email: Yup.string().matches(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
                "Valid email is required",
            )
            .required("Email is required")
  });

export const PasswordResetschema = Yup.object().shape({
        password: Yup
            .string()
            .required("Password is required")
            .min(6, "Can't be lesser than 6 digits"),
        c_password: Yup
            .string().oneOf([Yup.ref('password')], 'Passwords must match')
            .required("Password is required"),

    });

export const UploadSchema = Yup.object().shape({
  product_name: Yup.string().required("Product name is required"),
  product_category: Yup.string().required("Product category is required"),
  sub_category: Yup.string().required("Sub category is required"),
  description: Yup.string().required("Product Description is required"),
  selling_price: Yup.string().required("selling Price is required"),
  discount: Yup.string().required("discount Price is required"),
  // scehma for image and video
  regular_media: Yup.mixed().required("Please select at least one file").test(
      'regular_media',
      'Please select at least one file',
      (value) => value && value.length > 0
    )
});