import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validator";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const NewPlace = () => {
  const [formState, InputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  let auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  // Send to Backend server in the "form" format instead of JSON because of using..
  // the binary image data
  let formData = new FormData();
  formData.append("title", formState.inputs.title.value);
  formData.append("description", formState.inputs.description.value);
  formData.append("address", formState.inputs.address.value);
  formData.append("image", formState.inputs.image.value);
  formData.append("creator", auth.userId);

  const placeSubmitHandler = async (event) => {
    try {
      console.log(auth.token);
      await sendRequest(process.env.REACT_APP_BACKEND_URL+"/places", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      // Redirect to main pages after succeed
      history.push("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <ImageUpload
            id="image"
            center
            onInput={InputHandler}
            errorText="Please Select an Image."
          />
          <Input
            id="title"
            element="input"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a Valid Title"
            onInput={InputHandler}
          ></Input>
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please Enter a Valid Description(at least 5 characters)"
            onInput={InputHandler}
          ></Input>
          <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address"
            onInput={InputHandler}
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            Submit
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default NewPlace;
