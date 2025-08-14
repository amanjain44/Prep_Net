import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { userSchema } from "../../schemas/user";
import { sendOtp, signin } from "../../actions/auth";
import CircularProgress from "@mui/material/CircularProgress";
import "./Auth.css";
import { toast } from "react-hot-toast";

const initialState = { firstName: "", lastName: "", email: "", password: "" };

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUp, setisSignUp] = useState(false);
  const [PasswordType, setPasswordType] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const { isLoading } = useSelector((state) => state.auth);

  const handlePassword = () => {
    setPasswordType((prevPasswordType) => !prevPasswordType);
  };

  const handleSignIn = () => setisSignUp((previsSignUp) => !previsSignUp);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userSchema.validate(formData, { abortEarly: false });

      if (isSignUp) {
        if (
          formData.email &&
          formData.password &&
          formData.firstName &&
          formData.lastName
        ) {
          dispatch({ type: "STORE_SIGNUP_DATA", data: formData });
          dispatch(sendOtp(formData, navigate));
        } else {
          toast.error("All fields are required");
        }
      } else {
        dispatch(signin(formData, navigate));
      }
    } catch (validationError) {
      if (formData.email && !formData.email.includes("@")) {
        toast.error("Enter valid email!");
      } else if (formData.email && formData.password) {
        toast.error("Password length should be greater than 6");
      } else {
        toast.error("All fields are required!");
      }
      console.log(validationError.errors);
    }
  };

  const googleSuccess = async (credentialResponse) => {
    dispatch({ type: "START_LOADING" });
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const token = credentialResponse.credential;

      toast.success("Login Successful 🎉");
      dispatch({ type: "AUTH", data: { result: decoded, token } });
      dispatch({ type: "END_LOADING" });
      navigate("/");
    } catch (error) {
      console.log("Google login error:", error);
    }
  };

  return (
    <div className="auth_mainContainer">
      <div className="auth_heading">
        <p className="auth_headText">
          {isSignUp ? "Sign Up" : "Sign In"}&nbsp;
        </p>
        to your account
      </div>
      <div className="auth_container">
        <div className="auth_subContainer">
          {isSignUp && (
            <div className="authName">
              <input
                type="text"
                className="auth_name"
                placeholder="First name"
                name="firstName"
                onChange={handleChange}
              />
              <input
                type="text"
                className="auth_name"
                placeholder="Last name"
                name="lastName"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="authEmail">
            <input
              name="email"
              type="text"
              placeholder="Email address"
              className="auth_email"
              onChange={handleChange}
            />
          </div>
          <div className="authPass">
            <input
              type={PasswordType ? "text" : "password"}
              placeholder="Enter password"
              className="auth_pass"
              name="password"
              onChange={handleChange}
            />
            <button className="authPass_view" onClick={handlePassword}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="4"
                  fill={PasswordType ? "black" : "#fff"}
                />
                <path
                  fill={PasswordType ? "black" : "#fff"}
                  d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68ZM16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5Z"
                />
              </svg>
            </button>
          </div>

          <div className="auth_SubmitOptions">
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onError={() => {
                    toast.error("Google Sign-In failed");
                  }}
                />
                <button className="auth_formSubmit" onClick={handleSubmit}>
                  Submit
                </button>
              </>
            )}
          </div>

          <div className="auth_comment">
            <button className="auth_switchComment" onClick={handleSignIn}>
              {isSignUp
                ? "Already have an account ? Sign In"
                : "Don't have an account ? Sign Up"}
            </button>
          </div>
        </div>
      </div>
      <div className="verify_alert" id="new_verify_alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="red"
            d="m12.865 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.473a1 1 0 0 1-.866-1.5L11.133 3a1 1 0 0 1 1.732 0Zm-1.866 13v2h2v-2h-2Zm0-7v5h2V9h-2Z"
          />
        </svg>
        &nbsp;<b>TIP :</b> If you are facing any problem while{" "}
        {isSignUp ? "Sign Up" : "Sign In"} you can always sign in using your
        Google Account
      </div>
    </div>
  );
};

export default Auth;
