import React, { useState, useContext } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import useHttpClient from '../../shared/hooks/http-hook'
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setisLoginMode] = useState(true);
  const {isLoading, error, sendRequest,clearError} = useHttpClient()

  const [formState, InputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    // When Switch to Login Mode
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image:{
            value:null,
            isValid:false
          }
        },
        false
      );
    }
    setisLoginMode((prevMode) => !prevMode);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
        try { //Login Mode
            
            const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+"/users/login", "POST",
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),{"Content-Type": "application/json"})
            console.log(responseData)
            auth.login(responseData.userId,responseData.token);    
        } catch (err) {}

      
    }else {
      try { //   Sign Up Mode
        const formData = new FormData()
        formData.append('name', formState.inputs.name.value)
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        formData.append('image', formState.inputs.image.value)
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+"/users/signup", "POST",
                                    formData); //Sending a form Data instead of JSOn
         console.log(responseData)
         auth.login(responseData.userId,responseData.token);
      } catch (err) {}
    }
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className="authentication__header">Login Requried</h2>
        <hr />
        <form>
          
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Field Cannot be Empty"
              onInput={InputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload center id='image' onInput={InputHandler}/>}
          <Input
            id="email"
            element="input"
            label="Email"
            errorText="Please Enter Valid Email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={InputHandler}
          />

          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="Please Enter Minimum Length of 6 Characters Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={InputHandler}
          />
          <Button
            type="submit"
            success
            onClick={authSubmitHandler}
            disabled={!formState.isValid}
          >
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {isLoginMode ? "PROCEED TO SIGN UP" : "SWITCH TO LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};
export default Auth;
