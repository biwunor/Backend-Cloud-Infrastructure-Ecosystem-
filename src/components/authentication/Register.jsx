// Component: Register
// Purpose: Handles user registration functionality.
// - Displays a registration form with fields for user details.
// - Validates user input and submits the form to create a new account.
// - Redirects to the login page upon successful registration.

// TODO: Remember to set up HTTPS for your domain before deploying to production
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAc75lzWPr4e0AY43V_k0Dy_Ofz4A4FOFY",
  authDomain: "urban-waste-help-6cb52.firebaseapp.com",
  projectId: "urban-waste-help-6cb52",
  storageBucket: "urban-waste-help-6cb52.firebasestorage.app",
  messagingSenderId: "489957749468",
  appId: "1:489957749468:web:9b150e6e013c5597157a19",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) {
        window.FB.init({
          appId: "1825382201594217",
          cookie: true,
          xfbml: true,
          version: "v12.0",
        });
      } else {
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.onload = () => {
          window.FB.init({
            appId: "1825382201594217",
            cookie: true,
            xfbml: true,
            version: "v12.0",
          });
        };
        document.body.appendChild(script);
      }
    };

    loadFacebookSDK();
  }, []);

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User registered:", userCredential.user);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackClick = () => {
    navigate("/onboarding3");
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Facebook sign-in successful:", result.user);
        navigate("/signupas");
      })
      .catch((error) => {
        console.error("Error with Facebook sign-in:", error);
      });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="relative flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-40 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
      <FaArrowLeft
        className="absolute w-4 h-4 top-8 left-4 text-zinc-900 cursor-pointer sm:w-5 sm:h-5 md:w-6 md:h-6"
        onClick={handleBackClick}
      />
      <div className="mt-16 text-center w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
            Let’s Get Started!
          </h1>
        </div>
        <div className="w-full mt-2">
          <p className="text-lg font-normal text-neutral-500 sm:text-xl md:text-2xl">
            Sign up now to schedule your first waste pickup and start making an
            impact.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 w-full max-w-md flex flex-col gap-4"
      >
        <input
          className="border border-neutral-500 p-2 rounded w-full"
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <span className="text-red-500">Username is required</span>
        )}

        <input
          className="border border-neutral-500 p-2 rounded w-full"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-red-500">Email is required</span>
        )}

        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-400" />
          <input
            className="border border-neutral-500 p-2 pl-10 pr-10 rounded w-full"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: true })}
          />
          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </div>
        </div>
        {errors.password && (
          <span className="text-red-500">Password is required</span>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="text-sm cursor-pointer">
              Remember Me
            </label>
          </div>
          <a href="#" className="text-sm text-[#1D661B]">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="bg-green-800 text-white p-2 rounded-full mt-4 cursor-pointer hover:bg-green-700 transition-all"
        >
          Submit
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm sm:text-base">
          Already have an account?{" "}
          <span
            className="text-green-800 cursor-pointer hover:underline"
            onClick={handleLoginClick}
          >
            Login
          </span>
        </p>
      </div>
      <div className="flex items-center mt-4 w-full justify-center">
        <hr className="w-1/4 border-t border-neutral-500" />
        <span className="mx-2 text-black font-semibold">OR</span>
        <hr className="w-1/4 border-t border-neutral-500" />
      </div>
      <div className="mt-4 w-full flex flex-col items-center gap-4">
        <GoogleLogin
          onSuccess={(response) => {
            console.log("Google sign-up successful", response);
            navigate("/signupas");
          }}
          onError={() => {
            console.log("Google sign-up failed");
          }}
        />
        <div
          className="fb-login-button"
          data-width=""
          data-size="large"
          data-button-type="login_with"
          data-layout="default"
          data-auto-logout-link="false"
          data-use-continue-as="false"
          onClick={handleFacebookLogin}
        ></div>
      </div>
    </div>
  );
};

/**
 * Validates the registration form inputs.
 * @returns {boolean} - True if all inputs are valid, false otherwise.
 */
export default Register;
